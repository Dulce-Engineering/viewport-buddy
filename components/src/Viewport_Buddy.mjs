
class Viewport_Buddy extends HTMLElement 
{
  constructor()
  {
    super();
    this.shapes = null;
    this.sys_shapes = [];
    this.size = {width: 1000, height: 1000};
    this.camera = {pos: {x: 0, y: 0}, scale: {x: 1, y: 1}, angle: 0};
    this.origin = {strokeStyle: "#fff", lineWidth: 2};
    this.marks = {strokeStyle: "#050", lineWidth: 1, step: 100};
        
    this.attachShadow({mode: 'open'});

    this.OnMouseMove_Canvas = this.OnMouseMove_Canvas.bind(this);
    this.OnMouseDown_Canvas = this.OnMouseDown_Canvas.bind(this);
    this.OnMouseUp_Canvas = this.OnMouseUp_Canvas.bind(this);
    this.OnWheel = this.OnWheel.bind(this);
  }

  connectedCallback()
  {
    this.Render();
  }

  // Fields =======================================================================================
  
  set drawables(shapes)
  {
    this.shapes = shapes;
    this.Render_Update();
  }

  set mode(mode_id)
  {
    this.cmd = null;
    if (mode_id == "pan")
    {
      this.canvas.addEventListener("wheel", this.OnWheel);
      this.canvas.addEventListener('mousemove', this.OnMouseMove_Canvas);
      this.canvas.addEventListener('mousedown', this.OnMouseDown_Canvas);
      this.canvas.addEventListener('mouseup', this.OnMouseUp_Canvas);
    }
    else
    {
      this.canvas.removeEventListener("wheel", this.OnWheel);
      this.canvas.removeEventListener('mousemove', this.OnMouseMove_Canvas);
      this.canvas.removeEventListener('mousedown', this.OnMouseDown_Canvas);
      this.canvas.removeEventListener('mouseup', this.OnMouseUp_Canvas);
    }
  }

  // Events =======================================================================================

  OnMouseDown_Canvas(event)
  {
    const shape = this.Drawable_Selected(event.offsetX, event.offsetY);
    if (shape && shape.type == "rotate")
    {
      this.cmd = 
      {
        id: "rotate", 
        event_x: event.offsetX, 
        event_y: event.offsetY, 
        shape
      };
    }
    else if (shape && shape.type == "scale")
    {
      const event_pos = this.To_Canvas_Pt(event.offsetX, event.offsetY);
      const offset = {x: event_pos.x-shape.selected_shape.pos.x, y: event_pos.y-shape.selected_shape.pos.y};
      this.cmd = 
      {
        id: "scale", 
        offset,
        shape,
        original_scale: {...shape.selected_shape.scale}
      };
    }
    else if (shape)
    {
      const event_pos = this.To_Canvas_Pt(event.offsetX, event.offsetY);
      const offset = {x: event_pos.x-shape.pos.x, y: event_pos.y-shape.pos.y};
      this.Select_Drawable(shape);
      this.cmd = 
      {
        id: "move", 
        offset,
        shape
      };
    }
    else
    {
      const event_pos = this.To_Canvas_Pt(event.offsetX, event.offsetY);
      this.cmd = 
      {
        id: "pan", 
        event_x: event.offsetX, 
        event_y: event.offsetY, 
        camera_pos: {...this.camera.pos}
      };
    }
  }

  OnMouseMove_Canvas(event)
  {
    if (this.cmd && this.cmd.id == "move")
    {
      const event_pos = this.To_Canvas_Pt(event.offsetX, event.offsetY);
      const shape = this.cmd.shape;

      shape.pos = 
        {x: event_pos.x-this.cmd.offset.x, y: event_pos.y-this.cmd.offset.y};

      this.Render_Update();
    }
    else if (this.cmd && this.cmd.id == "scale")
    {
      const shape = this.cmd.shape.selected_shape;
      const event_pos = this.To_Canvas_Pt(event.offsetX, event.offsetY);
      const offset = {x: event_pos.x-shape.pos.x, y: event_pos.y-shape.pos.y};
      const event_ratio = {x: offset.x/this.cmd.offset.x, y: offset.y/this.cmd.offset.y};

      shape.scale = 
        {x: this.cmd.original_scale.x*event_ratio.x, y: this.cmd.original_scale.y*event_ratio.y};

      this.Render_Update();
    }
    else if (this.cmd && this.cmd.id == "pan")
    {
      const canvas_origin = this.To_Canvas_Pt(this.cmd.event_x, this.cmd.event_y);
      const canvas_now = this.To_Canvas_Pt(event.offsetX, event.offsetY);
      const d = {x: canvas_now.x-canvas_origin.x, y: canvas_now.y-canvas_origin.y};
      this.camera.pos.x = this.cmd.camera_pos.x - d.x;
      this.camera.pos.y = this.cmd.camera_pos.y - d.y;

      this.Render_Update();
    }
  }

