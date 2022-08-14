import { Parser } from "./parser.js";

const parser = new Parser();

const program = `42`;

const result = parser.parse(program);

console.log(result);