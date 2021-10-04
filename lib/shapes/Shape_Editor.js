import Canvas_Editor from "../Canvas_Editor.js";

// Editor Def ======================================================================================

class Shape_Editor extends Canvas_Editor
{
  Render(ctx, shapes)
  {
    let shape;

    this.Clr(ctx);

    if (shapes && shapes.length>0)
    {
      ctx.save();
      ctx.beginPath();
      for (let i=0; i<shapes.length; i++)
      {
        shape = shapes[i];
        if (shape.Render)
          shape.Render(ctx);
      }
      if (this.paint_style == "stroke")
      {
        ctx.stroke();
      }
      else
      {
        ctx.fill();
      }
      ctx.restore();

      this.Render_Design(ctx, shapes);
    }
    this.Render_Origin(ctx);
  }

  Render_Design(ctx, shapes)
  {
    let shape;

    for (let i=0; i<shapes.length; i++)
    {
      shape = shapes[i];
      if (shape.selected && shape.Render_Design)
        shape.Render_Design(ctx);
    }
  }
}

customElements.define('shape-editor', Shape_Editor);
export default Shape_Editor;