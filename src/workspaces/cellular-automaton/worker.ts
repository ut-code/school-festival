import Interpreter from "js-interpreter";

globalThis.addEventListener("message", (e) => {
  const code = `result(JSON.stringify((function () {${e.data}})()));`;
  let result: boolean[][] = [];
  const interpreter = new Interpreter(code, (newInterpreter, globalScope) => {
    newInterpreter.setProperty(
      globalScope,
      "result",
      newInterpreter.createNativeFunction((json: string) => {
        result = JSON.parse(json);
      }),
    );
  });
  interpreter.run();
  globalThis.postMessage(result);
});
