window.__TS__ = window.__TS__ || { modules: {}, libs: {} };

// ========================================
// PDF ALL-IN-ONE TOOL
// ========================================
window.__TS__.modules['pdf-suite'] = {

  render() {
    return `
    <div class="widget">
      <h2 style="margin-bottom:20px">📄 أدوات PDF</h2>

      <select id="toolSelect" class="tool-input">
        <option value="merge">دمج PDF</option>
        <option value="split">تقسيم PDF</option>
        <option value="compress">ضغط PDF</option>
      </select>

      <div id="dropZone" class="drop-zone">
        اسحب ملفات PDF هنا أو اضغط للاختيار
      </div>

      <input type="file" id="fileInput" multiple accept="application/pdf" hidden>

      <ul id="fileList" style="margin:15px 0"></ul>

      <button id="runBtn" class="tool-btn">تنفيذ</button>
    </div>
    `;
  },

  async init(app) {

    // ✅ تحميل pdf-lib إذا لم يكن موجود
    if (!window.PDFLib) {
      await new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://unpkg.com/pdf-lib/dist/pdf-lib.min.js";
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });
    }

    const { PDFDocument } = PDFLib;

    const toolSelect = document.getElementById("toolSelect");
    const dropZone = document.getElementById("dropZone");
    const input = document.getElementById("fileInput");
    const list = document.getElementById("fileList");
    const runBtn = document.getElementById("runBtn");

    let files = [];

    // ==========================
    // 📂 Upload
    // ==========================
    dropZone.onclick = () => input.click();

    input.onchange = e => {
      files = [...files, ...e.target.files];
      renderList();
    };

    dropZone.ondragover = e => e.preventDefault();

    dropZone.ondrop = e => {
      e.preventDefault();
      files = [...files, ...e.dataTransfer.files];
      renderList();
    };

    function renderList() {
      list.innerHTML = "";
      files.forEach(f => {
        let li = document.createElement("li");
        li.textContent = f.name;
        list.appendChild(li);
      });
    }

    // ==========================
    // 🚀 RUN
    // ==========================
    runBtn.onclick = async () => {

      if (files.length === 0) {
        return app.toast("اختر ملفات PDF");
      }

      const tool = toolSelect.value;

      // ======================
      // MERGE
      // ======================
      if (tool === "merge") {

        const mergedPdf = await PDFDocument.create();

        for (let file of files) {
          const bytes = await file.arrayBuffer();
          const pdf = await PDFDocument.load(bytes);

          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach(p => mergedPdf.addPage(p));
        }

        const mergedBytes = await mergedPdf.save();
        download(mergedBytes, "merged.pdf");
      }

      // ======================
      // SPLIT
      // ======================
      if (tool === "split") {

        if (files.length !== 1) {
          return app.toast("اختر ملف واحد فقط");
        }

        const bytes = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);

        for (let i = 0; i < pdf.getPageCount(); i++) {

          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdf, [i]);

          newPdf.addPage(page);

          const newBytes = await newPdf.save();
          download(newBytes, `page-${i + 1}.pdf`);
        }
      }

      // ======================
      // COMPRESS
      // ======================
      if (tool === "compress") {

        if (files.length !== 1) {
          return app.toast("اختر ملف واحد فقط");
        }

        const bytes = await files[0].arrayBuffer();
        const pdf = await PDFDocument.load(bytes);

        const compressed = await pdf.save({
          useObjectStreams: true
        });

        download(compressed, "compressed.pdf");
      }
    };

    function download(bytes, name) {
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
    }
  },

  destroy() {}
};
