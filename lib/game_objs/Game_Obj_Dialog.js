import {LitElement, html, css} from "../lit-element/lit-element.js";
import * as pl from "../Coral_Racer.js";

class Game_Obj_Dialog extends LitElement 
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
    
    const new_class_name = this.Get_Field_Value("c");
    if (new_class_name != shape.class_name)
    {
      shape = new pl[new_class_name];
      shape.id = this.shape.id;
    }

    shape.name = this.Get_Field_Value("n");
    shape.pt.x = this.Get_Field_Value_Float("x");
    shape.pt.y = this.Get_Field_Value_Float("y");
    shape.scale.x = this.Get_Field_Value_Float("xs");
    shape.scale.y = this.Get_Field_Value_Float("ys");
    shape.angle = this.Get_Field_Value_Float("a");

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

    this.Show_Field("c", shape.class_name);
    this.Show_Field("n", shape.name);
    this.Show_Field("x", shape.pt.x);
    this.Show_Field("y", shape.pt.y);
    this.Show_Field("xs", shape.scale.x);
    this.Show_Field("ys", shape.scale.y);
    this.Show_Field("a", shape.angle);

    this.new_ok_btn.style.display = "none";
    this.edit_ok_btn.style.display = "inline-block";
  }

  Get_Field_Value_Float(field_id)
  {
    let res = 0;

    const field_value = this.Get_Field_Value(field_id);
    if (field_value)
    {
      res = Number.parseFloat(field_value);
    }

    return res;
  }

  Get_Field_Value(field_id)
  {
    let res;

    const value_elem = this.shadowRoot.getElementById(field_id);
    if (value_elem)
    {
      res = value_elem.value;
    }

    return res;
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
        color: #fff;
        width: 200px;
        display: none;
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
      <span class="title" id="type">Object Properties</span>
      <label for="c">Type</label>
      <select id="c">
        <option>Accelerator</option>
        <option>Black_Hole</option>
        <option>Bouncy_Wall</option>
        <option>Finish</option>
        <option>Flappy_Wall</option>
        <option>Game_Object</option>
        <option>Loose_Wall</option>
        <option>Mine</option>
        <option>Oil_Slick</option>
        <option>Player</option>
        <option>Portal</option>
      </select>
      <label for="n">Name</label><input id="n" type="text">
      <label for="x">X</label><input id="x" type="number">
      <label for="y">Y</label><input id="y" type="number">
      <label for="xs">X Scale</label><input id="xs" type="number">
      <label for="ys">Y Scale</label><input id="ys" type="number">
      <label for="a">Angle</label><input id="a" type="number">

      <div id="btns">
        <button id="new_ok" @click="${this.OnClick_New_Ok}"><img src="images/check.svg"></button>
        <button id="edit_ok" @click="${this.OnClick_Edit_Ok}"><img src="images/check.svg"></button>
        <button id="cancel" @click="${this.OnClick_Cancel}"><img src="images/close.svg"></button>
      </div>
      `;
  }
}

customElements.define('game-obj-dlg', Game_Obj_Dialog);
