import {lex} from "lexer.js";
import {parse} from "parser.js";
import {evaluate} from "evaluator.js";

var calculate = function calc(input){
  try{
    let tokens = lex(input);
    let parseTree = parse(tokens);
    return evaluate(parseTree);
  }catch(e){
    console.log(e);
    return e;
  }
}
