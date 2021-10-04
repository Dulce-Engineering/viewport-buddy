import {LitElement, html, css} from "../lit-element/lit-element.js";
import * as pl from "../Coral_Racer.js";

class Shape_Dialog extends LitElement 
{
  constructor()
  {
    super();
    this.onclick_edit_ok = null;
    this.shape = null;
  }

  firstUpdated(changedProperties)
  {
    this.type_elem = this.shadowRoot.getElementById("type");
    this.x_elem = this.shadowRoot.getElementById("x");
    this.y_elem = this.shadowRoot.getElementById("y");
    this.x2_elem = this.shadowRoot.getElementById("x2");
    this.y2_elem = this.shadowRoot.getElementById("y2");
    this.radius_elem = this.shadowRoot.getElementById("r");
    this.radius_x_elem = this.shadowRoot.getElementById("rx");
    this.radius_y_elem = this.shadowRoot.getElementById("ry");
    this.start_angle_elem = this.shadowRoot.getElementById("sa");
    this.end_angle_elem = this.shadowRoot.getElementById("ea");
    this.width_elem = this.shadowRoot.getElementById("w");
    this.height_elem = this.shadowRoot.getElementById("h");
    this.ctrl_pt_x_elem = this.shadowRoot.getElementById("cpx");
    this.ctrl_pt_y_elem = this.shadowRoot.getElementById("cpy");
    this.ctrl_pt_x2_elem = this.shadowRoot.getElementById("cpx2");
    this.ctrl_pt_y2_elem = this.shadowRoot.getElementById("cpy2");

    this.new_ok_btn = this.shadowRoot.getElementById("new_ok");
    this.edit_ok_btn = this.shadowRoot.getElementById("edit_ok");
  }

  OnClick_New_Ok()
  {
    var plant = new pl[this.plant_class_elem.value];
    plant.maturity_rate = 1;
    plant.maturity = 0;
    plant.level = 0;
    plant.selected = false;
    this.Get_User_Input(plant);

    this.Hide();
    this.onclick_new_ok(plant);
  }

  OnClick_Edit_Ok()
  {
    let shape = this.shape;
    
    switch (shape.class_name)
    {
      case "Shape_LineTo":
        shape.pt.x = Number.parseFloat(this.x_elem.value);
        shape.pt.y = Number.parseFloat(this.y_elem.value);
        break;
      case "Shape_MoveTo":
        shape.pt.x = Number.parseFloat(this.x_elem.value);
        shape.pt.y = Number.parseFloat(this.y_elem.value);
        break;
      case "Shape_Arc":
        shape.pt.x = Number.parseFloat(this.x_elem.value);
        shape.pt.y = Number.parseFloat(this.y_elem.value);
        shape.Set_Radius(Number.parseFloat(this.radius_elem.value));
        shape.Set_Start_Angle(Number.parseFloat(this.start_angle_elem.value));
        shape.Set_End_Angle(Number.parseFloat(this.end_angle_elem.value));
        break;
      case "Shape_Rect":
        shape.pt.x = Number.parseFloat(this.x_elem.value);
        shape.pt.y = Number.parseFloat(this.y_elem.value);
        shape.cp.x = Number.parseFloat(this.x2_elem.value);
        shape.cp.y = Number.parseFloat(this.y2_elem.value);
        break;
      }

    this.Hide();
    this.onclick_edit_ok(shape);
  }

  OnClick_Cancel()
  {
    this.Hide();
  }

  New()
  {
    this.plant_name_elem.value = "Plant 1";
    this.plant_class_elem.value = "Plant1";
    this.sprout_time_elem.value = "50";
    this.plant_x_elem.value = "500";
    this.plant_y_elem.value = "500";
    this.plant_x_scale_elem.value = "1";
    this.plant_y_scale_elem.value = "1";
    this.plant_angle_elem.value = "0";
    this.new_ok_btn.hidden = false;
    this.edit_ok_btn.hidden = true;
  }

