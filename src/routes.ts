import { CellularAutomatonWorkspace } from "./workspaces/cellular-automaton";
import { cellularAutomatonTutorialSteps } from "./workspaces/cellular-automaton/tutorial";
import { MazeWorkspace } from "./workspaces/maze";
import { mazeTutorialSteps } from "./workspaces/maze/tutorial";
import { SortWorkspace } from "./workspaces/sort";
import { sortTutorialSteps } from "./workspaces/sort/tutorial";

export const routes = [
  {
    path: "/maze",
    label: "迷路",
    description: "プログラムを書いて迷路を解こう！",
    Component: MazeWorkspace,
    tutorialSteps: mazeTutorialSteps,
  },
  {
    path: "/sort",
    label: "並べ替え",
    description: "先生になりきって生徒を並ばせよう！",
    Component: SortWorkspace,
    tutorialSteps: sortTutorialSteps,
  },
  {
    path: "/cellular-automaton",
    label: "セル・オートマトン",
    description: "簡単なルールで生命活動のシミュレーション",
    Component: CellularAutomatonWorkspace,
    tutorialSteps: cellularAutomatonTutorialSteps,
  },
];
