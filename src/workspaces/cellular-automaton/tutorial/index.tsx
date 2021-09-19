import { Text, Grid, Box, UnorderedList, ListItem } from "@chakra-ui/react";
import { TutorialDialogPropsStep } from "../../../components/TutorialDialog";

export const cellularAutomatonTutorialSteps: TutorialDialogPropsStep[] = [
  {
    title: "セル・オートマトン",
    content: (
      <Grid templateColumns="1fr 1fr" gap={3}>
        <Box>
          <Text mb={2}>
            セル・オートマトンとは、格子型のセルに対し、単純なルールを与えることによって、複雑な現象をシミュレーションするための枠組みです。
          </Text>
          <Text mb={2}>
            このゲームでは、「現世代」の状態から、「次世代」への変化のルールを定義できるようになっています。
          </Text>
          <Text mb={2}>
            右の例では、黒いセルを白で塗り、黒いセルを白く塗ることで、すべてのセルの色を反転させています。
          </Text>
        </Box>
        <video
          src={new URL("./cell-automaton.mp4", import.meta.url).toString()}
          muted
          autoPlay
          loop
          width="100%"
        />
      </Grid>
    ),
  },
  {
    title: "ライフゲーム",
    content: (
      <Grid templateColumns="1fr 1fr" gap={3}>
        <Box>
          <Text mb={2}>
            ライフゲームは、イギリスの数学者コンウェイによって考案された、セル・オートマトンを利用したゲームです。
          </Text>
          <Text mb={2}>
            このライフゲームでは、生命が存在するセルを黒色で、存在しないセルを白色で表現します。
          </Text>
          <Text mb={2}>
            ライフゲームのルールは単純です。あるセルの次の世代における生命の存在は、現在の世代での隣接セルに存在する生命の数によって決まります。具体的には下の通りです。
          </Text>
          <UnorderedList mb={2}>
            <ListItem>
              生命が存在しないセル
              <UnorderedList>
                <ListItem>隣接する生命が3つ → 誕生</ListItem>
                <ListItem>それ以外 → 変化なし</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              生命が存在するセル
              <UnorderedList>
                <ListItem>隣接する生命が2つまたは3つ → 生存</ListItem>
                <ListItem>それ以外 → 死滅</ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
          <Text mb={2}>
            ライフゲームのアルゴリズムをプログラミングして、実際にシミュレーションを行ってみましょう。
          </Text>
        </Box>
        <video
          src={new URL("./life-game.mp4", import.meta.url).toString()}
          muted
          autoPlay
          loop
          controls
          width="100%"
        />
      </Grid>
    ),
  },
];
