const dock = document.getElementById("dock");
const desktop = document.getElementById("desktop");

let zIndex = 10;

const apps = [
{
name:"Nebulo",
icon:"☁️",
url:"https://plat.primebuildings.bg/"
},
{
name:"Settings",
icon:"⚙️",
settings:true
}
];

renderDock();

function renderDock(){

dock.innerHTML="";

apps.forEach(app=>{

const el=document.createElement("div");

el.className="app";
el.textContent=app.icon;

el.title=app.name;

el.onclick=()=>{

if(app.settings){
openSettings();
}
else{
openWindow(
app.name,
app.url
);
}

};

dock.appendChild(el);

});

}

function openWindow(title,url){

const win=document.createElement("div");

win.className="window";
win.style.zIndex=++zIndex;

win.innerHTML=`
<div class="titlebar">

<div class="controls">
<div class="dot close"></div>
<div class="dot min"></div>
<div class="dot max"></div>
</div>

<div class="title">${title}</div>

<button class="refresh">↻</button>

</div>

${url}</iframe>
`;

desktop.appendChild(win);

const iframe =
win.querySelector("iframe");

win.querySelector(".refresh").onclick =
()=>{
iframe.src=iframe.src;
};

win.querySelector(".close").onclick =
()=>{

if(confirm("Close window?")){
win.remove();
}

};

drag(win);
}

function openSettings(){

const win=document.createElement("div");

win.className="window";
win.style.zIndex=++zIndex;

win.innerHTML=`
<div class="titlebar">

<div class="controls">
<div class="dot close"></div>
<div class="dot min"></div>
<div class="dot max"></div>
</div>

<div class="title">
Settings
</div>

</div>

<div class="settings">

<h2>Wallpaper URL</h2>

<input
id="wallpaperInput"
placeholder="https://image.jpg">

<button onclick="setWallpaper()">
Apply Wallpaper
</button>

<br><br>

<h2>Create App</h2>

<input
id="appName"
placeholder="App Name">

<input
id="appUrl"
placeholder="https://">

<button onclick="createApp()">
Create App
</button>

</div>
`;

desktop.appendChild(win);

win.querySelector(".close").onclick =
()=>{
win.remove();
};

drag(win);
}

function setWallpaper(){

const url =
document.getElementById(
"wallpaperInput"
).value;

if(!url) return;

document.getElementById(
"wallpaper"
).style.backgroundImage =
`url('${url}')`;

document.getElementById(
"wallpaper"
).style.backgroundSize =
"cover";

document.getElementById(
"wallpaper"
).style.backgroundPosition =
"center";
}

function createApp(){

const name =
document.getElementById(
"appName"
).value;

const url =
document.getElementById(
"appUrl"
).value;

if(!name || !url) return;

apps.push({
name,
url,
icon:"🌐"
});

renderDock();
}

function toggleTheme(){
document.body.classList.toggle(
"light"
);
}

function drag(win){

const bar =
win.querySelector(".titlebar");

let down=false;
let x=0;
let y=0;

bar.addEventListener(
"mousedown",
e=>{

down=true;

x=e.clientX-win.offsetLeft;
y=e.clientY-win.offsetTop;

});

document.addEventListener(
"mousemove",
e=>{

if(!down) return;

win.style.left=
e.clientX-x+"px";

win.style.top=
e.clientY-y+"px";

});

document.addEventListener(
"mouseup",
()=>{
down=false;
});

}

window.addEventListener(
"beforeunload",
e=>{
e.preventDefault();
e.returnValue="";
});
