import { Box, Grid, List, ListItem, Text } from "@chakra-ui/react";
import { TutorialDialogPropsStep } from "../../../components/TutorialDialog";

export const geneticAlgorithmTutorialSteps: TutorialDialogPropsStep[] = [
  {
    title: "遺伝的アルゴリズム",
    content: (
      <Grid templateColumns="1fr 1fr" gap={3}>
        <Box>
          <Text mb={2}>
            遺伝的アルゴリズムは、生命が遺伝子を用いて進化する様子をコンピュータ上で再現することで、組み合わせ爆発が起こるような問題に対する最適解を探索するアルゴリズムです。
          </Text>
          <Text mb={2}>
            ここでは、遺伝子に相当するものは「ルート」です。地図上のすべての地点を結ぶ「ルート」のうち、最短となるものを探しましょう。
          </Text>
          <Text mb={2}>
            遺伝的アルゴリズムでは、親の遺伝子を組み合わせる交叉や、この遺伝子をランダムに書き換える突然変異といった操作を行って新しい世代を作ったのち、自然選択により最適解に近い個体を残します。
          </Text>
        </Box>
        <img
          alt="遺伝的アルゴリズムの模式図"
          src={new URL("./genes.jpg", import.meta.url).toString()}
        />
      </Grid>
    ),
  },
  {
    title: "自然選択",
    content: (
      <Box>
        <Text mb={2}>
          自然選択を行うには、「並び替え」の問題で行ったようなバブルソートを用います。それぞれの経路について合計移動距離を計算し、短い順に並び変えましょう。
        </Text>
      </Box>
    ),
  },
  {
    title: "交叉と突然変異",
    content: (
      <Grid templateColumns="max-content 1fr" gap={6}>
        <img
          alt="交叉"
          src={new URL("./crossover.drawio.svg", import.meta.url).toString()}
        />
        <Box>
          <Text mb={2}>
            交叉を行うには、ランダムに選んだ地点を境に親の遺伝子を組み合わせます。この際、左の図のようなアルゴリズムが考えられます。
          </Text>
          <List mb={2}>
            <ListItem>1. 新しい空のルートを作ります</ListItem>
            <ListItem>2. 親となるルートを 2 つ選びます</ListItem>
            <ListItem>
              3. 親 2 つのルートから、どちらか一つをランダムに選びます
            </ListItem>
            <ListItem>
              4.
              選ばれた親のルートで訪れる地点を先頭から順番に見ていき、まだ新しいルートで訪れていない地点が見つかれば新しいルートに追加します
            </ListItem>
            <ListItem>5. 3 ～ 4 を繰り返します</ListItem>
          </List>
          <Text mb={2}>
            突然変異を行うには、ランダムに選んだ地点同士を入れ替えるとよいでしょう。
          </Text>
        </Box>
      </Grid>
    ),
  },
];
