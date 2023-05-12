import {
  Text,
  Grid,
  Box,
  Icon,
  Center,
  OrderedList,
  ListItem,
} from "@chakra-ui/react";
import { RiArrowRightSLine } from "react-icons/ri";
import { TutorialDialogPropsStep } from "../../../components/TutorialDialog";

export const kmeansTutorialSteps: TutorialDialogPropsStep[] = [
  {
    title: "点をグループ分けしよう",
    content: (
      <Grid templateRows="1fr 4fr">
        <Box>
          <Text>
            画面上にたくさんの点が並んでいます。これらを、点の位置関係に注目してグループ分けするにはどうすれば良いでしょうか？
          </Text>
          <Text>
            図では点の属するグループが点の色で表現されています。また、黒で縁取られた点はその色のグループの中心地点を表現しています。例えば、黒縁の赤い点は赤い点のグループの中心地点を表します。
          </Text>
        </Box>
        <Grid templateColumns="4fr 1fr 4fr">
          <Box>
            <img
              height="100%"
              src={new URL(
                "./before_clustering.png",
                import.meta.url
              ).toString()}
              alt="クラスタリング前の状況"
            />
            <Text align="center">グループ分け前</Text>
          </Box>
          <Center>
            <Icon as={RiArrowRightSLine} w={8} h={8} />
          </Center>
          <Box>
            <img
              height="100%"
              src={new URL(
                "./after_clustering.png",
                import.meta.url
              ).toString()}
              alt="クラスタリング後の状況"
            />
            <Text align="center">グループ分け後</Text>
          </Box>
        </Grid>
      </Grid>
    ),
  },
  {
    title: "K-means法",
    content: (
      <Grid templateColumns="2fr 1fr">
        <Box>
          <Text>
            こうした点のグループ分けアルゴリズムとして、
            <strong>「K-means」</strong>
            というものが知られています。次に、K-means法のアルゴリズムを紹介します。
          </Text>
          <Box bg="gainsboro" borderRadius="5px" p={4} m={2}>
            <OrderedList>
              <ListItem>各点に適当にグループを割り当てる。</ListItem>
              <ListItem>各グループの中心地点を計算する。</ListItem>
              <ListItem>
                各点から、すべてのグループの中心地点との距離を計算し、最も距離が近いグループにその点を割り当て直す。
              </ListItem>
              <ListItem>上記2つを、変化がなくなるまで繰り返す。</ListItem>
            </OrderedList>
          </Box>
          <Text>
            この課題では各点に適当にグループが割り当てられた状態からスタートしますので、2番以降の動作を行うプログラミングを書いてみることが目標です。
            グループの中心地点は予め計算しておき、割り当て直しの最中で中心が動かないようにすることに注意してください。
          </Text>
        </Box>
        <video
          src={new URL("./compare_distance.mp4", import.meta.url).toString()}
          muted
          autoPlay
          loop
          width="100%"
        />
      </Grid>
    ),
  },
  {
    title: "データ構造について",
    content: (
      <Grid>
        <Box>
          <Text>
            この課題では、画像のように<strong>各データの情報</strong>(座標)
            <strong>がグループごとに順番に並べられて保存されています。</strong>
            グループや点には順番が存在します。グループや点の数え方が「0番目の点,1番目の点…」というように0始まりであることに注意してください。
            例えば、画像の点(c,d)(朱色)は「0番目のグループの1番目の点」で表されます。
          </Text>
        </Box>
        <Center>
          <img
            width="80%"
            src={new URL("./Data_structure.svg", import.meta.url).toString()}
            alt="データ構造"
          />
        </Center>
        <Text align="center">本課題のデータ構造の模式図</Text>
      </Grid>
    ),
  },
  {
    title: "ヒント",
    content: (
      <Grid>
        <Box m={4}>
          <Text fontSize="2xl">お助けブロック</Text>
          <Text>
            お助けブロックとして、「各グループの中心を計算する」ブロック、「点
            から点 の距離」ブロックが用意されています。
            はじめはこれらを用いてプログラムを書いてみましょう。
            実は、お助けブロックの内容を他のブロックを組み合わせて実現することもできます。興味があればやってみるのもよいでしょう。
          </Text>
        </Box>
        <Box m={4}>
          <Text fontSize="2xl">ループ&ループ</Text>
          <Text>
            ループ構文は「[(条件式)]になるまで」と変数操作、適切な条件式を組み合わせて表現できます。どうすればよいでしょうか？
          </Text>
        </Box>
        <Box m={4}>
          <Text fontSize="2xl">はじめの一歩</Text>
          <Text>
            「アルゴリズムを書ける自信がない...」そんなときは、まず簡単なプログラムを書いてみましょう。
            例えば、二点間の距離を計算し、それを変数に代入するプログラムを書いてみましょう。
            点Aと点Bの距離は√((点Aと点Bのx座標の差)^2+(点Aと点Bのy座標の差)^2)で計算できます。
            ループ構文が分かれば、各グループの中心地点を計算するプログラムも書くことができます。
            中心地点のx座標はグループ内の各点のx座標の平均値で計算できます。y座標も同様です。
          </Text>
        </Box>
        <Box m={4}>
          <Text fontSize="2xl">点の割り当て</Text>
          <Text>
            「点AをグループBに割り当てる」には「グループBに点Aを加える」操作と「点Aを点Aの属していたグループから削除する」操作が必要です。
            点を削除する際には図のように点の数え方がずれてしまうことに注意してください。
            なお、点を追加する際はグループ内の点の並びの末尾に追加されます。
          </Text>
          <Center>
            <img
              width="80%"
              src={new URL("./Delete_point.svg", import.meta.url).toString()}
              alt="データを削除したときの変化"
            />
          </Center>
          <Text align="center">点を削除したときの変化</Text>
        </Box>
      </Grid>
    ),
  },
];