  OnMouseUp_Canvas(event)
  {
    if (this.cmd)
    {
      this.cmd = null;
    }
  }

  OnWheel(event)
  {
    const p = this.To_Canvas_Pt(event.clientX, event.clientY);
    if (event.deltaY>0)
    {
      this.camera.scale.x = this.camera.scale.x/1.25;
      this.camera.scale.y = this.camera.scale.y/1.25;
    }
    else
    {
      this.camera.scale.x = this.camera.scale.x*1.25;
      this.camera.scale.y = this.camera.scale.y*1.25;
    }
    const p2 = this.To_Screen_Pt(p.x, p.y);
    const d = 
    {
      x: event.clientX-p2.x, 
      y: event.clientY-p2.y
    };

    this.camera.pos = 
    {
      x: this.camera.pos.x-(d.x/this.camera.scale.x), 
      y: this.camera.pos.y+(d.y/this.camera.scale.y)
    };
    this.Render_Update();
  }

  // Rendering ====================================================================================

  Render_Update()
  {
    let shape;

    this.ctx.save();
    this.Apply_Camera();

    this.Clr();
    this.Render_Origin();

    this.Render_Shapes(this.shapes);
    this.Render_Shapes(this.sys_shapes);

    this.ctx.restore();
  }
  
  Render_Shapes(shapes)
  {
    if (shapes && shapes.length>0)
    {
      for (const shape of shapes)
      {
        this.ctx.save();
        this.Apply_Drawable(shape);
        if (shape.Render)
        {
          shape.Render(this.ctx);
        }
        this.ctx.restore();
      }
    }
  }

