"use strict"
export function lex(input){
  var tokens = [], c, i = 0;
  var advance = function(){return c = input[++i]};
  var addToken = function(type, value){
    tokens.push({
      type: type,
      value: value
    });
  };
  while(i < input.length){
    c = input[i];
    if(isWhitespace(c)){
      advnace();
    }else if(isOperator(c)){
      addToken(c);
      advance();
    }else if(isDigit(c)){
      var num = c;
      while(isDigit(advance())){
        num += c;
      }
      if(c==="."){
        do num += c; while(isDigit(advance()));
      }
      num = parseFloat(num);
      if(!isFinite(num)) throw "Too big.";
      addToken("number", num);
    }else if(isIdentifier(c)){
      var idn = c;
      while(isIdentifier(advance())){
        idn += c;
      }
      addToken("identifier", idn);
    }else{
      throw "Unrecognized.";
    }
  }
  addToken("(end)");
  return tokens;
}

var isOperator = function(token){ return /[+\-*\/\^%=(),]/.test(token)};
var isDigit = function(token){return /[1-9]/.test(token)};
var isWhitespace = function(token){return /\s/.test(token)};
var isIdentifier = function(token){return typeof token === 'string'
                            && !isOperator(token)
                            && !isDigit(token)
                            && !isWhitespace(token)};
