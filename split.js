const app = document.getElementById("toolApp");

app.innerHTML = `
<div class="tool-ui">

<h2>تقسيم ملف PDF</h2>

<div id="dropZone" style="
border:2px dashed var(--border-color);
padding:40px;
border-radius:10px;
margin-bottom:20px;
cursor:pointer;
">
اسحب ملف PDF هنا أو اضغط للاختيار
</div>

<input type="file" id="fileInput" accept="application/pdf" style="display:none">

<div id="fileInfo" style="margin:15px 0;color:var(--text-dim)"></div>

<input id="pages" placeholder="مثال: 1,3,5-8" style="
padding:12px;
width:220px;
border-radius:8px;
border:1px solid var(--border-color);
">

<br><br>

<button id="splitBtn" style="
padding:12px 30px;
background:var(--primary-color);
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;
">
استخراج الصفحات
</button>

</div>
`;

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");

dropZone.onclick = () => fileInput.click();

dropZone.ondragover = e => {
 e.preventDefault();
 dropZone.style.borderColor = "var(--primary-color)";
};

dropZone.ondragleave = () => {
 dropZone.style.borderColor = "var(--border-color)";
};

dropZone.ondrop = e => {
 e.preventDefault();
 fileInput.files = e.dataTransfer.files;
 showFile();
};

fileInput.onchange = showFile;

async function showFile(){

 const file = fileInput.files[0];
 if(!file) return;

 const bytes = await file.arrayBuffer();

 const pdf = await PDFLib.PDFDocument.load(bytes);

 fileInfo.innerHTML =
 "الملف: <b>"+file.name+"</b><br>عدد الصفحات: "+pdf.getPageCount();

}

document.getElementById("splitBtn").onclick = async () => {

const file = fileInput.files[0];

if(!file){
 alert("اختر ملف PDF");
 return;
}

const pagesInput = document.getElementById("pages").value;

if(!pagesInput){
 alert("اكتب الصفحات");
 return;
}

const { PDFDocument } = PDFLib;

const bytes = await file.arrayBuffer();
const pdf = await PDFDocument.load(bytes);

const newPdf = await PDFDocument.create();

let pages = [];

pagesInput.split(",").forEach(p => {

 if(p.includes("-")){
  let range = p.split("-");
  let start = parseInt(range[0]);
  let end = parseInt(range[1]);

  for(let i=start;i<=end;i++){
   pages.push(i-1);
  }

 }else{
  pages.push(parseInt(p)-1);
 }

});

const copied = await newPdf.copyPages(pdf,pages);

copied.forEach(p=>newPdf.addPage(p));

const newBytes = await newPdf.save();

const blob = new Blob([newBytes],{type:"application/pdf"});

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href=url;
a.download="split-pages.pdf";
a.click();

};nload="split.pdf";

a.click();

};