  Clr()
  {
    const p1 = this.To_Canvas_Pt(0, 0);
    const p2 = this.To_Canvas_Pt(this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.clearRect(p1.x, p1.y, p2.x-p1.x, p2.y-p1.y);
  }

  Render_Origin()
  {
    const p1 = this.To_Canvas_Pt(0, 0);
    const p2 = this.To_Canvas_Pt(this.ctx.canvas.width, this.ctx.canvas.height);
    
    this.ctx.strokeStyle = this.marks.strokeStyle;
    this.ctx.lineWidth = this.marks.lineWidth;
    const step = this.marks.step;
    for (let x = Math.ceil(p1.x/step)*step; x < p2.x; x += step)
    {
      this.ctx.beginPath();
      this.ctx.moveTo(x, p1.y);
      this.ctx.lineTo(x, p2.y);
      this.ctx.stroke();
    }

    for (let y = Math.ceil(p2.y/step)*step; y < p1.y; y += step)
    {
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, y);
      this.ctx.lineTo(p2.x, y);
      this.ctx.stroke();
    }

    this.ctx.strokeStyle = this.origin.strokeStyle;
    this.ctx.lineWidth = this.origin.lineWidth;

    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, 0);
    this.ctx.lineTo(p2.x, 0);
    this.ctx.moveTo(0, p1.y);
    this.ctx.lineTo(0, p2.y);
    this.ctx.stroke();
  }

  Render()
  {
    this.style.overflow ="hidden";
    this.style.display = "inline-block";

    this.canvas = document.createElement("canvas");
    this.canvas.id = "main_canvas";
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;        
    this.mode = "pan";
    this.shadowRoot.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.ctx.line_width = 1;
    this.ctx.strokeStyle="#000";
    this.ctx.fillStyle="#000";
    this.global = {pos: {x: this.size.width/2, y: this.size.height/2}, scale: {x: 1, y: -1}, angle: 0};
    this.ctx.translate(this.global.pos.x, this.global.pos.y);
    this.ctx.scale(this.global.scale.x, this.global.scale.y);
    this.ctx.rotate(this.global.angle);

    this.Render_Update();
  }

  // Misc =========================================================================================

  Select_Drawable(selected_shape)
  {
    const vp = this;
    const target =
    {
      get pos() {return selected_shape.pos},
      get scale() {return {x: 1/vp.camera.scale.x, y: 1/vp.camera.scale.y}},
      angle: 0,
      selected_shape,
      Render(ctx)
      {
        //let m = new DOMMatrix();
        //m = m.translate(this.global.pos.x, this.global.pos.y);
        //m = m.scale(this.global.scale.x, this.global.scale.y);
        //m = m.rotate(this.global.angle);
        //const sp = new DOMPointReadOnly(sx, sy).matrixTransform(m);
        //ctx.save();
        //ctx.scale(shape.scale.x, shape.scale.y);
        //ctx.rotate(shape.angle);
    
        ctx.strokeStyle = "#0f0";
        ctx.beginPath();
        ctx.moveTo(0, 150);
        ctx.lineTo(0, -100);
        ctx.lineTo(-100, -100);
        ctx.lineTo(-100, 100);
        ctx.lineTo(100, 100);
        ctx.lineTo(100, -100);
        ctx.lineTo(0, -100);
        ctx.stroke();

        //ctx.restore();
      }
    };

    const btn = new Path2D();
    btn.moveTo(10, 10);
    btn.lineTo(-10, 10);
    btn.lineTo(-10, -10);
    btn.lineTo(10, -10);
    btn.closePath();

    const scale_btn =
    {
      get pos() 
      {
        return {x: selected_shape.pos.x+(100/vp.camera.scale.x), y: selected_shape.pos.y+(100/vp.camera.scale.y)};
      },
      get scale() 
      {
        return {x: 1/vp.camera.scale.x, y: 1/vp.camera.scale.y}
      },
      angle: 0,
      type: "scale",
      selected_shape,
      path: btn,
      Render(ctx)
      {
        ctx.fillStyle = "#00f";
        ctx.fill(this.path);
      }
    };
    
    const rotate_btn =
    {
      get pos() {return selected_shape.pos},
      get scale() {return {x: 1/vp.camera.scale.x, y: 1/vp.camera.scale.y}},
      angle: 0,
      selected_shape,
      Render(ctx)
      {
        ctx.save()
        ctx.fillStyle = "#00f";
        ctx.fill(btn);
        ctx.restore()
      }
    };

    const move_btn =
    {
      get pos() {return selected_shape.pos},
      get scale() {return {x: 1/vp.camera.scale.x, y: 1/vp.camera.scale.y}},
      angle: 0,
      selected_shape,
      Render(ctx)
      {
        ctx.fillStyle = "#00f";
        ctx.fill(btn);
      }
    };

    this.sys_shapes = [target, rotate_btn, scale_btn, move_btn];
    this.Render_Update();
  }

  Drawable_Selected(x, y)
  {
    let res;

    res =  this.Shape_Selected(this.sys_shapes, x, y);
    if (!res)
    {
      res =  this.Shape_Selected(this.shapes, x, y);
    }

    return res;
  }

  Shape_Selected(shapes, x, y)
  {
    let res;

    if (shapes && shapes.length>0)
    {
      for (const shape of shapes)
      {
        //if (shape.can_move)
        {
          const is_in_path = this.Is_Point_In_Path(shape, x, y);
          if (is_in_path)
          {
            res = shape;
            break;
          }
        }
      }
    }

    return res;
  }

  Apply_Drawable(drawable)
  {
    this.ctx.translate(drawable.pos.x, drawable.pos.y);
    this.ctx.scale(drawable.scale.x, drawable.scale.y);
    this.ctx.rotate(drawable.angle);
  }

  Apply_Camera()
  {
    this.ctx.scale(this.camera.scale.x, this.camera.scale.y);
    this.ctx.translate(-this.camera.pos.x, -this.camera.pos.y);
    this.ctx.rotate(this.camera.angle);
  }

  Is_Point_In_Path(drawable, x, y)
  {
    let  res = false;

    if (drawable.path)
    {
      this.ctx.save();
      this.Apply_Camera();
      this.Apply_Drawable(drawable);

      res = this.ctx.isPointInPath(drawable.path, x, y);
      this.ctx.restore();
    }

    return res;
  }

  To_Canvas_Pt(sx, sy)
  {
    let m = new DOMMatrix();
    m = m.translate(this.global.pos.x, this.global.pos.y);
    m = m.scale(this.global.scale.x, this.global.scale.y);
    m = m.rotate(this.global.angle);

    m = m.scale(this.camera.scale.x, this.camera.scale.y);
    m = m.translate(-this.camera.pos.x, -this.camera.pos.y);
    m = m.rotate(this.camera.angle);

    m = m.invertSelf();

    const sp = new DOMPointReadOnly(sx, sy);
    const pt = sp.matrixTransform(m);

    return pt;
  }

  To_Screen_Pt(sx, sy)
  {
    let m = new DOMMatrix();
    m = m.translate(this.global.pos.x, this.global.pos.y);
    m = m.scale(this.global.scale.x, this.global.scale.y);
    m = m.rotate(this.global.angle);

    m = m.scale(this.camera.scale.x, this.camera.scale.y);
    m = m.translate(-this.camera.pos.x, -this.camera.pos.y);
    m = m.rotate(this.camera.angle);

    const sp = new DOMPointReadOnly(sx, sy);
    const pt = sp.matrixTransform(m);

    return pt;
  }
}

export default Viewport_Buddy;