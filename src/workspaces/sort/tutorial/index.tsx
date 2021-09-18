import { Text } from "@chakra-ui/react";
import { TutorialDialogPropsStep } from "../../../components/TutorialDialog";

export const sortTutorialSteps: TutorialDialogPropsStep[] = [
  {
    title: "先生と生徒",
    content: (
      <>
        <Text mb={2}>
          「右（左）へ動く」は先生（ホイッスル）の位置を移動させ、「右（左）の人と入れ替える」は、ホイッスルに最も近い生徒を隣の生徒と入れ替えます。
        </Text>
        <video
          src={new URL("./sort-basic.mp4", import.meta.url).toString()}
          muted
          autoPlay
          loop
          width="100%"
        />
      </>
    ),
  },
  {
    title: "身長の比較",
    content: (
      <>
        <Text mb={2}>
          先生は、目の前の生徒と隣の生徒の身長を比較することができます。条件分岐と繰り返しを駆使して、生徒を身長順に並べましょう。
        </Text>
        <video
          src={new URL("./sort-advanced.mp4", import.meta.url).toString()}
          muted
          autoPlay
          loop
          width="100%"
        />
      </>
    ),
  },
  {
    title: "アルゴリズム",
    content: (
      <>
        <Text mb={2}>
          この課題で用いるのは、<strong>バブルソート</strong>
          と呼ばれる並べ替え（＝ソート）のためのアルゴリズムです。隣り合う要素同士を順に比較していくシンプルなアルゴリズムですが、計算量が要素数の二乗に比例するため、計算に時間がかかってしまいます。
        </Text>
        <Text mb={2}>
          並べ替えのためのアルゴリズムは古くから研究されており、バブルソートよりも一般的に高速なアルゴリズムとして、
          <strong>クイックソート</strong>や<strong>マージソート</strong>
          など様々なアルゴリズムが考案されてきました。
        </Text>
        <Text mb={2}>
          残念ながら、この課題ではそういった高度な並べ替えのアルゴリズムを記述することはできません。しかしながら、家庭にあるトランプなどを使って並べ替えの実験をしてみるのも面白いでしょう。
        </Text>
      </>
    ),
  },
];
