import { Tokenizer } from './tokenizer.js';

export class Parser {
  constructor() {
    this.string = '';
    this.tokenizer = new Tokenizer();
  }

  parse(string) {
    this.string = string;
    this.tokenizer.init(string);

    this.lookahead = this.tokenizer.getNextToken();

    return this.Program();
  }

  Program() {
    return {
      type: 'Program',
      body: this.StatementList()
    }
  }

  StatementList() {
    const statements = [];
    while(this.lookahead) {
      statements.push(this.Statement());
    }
    return statements;
  }

  Statement() {
    const expression = this.Expression();
    if(this.lookahead?.type === ';') this.eat(';');
    return {
      type: 'Statement',
      expression
    }
  }

  Expression() {
    return this.AdditiveExpression();
  }

  AdditiveExpression() {
    let left = this.MultiplicativeExpression();
    while(this.lookahead?.type === 'ADDITIVE_OPERATOR') {
      const operator = this.eat(this.lookahead.type).value;
      const right = this.MultiplicativeExpression();
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      };
    }
    return left;
  }

  MultiplicativeExpression() {
    let left = this.UnaryExpression();
    while(this.lookahead?.type === 'MULTIPLICATIVE_OPERATOR') {
      const operator = this.eat(this.lookahead.type).value;
      const right = this.UnaryExpression();
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      };
    }
    return left;
  }

  UnaryExpression() {
    return this.PrimaryExpression();
  }

  PrimaryExpression() {
    switch(this.lookahead.type) {
      case '(': return this.ParenthesizedExpression();
      case 'ID': return this.Identifier();
      default: return this.Literal();
    }
  }

  ParenthesizedExpression() {
    this.eat('(');
    const expression = this.Expression();
    this.eat(')');
    return expression;
  }

  Literal() {
    switch(this.lookahead.type) {
      case 'NUMBER': return this.NumericLiteral();
      case 'STRING': return this.StringLiteral();
    }
    throw new Error(`Unexpected literal type ${token.type}`);
  }

  NumericLiteral() {
    const token = this.eat('NUMBER');
    return {
      type: 'NumericLiteral', 
      value: Number(token.value)
    };
  }

  StringLiteral() {
    const token = this.eat('STRING');
    return {
      type: 'StringLiteral',
      value: token.value.slice(1, -1)
    };
  }

  Identifier() {
    const token = this.eat('ID');
    return {
      type: 'Identifier',
      value: token.value
    };
  }

  eat(tokenType) {
    const token = this.lookahead;
    if(token == null) {
      throw new SyntaxError(`Unexpected end of input, expected ${tokenType}`);
    }
    if(token.type === tokenType) {
      this.lookahead = this.tokenizer.getNextToken();
      return token;
    }
    throw new SyntaxError(`Unexpected token ${token.type}, expected ${tokenType}`);
  }
}