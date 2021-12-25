// globalThisがNodeのと違うのでimportしないと使えないもの
// TODO 何故importが使えないのか

// NodeのglobalThis.AbortControllerを参照できないので、node-abort-controllerを使用
const { AbortController, AbortSignal } = require("node-abort-controller");
globalThis.AbortController = AbortController;
globalThis.AbortSignal = AbortSignal;
