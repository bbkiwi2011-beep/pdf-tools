const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">ضغط ملف PDF</h2>

<div id="dropZone" style="
border:2px dashed #0984e3;
padding:40px;
border-radius:10px;
cursor:pointer;
margin-bottom:20px;
font-size:18px;
">
اسحب ملف PDF هنا أو اضغط لاختياره
</div>

<input type="file" id="fileInput" accept="application/pdf" style="display:none">

<div id="fileName" style="margin-bottom:20px"></div>

<button id="compressBtn" style="
padding:12px 25px;
background:#0984e3;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;
">
ضغط الملف
</button>

<p id="status" style="margin-top:15px;color:#666"></p>
`;

const dropZone = document.getElementById("dropZone");
const input = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const compressBtn = document.getElementById("compressBtn");
const status = document.getElementById("status");

let file = null;

dropZone.onclick = () => input.click();

input.onchange = e => {
file = e.target.files[0];
fileName.textContent = file.name;
};

dropZone.ondragover = e => e.preventDefault();

dropZone.ondrop = e => {
e.preventDefault();
file = e.dataTransfer.files[0];
fileName.textContent = file.name;
};

compressBtn.onclick = async () => {

if(!file){
alert("اختر ملف PDF");
return;
}

status.textContent="جاري ضغط الملف...";

const { PDFDocument } = PDFLib;

const bytes = await file.arrayBuffer();

const pdf = await PDFDocument.load(bytes);

const compressedBytes = await pdf.save({
useObjectStreams: true
});

const blob = new Blob([compressedBytes],{type:"application/pdf"});

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;
a.download = "compressed.pdf";

a.click();

status.textContent="تم ضغط الملف";

};
