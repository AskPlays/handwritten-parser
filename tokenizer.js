
const spec = [
  [/^\s+/, null],
  [/^\d+/, 'NUMBER'],
  [/^"[^"]*"/, 'STRING'],
  [/^'[^']*'/, 'STRING'],
  [/^[+\-]/, 'ADDITIVE_OPERATOR'],
  [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],
  [/^\w+/, 'ID'],
  [/^;/, ';'],
  [/^\{/, '{'],
  [/^\}/, '}'],
  [/^\(/, '('],
  [/^\)/, ')'],
];

export class Tokenizer {

  init(string) {
    this.cursor = 0;
    this.string = string;
  }

  isEOF() {
    return this.cursor >= this.string.length;
  }

  getNextToken() {
    if(this.isEOF()) return null;
    const string = this.string.slice(this.cursor);
    for(const [regexp, tokenType] of spec) {
      const match = this.match(regexp, string);
      if(match == null) continue;
      if(tokenType == null) return this.getNextToken();
      return {
        type: tokenType,
        value: match[0]
      };
    }

    throw new SyntaxError(`Unexpected token ${string[0]}`);
  }

  match(regexp, string) {
    const matched = regexp.exec(string);
    if(matched) {
      this.cursor += matched[0].length;
      return matched[0];
    }
    return null;
  }
}