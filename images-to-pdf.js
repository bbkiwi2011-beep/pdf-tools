const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">تحويل الصور إلى PDF</h2>

<div id="dropZone" style="
border:2px dashed #0984e3;
padding:40px;
border-radius:10px;
cursor:pointer;
margin-bottom:20px;
font-size:18px;
">
اسحب الصور هنا أو اضغط لاختيارها
</div>

<input type="file" id="fileInput" multiple accept="image/*" style="display:none">

<ul id="fileList" style="text-align:right;margin-bottom:20px"></ul>

<button id="convertBtn" style="
padding:12px 25px;
background:#0984e3;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;
">
تحويل إلى PDF
</button>

<p id="status" style="margin-top:15px;color:#666"></p>
`;

const dropZone = document.getElementById("dropZone");
const input = document.getElementById("fileInput");
const list = document.getElementById("fileList");
const convertBtn = document.getElementById("convertBtn");
const status = document.getElementById("status");

let images = [];

dropZone.onclick = () => input.click();

input.onchange = e => {
images = [...images, ...e.target.files];
renderList();
};

dropZone.ondragover = e => e.preventDefault();

dropZone.ondrop = e => {
e.preventDefault();
images = [...images, ...e.dataTransfer.files];
renderList();
};

function renderList(){
list.innerHTML = "";
images.forEach((file,index)=>{
const li = document.createElement("li");
li.innerHTML = `
${file.name}
<button data-index="${index}" style="
margin-right:10px;
background:#e74c3c;
color:white;
border:none;
border-radius:5px;
cursor:pointer;
padding:2px 8px;
">حذف</button>
`;
list.appendChild(li);
});

document.querySelectorAll("[data-index]").forEach(btn=>{
btn.onclick=()=>{
images.splice(btn.dataset.index,1);
renderList();
};
});
}

convertBtn.onclick = async () => {

if(images.length === 0){
alert("اختر صورة واحدة على الأقل");
return;
}

status.textContent="جاري إنشاء PDF...";

const { PDFDocument } = PDFLib;

const pdf = await PDFDocument.create();

for(let img of images){

const bytes = await img.arrayBuffer();

let image;

if(img.type === "image/png"){
image = await pdf.embedPng(bytes);
}else{
image = await pdf.embedJpg(bytes);
}

const page = pdf.addPage([image.width,image.height]);

page.drawImage(image,{
x:0,
y:0,
width:image.width,
height:image.height
});

}

const pdfBytes = await pdf.save();

const blob = new Blob([pdfBytes],{type:"application/pdf"});

const url = URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;
a.download = "images.pdf";

a.click();

status.textContent="تم إنشاء الملف بنجاح";

};
