import {LitElement, html, css} from "./lit-element/lit-element.js";

class Remote_Ctrl extends LitElement
{
  constructor()
  {
    super();
    this.objs = null;
    this.on_change_fn = null;
    this.Change_Obj = this.Change_Obj.bind(this);
    this.pos_d = 1;
    this.scale_d = 0.01;
    this.rot_d = 0.005;
  }

  firstUpdated(changedProperties)
  {
    this.Set_Cmd(null);
  }

  Set_Shapes(objs)
  {
    this.objs = objs; 
  }

  Change_Obj(change_fn)
  {
    let obj;

    if (this.objs && this.objs.length>0)
    {
      for (let i=0; i<this.objs.length; i++)
      {
        obj = this.objs[i];
        if (obj.selected)
        {
          change_fn = change_fn.bind(this);
          change_fn(obj);
          if (this.on_change_fn)
          {
            this.on_change_fn(obj);
          }
        }
      }
    }
  }

  Disable_Buttons()
  {
    const btns = this.shadowRoot.querySelectorAll("button");
    if (btns && btns.length>0)
    {
      btns.forEach((btn) => btn.disabled = true);
    }
    this.shadowRoot.getElementById("close").disabled = false;
  }

  Disable_Unused_Buttons()
  {
    this.shadowRoot.getElementById("u1").disabled = true;
    this.shadowRoot.getElementById("u2").disabled = true;
    this.shadowRoot.getElementById("u3").disabled = true;
  }

  Set_Disabled(disabled)
  {
    if (disabled)
    {
      this.Disable_Buttons();
    }
    else
    {
      this.Set_Cmd(this.cmd);
    }
  }

  Show()
  {
    this.style.display = "inline-block";
  }

