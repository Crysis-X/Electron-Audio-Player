import "./Button.css";

export default class Button {
  element;
  constructor(innerHTML, styles, cls) {
    this.element = document.createElement("button");
    this.element.className = "component-btn" + " " + (cls ? cls : "");
    this.element.innerHTML = innerHTML ? innerHTML : "";
    if (typeof styles == "object") {
      Object.keys(styles).forEach((key) => {
        this.element.style[key] = styles[key];
      });
    }
  }
}
