import { Parser } from "../parser.js";

const parser = new Parser();

let program = `(2 + 2) * 42`;
let result = JSON.stringify(parser.parse(program));
console.log(result);
console.assert(result == `{"type":"Program","body":{"type":"NumericLiteral","value":42}}`);

program = `

    2+i;
    j*16;

`;
result = JSON.stringify(parser.parse(program));
console.log(result);