import { Col, Row, Typography } from 'antd';
import React from 'react';
import { TutorialDialogPropsStep } from './components/TutorialDialog';
import { MazeWorkspace } from './workspaces/maze';
import { SortWorkspace } from './workspaces/sort';

export const routes: {
  path: string;
  label: string;
  description: string;
  Component: React.ComponentType;
  tutorialSteps: TutorialDialogPropsStep[];
}[] = [
  {
    path: '/maze',
    label: '迷路',
    description: 'プログラムを書いて迷路を解こう！',
    Component: MazeWorkspace,
    tutorialSteps: [
      {
        title: 'ゴールまで行く',
        content: (
          <>
            <Typography.Paragraph>
              ブロックを並べて、迷路内にいる赤いアイコンを右下の旗印の場所まで移動させましょう。
            </Typography.Paragraph>
            <video
              src="/videos/maze-basic.mp4"
              muted
              autoPlay
              loop
              width="100%"
            />
          </>
        ),
      },
      {
        title: 'どんな迷路でも',
        content: (
          <>
            <Typography.Paragraph>
              「新しい迷路にする」をクリックすると、全く異なる迷路が生成されます。繰り返しや条件分岐をうまく使用し、
              <strong>どんな迷路にも対応できる</strong>
              プログラムを作りましょう。
            </Typography.Paragraph>
            <video
              src="/videos/maze-advanced.mp4"
              muted
              autoPlay
              loop
              width="100%"
            />
          </>
        ),
      },
      {
        title: 'アルゴリズム',
        content: (
          <Row>
            <Col span={10}>
              <Typography.Paragraph>
                古来から知られている迷路の解法に、「左手法」があります。この方法では、プレーヤーは迷路内で自分の手を左の壁に当て、そのまま離さないように進みます。
              </Typography.Paragraph>
              <Typography.Paragraph>
                シンプルなアルゴリズムですが、島が存在しない単純な迷路は必ず方法で解くことができます。用意されたブロックのみを用いて「左手法」はどのように表現されるでしょうか。
              </Typography.Paragraph>
            </Col>
            <Col span={14}>
              <img width="100%" src="/images/maze-method.svg" alt="左手法" />
            </Col>
          </Row>
        ),
      },
      {
        title: 'ヒント',
        content: (
          <Row gutter={16}>
            <Col span={10}>
              <img width="100%" src="/images/maze-hint.svg" alt="ヒント" />
            </Col>
            <Col span={14}>
              <Typography.Paragraph>
                迷路においてプレーヤーが歩かなければならない距離は非常に長いですが、実際は一歩一歩の積み重ねにすぎません。この一歩をもう少し詳しく見てみましょう。
              </Typography.Paragraph>
              <Typography.Paragraph>
                いま、プレーヤーは十字路に立っており、前、後ろ、左右のすべての方向に進むことができます。このとき、左手法に従うのであれば、プレーヤーはどちらに進めばよいでしょうか。
              </Typography.Paragraph>
              <Typography.Paragraph>
                左の壁に沿って進むので、左方向に進むのが正解ですね。それでは、左にもし壁があったとしたら？その場合はまっすぐ進めば良いはずです。
              </Typography.Paragraph>
              <Typography.Paragraph>
                同じように考えて、４つの方向に「優先順位」をつけてみましょう。壁がない方向のうち、最も優先順位が高い方向が、プレーヤーが進むべき道です。
              </Typography.Paragraph>
            </Col>
          </Row>
        ),
      },
    ],
  },
  {
    path: '/sort',
    label: '並べ替え',
    description: '先生になりきって生徒を並ばせよう！',
    Component: SortWorkspace,
    tutorialSteps: [
      {
        title: '先生と生徒',
        content: (
          <>
            <Typography.Paragraph>
              「右（左）へ動く」は先生（ホイッスル）の位置を移動させ、「右（左）の人と入れ替える」は、ホイッスルに最も近い生徒を隣の生徒と入れ替えます。
            </Typography.Paragraph>
            <video
              src="/videos/sort-basic.mp4"
              muted
              autoPlay
              loop
              width="100%"
            />
          </>
        ),
      },
      {
        title: '身長の比較',
        content: (
          <>
            <Typography.Paragraph>
              先生は、目の前の生徒と隣の生徒の身長を比較することができます。条件分岐と繰り返しを駆使して、生徒を身長順に並べましょう。
            </Typography.Paragraph>
            <video
              src="/videos/sort-advanced.mp4"
              muted
              autoPlay
              loop
              width="100%"
            />
          </>
        ),
      },
      {
        title: 'アルゴリズム',
        content: (
          <>
            <Typography.Paragraph>
              この課題で用いるのは、<strong>バブルソート</strong>
              と呼ばれる並べ替え（＝ソート）のためのアルゴリズムです。隣り合う要素同士を順に比較していくシンプルなアルゴリズムですが、計算量が要素数の二乗に比例するため、計算に時間がかかってしまいます。
            </Typography.Paragraph>
            <Typography.Paragraph>
              並べ替えのためのアルゴリズムは古くから研究されており、バブルソートよりも一般的に高速なアルゴリズムとして、
              <strong>クイックソート</strong>や<strong>マージソート</strong>
              など様々なアルゴリズムが考案されてきました。
            </Typography.Paragraph>
            <Typography.Paragraph>
              残念ながら、この課題ではそういった高度な並べ替えのアルゴリズムを記述することはできません。しかしながら、家庭にあるトランプなどを使って並べ替えの実験をしてみるのも面白いでしょう。
            </Typography.Paragraph>
          </>
        ),
      },
    ],
  },
];
