import {LitElement, html, css} from "./lit-element/lit-element.js";
import {unsafeHTML} from './lit-html/directives/unsafe-html.js';
import "./code_gen/Canvas_Code_Gen.js";
import "./code_gen/Path_Code_Gen.js";
import "./code_gen/Android_Code_Gen.js";
import * as pl from "./Coral_Racer.js";

class Object_List extends LitElement
{
  constructor()
  {
    super();
    this.on_change_fn = null;
    this.OnClick_Edit_Ok = this.OnClick_Edit_Ok.bind(this);
    this.OnChange_File = this.OnChange_File.bind(this);
    this.shapes = [];
    this.code_gen_type = null;
    this.save_name = "shapes";
  }
  
  firstUpdated(changedProperties)
  {
    this.Load();
    this.Set_Code_Gen_Type("android_code");
    this.shadowRoot.getElementById("dlg").onclick_edit_ok = this.OnClick_Edit_Ok;
  }
  
  Set_Code_Gen_Type(code_gen_type)
  {
    this.code_gen_type = code_gen_type;
    this.shadowRoot.getElementById("canvas_code").classList.remove("selected");
    this.shadowRoot.getElementById("path_code").classList.remove("selected");
    this.shadowRoot.getElementById("android_code").classList.remove("selected");
    if (code_gen_type)
    {
      this.shadowRoot.getElementById(code_gen_type).classList.add("selected");
    }
  }

  Save()
  {
    const json = JSON.stringify(this.shapes, this.JSON_Replacer);
    localStorage.setItem(this.save_name, json);
  }

  Load()
  {
    const json = localStorage.getItem(this.save_name);
    const res = this.Load_JSON(json);

    return res;
  }

  Load_JSON(json)
  {
    let res = false;

    if (json)
    {
      this.shapes = JSON.parse(json);
      this.shapes = this.shapes.map((p) => this.Revive_Shape(p));
      this.requestUpdate();
      res = true;
    }

    return res;
  }

  Revive_Shape(obj)
  {
    const shape = new pl[obj.class_name];
    Object.assign(shape, obj);

    return shape;
  }

  JSON_Replacer(key, value)
  {
    return value;
  }

  Round(num)
  {
    return Math.round((num + Number.EPSILON) * 10000) / 10000;
  }

  Set_Disabled(disabled)
  {
    let btns, i;

    btns = this.shadowRoot.querySelectorAll("button");
    if (btns && btns.length>0)
    {
      btns.forEach((btn) => btn.disabled = disabled);
    }
  }

  // Utils ========================================================================================

  Get_Last_Idx()
  {
    return this.shapes.length-1;
  }

  Get_Selected_Shape()
  {
    let res;

    const i = this.Get_Selected_Idx();
    if (i >= 0)
    {
      res = this.shapes[i];
    }

    return res;
  }

  Get_Selected_Idx()
  {
    let shape;
    let res = -1;

    if (this.shapes && this.shapes.length>0)
    {
      for (let i=0; i<this.shapes.length; i++)
      {
        shape = this.shapes[i];
        if (shape.selected)
        {
          res = i;
          break;
        }
      }
    }

    return res;
  }

  Get_Selected_Or_Pick_Idx()
  {
    let i = -1;
    if (this.shapes && this.shapes.length>0)
    {
      i = this.Get_Selected_Idx();
      if (i==-1 )
      {
        i=0;
      }
    }

    return i;
  }

  Get_Shape_Idx(shape_id)
  {
    let res = null;

    if (this.shapes && this.shapes.length>0)
    {
      for (let i=0; i<this.shapes.length; i++)
      {
        if (this.shapes[i].id == shape_id)
        {
          res = i;
          break;
        }
      }
    }

    return res;
  }

  Get_Shape_By_Id(id)
  {
    const i = this.Get_Shape_Idx(id);
    const shape = this.shapes[i];
    return shape;
  }

  // API ==========================================================================================

  Hide()
  {
    const panel_elem = this.shadowRoot.getElementById("shapes");
    const panel_height = 56;
    panel_elem.style.height = panel_height + "px";

    panel_elem.visible = false;
  }

  Show()
  {
    const panel_elem = this.shadowRoot.getElementById("shapes");
    const panel_height = window.innerHeight * 0.4;
    panel_elem.style.height = panel_height + "px";

    const table_elem = this.shadowRoot.getElementById("table");
    const table_height = panel_height - 56;
    table_elem.style.height = table_height + "px";

    panel_elem.visible = true;
  }

  Toggle_Show()
  {
    let res;
    const panel_elem = this.shadowRoot.getElementById("shapes");

    if (!panel_elem.visible)
    {
      this.Show();
      res = true;
    }
    else
    {
      this.Hide();
      res = false;
    }

    return res;
  }

