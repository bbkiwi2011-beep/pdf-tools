const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">مجموعة أدوات PDF</h2>

<select id="toolSelect" style="
padding:10px;
border-radius:6px;
border:1px solid #ccc;
margin-bottom:20px;
font-size:16px;
">

<option value="merge">دمج PDF</option>
<option value="split">تقسيم PDF</option>
<option value="compress">ضغط PDF</option>
<option value="rotate">تدوير الصفحات</option>
<option value="delete">حذف صفحات</option>

</select>

<div id="dropZone" style="
border:2px dashed #0984e3;
padding:40px;
border-radius:10px;
cursor:pointer;
margin-bottom:20px;
font-size:18px;">
اسحب ملفات PDF هنا أو اضغط لاختيارها
</div>

<input type="file" id="fileInput" multiple accept="application/pdf" style="display:none">

<ul id="fileList" style="text-align:right;margin-bottom:20px"></ul>

<button id="runBtn" style="
padding:12px 25px;
background:#0984e3;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;">
تنفيذ الأداة
</button>
`;

const dropZone = document.getElementById("dropZone");
const input = document.getElementById("fileInput");
const list = document.getElementById("fileList");
const runBtn = document.getElementById("runBtn");
const toolSelect = document.getElementById("toolSelect");

let files = [];

dropZone.onclick = () => input.click();

input.onchange = e=>{
files=[...files,...e.target.files];
renderList();
};

dropZone.ondragover = e=>e.preventDefault();

dropZone.ondrop = e=>{
e.preventDefault();
files=[...files,...e.dataTransfer.files];
renderList();
};

function renderList(){

list.innerHTML="";

files.forEach(f=>{
let li=document.createElement("li");
li.textContent=f.name;
list.appendChild(li);
});

}

runBtn.onclick = async ()=>{

if(files.length===0){
alert("اختر ملفات PDF");
return;
}

const tool = toolSelect.value;

if(tool==="merge") mergePDF();
if(tool==="split") splitPDF();
if(tool==="compress") compressPDF();
if(tool==="rotate") rotatePDF();
if(tool==="delete") deletePages();

};

async function mergePDF(){

const { PDFDocument } = PDFLib;

const merged = await PDFDocument.create();

for(let file of files){

const bytes = await file.arrayBuffer();

const pdf = await PDFDocument.load(bytes);

const pages = await merged.copyPages(pdf,pdf.getPageIndices());

pages.forEach(p=>merged.addPage(p));

}

const bytes = await merged.save();

download(bytes,"merged.pdf");

}

async function splitPDF(){

const { PDFDocument } = PDFLib;

const bytes = await files[0].arrayBuffer();

const pdf = await PDFDocument.load(bytes);

for(let i=0;i<pdf.getPageCount();i++){

const newPdf = await PDFDocument.create();

const [page] = await newPdf.copyPages(pdf,[i]);

newPdf.addPage(page);

const newBytes = await newPdf.save();

download(newBytes,"page-"+(i+1)+".pdf");

}

}

async function compressPDF(){

const { PDFDocument } = PDFLib;

const bytes = await files[0].arrayBuffer();

const pdf = await PDFDocument.load(bytes);

const compressed = await pdf.save({useObjectStreams:true});

download(compressed,"compressed.pdf");

}

async function rotatePDF(){

const { PDFDocument,degrees } = PDFLib;

const bytes = await files[0].arrayBuffer();

const pdf = await PDFDocument.load(bytes);

pdf.getPages().forEach(p=>{
p.setRotation(degrees(90));
});

const newBytes = await pdf.save();

download(newBytes,"rotated.pdf");

}

async function deletePages(){

const { PDFDocument } = PDFLib;

const bytes = await files[0].arrayBuffer();

const pdf = await PDFDocument.load(bytes);

pdf.removePage(0);

const newBytes = await pdf.save();

download(newBytes,"deleted-pages.pdf");

}

function download(bytes,name){

const blob = new Blob([bytes],{type:"application/pdf"});

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href=url;
a.download=name;

a.click();

}
