import { Chess } from "./chess";
const fs = require("fs");

const chess = new Chess();
console.time();
chess.loadPgn(fs.readFileSync("./1.pgn").toString());
console.timeEnd();
