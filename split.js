const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">تقسيم ملف PDF</h2>

<input type="file" id="fileInput" accept="application/pdf">

<p style="margin-top:20px">
اكتب الصفحات التي تريد استخراجها
</p>

<input id="pages" placeholder="مثال: 1,3,5-8" style="padding:10px;width:200px">

<br><br>

<button id="splitBtn" style="
padding:12px 25px;
background:#0984e3;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
">
استخراج الصفحات
</button>
`;

document.getElementById("splitBtn").onclick = async () => {

const file = document.getElementById("fileInput").files[0];

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
a.download="split.pdf";

a.click();

};