  Add(shape)
  {
    shape.id = Date.now();
    this.shapes.push(shape);
    this.requestUpdate();
  }

  Edit_Plant(shape)
  {
    const i = this.Get_Shape_Idx(plant);
    this.shapes[i] = shape;
    this.requestUpdate();
  }

  Delete(shape_id)
  {
    const msg = "Are you sure you want to delete this shape?";
    let i;

    const do_delete = confirm(msg);
    if (do_delete)
    {
      i = this.Get_Shape_Idx(shape_id);
      this.shapes.splice(i, 1);
      this.requestUpdate();
    }

    return do_delete;
  }

  Select(shape_id)
  {
    let shape;

    if (this.shapes && this.shapes.length>0)
    {
      for (let i=0; i<this.shapes.length; i++)
      {
        shape = this.shapes[i];
        shape.selected = false;
        if (shape.id == shape_id)
        {
          shape.selected = true;
        }
      }
      this.requestUpdate();
    }
  }

  Select_Next()
  {
    const i = this.Get_Selected_Or_Pick_Idx();
    if (i!=-1)
    {
      const last_i = this.Get_Last_Idx();
      this.shapes[i].selected = false;
      if (i >= 0 && i < last_i)
      {
        this.shapes[i+1].selected = true;
      }
      else
      {
        this.shapes[0].selected = true;
      }
      this.requestUpdate();
    }
  }

  Select_Prev()
  {
    const i = this.Get_Selected_Or_Pick_Idx();
    if (i!=-1)
    {
      const last_i = this.Get_Last_Idx();
      this.shapes[i].selected = false;
      if (i > 0 && i <= last_i)
      {
        this.shapes[i-1].selected = true;
      }
      else
      {
        this.shapes[last_i].selected = true;
      }
      this.requestUpdate();
    }
  }

  Add_Shape(class_name, shape_name, scale, angle)
  {
    const shape = new pl[class_name];
    shape.class_name = class_name;
    shape.name = shape_name;

    this.Add(shape);
    this.moveShapeToCentre(shape);
    if (scale)
    {
      shape.scale = scale;
    }
    if (angle)
    {
      shape.angle = angle;
    }
    this.Select(shape.id);
    this.Save();

    if (this.on_change_fn)
    {
      this.on_change_fn(this.shapes);
    }

    return shape;
  }

  // Events =======================================================================================
  
  OnClick_Copy(event)
  {
    const shape_id = event.currentTarget.getAttribute("shape-id");
    const shape = this.Get_Shape_By_Id(shape_id);

    const scale = { x: shape.scale.x, y: shape.scale.y };
    const angle = shape.angle;
    this.Add_Shape(shape.class_name, shape.name, scale, angle);
  }

  OnClick_Delete(event)
  {
    const shape_id = event.currentTarget.getAttribute("shape-id");
    const deleted = this.Delete(shape_id);
    if (deleted && this.on_change_fn)
    {
      this.on_change_fn(this.shapes);
    }
  }

  OnClick_Select(event)
  {
    const shape_id = event.currentTarget.getAttribute("shape-id");
    this.Select(shape_id);
    if (this.on_change_fn)
    {
      this.on_change_fn(this.shapes);
    }
  }

  OnClick_Edit(event)
  {
    const dlg = this.shadowRoot.getElementById("dlg");
    const id = event.currentTarget.getAttribute("shape-id");
    const i = this.Get_Shape_Idx(id);
    const shape = this.shapes[i];

    dlg.Show();
    dlg.Edit(shape);
  }

  OnClick_Edit_Ok(shape)
  {
    const i = this.Get_Shape_Idx(shape.id);
    this.shapes[i] = shape;
    this.requestUpdate();
    if (this.on_change_fn)
      this.on_change_fn(this.shapes);
  }

  OnClick_Gen_Code()
  {
    const canvas_code_gen = this.shadowRoot.getElementById("canvas_code_gen");
    const path_code_gen = this.shadowRoot.getElementById("path_code_gen");
    const android_code_gen = this.shadowRoot.getElementById("android_code_gen");
    canvas_code_gen.Hide();
    path_code_gen.Hide();
    android_code_gen.Hide();

    if (this.code_gen_type == "canvas_code")
    {
      canvas_code_gen.Show();
      canvas_code_gen.Gen_Code(this.shapes);
    }
    else if (this.code_gen_type == "path_code")
    {
      path_code_gen.Show();
      path_code_gen.Gen_Code(this.shapes);
    }
    else if (this.code_gen_type == "android_code")
    {
      android_code_gen.Show();
      android_code_gen.Gen_Code(this.shapes);
    }
  }

  OnClick_Code_Type(event)
  {
    this.Set_Code_Gen_Type(event.currentTarget.id);
  }

