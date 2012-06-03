/*

Written by Daniël Heres 2012


*/
function _f(ctx, prop, expression) {
  delete ctx[prop]
  ctx.__defineGetter__(prop, new Function("return " + expression));
  ctx["set" +prop] = function(from, val) {
    var v = prop;
    v[0] = v.charAt(0).toUpperCase();
    if (ctx["on" + v + "Changed"] !== undefined) ctx["on" + v + "Changed"]();
    if(ctx.subscribers.indexOf(from) === -1) ctx.subscribers.push(from);
    ctx[prop] = val;
    ctx.subscribers.map(function(s) {
       //s();
    });
  }
}

function item(json, parent, ctx) {
  ctx.id = ""
  ctx.x = 0;
  ctx.y = 0;
  ctx.z = 0;
  ctx.width = _f(ctx, "width", 0);
  ctx.height = _f(ctx, "height", 0);
  ctx.opacity = 1;
  ctx.visible = "true";
  ctx.focus = false;
  ctx.clip = false;
  ctx.rotation = 0;
  ctx.scale = 1;
  ctx.children = [];
  ctx.parent = parent;
  ctx.subscribers = [];
  ctx.anchors = {
    fill:null,
    parent:ctx.parent
  }
  json.map(function(e) {
    if(e.id!==undefined) ctx.id = e.id;
    if(e.width!==undefined) _f(ctx, "width", e.width);
    if(e.height!==undefined) _f(ctx, "height", e.height);
    if(e.x!==undefined) _f(ctx, "x", e.x);
    if(e.y!==undefined) _f(ctx, "y", e.y);
    if(e.z!==undefined) _f(ctx, "z", e.z);
    if(e.opacity!==undefined) _f(ctx, "opacity", e.opacity);
    if(e.visible!==undefined) _f(ctx, "visible", e.visible);
    if(e.focus!==undefined) _f(ctx, "focus", e.focus);
    if(e.clip!==undefined) _f(ctx, "clip", e.clip);
    if(e.rotation!==undefined) _f(ctx, "rotation", e.rotation);
    if(e.scale!==undefined) _f(ctx, "scale", e.scale);
    if(e["anchors.fill"]!==undefined) _f(ctx.anchors, "fill", e["anchors.fill"]);
  });
  //create new id if it doesn't exist
  if(ctx.id==="") ctx.id = global_id++ + "qmljs";
  this.children = load_qml(json, ctx || this);

  this.html = function(ctx, e) {
     ctx = ctx || this;
     var div = document.createElement("div");
     div.id = ctx.id;
     div.style.position = "absolute";
     if(ctx.anchors.fill!==null) {
        delete ctx.width; delete ctx.height; delete ctx.x; delete ctx.y;
        ctx.width = ctx.anchors.fill.width;
        ctx.height = ctx.anchors.fill.height;
        ctx.x = ctx.anchors.fill.x;
        ctx.y = ctx.anchors.fill.y;
     }
     div.style.width=ctx.width
     div.style.height=ctx.height
     div.style.left=ctx.x
     div.style.top=ctx.y
     div.style.zIndex = ctx.z
     div.style.opacity=ctx.opacity;
     div.autofocus=ctx.focus
     if (ctx.visible) div.style.visibility="visible";
     else div.style.visibility="hidden";
     var rot = "rotate(" + ctx.rotation + "deg)";
     div.style.webkitTransform=rot;
     div.style.MozTransform=rot;
     div.style.oTransform=rot;
     div.style.transform=rot
     var scale = "scale(" + ctx.scale + ")";
     div.style.webkitTransform+=scale;
     div.style.MozTransform+=scale
     div.style.oTransform+=scale;
     div.style.transform+=scale;
     
     this.children.map(function(h) {
      e.appendChild(h.html(null, e));
     });
     return div;
  }
}

