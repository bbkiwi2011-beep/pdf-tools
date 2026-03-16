const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">أدوات PDF</h2>

<select id="toolSelect">
<option value="merge">دمج PDF</option>
<option value="split">تقسيم PDF</option>
<option value="compress">ضغط PDF</option>
</select>

<div id="dropZone" style="
border:2px dashed #0984e3;
padding:40px;
border-radius:10px;
cursor:pointer;
margin-bottom:20px;
text-align:center;">
اسحب ملف PDF هنا أو اضغط لاختياره
</div>

<input type="file" id="fileInput" accept="application/pdf" style="display:none">

<div id="preview" style="
display:grid;
grid-template-columns:repeat(auto-fill,150px);
gap:10px;
margin-top:20px">
</div>

<button id="runBtn" style="
margin-top:20px;
padding:10px 20px;
background:#0984e3;
color:white;
border:none;
border-radius:6px;
cursor:pointer;">
تنفيذ
</button>
`;

const preview = document.getElementById("preview");
const input = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");

let files = [];
let pagesOrder = [];
let dragIndex = null;


/* فتح اختيار الملف */

dropZone.onclick = () => input.click();


/* اختيار الملف */

input.onchange = e => {

files = [...e.target.files];

previewPDF(files[0]);

};


/* السحب والإفلات */

dropZone.ondragover = e => e.preventDefault();

dropZone.ondrop = e => {

e.preventDefault();

files = [...e.dataTransfer.files];

previewPDF(files[0]);

};



/* معاينة صفحات PDF */

async function previewPDF(file){

preview.innerHTML = "";

pagesOrder = [];

const pdfjsLib = window['pdfjs-dist/build/pdf'];

const data = await file.arrayBuffer();

const pdf = await pdfjsLib.getDocument({data}).promise;

for(let i=1;i<=pdf.numPages;i++){

const page = await pdf.getPage(i);

const viewport = page.getViewport({scale:0.4});

const canvas = document.createElement("canvas");

const ctx = canvas.getContext("2d");

canvas.width = viewport.width;
canvas.height = viewport.height;

await page.render({
canvasContext: ctx,
viewport: viewport
}).promise;



/* حاوية الصفحة */

const wrapper = document.createElement("div");

wrapper.style.border="1px solid #ddd";
wrapper.style.padding="5px";
wrapper.style.cursor="move";
wrapper.style.position="relative";
wrapper.style.background="#fff";

wrapper.draggable = true;

wrapper.appendChild(canvas);



/* رقم الصفحة */

const pageNum = document.createElement("span");

pageNum.textContent = i;

pageNum.style.position="absolute";
pageNum.style.top="5px";
pageNum.style.left="5px";
pageNum.style.background="#000";
pageNum.style.color="#fff";
pageNum.style.fontSize="12px";
pageNum.style.padding="2px 6px";
pageNum.style.borderRadius="4px";

wrapper.appendChild(pageNum);



/* زر حذف الصفحة */

const del = document.createElement("span");

del.textContent="✕";

del.style.position="absolute";
del.style.top="5px";
del.style.right="5px";
del.style.background="red";
del.style.color="white";
del.style.fontSize="12px";
del.style.padding="2px 6px";
del.style.borderRadius="50%";
del.style.cursor="pointer";

wrapper.appendChild(del);



/* حذف الصفحة */

del.onclick = (e) => {

e.stopPropagation();

wrapper.remove();

pagesOrder = pagesOrder.filter(p => p !== i);

};



/* سحب الصفحات */

wrapper.ondragstart = () => dragIndex = i-1;

wrapper.ondragover = e => e.preventDefault();

wrapper.ondrop = () => {

const targetIndex = i-1;

const temp = pagesOrder[dragIndex];

pagesOrder.splice(dragIndex,1);

pagesOrder.splice(targetIndex,0,temp);

renderPreview();

};



preview.appendChild(wrapper);

pagesOrder.push(i);

}

}



/* إعادة ترتيب المعاينة */

function renderPreview(){

const items = [...preview.children];

preview.innerHTML = "";

pagesOrder.forEach(i => {

preview.appendChild(items[i-1]);

});

}



/* زر التنفيذ */

document.getElementById("runBtn").onclick = () => {

const tool = document.getElementById("toolSelect").value;

alert("تم اختيار الأداة: " + tool);

};
