"use strict"
export function evaluate(parseTree){
  var parseNode = function(node){
    if (node.type === "number") return node.value;
    else if (operators[node.type]) {
      if (node.left) return operators[node.type](parseNode(node.left), parseNode(node.right));
      return operators[node.type](parseNode(node.right));
    }
    else if (node.type === "identifier") {
      var value = args.hasOwnProperty(node.value) ? args[node.value] : variables[node.value];
      if (typeof value === "undefined") throw node.value + " is undefined";
      return value;
    }
    else if (node.type === "assign") {
      variables[node.name] = parseNode(node.value);
    }
    else if (node.type === "call") {
      for (var i = 0; i < node.args.length; i++) node.args[i] = parseNode(node.args[i]);
      return functions[node.name].apply(null, node.args);
    }
    else if (node.type === "function") {
      functions[node.name] = function () {
        for (var i = 0; i < node.args.length; i++) {
          args[node.args[i].value] = arguments[i];
        }
        var ret = parseNode(node.value);
        args = {};
        return ret;
      };
    }

  };
  let output = "";
  for (let treeNode : parseTree){
    let value = parseNode(treeNode);
    if(typeof value !== "undefine"){
      output += value + "\n";
    }
  }
  return output;
};
var operators = {
  "+": (a,b)=>{return a + b},
  "-": (a,b)=>{b ? return a - b : return -a},
  "*": (a,b)=>{a*b},
  "/": (a,b)=>{a/b},
  "%": (a,b)=>{a%b},
  "^": (a,b)=>{Math.pow(a,b)}
};
var variables = {
  pi: Math.PI,
  e: Math.E
};
var functions = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  abs: Math.abs,
  round: Math.round,
  ceil: Math.ceil,
  floor: Math.floor,
  log: Math.log,
  exp: Math.exp,
  sqrt: Math.sqrt,
  max: Math.max,
  min: Math.min,
  random: Math.random
};
var args = {};
