var qml_convert = {
  item: function(i, t) {
    var div = document.createElement(t || "div");
    if(i.id) div.id=i.id;
    if(i.width) div.style.width=i.width;
    if(i.height) div.style.height=i.height;
    return div;   
  },
  rectangle: function(r) {
    var div = qml_convert.item(r);
    if(r.color) div.style.backgroundColor = r.color;
    if(r['border.color']) div.style.borderColor = r['border.color'];
    if(r['border.color']) div.style.borderWidth = r['border.width'] + "px";
    if(r['radius']) div.style.borderRadius = r['radius'] + "px";
    div.style.borderStyle="solid";
    return div;
  },
  image: function(i) {
    var img = qml_convert.item(i, "img");
    if(i.source) img.src = i.source;
    img.style.display="block";
    return img;
  }
}

function convert_to_page(json) {
  if(json.Item) return qml_convert.item(json.Item);
  if(json.Rectangle) return qml_convert.rectangle(json.Rectangle)
  if(json.Image) return qml_convert.image(json.Image)
}
var p = qmlparser.parse(document.getElementById("qml").innerHTML);
var page = convert_to_page(JSON.parse(p));
console.log(page);
document.getElementById("qml").appendChild(page);
