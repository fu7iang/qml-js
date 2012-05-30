/*

Written by Daniël Heres 2012


*/
function item() {
  this.x = 0;
  this.y = 0;
}
var graph = {};
var funcs = [];

function val(v, id, prop) {
  if (typeof(v)==="string") {
    if (!graph[id].updates) graph[id].updates = {};
    if(!graph[id].subscribers) graph[id].subscribers = [];
    //todo subscribe to vars
    graph[id].updates[prop] = new Function("return " + v);
    funcs+={id:id, func: graph[id].updates[prop]};
    return graph[id].updates[prop]();
  }
  return v;
}
var global_id = 0;
var qml_convert = {
  item: function(i, t) {
    var div = document.createElement(t || "div");
    div.style.position="absolute";
    i.map(function(e) {
      if(e.id!==undefined) {
        div.id=e.id;
      }
      else e.id = global_id++ + "qmljs";
      graph[e.id] = {}
      graph[e.id].id = e.id;
      if(e.width!==undefined) div.style.width=val(e.width, e.id, "width");
      if(e.height!==undefined) div.style.height=val(e.height, e.id, "height");
      if(e.x!==undefined) div.style.left=val(e.x, e.id, "x") + "px";
      if(e.y!==undefined) div.style.top=val(e.y, e.id, "y") + "px";
      if(e.z!==undefined) div.style.zIndex = val(e.z, e.id, "z");
      if(e.opacity!==undefined) div.style.opacity=val(e.opacity, e.id, "opacity");
      console.log(e.visible);
      if(e.visible==="false") div.style.visibility="hidden";
      if(e.focus==="true") div.autofocus="true";
      if(e.clip==="false")div.style.overflow="visible";
      if(e.clip==="true")div.style.overflow="hidden";
      if(e.rotation!==undefined) {
        var rot = "rotate(" + e.rotation + "deg)";
        div.style.webkitTransform=rot;
        div.style.MozTransform=rot;
        div.style.oTransform=rot;
        div.style.transform=rot;
      }
      if(e.scale!==undefined) {
        var scale = "scale(" + e.scale + ")";
        div.style.webkitTransform+=scale;
        div.style.MozTransform+=scale;
        div.style.oTransform+=scale;
        div.style.transform+=scale;
      }
    });
    var p = convert_to_page(i, div);
    return div;   
  },

  rectangle: function(i) {
    var div = qml_convert.item(i);
    i.map(function(e) {
      if(e.color!==undefined) div.style.backgroundColor = e.color;
      if(e['border.color']!==undefined) div.style.borderColor = e['border.color'];
      if(e['border.width']!==undefined){
        div.style.borderWidth = e['border.width'] + "px";
        div.style.borderStyle="solid";
      }
      if(e.radius!==undefined) div.style.borderRadius = e.radius + "px";
      if(e.gradient!==undefined) {
        var grad = [];
        e.gradient.Gradient.map(function(gs) {
          gradient_stop = {color: "", position:0}
          gs.GradientStop.map(function(e) {
            if(e.position!==undefined) gradient_stop.position = e.position
            if(e.color!==undefined) gradient_stop.color = e.color
          });
          grad.push(gradient_stop.color + " " + gradient_stop.position * 100 + "%");
        });
        div.style.backgroundImage = "linear-gradient(top, " + grad.join(",") + ")";
        div.style.backgroundImage = "-o-linear-gradient(top, " + grad.join(",") + ")";
        div.style.backgroundImage = "-moz-linear-gradient(top, " + grad.join(",") + ")";
        div.style.backgroundImage = "-webkit-linear-gradient(top, " + grad.join(",") + ")";
        div.style.backgroundImage = "-ms-linear-gradient(top, " + grad.join(",") + ")";
      }
    })
    return div;
  },

  image: function(i) {
    var img = qml_convert.item(i);
    i.map(function(e) {
      if(e.source!==undefined) img.style.backgroundImage = "url(" + e.source + ")";
      if(e.mirror==="true") {
        img.style.webkitTransform = "scale(-1, 1)";
        img.style.MozTransform = "scale(-1, 1)";
        img.style.oTransform = "scale(-1, 1)";
        img.style.msTransform = "scale(-1, 1)";
        img.style.transform = "scale(-1, 1)";
      }
      switch(e.fillMode) {
        case "Image.PreserveAspectFit":
          img.style.backgroundSize = "contain";
          img.style.backgroundRepeat = "no-repeat";
          break;
        case "Image.PreserveAspectCrop":
          img.style.backgroundSize = "cover";
          break;
        default:
          img.style.backgroundSize = "100% 100%";
      }
      
    });
    return img;
  },

  text: function(t) {
    var text = qml_convert.item(t);
    t.map(function(e) {
      if(e.text!==undefined) text.innerHTML = e.text;

      if(e.color!==undefined) text.style.color=e.color;

      if(e["font.bold"] ==="true") text.style.fontWeight="bold";
      if(e["font.italic"]!==undefined) text.style.fontStyle="italic";
      if(e["font.pixelSize"]!==undefined) text.style.fontSize+=e["font.pixelSize"] + "px";
      if(e["font.pointSize"]!==undefined) text.style.fontSize+=e["font.pointSize"] + "pt";
      if(e["font.family"]!==undefined) text.style.fontFamily = e["font.family"];
      if(e["font.underline"]==="true") text.style.textDecoration+=" underline";
      if(e["font.strikeout"]==="true") text.style.textDecoration+=" line-through";
      if(e["font.letterSpacing"]!==undefined) text.style.letterSpacing = e["font.letterspacing"] + "px";
      if(e["font.wordSpacing"]!==undefined) text.style.wordSpacing = e["font.wordspacing"] + "px";
      switch(e['font.capitalization']) {
        case "Font.AllUppercase":
          text.style.textTransform = "uppercase";
          break;
        case "Font.AllLowercase":
          text.style.textTransform = "lowercase";
          break;
        case "Font.SmallCaps":
          text.style.fontVariant = "small-caps"
          break;
        case "Font.Capitalize":
          text.style.textTransform = "capitalize"; 
          break;  
      }
      switch(e['font.weight']) {
          case "Font.Light":
            text.style.fontWeight = "lighter";
            break;
          case "Font.DemiBold":
            text.style.fontWeight = "bolder";
            break;
          case "Font.Bold":
            text.style.fontWeight = "bold";
            break;
          case "Font.Black":
            text.style.fontWeight = "900";
            break;
      }
      switch(e['horizontalAlignment']) {
          case "Text.AlignLeft":
            text.style.textAlign = "left";
            break;
          case "Text.AlignRight":
            text.style.textAlign = "right";
            break;
          case "Text.AlignHCenter":
            text.style.textAlign = "center";
            break;
          case "Text.AlignJustify":
            text.style.textAlign = "justify";
            break;
      }
      switch(e['verticalAlignment']) {
          case "Text.Text.AlignTop":
            text.style.verticalAlign = "text-top";
            break;
          case "Text.Text.AlignBottom":
            text.style.textAlign = "text-bottom";
            break;
          case "Text.AlignVCenter":
            text.style.textAlign = "middle";
            break;
      }
    });
    return text;
  },
  mouse_area: function(m) {
    var mouse = qml_convert.item(m);
    m.map(function(e) {
      
    });
  }
}

function convert_to_page(json, e) {
  json.map(function(j) {
    if(j.Item) e.appendChild(qml_convert.item(j.Item));
    if(j.Rectangle) e.appendChild(qml_convert.rectangle(j.Rectangle));
    if(j.Image) e.appendChild(qml_convert.image(j.Image));
    if(j.Text) e.appendChild(qml_convert.text(j.Text));
    if(j.MouseArea) e.appendChild(qml_convert.mouse_area(j.Text));
  });
  return e;
}

var p = qmlparser.parse(document.getElementById("qml").innerHTML);
var json = JSON.parse(p);
var page = convert_to_page(json, document.createElement("div"));
document.getElementById("qml").appendChild(page);
