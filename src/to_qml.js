var qml_convert = {
  item: function(i, t) {
    var div = document.createElement(t || "div");
    if(i.id) div.id=i.id;
    if(i.width) div.style.width=i.width;
    if(i.height) div.style.height=i.height;
    if(i.x) div.style.marginLeft=i.x + "px";
    if(i.y) div.style.marginTop=i.y + "px";
    var p = convert_to_page(i);
    if (p) div.appendChild(p);
    return div;   
  },
  rectangle: function(r) {
    var div = qml_convert.item(r);
    if(r.color) div.style.backgroundColor = r.color;
    if(r['border.color']) div.style.borderColor = r['border.color'];
    if(r['border.size']){
      div.style.borderWidth = r['border.size'] + "px";
      div.style.borderStyle="solid";
    }
    if(r['radius']) div.style.borderRadius = r['radius'] + "px";
    return div;
  },
  image: function(i) {
    var img = qml_convert.item(i, "img");
    if(i.source) img.src = i.source;
    img.style.display="block";
    return img;
  },

  text : function(t) {
    var text = qml_convert.item(t);
    if(t.text) text.innerHTML = t.text;
    if(t.bold ==="true") text.style.fontWeight="bold";
    return text;
  }
}

function convert_to_page(json) {
  if(json.Item) return qml_convert.item(json.Item);
  if(json.Rectangle) return qml_convert.rectangle(json.Rectangle);
  if(json.Image) return qml_convert.image(json.Image);
  if(json.Text) return qml_convert.text(json.Text);
}
var p = qmlparser.parse(document.getElementById("qml").innerHTML);
var page = convert_to_page(JSON.parse(p));
document.getElementById("qml").appendChild(page);