  OnClick_Left_Up()
  {
    if (this.cmd == "move")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        const pos = obj.Get_Pos();
        pos.x -= 1;
        pos.y -= 1;
        obj.Set_Pos(pos);
      }
    }
    else if (this.cmd == "scale")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.scale.x -= this.scale_d;
        obj.scale.y += this.scale_d;
      }
    }
  }

  OnClick_Up()
  {
    if (this.cmd == "move")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        const pos = obj.Get_Pos();
        pos.y -= 1;
        obj.Set_Pos(pos);
      }
    }
    else if (this.cmd == "scale")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.scale.y += this.scale_d;
      }
    }
    else if (this.cmd == "rotate")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.angle += Math.PI/4;
      }
    }
  }

  OnClick_Right_Up()
  {
    if (this.cmd == "move")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        const pos = obj.Get_Pos();
        pos.x += 1;
        pos.y -= 1;
        obj.Set_Pos(pos);
      }
    }
    else if (this.cmd == "scale")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.scale.x += this.scale_d;
        obj.scale.y += this.scale_d;
      }
    }
  }

  OnClick_Left()
  {
    if (this.cmd == "move")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        const pos = obj.Get_Pos();
        pos.x -= 1;
        obj.Set_Pos(pos);
      }
    }
    else if (this.cmd == "scale")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.scale.x -= this.scale_d;
      }
    }
    else if (this.cmd == "rotate")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.angle += this.rot_d;
      }
    }
  }

  OnClick_Right()
  {
    if (this.cmd == "move")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        const pos = obj.Get_Pos();
        pos.x += 1;
        obj.Set_Pos(pos);
      }
    }
    else if (this.cmd == "scale")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.scale.x += this.scale_d;
      }
    }
    else if (this.cmd == "rotate")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.angle -= this.rot_d;
      }
    }
  }

  OnClick_Left_Down()
  {
    if (this.cmd == "move")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        const pos = obj.Get_Pos();
        pos.x -= 1;
        pos.y += 1;
        obj.Set_Pos(pos);
      }
    }
    else if (this.cmd == "scale")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.scale.x -= this.scale_d;
        obj.scale.y -= this.scale_d;
      }
    }
  }

  OnClick_Down()
  {
    if (this.cmd == "move")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        const pos = obj.Get_Pos();
        pos.y += 1;
        obj.Set_Pos(pos);
      }
    }
    else if (this.cmd == "scale")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.scale.y -= this.scale_d;
      }
    }
    else if (this.cmd == "rotate")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.angle -= Math.PI/4;
      }
    }
  }

  OnClick_Right_Down()
  {
    if (this.cmd == "move")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        const pos = obj.Get_Pos();
        pos.x += 1;
        pos.y += 1;
        obj.Set_Pos(pos);
      }
    }
    else if (this.cmd == "scale")
    {
      this.Change_Obj(Change);
      function Change(obj)
      {
        obj.scale.x += this.scale_d;
        obj.scale.y -= this.scale_d;
      }
    }
  }

  OnClick_Cmd(event)
  {
    this.Set_Cmd(event.currentTarget.id);
  }

  OnClick_Close()
  {
    this.style.display = "none";
  }

  Set_Cmd(cmd)
  {
    this.cmd = cmd;
    this.Disable_Buttons();

    this.shadowRoot.getElementById("move").classList.remove("selected");
    this.shadowRoot.getElementById("rotate").classList.remove("selected");
    this.shadowRoot.getElementById("scale").classList.remove("selected");
    if (cmd)
    {
      this.shadowRoot.getElementById(cmd).classList.add("selected");
    }

    this.shadowRoot.getElementById("move").disabled = false;
    this.shadowRoot.getElementById("rotate").disabled = false;
    this.shadowRoot.getElementById("scale").disabled = false;
    if (this.cmd == "rotate")
    {
      this.shadowRoot.getElementById("u").disabled = false;
      this.shadowRoot.getElementById("r").disabled = false;
      this.shadowRoot.getElementById("d").disabled = false;
      this.shadowRoot.getElementById("l").disabled = false;
    }
    else if (this.cmd == "move" || this.cmd == "scale")
    {
      this.shadowRoot.getElementById("lu").disabled = false;
      this.shadowRoot.getElementById("u").disabled = false;
      this.shadowRoot.getElementById("ru").disabled = false;
      this.shadowRoot.getElementById("r").disabled = false;
      this.shadowRoot.getElementById("rd").disabled = false;
      this.shadowRoot.getElementById("d").disabled = false;
      this.shadowRoot.getElementById("ld").disabled = false;
      this.shadowRoot.getElementById("l").disabled = false;
    }
  }

  static get styles()
  {
    return css`
      :host
      {
        display: none;
        text-align: center;
        position: absolute;
        top: 0px;
        left: 0px;
        padding: 10px;
        xdisplay: inline-block;
        z-index: 1;
      }
      .grid
      {
        display: grid;
        grid-template-columns: 20% 20% 20% 20% 20%;
        grid-template-rows: 33% 34% 33%;
        column-gap: 5px;
        row-gap: 5px;
        align-items: center;
        justify-items: center;
      }
      button
      {
        border-radius: 7px;
        border: 1px solid #0f0;
        padding: 5px;
        cursor: pointer;
        width: 36px;
        height: 36px;
        background-color: #666;
      }
      button img
      {
        padding: 0;
        margin: 0;
        width: 24px;
        height: 24px;
        xbackground-color: #666;
      }
      button:disabled
      {
        opacity: 0.25;
      }
      .selected
      {
        background-color: #0f0;
      }
      h2
      {
        font-weight: 100;
        font-family: serif;
        font-style: italic;
        font-size: 20px;
        box-shadow: 
          rgb(0,0,0) 0px 1px 0px 0px, 
          rgb(255,255,255) 0px 4px 0px 0px, 
          rgb(0,0,0) 0px 7px 0px 0px;    
        display: inline-block;
        margin-bottom: 20px;      
      }
    `;
  }

  render()
  {
    return html`
      <div class="grid">
        <button id="lu" @click="${this.OnClick_Left_Up}"><img src="images/arrow-top-left-bold-outline.svg"></button>
        <button id="u" @click="${this.OnClick_Up}"><img src="images/arrow-up-bold-outline.svg"></button>
        <button id="ru" @click="${this.OnClick_Right_Up}"><img src="images/arrow-top-right-bold-outline.svg"></button>
        <button id="move" @click="${this.OnClick_Cmd}"><img src="images/move-resize-variant.svg"></button>
        <button id="close" @click="${this.OnClick_Close}"><img src="images/close.svg"></button>

        <button id="l" @click="${this.OnClick_Left}"><img src="images/arrow-left-bold-outline.svg"></button>
        <button id="u3"></button>
        <button id="r" @click="${this.OnClick_Right}"><img src="images/arrow-right-bold-outline.svg"></button>
        <button id="rotate" @click="${this.OnClick_Cmd}"><img src="images/rotate-left.svg"></button>
        <button id="u2"></button>

        <button id="ld" @click="${this.OnClick_Left_Down}"><img src="images/arrow-bottom-left-bold-outline.svg"></button>
        <button id="d" @click="${this.OnClick_Down}"><img src="images/arrow-down-bold-outline.svg"></button>
        <button id="rd" @click="${this.OnClick_Right_Down}"><img src="images/arrow-bottom-right-bold-outline.svg"></button>
        <button id="scale" @click="${this.OnClick_Cmd}"><img src="images/move-resize.svg"></button>
        <button id="u1"></button>
      </div>
    `;
  }
}

customElements.define('remote-ctrl', Remote_Ctrl);
