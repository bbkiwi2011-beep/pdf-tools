const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">تحويل PDF إلى صور</h2>

<div id="dropZone" style="
border:2px dashed #0984e3;
padding:40px;
border-radius:10px;
cursor:pointer;
margin-bottom:20px;
font-size:18px;">
اسحب ملف PDF هنا أو اضغط لاختياره
</div>

<input type="file" id="fileInput" accept="application/pdf" style="display:none">

<div id="fileName" style="margin-bottom:20px"></div>

<select id="formatSelect" style="
padding:10px;
border-radius:6px;
border:1px solid #ccc;
margin-bottom:20px;
font-size:15px;
">
<option value="image/jpeg">JPG</option>
<option value="image/png">PNG</option>
<option value="image/webp">WEBP</option>
</select>

<button id="convertBtn" style="
padding:12px 25px;
background:#0984e3;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;">
تحويل
</button>

<p id="status" style="margin-top:15px;color:#666"></p>
`;

const dropZone = document.getElementById("dropZone");
const input = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const convertBtn = document.getElementById("convertBtn");
const formatSelect = document.getElementById("formatSelect");
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

convertBtn.onclick = async () => {

if(!file){
alert("اختر ملف PDF");
return;
}

status.textContent="جاري تحويل الصفحات...";

const format = formatSelect.value;

const pdfjsLib = window['pdfjs-dist/build/pdf'];

const reader = new FileReader();

reader.onload = async function(){

const typedarray = new Uint8Array(this.result);

const pdf = await pdfjsLib.getDocument(typedarray).promise;

for(let i=1;i<=pdf.numPages;i++){

const page = await pdf.getPage(i);

const viewport = page.getViewport({scale:2});

const canvas = document.createElement("canvas");

const context = canvas.getContext("2d");

canvas.height = viewport.height;
canvas.width = viewport.width;

await page.render({
canvasContext:context,
viewport:viewport
}).promise;

const link = document.createElement("a");

link.href = canvas.toDataURL(format,0.9);

let ext="jpg";
if(format==="image/png") ext="png";
if(format==="image/webp") ext="webp";

link.download = "page-"+i+"."+ext;

link.click();

}

status.textContent="تم تحويل الصفحات";

};

reader.readAsArrayBuffer(file);

};
