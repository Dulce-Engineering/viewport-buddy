import {LitElement, html, css} from "../lit-element/lit-element.js";

class Android_Code_Gen extends LitElement 
{
  constructor()
  {
    super();
  }

  Hide()
  {
    this.style.display = "none";
  }

  Show()
  {
    this.style.display = "block";
  }

  Gen_Code(shapes)
  {
    let code;

    const code_objs = this.Gen_Game_Objs(shapes);
    code = 
      "package rs.projecta.level;\n\n" +

      "public class Some_Level\n" +
      "extends Level\n" +
      "{\n" +
        "\t@Override\n" +
        "\tpublic Class<? extends Level> Get_Next_Level()\n" +
        "\t{\n" +
          "\t\treturn rs.projecta.level.Some_Level.class;\n" +
        "\t}\n" +
        "\n" +
  
        "\t@Override\n" +
        "\tpublic String Get_Title()\n" +
        "\t{\n" +
          "\t\treturn \"Some Tile\";\n" +
        "\t}\n" +
        "\n" +
    
        "\t@Override\n" +
        "\tpublic String Get_Description()\n" +
        "\t{\n" +
          "\t\treturn \"Some Description\";\n" +
        "\t}\n" +
        "\n" +
    
        "\t@Override\n" +
        "\tpublic void Build(rs.projecta.world.World w)\n" +
        "\t{\n" +
          "\t\tsuper.Build(w);\n" +
          code_objs.player +
          "\t\tAdd_Wavy_Bkg(w, player);\n" +
          code_objs.objs +
        "\t}\n" +
      "}\n";

    this.shadowRoot.getElementById("txt_area").value = code;
  }

  Round(val)
  {
    const dec_places = 3;
    const f = Math.pow(10, dec_places);
    val = Math.trunc(val * f) / f;

    return val;
  }

  Gen_Game_Objs(shapes)
  {
    let res = { objs: "", player: ""};

    if (shapes && shapes.length>0)
    {
      for (let i=0; i<shapes.length; i++)
      {
        const s = shapes[i];
        if (s.class_name == "Player")
        {
          const x = Math.trunc(s.pt.x);
          const y = Math.trunc(s.pt.y);
          const rx = this.Round(s.scale.x*100);
          const ry = this.Round(s.scale.y*100);
          const a = this.Round(s.To_Degrees(s.angle));
          const params = "" +
            x + "f, " +
            y + "f, " +
            rx + "f, " +
            ry + "f, " +
            a + "f";
          res.player = "\t\trs.projecta.object.Player player = new rs.projecta.object.Player(w, " + params + ");\n"
          res.objs += "\t\tw.objs.Add(player);\n";
        }
        else
        {
          const x = Math.trunc(s.pt.x);
          const y = Math.trunc(s.pt.y);
          const rx = this.Round(s.scale.x*100);
          const ry = this.Round(s.scale.y*100);
          const a = this.Round(s.To_Degrees(s.angle));
          const params = "" +
            x + "f, " +
            y + "f, " +
            rx + "f, " +
            ry + "f, " +
            a + "f";
          res.objs += "\t\tw.objs.Add(new rs.projecta.object." + s.class_name + "(w, " + params + "));\n";
        }
      }
    }

    return res;
  }

  Normalise_Angle(a)
  {
    let na = a;

    if (a<0)
    {
      na = 2*Math.PI + a;
    }

    return na;
  }

  OnClick_Close()
  {
    this.Hide();
  }

  static get styles()
  {
    return css`
      :host
      {
        display: none;
        margin-top: 20px;
      }
      #title
      {
        text-align: left;
        display: inline-block;
        width: 48%;
        font-size: 35px;
      }
      #btn_bar
      {
        display: inline-block;
        width: 48%;
        text-align: right;
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

      textarea
      {
        background-color: #222;
        border: 1px solid #fff;
        color: #fff;
        padding: 5px;
        font-family: monospace;
        font-size: 11px;
        tab-size: 2;
        width: 95%;
        height: 70%;
      }
      #hdr
      {
        padding-bottom: 10px;
      }
    `;
  }

  render()
  {
    return html`
      <div id="hdr">
        <div id="title">Android Code</div>
        <div id="btn_bar">
          <button @click="${this.OnClick_Close}"><img src="images/close.svg"></button>
        </div>
      </div>
      <textarea id="txt_area"></textarea>
    `;
  }
}

customElements.define('android-code-gen', Android_Code_Gen);
