window.ToolModules = window.ToolModules || {};

window.ToolModules.pdf = {
  name: "PDF Suite",

  render: function () {
    return `
      <div class="widget">
        <h2>أدوات PDF</h2>

        <select id="toolSelect" class="cp-select">
          <option value="merge">دمج PDF</option>
          <option value="split">تقسيم PDF</option>
          <option value="compress">ضغط PDF</option>
          <option value="export">تصدير الصفحات</option>
        </select>

        <div id="dropZone" style="
          border:2px dashed var(--accent-color);
          padding:40px;
          border-radius:10px;
          cursor:pointer;
          margin-bottom:20px;
          text-align:center;">
          اسحب ملف PDF هنا أو اضغط
        </div>

        <input type="file" id="fileInput" accept="application/pdf" style="display:none">

        <div id="preview" style="
          display:grid;
          grid-template-columns:repeat(auto-fill,150px);
          gap:10px;
          margin-top:20px">
        </div>

        <button id="runBtn" class="tool-btn">تنفيذ</button>
      </div>
    `;
  },

  init: function () {
    const preview = document.getElementById("preview");
    const input = document.getElementById("fileInput");
    const dropZone = document.getElementById("dropZone");

    let files = [];

    dropZone.onclick = () => input.click();

    input.onchange = e => {
      files = [...e.target.files];
      console.log("Files:", files);
    };

    dropZone.ondragover = e => e.preventDefault();

    dropZone.ondrop = e => {
      e.preventDefault();
      files = [...e.dataTransfer.files];
      console.log("Dropped:", files);
    };

    document.getElementById("runBtn").onclick = () => {
      alert("تشغيل الأداة...");
    };
  }
};
