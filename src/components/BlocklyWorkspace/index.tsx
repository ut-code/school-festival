import React, { useContext, useState } from 'react';
import { Button, Slider } from 'antd';
import {
  CaretRightOutlined,
  PauseOutlined,
  ClearOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons';
import { BlocklyEditor, BlocklyEditorExcutionState } from '../BlocklyEditor';
import styles from './style.module.css';
import { firestoreContext } from '../../commons/firebase';

export type BlocklyWorkspaceProps = {
  type: string;
  onReset: () => unknown;
  toolboxBlocks: string[];
  nativeFunctions: Record<string, Function>;
};

export const BlocklyWorkspace: React.FC<BlocklyWorkspaceProps> = (props) => {
  const [
    executionState,
    setExecutionState,
  ] = useState<BlocklyEditorExcutionState>('stopped');
  const [executionInterval, setExecutionInterval] = useState(1000);
  const context = useContext(firestoreContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.editor}>
        <BlocklyEditor
          type={props.type}
          firestoreContext={context}
          executionInterval={executionInterval}
          executionState={executionState}
          updateExecutionState={setExecutionState}
          nativeFunctions={props.nativeFunctions}
          toolboxBlocks={props.toolboxBlocks}
        />
        <Button
          className={styles.sidebarToggleButton}
          icon={
            isSidebarOpen ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
          }
          size="large"
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event('resize'));
            });
          }}
        />
      </div>
      <div
        className={styles.sidebar}
        style={{ display: isSidebarOpen ? 'block' : 'none' }}
      >
        <div className={styles.toolbox}>
          <section className={styles.toolboxButtonContainer}>
            <Button
              icon={<CaretRightOutlined />}
              disabled={
                executionState === 'running' || executionState === 'finished'
              }
              onClick={() => {
                setExecutionState('running');
              }}
            >
              実行
            </Button>
            <Button
              icon={<PauseOutlined />}
              disabled={executionState !== 'running'}
              onClick={() => {
                setExecutionState('paused');
              }}
            >
              一時停止
            </Button>
            <Button
              icon={<ClearOutlined />}
              disabled={executionState === 'stopped'}
              onClick={() => {
                setExecutionState('stopped');
                props.onReset();
              }}
            >
              リセット
            </Button>
          </section>
          <section>
            <Slider
              value={executionInterval}
              onChange={setExecutionInterval}
              min={100}
              max={2000}
              marks={{ 100: '速い', 2000: '遅い' }}
              tooltipVisible={false}
            />
          </section>
        </div>
        <div className={styles.workspaceConfig}>{props.children}</div>
      </div>
    </div>
  );
};
