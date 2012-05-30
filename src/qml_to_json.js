
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
  x: (declaration break ident) {return x.join("")} 
  /d:declaration break? {return d}

declaration "declaration" =
  l:var spaces ":" ident r:var ident "{" m:mix "}" {return '{"' + l + '":{"' + r + '":[' + m + "]}" + '}'}
  /l:var spaces ":" spaces r:val comments {return '{"' + l + '"' + ":" + r + "}"}

break "break" =
  (";" / "\n") { return ""}
   
ident "ident" =
  ("\n" / " " / "\t")* {return ""}

spaces "spaces" =
  " "* {return ""}

var "var" =
  v:alphanumeric  p:(x:("." alphanumeric) {return x.join("")})* {return v + p.join("")}

alphanumeric "alphanumeric" =
  v:[a-zA-Z0-9]+ {return v.join("")}

sign = 
  "+" { return ""}
 /"-"
 / ""

comments "comments" = 
   (ident one_line_comment ident / ident multi_line_comment ident)* 

one_line_comment "one line comment" =
  "//" [^"\n"]* "\n"   {return ""}

multi_line_comment "multi line comment" = 
  "/*" [^"*/"]* "*/" {return ""}

integer "integer" =
  s:sign spaces digits:[0-9]+ { return s + parseInt(digits.join(""), 10); }

floating "float" =
  s:sign spaces f:(integer "." integer) {return s + parseFloat(f.join(""));}

string "string" =
  '"' v:('\\"' / [^"\""])+ '"' {return '"' + v.join("") + '"'}

additive "additive" =
  left:multiplicative spaces "+" spaces right:additive { return left + "+" + right; }
 /left:multiplicative spaces "-" spaces right:additive { return left + "-" + right; }
 /multiplicative

multiplicative "multiplicative" =
  left:primary spaces "*" spaces right:multiplicative { return left +  "*" + right; }
 /left:primary spaces "/" spaces right:multiplicative { return left +  "/" + right; }
 /primary

primary
  = floating
  / integer
  / "(" additive:additive ")" { return "(" + additive + ")"; }
  / v:var {return "graph." + v}

expression "expression" =
  "{" spaces a:additive spaces "}" {return '"' + a + '"'}

val "val" =
 floating
 /integer
 /string
 /v:var {return '"' + v + '"'}
 /e:expression
