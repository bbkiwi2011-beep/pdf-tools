const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">تقسيم ملف PDF</h2>

<input type="file" id="fileInput" accept="application/pdf">

<p style="margin-top:20px">
اكتب رقم الصفحة التي تريد استخراجها
</p>

<input id="pageNumber" type="number" min="1" style="padding:8px">

<br><br>

<button id="splitBtn" style="
padding:12px 25px;
background:#0984e3;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
">
استخراج الصفحة
</button>
`;

const input = document.getElementById("fileInput");
const btn = document.getElementById("splitBtn");

btn.onclick = async () => {

 const file = input.files[0];

 if(!file){
  alert("اختر ملف PDF");
  return;
 }

 const pageNumber = parseInt(document.getElementById("pageNumber").value);

 if(!pageNumber){
  alert("ادخل رقم الصفحة");
  return;
 }

 const { PDFDocument } = PDFLib;

 const bytes = await file.arrayBuffer();
 const pdf = await PDFDocument.load(bytes);

 const newPdf = await PDFDocument.create();

 const [page] = await newPdf.copyPages(pdf,[pageNumber-1]);

 newPdf.addPage(page);

 const newBytes = await newPdf.save();

 const blob = new Blob([newBytes],{type:"application/pdf"});
 const url = URL.createObjectURL(blob);

 const a = document.createElement("a");
 a.href = url;
 a.download = "page.pdf";
 a.click();

};