  Edit(shape)
  {
    this.shape = shape;

    this.type_elem.innerText = shape.name;
    switch (shape.class_name)
    {
      case "Shape_LineTo":
        this.Show_Field("x", shape.pt.x);
        this.Show_Field("y", shape.pt.y);
        break;
      case "Shape_MoveTo":
        this.Show_Field("x", shape.pt.x);
        this.Show_Field("y", shape.pt.y);
        break;
      case "Shape_Arc":
        this.Show_Field("x", shape.pt.x);
        this.Show_Field("y", shape.pt.y);
        this.Show_Field("r", shape.Calc_Radius());
        this.Show_Field("sa", shape.Calc_Start_Angle());
        this.Show_Field("ea", shape.Calc_End_Angle());
        break;
      case "Shape_Rect":
        this.Show_Field("x", shape.pt.x);
        this.Show_Field("y", shape.pt.y);
        this.Show_Field("x2", shape.cp.x);
        this.Show_Field("y2", shape.cp.y);
        break;
      }

    this.new_ok_btn.style.display = "none";
    this.edit_ok_btn.style.display = "inline-block";
  }

  Show_Field(field_id, value)
  {
    const value_elem = this.shadowRoot.getElementById(field_id);
    if (value_elem)
    {
      value_elem.value = value;
      value_elem.style.display = "initial";
    }

    const label_elem = this.shadowRoot.querySelector("label[for=\"" + field_id +"\"]");
    if (label_elem)
    {
      label_elem.style.display = "initial";
    }
  }

  Hide()
  {
    this.style.display = "none";
  }

  Show()
  {
    this.style.display = "grid";
  }

  static get styles()
  {
    return css`
      :host
      {
        display: none;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 10px;
        grid-column-gap: 10px;
        overflow: auto;
        align-content: start;
      }
      input
      {
        border: 0;
        background-color: inherit;
        padding: 0;
        margin: 0;
        border-bottom: 1px solid #fff;
        font-family: monospace;
        font-size: 16px;
        width: 200px;
        color: #fff;
        display: none;
      }
      select
      {
        border: 0;
        background-color: inherit;
        padding: 0;
        margin: 0;
        border-bottom: 1px solid #fff;
        font-family: monospace;
        font-size: 16px;
      }
      label
      {
        margin-right: 10px;
        padding: 0;
        margin: 0;
        font-weight: 100;
        font-size: 16px;
        text-align: right;
        display: none;
      }
      span
      {
        text-align: left;
      }

      #btns
      {
        grid-column-start: 2;
        text-align: left;
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
        display: inline-block;
        box-sizing: border-box;
      }
      button img
      {
        padding: 0;
        margin: 0;
        width: 24px;
        height: 24px;
      }
      button:disabled
      {
        opacity: 0.25;
      }

      .title
      {
        grid-column-start: 1;
        grid-column-end: 3;
        padding: 10px 20px 5px 20px;
        text-align: center;
        font-weight: 100;
        font-size: 20px;
        border-bottom: 1px solid #202020;
      }
    `;
  }

  render() 
  {
    return html`
      <span class="title" id="type" class="title"></span>
      <label for="x">X</label><input id="x" type="number">
      <label for="y">Y</label><input id="y" type="number">
      <label for="x2">X2</label><input id="x2" type="number">
      <label for="y2">Y2</label><input id="y2" type="number">
      <label for="r">Radius</label><input id="r" type="number">
      <label for="rx">Radius X</label><input id="rx" type="number">
      <label for="ry">Radius Y</label><input id="ry" type="number">
      <label for="sa">Start Angle</label><input id="sa" type="number">
      <label for="ea">End Angle</label><input id="ea" type="number">
      <label for="w">Width</label><input id="w" type="number">
      <label for="h">Height</label><input id="h" type="number">
      <label for="cpx">Control Point X</label><input id="cpx" type="number">
      <label for="cpy">Control Point Y</label><input id="cpy" type="number">
      <label for="cpx2">Control Point X2</label><input id="cpx2" type="number">
      <label for="cpy2">Control Point Y2</label><input id="cpy2" type="number">

      <div id="btns">
        <button id="new_ok" @click="${this.OnClick_New_Ok}"><img src="images/check.svg"></button>
        <button id="edit_ok" @click="${this.OnClick_Edit_Ok}"><img src="images/check.svg"></button>
        <button id="cancel" @click="${this.OnClick_Cancel}"><img src="images/close.svg"></button>
      </div>
      `;
  }
}

customElements.define('shape-dlg', Shape_Dialog);
