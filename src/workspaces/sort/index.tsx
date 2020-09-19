import React from 'react';
import { Alert } from 'antd';
import { BlocklyWorkspace } from '../../components/BlocklyWorkspace';
import {
  CUSTOM_SORT_MOVE,
  CUSTOM_SORT_SWAP,
  CUSTOM_SORT_CHECKTALLER,
  CUSTOM_SORT_CHECKEXISTENCE,
  CUSTOM_SORT_MOVETOEND,
  SortDirection,
  SortDirectionDiffMap,
  SortDirectionMap,
} from './blocks';
import {
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_COMMON_WHILE_TRUE,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_DO_UNTIL,
} from '../../config/blockly.blocks';
import { SortRenderer } from './components/SortRenderer';
import styles from './style.module.css';
import { BlocklyEditorMessage } from '../../components/BlocklyEditor';

const SORT_COUNT = 10;

export type SortWorkspaceState = {
  heights: number[];
  teachersLocation: number;
};

export class SortWorkspace extends React.Component<{}, SortWorkspaceState> {
  static createDefaultState() {
    return {
      heights: Array.from(Array(SORT_COUNT).keys(), (v) => v + 1).sort(
        () => Math.random() - 0.5,
      ),
      teachersLocation: 0,
    };
  }

  state = SortWorkspace.createDefaultState();

  nativeFunctions = {
    [CUSTOM_SORT_MOVE]: (direction: SortDirection) => {
      const newTeachersLocation =
        this.state.teachersLocation + SortDirectionDiffMap[direction];
      if (newTeachersLocation < 0 || newTeachersLocation >= SORT_COUNT)
        throw new Error('これ以上進むことはできません。');
      this.setState({ teachersLocation: newTeachersLocation });
    },
    [CUSTOM_SORT_MOVETOEND]: (direction: SortDirection) => {
      this.setState({
        teachersLocation: {
          [SortDirectionMap.LEFT]: 0,
          [SortDirectionMap.RIGHT]: SORT_COUNT - 1,
        }[direction],
      });
    },
    [CUSTOM_SORT_SWAP]: (direction: SortDirection) => {
      const targetLocation =
        this.state.teachersLocation + SortDirectionDiffMap[direction];
      if (targetLocation < 0 || targetLocation >= SORT_COUNT)
        throw new Error('入れ替える方向に人がいません。');
      const newHeights = this.state.heights.map(
        (_, index) =>
          this.state.heights[
            {
              [this.state.teachersLocation]: targetLocation,
              [targetLocation]: this.state.teachersLocation,
            }[index] ?? index
          ],
      );
      this.setState({ heights: newHeights });
      if (
        newHeights.reduce((previous, current) =>
          previous > current ? current : 0,
        )
      )
        throw new BlocklyEditorMessage('並び替えに成功しました！');
    },
    [CUSTOM_SORT_CHECKTALLER]: (direction: SortDirection) => {
      const targetLocation =
        this.state.teachersLocation + SortDirectionDiffMap[direction];
      if (targetLocation < 0 || targetLocation >= SORT_COUNT)
        throw new Error('入れ替える方向に人がいません。');
      return (
        this.state.heights[targetLocation] >
        this.state.heights[this.state.teachersLocation]
      );
    },
    [CUSTOM_SORT_CHECKEXISTENCE]: (direction: SortDirection) => {
      const targetLocation =
        this.state.teachersLocation + SortDirectionDiffMap[direction];
      return targetLocation >= 0 && targetLocation < SORT_COUNT;
    },
  };

  render() {
    return (
      <BlocklyWorkspace
        type="sort"
        toolboxBlocks={[
          CUSTOM_SORT_MOVE,
          CUSTOM_SORT_MOVETOEND,
          CUSTOM_SORT_SWAP,
          CUSTOM_SORT_CHECKTALLER,
          CUSTOM_SORT_CHECKEXISTENCE,
          CUSTOM_COMMON_IF,
          CUSTOM_COMMON_IF_ELSE,
          CUSTOM_COMMON_WHILE_TRUE,
          CUSTOM_COMMON_WHILE,
          CUSTOM_COMMON_DO_UNTIL,
        ]}
        nativeFunctions={this.nativeFunctions}
        onReset={() => {
          this.setState(SortWorkspace.createDefaultState());
        }}
      >
        <Alert
          message="並んでいる生徒たちを左から背の高い順に並べましょう。あなたは、黄色いホイッスルが付いている場所に立っています。"
          type="info"
          className={styles.section}
        />
        <section className={styles.section}>
          <SortRenderer
            heights={this.state.heights}
            teachersLocation={this.state.teachersLocation}
          />
        </section>
      </BlocklyWorkspace>
    );
  }
}
