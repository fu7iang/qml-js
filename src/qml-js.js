/*

Written by Daniël Heres 2012


*/

var qml_convert = {
  item: function(i, t) {
    var div = document.createElement(t || "div");
    div.style.position="absolute";
    i.map(function(e) {
      if(e.id) div.id=e.id;
      if(e.width) div.style.width=e.width;
      if(e.height) div.style.height=e.height;
      if(e.x) div.style.marginLeft=e.x + "px";
      if(e.y) div.style.marginTop=e.y + "px";
    });
    var p = convert_to_page(i, div);
    return div;   
  },

  rectangle: function(i) {
    var div = qml_convert.item(i);
    i.map(function(e) {
      if(e.color) div.style.backgroundColor = e.color;
      if(e['border.color']) div.style.borderColor = e['border.color'];
      if(e['border.size']){
        div.style.borderWidth = e['border.size'] + "px";
        div.style.borderStyle="solid";
      }
      if(e['radius']) div.style.borderRadius = e['radius'] + "px";
    });
    return div;
  },

  image: function(i) {
    var img = qml_convert.item(i);
    i.map(function(e) {
      if(e.source) {img.style.backgroundImage = "url(" + e.source + ")";}
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
      if(e.text) text.innerHTML = e.text;
      if(e.bold ==="true") text.style.fontWeight="bold";
    });
    return text;
  }
}

function convert_to_page(json, e) {
  json.map(function(j) {
    if(j.Item) e.appendChild(qml_convert.item(j.Item));
    if(j.Rectangle) e.appendChild(qml_convert.rectangle(j.Rectangle));
    if(j.Image) e.appendChild(qml_convert.image(j.Image));
    if(j.Text) e.appendChild(qml_convert.text(j.Text));
  });
  return e;
}

var p = qmlparser.parse(document.getElementById("qml").innerHTML);
var page = convert_to_page(JSON.parse(p), document.createElement("div"));
document.getElementById("qml").appendChild(page);
