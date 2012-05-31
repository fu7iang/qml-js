
/*
 * QML to JSON parser in PEG.js
 * Written by Daniël Heres 2012
 * 
 */

start =
  c:code {return "[" + c + "]"}

code "code" = 
  ident comments ident
    v:var ident "{" m:mix "}"
  ident comments 
  {return '{"' + v + '":[' + m + "]}"}

mix "mix" =
  ident comments
    x:(declarations
    /code)* 
  ident {return x.join(",")}

declarations "declarations" =
  x:declaration break ident {return x}
  /x:declaration

declaration "declaration" =
  l:var ident":" ident r:var ident "{" m:mix "}" {return '{"' + l + '":{"' + r + '":[' + m + "]}" + '}'}
  /l:var ident":" ident r:expression comments {return '{"' + l + '"' + ":" + r + "}"}

break "break" =
  (";" / "\n") { return ""}
   
ident "ident" =
  ("\n" / " " / "\t")* {return ""}

spaces "spaces" =
  " "* {return ""}

var "var" =
  v:alphanumeric  p:(x:("." alphanumeric) {return x.join("")})* {return v + p.join("")}

expvar "expressionvar" = 
  v:var { return "this."  + v }

alphanumeric "alphanumeric" =
  v:[a-zA-Z0-9]+ {return v.join("")}

sign = 
  "+" { return ""}
 /"-"

comments "comments" = 
   (ident one_line_comment ident / ident multi_line_comment ident)* 

one_line_comment "one line comment" =
  "//" [^"\n"]* "\n"

multi_line_comment "multi line comment" = 
  "/*" (!"*/" .)* "*/" 

integer "integer" =
  s:sign? spaces digits:[0-9]+ { return s + parseInt(digits.join(""), 10); }

floating "float" =
  s:sign? spaces f:([0-9] "." [0-9]) {return s + parseFloat(f.join(""));}

string "string" =
  '"' v:('\\"' / [^"\""])+ '"' {return "'" + v.join("") + "'"}

functioncall "functioncall" = 
   v:expvar "(" spaces a:( l:(spaces x:primary spaces "," {return "," + x})* spaces m:primary {return l.join(",") + m} )? spaces ")" {return v + "(" + a + ")"}

additive "additive" =
  left:multiplicative spaces op:("+"/"-") spaces right:additive { return left + op + right; }
 /multiplicative

multiplicative "multiplicative" =
  left:primary spaces op:("*"/"/") spaces right:multiplicative { return left +  op + right; }
 /primary

primary "primary"
 = floating
  /boolean
  /string
  /integer
  /functioncall
  / "(" additive:additive ")" { return "(" + additive + ")"; }
  / v:expvar {return v}

expression "expression" =
  "{" spaces a:additive spaces "}" {return '"' + a + '"'}
  / spaces a:additive spaces {return '"' + a + '"'}

boolean "boolean" = 
  b:("true" / "false")
