import { Modal } from 'antd';
import Blockly from 'blockly';
import React, { createRef } from 'react';
import { FirestoreContext } from '../../commons/firebase';
import { executeBlocklyCode } from '../../commons/interpreter';

export type BlocklyEditorExcutionState =
  | 'stopped'
  | 'paused'
  | 'running'
  | 'finished';

export type BlocklyEditorProps = {
  type: string;
  executionState: BlocklyEditorExcutionState;
  updateExecutionState: (executionState: BlocklyEditorExcutionState) => void;
  executionInterval: number;
  firestoreContext: FirestoreContext;
  nativeFunctions: Record<string, Function>;
  toolboxBlocks: string[];
};

export class BlocklyEditorMessage {
  constructor(public message: string) {}
}

export class BlocklyEditor extends React.Component<BlocklyEditorProps> {
  blocklyRef = createRef<HTMLDivElement>();

  clientId = Math.floor(Math.random() * 1000000);

  blocklyWorkspace!: Blockly.WorkspaceSvg;

  executionContext: ReturnType<typeof executeBlocklyCode> | null = null;

  excutionTimerId = NaN;

  lastPersistTimestamp = 0;

  persistTimerId = NaN;

  isChangeListnerDisabled = false;

  componentDidMount() {
    if (!this.blocklyRef.current) throw new Error('No div element found.');
    this.blocklyWorkspace = Blockly.inject(this.blocklyRef.current, {
      toolbox: [
        '<xml>',
        ...this.props.toolboxBlocks.map(
          (toolboxBlock) => `<block type="${toolboxBlock}"></block>`,
        ),
        '</xml>',
      ].join(''),
      grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
      renderer: 'thrasos',
    });
    this.blocklyWorkspace.addChangeListener(() => {
      window.clearTimeout(this.persistTimerId);
      if (this.isChangeListnerDisabled) return;
      this.persistTimerId = window.setTimeout(() => {
        const serializedWorkspace = Blockly.Xml.domToText(
          Blockly.Xml.workspaceToDom(this.blocklyWorkspace),
        );
        if (
          serializedWorkspace !==
          this.props.firestoreContext.data[this.props.type]?.workspace
        )
          this.props.firestoreContext.persist(
            this.props.type,
            serializedWorkspace,
            this.clientId,
          );
        this.lastPersistTimestamp = Date.now();
      }, Math.max(this.lastPersistTimestamp + 2000 - Date.now(), 0));
    });
    window.addEventListener('resize', () => {
      Blockly.svgResize(this.blocklyWorkspace);
    });
  }

  componentDidUpdate(prevState: BlocklyEditorProps) {
    const data = this.props.firestoreContext.data[this.props.type];
    if (data && data.clientId !== this.clientId) {
      this.isChangeListnerDisabled = true;
      const current = Blockly.Xml.domToText(
        Blockly.Xml.workspaceToDom(this.blocklyWorkspace),
      );
      if (current !== data.workspace) {
        this.blocklyWorkspace.clear();
        Blockly.Xml.domToWorkspace(
          Blockly.Xml.textToDom(data.workspace),
          this.blocklyWorkspace,
        );
        this.lastPersistTimestamp = Date.now();
      }
      this.isChangeListnerDisabled = false;
    }
    switch (this.props.executionState) {
      case 'stopped':
        this.stopExecution();
        break;
      case 'paused':
        this.pauseExecution();
        break;
      case 'running':
        if (prevState.executionState === 'stopped') {
          this.startExecution();
        } else if (prevState.executionState === 'paused') {
          this.stepExecution();
        }
        break;
      case 'finished':
        break;
      default:
        throw new Error('Invalid executionState.');
    }
  }

  private startExecution() {
    if (!this.blocklyWorkspace) return;
    this.executionContext = executeBlocklyCode(
      Blockly.JavaScript.workspaceToCode(this.blocklyWorkspace),
      this.props.nativeFunctions,
    );
    this.stepExecution();
  }

  private stepExecution() {
    if (!this.executionContext) return;
    try {
      const result = this.executionContext.next();
      if (result.done) {
        this.pauseExecution();
        this.props.updateExecutionState('finished');
      } else {
        this.blocklyWorkspace.highlightBlock(result.value);
        this.excutionTimerId = window.setTimeout(
          this.stepExecution.bind(this),
          this.props.executionInterval,
        );
      }
    } catch (e) {
      if (e instanceof Error) {
        Modal.error({ title: 'エラーが発生しました', content: e.message });
      }
      if (e instanceof BlocklyEditorMessage) {
        Modal.info({ title: 'メッセージ', content: e.message });
      }
      this.pauseExecution();
      this.props.updateExecutionState('finished');
    }
  }

  private pauseExecution() {
    window.clearTimeout(this.excutionTimerId);
    this.excutionTimerId = NaN;
  }

  private stopExecution() {
    this.pauseExecution();
    this.executionContext = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.blocklyWorkspace.highlightBlock(null as any);
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }} ref={this.blocklyRef} />
    );
  }
}