function rectangle(json, parent, ctx) {
  ctx = ctx || this;
  ctx.base = new item(json, parent, this);
  ctx.color = "transparent";
  ctx.border = {
    color:"white",
    width:0,
    parent:ctx.parent
  }

  ctx.radius = 0;
  ctx.gradient = null;

  json.map(function(e) {
    if(e.color!==undefined) _f(ctx, "color", e.color);
    if(e['border.color']!==undefined) _f(ctx.border, "color", e['border.color']);
    if(e['border.width']!==undefined) _f(ctx.border, "width", e['border.width']);
    if(e.radius!==undefined) _f(ctx, "radius", e.radius);
    if(e.gradient!==undefined) {ctx.gradient = e.gradient;
      ctx.gradient.Gradient.map(function(gs) {
        gs.GradientStop.map(function(e) {
          if(e.position!==undefined) _f(e, "position", e.position);
          if(e.color!==undefined) _f(e, "color", e.color);
          e.parent = ctx.parent;
        });
      });
    }
   if(e.function!==undefined) {}
  });
  this.html = function(ctx, e) {
    if (!ctx) var ctx = this;
    var div = ctx.base.html(ctx, e);
    div.style.backgroundColor = ctx.color, ctx.id, "color";
    div.style.borderColor = ctx.border.color;
    if (ctx.border.width > 0) {
      div.style.borderWidth = ctx.border.width+ "px";
      div.style.borderStyle = "solid";
    }
    div.style.borderRadius = ctx.radius + "px";
    if(ctx.gradient!==null) {
      var grad = [];
      ctx.gradient.Gradient.map(function(gs) {
        gradient_stop = {color: "", position:0}
        gs.GradientStop.map(function(e) {
          if(e.position!==undefined) gradient_stop.position = e.position;
          if(e.color!==undefined) gradient_stop.color = e.color;
        });
        grad.push(gradient_stop.color + " " + gradient_stop.position * 100 + "%");
      });
      div.style.backgroundImage = "linear-gradient(top, " + grad.join(",") + ")";
      div.style.backgroundImage = "-o-linear-gradient(top, " + grad.join(",") + ")";
      div.style.backgroundImage = "-moz-linear-gradient(top, " + grad.join(",") + ")";
      div.style.backgroundImage = "-webkit-linear-gradient(top, " + grad.join(",") + ")";
      div.style.backgroundImage = "-ms-linear-gradient(top, " + grad.join(",") + ")";
    }
    return div;
  }
}
function image(json, parent, ctx) {
  ctx = ctx || this;
  ctx.base = new item(json, parent, this);
  ctx.source="";
  ctx.mirror = false;
  ctx.Image = {PreserveAspectFit:0, PreserveAspectCrop:1, parent:ctx.parent,}
  ctx.fillMode = Image.PreserveAspectFit;

  json.map(function(e) {
    if(e.source!==undefined) _f(ctx, "source", e.source);
    if(e.mirror!==undefined) _f(ctx, "mirror", e.mirror);
    if(e.fillMode!==undefined) _f(ctx, "fillMode", e.fillMode);     
  });

  this.html = function(ctx, e) {
    if (!ctx) var ctx = this;
    var div = ctx.base.html(ctx, e);
    div.style.backgroundImage = "url(" + ctx.source + ")";
    if(ctx.mirror) {
        div.style.webkitTransform = "scale(-1, 1)";
        div.style.MozTransform = "scale(-1, 1)";
        div.style.oTransform = "scale(-1, 1)";
        div.style.msTransform = "scale(-1, 1)";
        div.style.transform = "scale(-1, 1)";
    }
    switch(ctx.fillMode.PreserveAspectFit) {
      case ctx.Image.PreserveAspectFit:
        div.style.backgroundSize = "contain";
        div.style.backgroundRepeat = "no-repeat";
        break;
      case ctx.Image.PreserveAspectCrop:
        div.style.backgroundSize = "cover";
        break;
      default:
        div.style.backgroundSize = "100% 100%";
    }
    return div;
  }
}

