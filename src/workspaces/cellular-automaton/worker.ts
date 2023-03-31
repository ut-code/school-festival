import JSInterpreter from "js-interpreter";

globalThis.addEventListener("message", (e) => {
  const code = `result(JSON.stringify((function () {${e.data}})()));`;
  let result: boolean[][] = [];
  const jsInterpreter = new JSInterpreter(
    code,
    (newInterpreter, globalScope) => {
      newInterpreter.setProperty(
        globalScope,
        "result",
        newInterpreter.createNativeFunction((json: string) => {
          result = JSON.parse(json);
        })
      );
    }
  );
  jsInterpreter.run();
  globalThis.postMessage(result);
});
