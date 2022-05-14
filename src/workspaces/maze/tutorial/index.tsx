import { Box, Grid, Text } from "@chakra-ui/react";
import { TutorialDialogPropsStep } from "../../../components/TutorialDialog";

export const mazeTutorialSteps: TutorialDialogPropsStep[] = [
  {
    title: "ゴールまで行く",
    content: (
      <>
        <Text my={2}>
          ブロックを並べて、迷路内にいる赤いアイコンを右下の旗印の場所まで移動させましょう。
        </Text>
        <video
          src={new URL("./maze-basic.mp4", import.meta.url).toString()}
          muted
          autoPlay
          loop
          width="100%"
        />
      </>
    ),
  },
  {
    title: "どんな迷路でも",
    content: (
      <>
        <Text my={2}>
          「新しい迷路にする」をクリックすると、全く異なる迷路が生成されます。繰り返しや条件分岐をうまく使用し、
          <strong>どんな迷路にも対応できる</strong>
          プログラムを作りましょう。
        </Text>
        <video
          src={new URL("./maze-advanced.mp4", import.meta.url).toString()}
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
      <Grid templateColumns="3fr 4fr" gap={3}>
        <Box>
          <Text my={2}>
            古来から知られている迷路の解法に、「左手法」があります。この方法では、プレーヤーは迷路内で自分の手を左の壁に当て、そのまま離さないように進みます。
          </Text>
          <Text my={2}>
            シンプルなアルゴリズムですが、島が存在しない単純な迷路は必ず方法で解くことができます。用意されたブロックのみを用いて「左手法」はどのように表現されるでしょうか。
          </Text>
        </Box>
        <img
          width="100%"
          src={new URL("./maze-method.svg", import.meta.url).toString()}
          alt="左手法"
        />
      </Grid>
    ),
  },
  {
    title: "ヒント",
    content: (
      <Grid templateColumns="4fr 3fr" gap={3}>
        <img
          width="100%"
          src={new URL("./maze-hint.svg", import.meta.url).toString()}
          alt="ヒント"
        />
        <Box>
          <Text my={2}>
            迷路においてプレーヤーが歩かなければならない距離は非常に長いですが、実際は一歩一歩の積み重ねにすぎません。この一歩をもう少し詳しく見てみましょう。
          </Text>
          <Text my={2}>
            いま、プレーヤーは十字路に立っており、前、後ろ、左右のすべての方向に進むことができます。このとき、左手法に従うのであれば、プレーヤーはどちらに進めばよいでしょうか。
          </Text>
          <Text my={2}>
            左の壁に沿って進むので、左方向に進むのが正解ですね。それでは、左にもし壁があったとしたら？その場合はまっすぐ進めば良いはずです。
          </Text>
          <Text my={2}>
            同じように考えて、４つの方向に「優先順位」をつけてみましょう。壁がない方向のうち、最も優先順位が高い方向が、プレーヤーが進むべき道です。
          </Text>
        </Box>
      </Grid>
    ),
  },
];
