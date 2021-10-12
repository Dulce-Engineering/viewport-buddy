# Viewport Buddy

A canvas-based Web Component whose contents can be scrolled, zoomed, and selected with the mouse. Intended for use in applications that require a graphical editing area. Built in JavaScript with no dependencies.

The following screenshot shows three simple house shapes in a simple scene. The user can move, rotate, and scale shapes via drag and drop. Additionally, it is possible to move and zoom the canvas via drag-and-drop and the mouse wheel.

![alt text](https://github.com/Dulce-Engineering/viewport-buddy/blob/main/images/screenshot-1.png?raw=true)

## Scene Definition

Scenes are defined as an array of objects with appropriate fields defining the position, scale, and angle of the object. A method that renders the object is also required. Following is the scene definition for the above scene.

```
const house = new Path2D();
house.moveTo(100, 0);
house.lineTo(0, 100);
house.lineTo(-100, 0);
house.lineTo(-100, -100);
house.lineTo(-20, -100);
house.lineTo(-20, -50);
house.lineTo(20, -50);
house.lineTo(20, -100);
house.lineTo(100, -100);
house.closePath();

const town =
[
  {
    id: "blue house",
    pos: {x: 200, y: 200},
    scale: {x: 1, y: 1},
    angle: 0,
    path: house,
    Render(ctx)
    {
      ctx.fillStyle = "#00f";
      ctx.fill(house);
    }
  },
  {
    id: "green house",
    pos: {x: 200, y: -200},
    scale: {x: 1, y: 1},
    angle: 0,
    path: house,
    Render(ctx)
    {
      ctx.fillStyle = "#0f0";
      ctx.fill(house);
    }
  },
  {
    id: "red house",
    pos: {x: -200, y: 200},
    scale: {x: 1, y: 1},
    angle: 0,
    path: house,
    Render(ctx)
    {
      ctx.fillStyle = "#f00";
      ctx.fill(house);
    }
  }
];

window.onload = Main;
function Main()
{
  viewport.origin.strokeStyle = "#0f0";
  viewport.canvas.style.backgroundColor = "#000";
  viewport.drawables = town;
}
```

The full example can be found in the root index.html file.
