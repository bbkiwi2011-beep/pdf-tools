const app = document.getElementById("toolApp");

app.innerHTML = `
<h2 style="margin-bottom:20px">محول الصور</h2>

<div id="dropZone" style="
border:2px dashed #0984e3;
padding:40px;
border-radius:10px;
cursor:pointer;
margin-bottom:20px;
font-size:18px;">
اسحب الصور هنا أو اضغط لاختيارها
</div>

<input type="file" id="fileInput" multiple accept="image/*" style="display:none">

<ul id="fileList" style="text-align:right;margin-bottom:20px"></ul>

<select id="formatSelect" style="
padding:10px;
border-radius:6px;
border:1px solid #ccc;
margin-bottom:20px;
font-size:15px;">
<option value="jpg">JPG</option>
<option value="png">PNG</option>
<option value="webp">WEBP</option>
<option value="pdf">PDF</option>
</select>

<button id="convertBtn" style="
padding:12px 25px;
background:#0984e3;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-size:16px;">
تحويل وتحميل
</button>
`;

const dropZone = document.getElementById("dropZone");
const input = document.getElementById("fileInput");
const list = document.getElementById("fileList");
const convertBtn = document.getElementById("convertBtn");
const formatSelect = document.getElementById("formatSelect");

let files = [];

dropZone.onclick = () => input.click();

input.onchange = e => {
files = [...files, ...e.target.files];
renderList();
};

dropZone.ondragover = e => e.preventDefault();

dropZone.ondrop = e => {
e.preventDefault();
files = [...files, ...e.dataTransfer.files];
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

convertBtn.onclick = async ()=>{

if(files.length===0){
alert("اختر صور");
return;
}

const format = formatSelect.value;

if(format==="pdf"){

const { jsPDF } = window.jspdf;
const pdf = new jsPDF();

for(let i=0;i<files.length;i++){

const img = await loadImage(files[i]);

const canvas=document.createElement("canvas");
const ctx=canvas.getContext("2d");

canvas.width=img.width;
canvas.height=img.height;

ctx.drawImage(img,0,0);

const data=canvas.toDataURL("image/jpeg",1);

if(i>0) pdf.addPage();

pdf.addImage(data,"JPEG",10,10,190,0);

}

pdf.save("images.pdf");

return;

}

for(let file of files){

const img = await loadImage(file);

const canvas=document.createElement("canvas");
const ctx=canvas.getContext("2d");

canvas.width=img.width;
canvas.height=img.height;

ctx.drawImage(img,0,0);

let mime="image/jpeg";

if(format==="png") mime="image/png";
if(format==="webp") mime="image/webp";

const url=canvas.toDataURL(mime,0.9);

const a=document.createElement("a");
a.href=url;
a.download=file.name.split(".")[0]+"."+format;
a.click();

}

};

function loadImage(file){

return new Promise(res=>{
const img=new Image();
img.src=URL.createObjectURL(file);
img.onload=()=>res(img);
});

}
