const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">تقسيم ملف PDF</h2>

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

<div id="fileName" style="margin-bottom:15px"></div>

<input id="pagesInput" placeholder="مثال: 1,2,5 أو 3-7"
style="
width:100%;
padding:10px;
margin-bottom:20px;
border:1px solid #ccc;
border-radius:6px;
font-size:15px;
">

<button id="splitBtn" style="
padding:12px 25px;
background:#0984e3;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;
">
استخراج الصفحات
</button>

<p id="status" style="margin-top:15px;color:#666"></p>
`;

const dropZone = document.getElementById("dropZone");
const input = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const pagesInput = document.getElementById("pagesInput");
const splitBtn = document.getElementById("splitBtn");
const status = document.getElementById("status");

let file = null;

dropZone.onclick = () => input.click();

input.onchange = e => {
file = e.target.files[0];
if(file && file.type === "application/pdf"){
fileName.textContent = "الملف: " + file.name;
}
};

dropZone.ondragover = e => {
e.preventDefault();
};

dropZone.ondrop = e => {
e.preventDefault();
file = e.dataTransfer.files[0];

if(file && file.type === "application/pdf"){
fileName.textContent = "الملف: " + file.name;
}
};

splitBtn.onclick = async () => {

if(!file){
alert("اختر ملف PDF");
return;
}

const pagesText = pagesInput.value.trim();

if(!pagesText){
alert("اكتب الصفحات");
return;
}

status.textContent = "جاري معالجة الملف...";

const { PDFDocument } = PDFLib;

const bytes = await file.arrayBuffer();

const pdf = await PDFDocument.load(bytes);

const newPdf = await PDFDocument.create();

let pages = [];

pagesText.split(",").forEach(part => {

if(part.includes("-")){

const [start,end] = part.split("-").map(n=>parseInt(n));

for(let i=start;i<=end;i++) pages.push(i);

}else{

pages.push(parseInt(part));

}

});

for(let p of pages){

const [copied] = await newPdf.copyPages(pdf,[p-1]);

newPdf.addPage(copied);

}

const newBytes = await newPdf.save();

const blob = new Blob([newBytes],{type:"application/pdf"});

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;

a.download = "split.pdf";

a.click();

status.textContent="تم استخراج الصفحات بنجاح";

};