  OnClick_Reset()
  {
    localStorage.removeItem("shapes");
    this.shapes = [];
    this.requestUpdate();
    this.Set_Code_Gen_Type(this.code_gen_type);
    if (this.on_change_fn)
    {
      this.on_change_fn(this.shapes);
    }
  }

  OnClick_Upload()
  {
    this.file_elem = document.createElement("input");
    this.file_elem.type = "file";
    this.file_elem.addEventListener("change", this.OnChange_File);
    this.file_elem.click();
  }

  OnChange_File()
  {
    const reader = new FileReader();
    reader.onload = () => this.OnLoad_File(reader.result);
    reader.readAsText(this.file_elem.files[0]);
  }

  OnLoad_File(json)
  {
    this.Load_JSON(json);
    this.Save();
    if (this.on_change_fn)
    {
      this.on_change_fn(this.shapes);
    }
  }

  OnClick_Download()
  {
    const json = JSON.stringify(this.shapes, this.JSON_Replacer);
    const href = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    this.shadowRoot.getElementById("download").setAttribute("href", href);
  }

  OnClick_Undo()
  {

  }

  OnClick_Prev()
  {
    this.Select_Prev();
    if (this.on_change_fn)
    {
      this.on_change_fn(this.shapes);
    }
  }

  OnClick_Next()
  {
    this.Select_Next();
    if (this.on_change_fn)
    {
      this.on_change_fn(this.shapes);
    }
  }

  OnClick_List(event)
  {
    if (this.Toggle_Show())
    {
      this.shadowRoot.getElementById("list_btn").classList.add("selected");
    }
    else
    {
      this.shadowRoot.getElementById("list_btn").classList.remove("selected");
    }
  }

  OnClick_Add_MoveTo()
  {
    this.Add_Shape("Shape_MoveTo", "moveTo");
  }

  OnClick_Add_LineTo()
  {
    this.Add_Shape("Shape_LineTo", "lineTo");
  }

  OnClick_Add_BezierTo()
  {
    this.Add_Shape("Shape_BezierCurveTo", "bezierCurveTo");
  }

  OnClick_Add_QuadraticTo()
  {
    this.Add_Shape("Shape_QuadraticCurveTo", "quadraticCurveTo");
  }

  OnClick_Add_ArcTo()
  {
    this.Add_Shape("Shape_ArcTo", "arcTo");
  }

  OnClick_Add_Rect()
  {
    this.Add_Shape("Shape_Rect", "rect");
  }

  OnClick_Add_Arc()
  {
    this.Add_Shape("Shape_Arc", "arc");
  }

  OnClick_Add_Ellipse()
  {
    this.Add_Shape("Shape_Ellipse", "ellipse");
  }

  OnClick_Add_ClosePath()
  {
    this.Add_Shape("Shape_ClosePath", "closePath");
  }

  // Rendering ====================================================================================

  static get styles()
  {
    return css`
      table
      {
        width: 100%;
        border-collapse: collapse;
        border-left: 10px solid #000;
        border-right: 10px solid #000;
      }
      thead
      {
        box-shadow: 
          rgb(32,32,32) 0px 1px 0px 0px;
      }
      tbody:before
      {
        display: block;
        content: " ";
        height: 10px;
      }
      tbody tr:hover
      {
        background-color: #111;
      }
      tbody:after
      {
        display: block;
        content: " ";
        height: 20px;
      }
      th
      {
        font-weight: 100;
        font-size: 20px;
        padding: 0px 10px;
      }
      td
      {
        padding: 4px 12px;
        font-size: 14px;
      }

      .button
      {
        border-radius: 7px;
        border: 1px solid #0f0;
        padding: 5px;
        cursor: pointer;
        width: 36px;
        height: 36px;
        background-color: #666;
        display: inline-block;
        box-sizing: border-box;
      }
      .button:disabled
      {
        opacity: 0.25;
      }
      .button img
      {
        padding: 0;
        margin: 0;
        width: 24px;
        height: 24px;
      }
      .selected
      {
        background-color: #0f0;
      }

      #shapes
      {
        display: block;
        position: absolute;
        z-index: 2;
        background-color: #000;
        bottom: 0px;
        right: 0px;
        width: 100%;
        height: 56px;
      }
      #summary
      {
        display: inline-block;
        position: absolute;
        z-index: 2;
        right: 0px;
        top: 46px;
        padding: 5px 10px 10px 10px;
        font-size: 12px;
      }
      .code_gen
      {
        xdisplay: block;
        position: absolute;
        z-index: 2;
        background-color: #000;
        bottom: 0px;
        right: 0px;
        width: 100%;
        height: 40%;
        xborder: 10px solid #fffff9;
      }

      #table
      {
        overflow: auto;
      }
      #btn_bar
      {
        text-align: right;
        padding: 10px;
      }

      #dlg
      {
        position: absolute;
        z-index: 2;
        background-color: #000;
        bottom: 0px;
        right: 0px;
        width: 100%;
        height: 40%;
      }
    `;
  }

