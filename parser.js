"use strict"
var symbols = {};
export function parse(tokens){
  var parseTree = [];
  var i = 0;
  function token(){
    return interpretToken(tokens[i]);
  };
  function advance(){
    i++; return token();
  };
  while(token().type !== "(end)"){
    parseTree.push(expression(0));
  }
  return parseTree;
};

function expression(rbp){
  var left, t = token();
  advance();
  if(!t.nud){ throw "Unexpected token: " + t.type};
  left = t.nud(t);
  while(rbp < token().lbp){
    t = token();
    advance();
    if(!t.led){throw "Unexpected token:" + t.type}
    left = t.led(left);
  }
  return left;
}

function symbol(id, nud, lbp, led){
  var sym = symbols[id] || {};
  symbols[id] = {
    lbp: sym.lbp : lbp,
    nud: sym.nud : nud,
    led: sym.led: led
  };
};

function interpretToken(token){
  var sym = Object.create(symbols[token.type]);
  sym.type = token.type;
  sym.value = token.value;
  return sym;
};

function infix(id, lbp, rbp, led){
  rbp = rbp || lbp;
  symbol(id, null, lbp, led || left =>
    ({
      type: id,
      left: left,
      right: expression(rbp)
    })
  )
};
function prefix(id, rbp){
  symbol(id, () =>
    ({type: id, right: expression(rbp)}))
}
prefix("-", 7);
infix("^", 6, 5);
infix("*", 4);
infix("/", 4);
infix("%", 4);
infix("+", 3);
infix("-", 3);
symbol(",");
symbol(")");
symbol("(end)");
symbol("(", () => {
  value = expression(2);
  if(token().type !== ")"){
    throw "Expected closing parenthesis ')'";
  }
  advance();
  return value;
});
symbol("number", (number) => {
  return number;
});
symbol("identifier", (name) => {
  if(token().type === "("){
    var args = [];
    if(tokens[i + 1].type === ")"){
      advance();
    }else{
      do{
        advance();
        args.push(expression(2));
      } while(token().type === ",");
    }
    advance();
    return {
      type: "call",
      args: args,
      name: name.value
    };
  }
  return name;
});
infix("=", 1, 2, (left) => {
  if(left.type === "call"){
    //this for loop can be updated, maybe with filter/find
    for(let j = 0; j < left.args.length; j++){
      if (left.args[j].type !== "identifier") throw "Error";
    }
    return {
      type: "function",
      name: left.name,
      args: left.args,
      value: expression(2)
    }
  }else if(left.type === "identifier"){
    return {
      type: "assign",
      name: left.value,
      value: expression(2)
    }
  }else{
    throw "Invalid value";
  }
});