function text(json, parent, ctx)
{
  ctx = ctx || this;
  ctx.base = new item(json, parent, this);
  ctx.text = "";
  ctx.color = "black";

  ctx.Font = {
    MixedCase:0,
    AllUppercase:1,
    AllLowercase:2,
    SmallCaps:3,
    Capitalize:4,

    Light:5,
    DemiBold:6,
    Bold:7,
    Black:8,
    parent:ctx.parent,
  }
  ctx.Text = {
    AlignLeft:0, AlignRight:1,
    AlignHCenter:2, AlignJustify:3,
 
    AlignTop:4, AlignVCenter:5, AlignBottom:6,
    parent:ctx.parent
  }
  ctx.font = {
    Font:ctx.Font,
    bold:false,
    italic:false,
    pixelSize:12,
    pointSize:1.0,
    family: "Arial",
    underline:false,
    strikeout:false,
    letterSpacing:2,
    wordSpacing:2,
    capitalization:ctx.Font.MixedCase,
    weight:ctx.Font.Normal,
    parent:ctx.parent,
  }
  ctx.horizontalAlignment=Text.AlignLeft;
  ctx.verticalAlignment=Text.AlignTop;

  json.map(function(e) {
    if(e.text!==undefined) _f(ctx, "text", e.text);
    if(e.color!==undefined) _f(ctx, "color", e.color);
    if(e["font.bold"]!==undefined) _f(ctx.font, "bold", e["font.bold"]);;
    if(e["font.italic"]!==undefined) _f(ctx.font, "color", e["font.italic"]);
    if(e["font.pixelSize"]!==undefined) _f(ctx.font, "pixelSize", e["font.pixelSize"]);     
    if(e["font.pointSize"]!==undefined) _f(ctx.font, "pointSize", e["font.pointSize"]);     
    if(e["font.family"]!==undefined) _f(ctx.font, "family", e["font.family"]);     
    if(e["font.underline"]!==undefined) _f(ctx.font, "underline", e["font.underline"]);     
    if(e["font.strikeout"]!==undefined) _f(ctx.font, "strikeout", e["font.strikeout"]);     
    if(e["font.letterSpacing"]!==undefined) _f(ctx.font, "letterSpacing", e["font.letterSpacing"]);     
    if(e["font.wordSpacing"]!==undefined) _f(ctx.font, "wordSpacing", e["font.wordSpacing"]);     
    if(e['font.capitalization']) _f(ctx.font, "capitalization", e['font.capitalization']);     
    if(e["font.weight"]!==undefined) _f(ctx.Font, "weight", e["font.weight"]);     
    if(e["horizontalAlignment"]!==undefined) _f(ctx, "horizontalAlignment", e["horizontalAlignment"]);
    if(e["verticalAlignment"]!==undefined) _f(ctx, "verticalAlignment", e["verticalAlignment"]);     
  });

  ctx.html = function(ctx, e) {
    ctx = ctx || this;
    var div = ctx.base.html(ctx, e);
    div.innerHTML = '<div>' + ctx.text + '<div>';
    div.style.color = ctx.color;
    if(ctx.font.bold) div.style.fontWeight="bold";
    if(ctx.font.italic) div.style.fontStyle="italic";
    div.style.fontSize+=ctx.font.pixelSize + "px";
    div.style.fontSize+= ctx.font.pointSize + "pt";
    div.style.fontFamily = ctx.font.family;
    if (ctx.font.underline) div.style.textDecoration+=" underline";
    if (ctx.font.strikeout) div.style.textDecoration+=" line-through";
    div.style.letterSpacing = ctx.font.letterSpacing + "px";
    div.style.wordSpacing = ctx.font.wordSpacing + "px";
    switch(ctx.font.capitalization) {
        case ctx.Font.AllUppercase:
          div.style.textTransform = "uppercase";
          break;
        case ctx.Font.AllLowercase:
          div.style.textTransform = "lowercase";
          break;
        case ctx.Font.SmallCaps:
          div.style.fontVariant = "small-caps"
          break;
        case ctx.Font.Capitalize:
          div.style.textTransform = "capitalize"; 
          break;  
    }
    switch(ctx.horizontalAlignment) {
      case ctx.Text.AlignLeft:
        div.style.textAlign = "left";
        break;
      case ctx.Text.AlignRight:
        div.style.textAlign = "right";
        break;
      case ctx.Text.AlignHCenter:
        div.style.textAlign = "center";
        break;
      case ctx.Text.AlignJustify:
        div.style.textAlign = "justify";
        break;
    }
    switch(ctx.verticalAlignment) {
      case ctx.Text.AlignTop: 
        div.style.verticalAlign = "text-top";
        break;
      case ctx.Text.AlignBottom:
        div.style.verticalAlign = "text-bottom";
        break;
      case ctx.Text.AlignVCenter:
         //console.log(window.getComputedStyle(div.childNodes[0]).getPropertyValue("height"))
         div.style.paddingTop = 0.5*ctx.height - 5;
         break;
    }
    return div;
  }
}

function mouse_area(json, parent, ctx) {
  ctx = ctx || this;
  ctx.base = new item(json, parent, this);
  ctx.onClicked = function () {}
  parent = parent;

  json.map(function(e) {
    if(e.onClicked) ctx.onClicked = new Function("ctx", e.onClicked);
  });


  ctx.html = function(ctx, e) {
    ctx = ctx || this;
    var div = ctx.base.html(ctx, e);
    div.onclick = function() {ctx.onClicked(ctx)}
    return div;
  }
}

var global_id = 0;
function load_qml(json, parent) {
  var p = [];
  json.map(function(j) {
    if(j.Item) p.push(new item(j.Item, parent));
    if(j.Rectangle) p.push(new rectangle(j.Rectangle, parent));
    if(j.Image) p.push(new image(j.Image, parent));
    if(j.Text) p.push(new text(j.Text, parent));
    if(j.MouseArea) p.push(new mouse_area(j.MouseArea, parent));
  });
  return p;
}

function convert_to_page(json, e, parent) {
  var p = load_qml(json, parent);
  p.map(function(h) {
    e.appendChild(h.html(h, e));
  });
  e.style.position = "relative";
  return e;
}

var p = qmlparser.parse(document.getElementById("qml").innerHTML);
var json = JSON.parse(p);
var page = convert_to_page(json, document.createElement("div"));
document.getElementById("qml").appendChild(page);
