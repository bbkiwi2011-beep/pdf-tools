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
margin-bottom:20px;">
اسحب ملفات PDF هنا
</div>

<input type="file" id="fileInput" accept="application/pdf" style="display:none">

<div id="preview" style="
display:grid;
grid-template-columns:repeat(auto-fill,150px);
gap:10px;
margin-top:20px">
</div>

<button id="runBtn">تنفيذ</button>
`
const preview = document.getElementById("preview")

async function previewPDF(file){

preview.innerHTML=""

const pdfjsLib = window['pdfjs-dist/build/pdf']

const data = await file.arrayBuffer()

const pdf = await pdfjsLib.getDocument({data}).promise

for(let i=1;i<=pdf.numPages;i++){

const page = await pdf.getPage(i)

const viewport = page.getViewport({scale:0.4})

const canvas = document.createElement("canvas")

const ctx = canvas.getContext("2d")

canvas.width = viewport.width
canvas.height = viewport.height

await page.render({
canvasContext:ctx,
viewport:viewport
}).promise

preview.appendChild(canvas)

}

}
input.onchange = e => {

files = [...e.target.files]

previewPDF(files[0])

}
