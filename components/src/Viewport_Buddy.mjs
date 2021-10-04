
class Viewport_Buddy extends HTMLElement 
{
  constructor()
  {
    super();
    this.shapes = null;
    this.size = {width: 1000, height: 1000};
    this.camera = {pos: {x: 150, y: 150}, scale: {x: 1, y: 1}, angle: 0};
        
    this.attachShadow({mode: 'open'});

    //this.OnMouseMove_Canvas = this.OnMouseMove_Canvas.bind(this);
    //this.OnMouseDown_Canvas = this.OnMouseDown_Canvas.bind(this);
    //this.OnMouseUp_Canvas = this.OnMouseUp_Canvas.bind(this);
    //this.Render_Update = this.Render_Update.bind(this);
    this.OnWheel = this.OnWheel.bind(this);
  }

  connectedCallback()
  {
    this.Render();
  }

  Set_Transform(trn, scl)
  {
    if (trn)
    {
      this.ctx.trn = trn;
    }
    if (scl)
    {
      this.ctx.scl = scl;
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(this.ctx.trn.x, this.ctx.trn.y);
    this.ctx.scale(this.ctx.scl.x, this.ctx.scl.y);
  }

  Disable_Events()
  {
    this.canvas.removeEventListener('mousemove', this.OnMouseMove_Canvas);
    this.canvas.removeEventListener('mousedown', this.OnMouseDown_Canvas);
    this.canvas.removeEventListener('mouseup', this.OnMouseUp_Canvas);
  }

  Enable_Events()
  {
    this.canvas.addEventListener('mousemove', this.OnMouseMove_Canvas);
    this.canvas.addEventListener('mousedown', this.OnMouseDown_Canvas);
    this.canvas.addEventListener('mouseup', this.OnMouseUp_Canvas);
  }

  Set_Shapes(shapes)
  {
    this.shapes = shapes;
    this.remote_ctrl.Set_Shapes(shapes);

    this.Render_Update(this.ctx, shapes);
  }

  Resize(width, height)
  {
    this.style.width = width + "px";
    this.style.height = height + "px";
    this.Init_Canvas(this.ctx.zoom, width, height, this.ctx.line_width);
    this.Render_Update(this.ctx, this.shapes);
  }

  // Fields =======================================================================================
  
  set drawables(shapes)
  {
    this.shapes = shapes;
    this.Render_Update();
  }

  // Events =======================================================================================

  OnMouseMove_Canvas(event)
  {
    let shape;

    if (this.cmd && this.cmd.id == "pan")
    {
      const dx = event.offsetX - this.cmd.x;
      const dy = event.offsetY - this.cmd.y;
      
      const c_pt = { x: this.cmd.o.x + dx, y: this.cmd.o.y + dy };
      this.Set_Transform(c_pt, null);
      this.Update();
    }
    else if (this.shapes && this.shapes.length>0)
    {
      for (let i=0; i<this.shapes.length; i++)
      {
        shape = this.shapes[i];
        if (shape.On_Mouse_Move)
        {
          shape.On_Mouse_Move(event, this.ctx);
        }
      }
      this.Update();
    }
  }

  OnMouseDown_Canvas(event)
  {
    let shape, hit = false;

    if (this.shapes && this.shapes.length>0)
    {
      for (let i=0; i<this.shapes.length; i++)
      {
        shape = this.shapes[i];
        if (shape.On_Mouse_Down)
        {
          hit = hit || shape.On_Mouse_Down(event, this.ctx);
        }
      }
    }

    if (!hit)
    {
      this.cmd = { id: "pan", x: event.offsetX, y: event.offsetY, o: this.To_Screen_Pt(this.ctx, 0, 0) };
    }

    if (hit)
    {
      this.Update();
    }
  }

  OnMouseUp_Canvas(event)
  {
    let shape, has_change;

    if (this.cmd)
    {
      this.cmd = null;
    }
    else if (this.shapes && this.shapes.length>0)
    {
      for (let i=0; i<this.shapes.length; i++)
      {
        shape = this.shapes[i];
        if (shape.On_Mouse_Up)
        {
          has_change = shape.On_Mouse_Up(event, this.ctx);
          if (has_change && this.on_change_fn)
          {
            this.on_change_fn(shape);
          }
        }
        this.Update();
      }
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
    this.ctx.scale(this.camera.scale.x, this.camera.scale.y);
    this.ctx.translate(-this.camera.pos.x, -this.camera.pos.y);
    this.ctx.rotate(this.camera.angle);

    this.Clr();
    if (this.shapes && this.shapes.length>0)
    {
      this.ctx.save();
      for (let i=0; i<this.shapes.length; i++)
      {
        shape = this.shapes[i];
        this.ctx.translate(shape.pos.x, shape.pos.y);
        this.ctx.scale(shape.scale.x, shape.scale.y);
        this.ctx.rotate(shape.angle);
        if (shape.Render)
        {
          shape.Render(this.ctx);
        }
      }
      this.ctx.restore();
    }

    this.ctx.fillStyle ="green";
    this.ctx.fillRect(this.camera.pos.x-10, this.camera.pos.y-10, 20, 20);
    this.Render_Origin();
    this.ctx.restore();
  }
  
  Clr()
  {
    const p1 = this.To_Canvas_Pt(0, 0);
    const p2 = this.To_Canvas_Pt(this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.clearRect(p1.x, p1.y, p2.x-p1.x, p2.y-p1.y);
  }

  Render_Origin()
  {
    this.ctx.save();
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 1;

    const p1 = this.To_Canvas_Pt(0, 0);
    const p2 = this.To_Canvas_Pt(this.ctx.canvas.width, this.ctx.canvas.height);
    
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, 0);
    this.ctx.lineTo(p2.x, 0);
    this.ctx.moveTo(0, p1.y);
    this.ctx.lineTo(0, p2.y);
    this.ctx.stroke();

    this.ctx.restore();
  }

  Render()
  {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "main_canvas";
    this.canvas.width = this.size.width;
    this.canvas.height = this.size.height;        
    this.canvas.style.border = "1px solid #f00";
    this.canvas.addEventListener("wheel", this.OnWheel);
    this.canvas.addEventListener('mousemove', this.OnMouseMove_Canvas);
    this.canvas.addEventListener('mousedown', this.OnMouseDown_Canvas);
    this.canvas.addEventListener('mouseup', this.OnMouseUp_Canvas);
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