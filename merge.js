const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">دمج ملفات PDF</h2>

<div id="dropZone" style="
border:2px dashed #0984e3;
padding:40px;
border-radius:10px;
cursor:pointer;
margin-bottom:20px;
font-size:18px;
">
اسحب ملفات PDF هنا أو اضغط لاختيارها
</div>

<input type="file" id="fileInput" multiple accept="application/pdf" style="display:none">

<ul id="fileList" style="text-align:right;margin-bottom:20px"></ul>

<button id="mergeBtn" style="
padding:12px 25px;
background:#0984e3;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;
">
دمج وتحميل الملف
</button>
`;

const dropZone = document.getElementById("dropZone");
const input = document.getElementById("fileInput");
const list = document.getElementById("fileList");
const mergeBtn = document.getElementById("mergeBtn");

let files = [];

dropZone.onclick = () => input.click();

input.onchange = e => {
  files = [...files, ...e.target.files];
  renderList();
};

dropZone.ondragover = e => {
  e.preventDefault();
};

dropZone.ondrop = e => {
  e.preventDefault();
  files = [...files, ...e.dataTransfer.files];
  renderList();
};

function renderList(){
  list.innerHTML = "";
  files.forEach(f => {
    let li = document.createElement("li");
    li.textContent = f.name;
    list.appendChild(li);
  });
}

mergeBtn.onclick = async () => {

  if(files.length < 2){
    alert("اختر ملفين على الأقل");
    return;
  }

  const { PDFDocument } = PDFLib;

  const mergedPdf = await PDFDocument.create();

  for (let file of files){
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => mergedPdf.addPage(p));
  }

  const mergedBytes = await mergedPdf.save();

  const blob = new Blob([mergedBytes], {type:"application/pdf"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "merged.pdf";
  a.click();

};
