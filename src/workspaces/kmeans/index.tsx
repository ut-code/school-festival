import { useRef, useState } from "react";
import { Box, Grid, Text } from "@chakra-ui/react";
import { useGetSet } from "react-use";
import {
  BlocklyEditorMessage,
  useBlocklyInterpreter,
} from "../../commons/interpreter";
import { useBlocklyWorkspace } from "../../commons/blockly";
import { CUSTOM_COMMON_WHILE_TRUE, CUSTOM_COMMON_DO_UNTIL, CUSTOM_COMMON_IF, CUSTOM_COMMON_IF_ELSE } from "../../config/blockly.blocks";
import { CUSTOM_CENTER_OF_CLUSTER, 
        CUSTOM_CALCULATE_CENTER_OF_CLUSTER, 
        CUSTOM_ASSIGN_CLUSTER, 
        CUSTOM_DISTANCE_BETWEEN_X_AND_Y, 
        CUSTOM_CLUSTER_OF_X, 
        CUSTOM_Y_IS_SMALLER_THAN_X, 
        CUSTOM_FOR_ALL_DATAS,
        CUSTOM_DATA_PROCESSING,
        CUSTOM_FOR_ALL_CLUSTERS,
        CUSTOM_CLUSTER_PROCESSING,
        CONSOLE_LOG } from "./blocks";
import { data, cluster } from "./blocks";
import { ExecutionManager } from "../../components/ExecutionManager";
import { SimulatorRenderer } from "./SimulatorRenderer";

const toolboxBlocks = [
  // 共有のブロック
  CUSTOM_COMMON_WHILE_TRUE,
  CUSTOM_COMMON_DO_UNTIL, 
  CUSTOM_COMMON_IF, 
  CUSTOM_COMMON_IF_ELSE,
  // ワークスペースごとに定義したブロック
  CUSTOM_CENTER_OF_CLUSTER, 
  CUSTOM_CALCULATE_CENTER_OF_CLUSTER, 
  CUSTOM_ASSIGN_CLUSTER, 
  CUSTOM_DISTANCE_BETWEEN_X_AND_Y, 
  CUSTOM_CLUSTER_OF_X, 
  CUSTOM_Y_IS_SMALLER_THAN_X,
  CUSTOM_FOR_ALL_DATAS,
  CUSTOM_DATA_PROCESSING,
  CUSTOM_FOR_ALL_CLUSTERS,
  CUSTOM_CLUSTER_PROCESSING,
  CONSOLE_LOG
];

type KmeansWorkspaceState = {
  //listOfDatas:data[];
  listOfClusters:cluster[];
  centerOfClusters:data[];
}



