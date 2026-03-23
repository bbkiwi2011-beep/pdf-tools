window.__TS__ = window.__TS__ || { modules: {} };

window.__TS__.modules['pdf'] = {

  _events: [],
  _libsLoaded: false,

  render() {
    return `
      <div id="pdf-app">
        <h2>📄 PDF Tools</h2>
        <div id="toolApp"></div>
      </div>
    `;
  },

  async init(app) {
    console.log("PDF INIT");

    try {
      if (!this._libsLoaded) {
        await this.loadLib("https://unpkg.com/pdf-lib/dist/pdf-lib.min.js");
        this._libsLoaded = true;
      }

      const container = document.getElementById("toolApp");
      if (!container) throw "Container missing";

      const btn = document.createElement("button");
      btn.textContent = "Test PDF Engine";
      btn.className = "tool-btn";

      const handler = () => {
        app.toast("PDF Engine Ready 🚀");
      };

      btn.addEventListener("click", handler);
      container.appendChild(btn);

      this._events.push({ el: btn, type: "click", handler });

    } catch (err) {
      console.error(err);
      app.toast("PDF Failed ❌");
    }
  },

  async loadLib(src) {
    if (document.querySelector(`script[src="${src}"]`)) return;

    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = res;
      s.onerror = rej;
      document.body.appendChild(s);
    });
  },

  destroy() {
    console.log("PDF DESTROY");

    this._events.forEach(e => {
      if (e.el) e.el.removeEventListener(e.type, e.handler);
    });

    this._events = [];

    const app = document.getElementById("pdf-app");
    if (app) app.innerHTML = "";
  }

};
