window.ToolModules = window.ToolModules || {};

window.ToolModules.pdf = {

  render: function() {
    return `
      <div id="pdf-app">
        <h2>PDF Tools</h2>
        <div id="toolApp"></div>
      </div>
    `;
  },

  init: function() {
    console.log("PDF INIT");

    this._events = [];

    const btn = document.createElement("button");
    btn.textContent = "Test Event";
    
    const handler = () => alert("PDF Working");
    btn.addEventListener("click", handler);

    document.getElementById("toolApp").appendChild(btn);

    // 🧠 سجل الأحداث
    this._events.push({ el: btn, type: "click", handler });
  },

  destroy: function() {
    console.log("PDF DESTROY");

    // 🧹 حذف كل الأحداث
    this._events.forEach(e => {
      e.el.removeEventListener(e.type, e.handler);
    });

    this._events = [];

    // 🧹 تنظيف DOM
    const app = document.getElementById("pdf-app");
    if (app) app.innerHTML = "";
  }

};
async loadLib(src) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.body.appendChild(s);
  });
}
