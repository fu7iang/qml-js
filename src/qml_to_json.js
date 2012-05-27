/*
 * QML to JSON parser in PEG.js
 * Written by Daniël Heres 2012
 * 
 */

start =
  c:code {return "{" + c + "}"}

code "code" = 
  ident
    v:var ident "{" m:mix "}"
  ident 
  {return '"' + v + '":{' + m + "}"}

mix "mix" =
  ident 
    x:(declarations
    / code)* 
  ident {return x.join(",")}

declarations "declarations" =
  x: (declaration break ident) {return x.join("")} 
  / d:declaration break? {return d}

declaration "declaration" =
  l:var spaces ":" spaces r:val {return '"' + l + '"' + ":" + r}

break "break" =
  (";" / "\n") { return ""}
   
ident "ident" =
  ("\n" / " " / "\t")* {return ""}

spaces "spaces" =
  " "* {return ""}

var "var" =
  v:alphanumeric  p:(x:("." alphanumeric) {return x.join("")})* {console.log(p); return v + p.join("")}

alphanumeric "alphanumeric" =
  v:[a-zA-Z0-9]+ {return v.join("")}

integer "integer" =
  digits:[0-9]+ { return parseInt(digits.join(""), 10); }

floating "float" =
  f:(integer "." integer) {return parseFloat(f.join(""));}

string "string" =
  '"' v:('\\"' / [^"\""])+ '"' {return '"' + v.join("") + '"'}

val "val" =
  floating
  / integer
  / s:string {return s}
  / v:var {return '"' + v + '"'} 