  render()
  {

  }

  Render(btns, edit_dlg)
  {
    return html`
      <div id="shapes">

        <div id="btn_bar">
          ${btns}
  
          &#183; <button class="button" id="list_btn" @click="${this.OnClick_List}" title="Show Shape List"><img src="images/format-list-bulleted-square.svg"></button>
          <button class="button" id="prev_btn" @click="${this.OnClick_Prev}" title="Previous Shape"><img src="images/skip-previous.svg"></button>
          <button class="button" id="next_btn" @click="${this.OnClick_Next}" title="Next Shape"><img src="images/skip-next.svg"></button>
          <button class="button" id="undo_btn" @click="${this.OnClick_Undo}" title="Undo"><img src="images/undo.svg"></button>
          
          &#183; <button class="button" id="gen_btn" @click="${this.OnClick_Gen_Code}" title="Generate Code"><img src="images/code-json.svg"></button>
          <button class="button" id="canvas_code" @click="${this.OnClick_Code_Type}" title="Canvas Code"><img src="images/image.svg"></button>
          <button class="button" id="path_code" @click="${this.OnClick_Code_Type}" title="Path Code"><img src="images/vector-polyline.svg"></button>
          <button class="button" id="android_code" @click="${this.OnClick_Code_Type}" title="Android Code"><img src="images/android.svg"></button>
          
          &#183; <button class="button" id="reset" @click="${this.OnClick_Reset}" title="Reset"><img src="images/nuke.svg"></button>
          <button class="button" id="upload" @click="${this.OnClick_Upload}" title="Upload"><img src="images/upload.svg"></button>
          <a class="button" id="download" href="" download="shape.json" @click="${this.OnClick_Download}" title="Download"><img src="images/download.svg"></a>
        </div>

        <div id="table">
          <table>
            <thead>
              <tr>
                <th>Actions</th>
                <th>#</th>
                <th>Function</th>
                <th>Parameters</th>
              </tr>
            </thead>
            <tbody>
              ${this.Render_Items()}
            </tbody>
          </table>
        </div>
      </div>

      <div id="summary"></div>

      ${edit_dlg}

      <canvas-code-gen id="canvas_code_gen" class="code_gen"></canvas-code-gen>
      <path-code-gen id="path_code_gen" class="code_gen"></path-code-gen>
      <android-code-gen id="android_code_gen" class="code_gen"></android-code-gen>
    `;
  }

  Render_Items()
  {
    let res = "", shape;

    if (this.shapes && this.shapes.length>0)
    {
      for (let i=0; i<this.shapes.length; i++)
      {
        shape = this.shapes[i];
        res = html`${res}${this.Render_Item(i, shape)}`;
      }
    }
    else
    {
      res = html`<tr><td class="msg" colspan=9>No shapes added yet. Get to work!</td></tr>`;
    }
    return res;
  }

  Render_Item(i, shape)
  {
    let btn_class = "button";

    if (shape.selected)
    {
      btn_class = "button selected";
      this.Render_Summary(shape);
    }

    return html`
      <tr shape-id="${shape.id}">
        <td nowrap>
          ${this.Render_Button(shape.id, this.OnClick_Select, "target.svg", true, "Select", btn_class)}
          ${this.Render_Button(shape.id, this.OnClick_Copy, "content-copy.svg", true, "Copy", "button")}
          ${this.Render_Button(shape.id, this.OnClick_Edit, "pencil-outline.svg", shape.can_edit, "Edit", "button")}
          ${this.Render_Button(shape.id, this.OnClick_Delete, "delete-outline.svg", shape.can_delete, "Delete", "button")}
        </td>
        <td>${i+1}</td>
        <td>${shape.class_name}</td>
        <td>${unsafeHTML(shape.Params_Str())}</td>
      </tr>
      `;
  }

  Render_Button(id, on_click_fn, image, can_render, title, btn_class)
  {
    let res;

    if (can_render == null || can_render == true)
    {
      if (!btn_class)
        btn_class = "";
      res = html`<button shape-id="${id}" @click="${on_click_fn}" title="${title}" class="${btn_class}"><img src="images/${image}"></button>`;
    }
    return res;
  }

  Render_Summary(shape)
  {
    const summ_element = this.shadowRoot.getElementById("summary");
    summ_element.innerText = shape.name + " " + shape.Params_Str();
  }
}

customElements.define('object-list', Object_List);
export default Object_List;