export function KmeansWorkspace(): JSX.Element {
  const N:number = 100;
  const K:number = 3;
  

  let clusters:cluster[]=[];

  for(let i:number = 0; i<K; i++){
    clusters.push({
      datas:[],
      n:i,
    });
  }
  function RandomDatas(N:number):KmeansWorkspaceState{
    let datas:data[] = [];
    for(let i:number = 0; i<N; i++){
      const x:number = Math.random()*N;
      const y:number = Math.random()*N;
      const c:number = Math.floor(Math.random()*K);
      datas.push({x:x,y:y,n:c});
      clusters[c].datas.push({x:x,y:y,n:c})
    }
    return {
      //listOfDatas:datas,
      listOfClusters:clusters,
      centerOfClusters:[],
    }
  }

  // interpreter に渡す関数は実行開始時に決定されるため、通常の state だと最新の情報が参照できません
  // このため、反則ですが内部的に ref を用いて状態管理をしている react-use の [useGetSet](https://github.com/streamich/react-use/blob/master/docs/useGetSet.md) を用いています。
  const [getState, setState] = useGetSet(RandomDatas(N));

  // javascriptGenerator により生成されたコードから呼ばれる関数を定義します
  const globalFunctions = useRef({
    [CUSTOM_CALCULATE_CENTER_OF_CLUSTER]: () => {
      
      for(let i=0; i<K; i++){
        const currentState = getState();
        const CLUSTER_X:number[] = currentState.listOfClusters[i].datas.map(data => data.x);
        const CLUSTER_Y:number[] = currentState.listOfClusters[i].datas.map(data => data.y);
        let avgX:number = 0;
        let avgY:number = 0;
        for(let j:number = 0; j<currentState.listOfClusters[i].datas.length; j++){
          avgX += CLUSTER_X[j]!;
          avgY += CLUSTER_Y[j]!;
        }
        avgX/=currentState.listOfClusters[i].datas.length;
        avgY/=currentState.listOfClusters[i].datas.length;
        setState({
          //listOfDatas:currentState.listOfDatas,
          listOfClusters:currentState.listOfClusters,
          centerOfClusters:currentState.centerOfClusters.concat({x:avgX,y:avgY,n:i}),
        });
      }
    },
    [CUSTOM_ASSIGN_CLUSTER]: (data:data,cluster:cluster) => {
      const currentState = getState();
      for(let i:number=0; i<currentState.listOfClusters[data.n].datas.length; i++){
        if(currentState.listOfClusters[data.n].datas[i]===data){
          let newListOfClusters = currentState.listOfClusters;
          newListOfClusters[data.n].datas.splice(i,1);
          newListOfClusters[cluster.n].datas.push(data);
          setState({
            listOfClusters:newListOfClusters,
            centerOfClusters:currentState.centerOfClusters,
          });
          break;
        }
      }
    },
    [CUSTOM_CLUSTER_OF_X]: (data:data) => {
      const currentState = getState();
      return currentState.listOfClusters[data.n];
    },
    [CUSTOM_CENTER_OF_CLUSTER]: (cluster:cluster) => {
      const currentState = getState();
      return currentState.centerOfClusters[cluster.n]
    },
    [CUSTOM_Y_IS_SMALLER_THAN_X]: (number1:number,number2:number) =>{
      return number1>number2;
    },
    [CUSTOM_DISTANCE_BETWEEN_X_AND_Y]: (data1:data,data2:data) => {
      return Math.sqrt((data1.x-data2.x)**2+(data1.y-data2.y)**2);
    }
  }).current;

  const [interval, setInterval] = useState(500);
  const { workspaceAreaRef, highlightBlock, getCode } = useBlocklyWorkspace({
    toolboxBlocks,
  });
  const interpreter = useBlocklyInterpreter({
    globalFunctions,
    executionInterval: interval,
    onStep: highlightBlock,
  });

  return (
    <Grid h="100%" templateColumns="1fr 25rem">
      <div ref={workspaceAreaRef} />
      <Box p={4}>
        <ExecutionManager
          interpreter={interpreter}
          interval={interval}
          setInterval={setInterval}
          onStart={() => {
            interpreter.start(getCode());
          }}
          onReset={() => {
            setState(RandomDatas(N));
          }}
        />
        <button 
          onClick={() => {
            setState(RandomDatas(N));
          }}>(再配置)</button>
        <SimulatorRenderer clusters = {getState().listOfClusters}/>
        
        <Text>0x {getState().centerOfClusters[0]? getState().centerOfClusters[0].x : 0}</Text>
        <Text>0y {getState().centerOfClusters[0]? getState().centerOfClusters[0].y : 0}</Text>
        <Text>1x {getState().centerOfClusters[1]? getState().centerOfClusters[1].x : 0}</Text>
        <Text>1y {getState().centerOfClusters[1]? getState().centerOfClusters[1].y : 0}</Text>
        <Text>2x {getState().centerOfClusters[2]? getState().centerOfClusters[2].x : 0}</Text>
        <Text>2y {getState().centerOfClusters[2]? getState().centerOfClusters[2].y : 0}</Text>
      </Box>
    </Grid>
  );
}