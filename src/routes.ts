import { CellularAutomatonWorkspace } from "./workspaces/cellular-automaton";
import { cellularAutomatonTutorialSteps } from "./workspaces/cellular-automaton/tutorial";
import { MazeWorkspace } from "./workspaces/maze";
import { mazeTutorialSteps } from "./workspaces/maze/tutorial";
import { SortWorkspace } from "./workspaces/sort";
import { sortTutorialSteps } from "./workspaces/sort/tutorial";
import { KmeansWorkspace } from "./workspaces/kmeans";
import { kmeansTutorialSteps } from "./workspaces/kmeans/tutorial";
import { GeneticAlgorithmWorkspace } from "./workspaces/genetic-algorithm";
import { geneticAlgorithmTutorialSteps } from "./workspaces/genetic-algorithm/tutorial";
import { GradWorkspace } from "./workspaces/gradient-descent";
import { gradTutorialSteps } from "./workspaces/gradient-descent/tutorial";

// テンプレートがどのように動作するのか確認したい場合はコメントアウトを外してください。
// import { TemplateWorkspace } from "./workspaces/template";
// import { templateTutorialSteps } from "./workspaces/template/tutorial";

export const routes = [
  {
    id: "maze",
    path: "/maze",
    label: "迷路",
    description: "プログラムを書いて迷路を解こう！",
    Component: MazeWorkspace,
    tutorialSteps: mazeTutorialSteps,
  },
  {
    id: "sort",
    path: "/sort",
    label: "並べ替え",
    description: "先生になりきって生徒を並ばせよう！",
    Component: SortWorkspace,
    tutorialSteps: sortTutorialSteps,
  },
  {
    id: "cellular-automaton",
    path: "/cellular-automaton",
    label: "セル・オートマトン",
    description: "簡単なルールで生命活動のシミュレーション",
    Component: CellularAutomatonWorkspace,
    tutorialSteps: cellularAutomatonTutorialSteps,
  },
  {
    id: "kmeans",
    path: "/kmeans",
    label: "K平均法",
    description: "データ分類アルゴリズムの体験",
    Component: KmeansWorkspace,
    tutorialSteps: kmeansTutorialSteps,
  },
  {
    id: "genetic-algorithm",
    path: "/genetic-algorithm",
    label: "遺伝的アルゴリズム",
    description: "遺伝的アルゴリズムのシミュレーション",
    Component: GeneticAlgorithmWorkspace,
    tutorialSteps: geneticAlgorithmTutorialSteps,
  },
  {
    id: "gradient-descent",
    path: "/gradient-descent",
    label: "勾配降下法",
    description: "勾配降下法のシミュレーション",
    Component: GradWorkspace,
    tutorialSteps: gradTutorialSteps,
  },
  // {
  //   path: "/template",
  //   label: "テンプレート",
  //   description: "新しい課題を作るためのテンプレートです",
  //   Component: TemplateWorkspace,
  //   tutorialSteps: templateTutorialSteps,
  // },
];
