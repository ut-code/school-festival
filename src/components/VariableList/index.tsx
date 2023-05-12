import { ReactNode, useEffect, useState } from "react";
import { Text, chakra } from "@chakra-ui/react";
import { Names } from "blockly";
import { BlocklyInterpreter } from "../../commons/interpreter";
import { javascriptGenerator } from "../../config/blockly";

const Table = chakra("table", {
  baseStyle: { width: "100%", tableLayout: "fixed" },
});
const Tbody = chakra("tbody", { baseStyle: {} });
const Tr = chakra("tr", { baseStyle: {} });
const Th = chakra("th", {
  baseStyle: {
    border: "1px solid",
    borderColor: "gray.500",
    px: 2,
    py: 1,
    width: "100px",
    textAlign: "left",
    background: "gray.100",
    fontWeight: "normal",
  },
});
const Td = chakra("td", {
  baseStyle: { border: "1px solid", borderColor: "gray.500", px: 2, py: 1 },
});

export default function VariableList({
  interpreter,
  variableNames,
  renderVariable,
}: {
  interpreter: BlocklyInterpreter;
  variableNames: string[];
  /** デフォルトのレンダラを使用する場合は undefined を返す */
  renderVariable?(value: unknown): JSX.Element | undefined;
}) {
  const [variables, setVariables] = useState<Array<{
    name: string;
    value: unknown;
  }> | null>(null);

  useEffect(() => {
    const onStep = () => {
      setVariables(
        variableNames.map((name) => ({
          name,
          value: interpreter.getVariable(
            ((javascriptGenerator as any).nameDB_ as Names).getName( // eslint-disable-line
              name,
              Names.NameType.VARIABLE
            )
            // 空白文字を _ に置き換えたあと encodeURIComponent で UTF-8 に変換し、さらに % を _ に置き換え
            // encodeURIComponent(name.replace(/\s+/g, "_")).replace(/%/g, "_")
          ),
        }))
      );
    };
    interpreter.addListener("step", onStep);
    return () => {
      interpreter.removeListener("step", onStep);
    };
  }, [interpreter, variableNames]);

  return (
    <div>
      <Text fontSize="xl">変数</Text>
      {!variables?.length ? (
        <Text fontSize="sm" mt={1} color="gray.500">
          変数はありません。
        </Text>
      ) : (
        <Table mt={1}>
          <Tbody>
            {variables?.map(({ name, value }) => {
              let rendered: ReactNode = renderVariable?.(value);
              if (!rendered) {
                if (typeof value === "string")
                  rendered = <Text>{value.toString()}</Text>;
                else if (
                  typeof value === "number" ||
                  typeof value === "boolean"
                )
                  rendered = <Text color="blue.700">{value.toString()}</Text>;
                else if (value === null)
                  rendered = <Text color="gray.500">null</Text>;
                else if (value === undefined)
                  rendered = <Text color="gray.500">値がありません</Text>;
                else
                  throw new Error(
                    `変数 ${name} の値 ${value} を表示できません。`,
                    { cause: value }
                  );
              }
              return (
                <Tr key={name}>
                  <Th>{name}</Th>
                  <Td>{rendered}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </div>
  );
}
