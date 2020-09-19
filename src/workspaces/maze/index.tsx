import React from 'react';
import { Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import {
  createMaze,
  Maze,
  MazeDirection,
  MazeDirectionMap,
  moveInMaze,
  rotateDirection,
} from '../../commons/maze';
import { BlocklyWorkspace } from '../../components/BlocklyWorkspace';
import {
  CUSTOM_MAZE_STEPFORWARD,
  CUSTOM_MAZE_TURN,
  CUSTOM_MAZE_CHECKWALL,
} from './blocks';
import {
  CUSTOM_COMMON_IF,
  CUSTOM_COMMON_IF_ELSE,
  CUSTOM_COMMON_WHILE_TRUE,
  CUSTOM_COMMON_WHILE,
  CUSTOM_COMMON_DO_UNTIL,
} from '../../config/blockly.blocks';
import { MazeRenderer } from './components/MazeRenderer';
import styles from './style.module.css';
import { BlocklyEditorMessage } from '../../components/BlocklyEditor';

export type MazeWorkspaceState = {
  maze: Maze;
  location: { x: number; y: number };
  direction: MazeDirection;
};

export class MazeWorkspace extends React.Component<{}, MazeWorkspaceState> {
  static createDefaultState() {
    return {
      maze: createMaze(10, 10),
      ...this.createDefaultMazeState(),
    };
  }

  static createDefaultMazeState() {
    return {
      location: { x: 0, y: 0 },
      direction: MazeDirectionMap.BOTTOM,
    };
  }

  state = MazeWorkspace.createDefaultState();

  nativeFunctions = {
    [CUSTOM_MAZE_STEPFORWARD]: () => {
      const nextCell = moveInMaze(
        this.state.maze,
        this.currentCell,
        this.state.direction,
      );
      if (!nextCell || this.currentCell.walls[this.state.direction])
        throw new Error('壁があるため、進むことができません。');
      this.setState({ location: nextCell.location });
      if (nextCell.location.x === 9 && nextCell.location.y === 9) {
        throw new BlocklyEditorMessage('迷路をクリアしました！');
      }
    },
    [CUSTOM_MAZE_CHECKWALL]: (direction: MazeDirection) =>
      this.currentCell.walls[rotateDirection(this.state.direction, direction)],
    [CUSTOM_MAZE_TURN]: (to: MazeDirection) => {
      this.setState({
        direction: rotateDirection(this.state.direction, to),
      });
    },
  };

  get currentCell() {
    return this.state.maze[this.state.location.y][this.state.location.x];
  }

  render() {
    return (
      <BlocklyWorkspace
        type="maze"
        toolboxBlocks={[
          CUSTOM_MAZE_STEPFORWARD,
          CUSTOM_MAZE_TURN,
          CUSTOM_MAZE_CHECKWALL,
          CUSTOM_COMMON_IF,
          CUSTOM_COMMON_IF_ELSE,
          CUSTOM_COMMON_WHILE_TRUE,
          CUSTOM_COMMON_WHILE,
          CUSTOM_COMMON_DO_UNTIL,
        ]}
        nativeFunctions={this.nativeFunctions}
        onReset={() => {
          this.setState(MazeWorkspace.createDefaultMazeState());
        }}
      >
        <Alert
          message="迷路の中のアイコンを、ゴールまで導きましょう。"
          type="info"
          className={styles.section}
        />
        <section className={styles.section}>
          <MazeRenderer
            maze={this.state.maze}
            location={this.state.location}
            direction={this.state.direction}
          />
        </section>
        <section className={styles.section}>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              this.setState(MazeWorkspace.createDefaultState());
            }}
          >
            新しい迷路にする
          </Button>
        </section>
      </BlocklyWorkspace>
    );
  }
}
