import {LitElement, html, css} from "../lit-element/lit-element.js";

class Path_Code_Gen extends LitElement 
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

  Round(val)
  {
    const dec_places = 3;
    const f = Math.pow(10, dec_places);
    val = Math.trunc(val * f) / f;

    return val;
  }

  Gen_Code(shapes)
  {
    let code;

      code = 
        "<html>\n" +
        "\t<head>\n" +
        "\t\t<title>Plantinator - Sample Page</title>\n" +
        "\t\t<script type=\"module\">\n" +
        "\t\t\timport * as pl from \"./lib/Coral_Racer.js\";\n" +

        "\t\t\tconst canvas = document.getElementById(\"canvas\");\n" +
        "\t\t\tconst ctx = canvas.getContext(\"2d\");\n" +
        "\t\t\tctx.translate(canvas.width/2, canvas.height/2);\n" +
        "\t\t\tctx.scale(1, -1);\n" +
        "\t\t\tctx.strokeStyle=\"#000\";\n" +
        "\t\t\tctx.lineWidth = 1;\n\n" +
    
        this.Gen_Cmds(shapes) +
        "\t\t\tctx.stroke(p);\n" +

        "\t\t</script>\n" +
        "\t</head>\n" +
        "\t<body>\n" +
        "\t\t<canvas id=\"canvas\" width=\"1000\" height=\"1000\" style=\"width:100%;height:100%;\">\n" +
        "\t</body>\n" +
        "</html>\n";

      this.shadowRoot.getElementById("txt_area").value = code;
  }

  Gen_Cmds(shapes)
  {
    let res = "";

    if (shapes && shapes.length>0)
    {
      res += "\t\t\tconst p = new Path2D();\n";
      for (let i=0; i<shapes.length; i++)
      {
        const s = shapes[i];
        res += "\t\t\tp." + s.To_Cmd_Str() + ";\n";
      }
    }

    return res;
  }

  OnClick_Run()
  {
    const js = this.shadowRoot.getElementById("txt_area").value;
    const page = window.open("", "plantinator", "width=500,height=500");
    page.document.open();
    page.document.write(js);
    page.document.close();
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
        <div id="title">Path Code</div>
        <div id="btn_bar">
          <button @click="${this.OnClick_Run}"><img src="images/play-outline.svg"></button>
          <button @click="${this.OnClick_Close}"><img src="images/close.svg"></button>
        </div>
      </div>
      <textarea id="txt_area"></textarea>
    `;
  }
}

customElements.define('path-code-gen', Path_Code_Gen);
