qml-js
======

QML to HTML/JavaScript compiler

This is a proof of concept now. It compiles QML first to JSON and then to HTML.

You can draw a few simple things now:
```
Rectangle {
  width:400;
  height:200
  color:orange
  id:red
  border.color:red
  border.size:5
  radius:20
}
```
```
Image {
  source:"test.jpg"
  height:300;
  width:600;
}
```