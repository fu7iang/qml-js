qml-js
======

QML to HTML/JavaScript compiler

This is a proof of concept. It compiles QML first to JSON and then to HTML.

You can draw some static items: Item, Rectangle, Image and Text. Only constant expressions are functional now.
Most of QML is not implemented yet (no advanced positioning, only basic items, no variables and properties etc.).
```
 Rectangle {
    width:120;
    height : 40;
    color:orange;
    x:40;
    y:20;
    border.color:white
    border.size:3
    radius:25;
    radius:20
    opacity:{1-0.4/(2/1)}
    z:1
}
```
```
Image {
  source:"test.jpg"
  height:300;
  width:600;
}
```