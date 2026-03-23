window.ToolModules = window.ToolModules || {};

window.ToolModules.pdf = {

  // 🔐 state داخلي
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
      // ✅ تحميل المكتبات مرة واحدة فقط
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
        app.toast("PDF Engine Ready 🚀", "success");
      };

      btn.addEventListener("click", handler);
      container.appendChild(btn);

      // 🧠 تسجيل event بشكل آمن
      this._events.push({ el: btn, type: "click", handler });

    } catch (err) {
      console.error(err);
      app.toast("PDF Failed ❌", "error");
    }
  },

  // 🧩 Loader داخلي للمكتبات
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

    // 🧹 إزالة الأحداث
    if (this._events && this._events.length) {
      this._events.forEach(e => {
        if (e.el) e.el.removeEventListener(e.type, e.handler);
      });
    }

    this._events = [];

    // 🧹 تنظيف DOM فقط داخل النطاق
    const app = document.getElementById("pdf-app");
    if (app) app.innerHTML = "";
  }

};
