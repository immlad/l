const desktop =
document.getElementById("desktop");

const dock =
document.getElementById("dock");

let zIndex = 100;

window.addEventListener("beforeunload",e=>{
e.preventDefault();
e.returnValue="";
});

const apps = [
{
name:"Nebulo",
icon:"☁",
url:"https://plat.primebuildings.bg/"
},
{
name:"Settings",
icon:"⚙",
settings:true
}
];

loadCustomApps();

renderDock();

function renderDock(){

dock.innerHTML="";

apps.forEach(app=>{

const icon =
document.createElement("div");

icon.className="app";

icon.innerHTML=app.icon;

icon.onclick=()=>{

if(app.settings){
openSettings();
}else{
openWindow(
app.name,
app.url
);
}

};

dock.appendChild(icon);

});

}

function openWindow(title,url){

const windowEl =
document.createElement("div");

windowEl.className="window";

windowEl.style.left="150px";
windowEl.style.top="100px";

windowEl.style.zIndex=++zIndex;

windowEl.innerHTML=`
<div class="titlebar">

<div class="controls">

<div class="control close"></div>

<div class="control min"></div>

<div class="control max"></div>

</div>

<div class="title">${title}</div>

<button class="refresh">
↻
</button>

</div>

${url}
</iframe>
`;

desktop.appendChild(windowEl);

const iframe =
windowEl.querySelector("iframe");

windowEl.onclick=()=>{
windowEl.style.zIndex=++zIndex;
};

windowEl.querySelector(".refresh")
.onclick=()=>{
iframe.src=iframe.src;
};

windowEl.querySelector(".close")
.onclick=()=>{

if(confirm(`Close "${title}" ?`))
windowEl.remove();

};

let minimized=false;

windowEl.querySelector(".min")
.onclick=()=>{

if(minimized){

windowEl.style.display="block";

}else{

windowEl.style.display="none";

}

minimized=!minimized;

};

let full=false;

windowEl.querySelector(".max")
.onclick=()=>{

if(!full){

windowEl.dataset.oldLeft=
windowEl.style.left;

windowEl.dataset.oldTop=
windowEl.style.top;

windowEl.style.left="10px";
windowEl.style.top="70px";

windowEl.style.width=
"calc(100vw - 20px)";

windowEl.style.height=
"calc(100vh - 100px)";

full=true;

}else{

windowEl.style.left=
windowEl.dataset.oldLeft;

windowEl.style.top=
windowEl.dataset.oldTop;

windowEl.style.width=
"1000px";

windowEl.style.height=
"700px";

full=false;
}

};

drag(windowEl);
}

function openSettings(){

const win =
document.createElement("div");

win.className="window";

win.style.left="200px";
win.style.top="120px";

win.style.zIndex=++zIndex;

win.innerHTML=`
<div class="titlebar">

<div class="controls">

<div class="control close"></div>

<div class="control min"></div>

<div class="control max"></div>

</div>

<div class="title">
Settings
</div>

</div>

<div class="settings-pane">

<h2>Theme</h2>

<button onclick="toggleTheme()">
Toggle Theme
</button>

<br><br>

<h2>Wallpaper URL</h2>

<input id="wallInput">

<button onclick="saveWallpaper()">
Apply Wallpaper
</button>

<br><br>

<h2>Create App</h2>

<input id="appName"
placeholder="App Name">

<input id="appUrl"
placeholder="https://">

<button onclick="createApp()">
Create App
</button>

</div>
`;

desktop.appendChild(win);

win.querySelector(".close")
.onclick=()=>{

if(confirm("Close settings?"))
win.remove();

};

drag(win);
}

function toggleTheme(){

document.body.classList.toggle(
"light"
);

document.body.classList.toggle(
"dark"
);

localStorage.setItem(
"theme",
document.body.className
);
}

function saveWallpaper(){

const url =
document.getElementById(
"wallInput"
).value;

localStorage.setItem(
"wallpaper",
url
);

document.getElementById(
"wallpaper"
).style.backgroundImage=
`url('${url}')`;
}

function createApp(){

const app={
name:
document.getElementById("appName").value,

url:
document.getElementById("appUrl").value,

icon:"🌐"
};

apps.push(app);

localStorage.setItem(
"customApps",
JSON.stringify(
apps.filter(a=>!a.settings)
)
);

renderDock();
}

function loadCustomApps(){

const saved=
JSON.parse(
localStorage.getItem(
"customApps"
)||"[]"
);

saved.forEach(app=>{
if(app.name!=="Nebulo")
apps.push(app);
});

const theme=
localStorage.getItem("theme");

if(theme){
document.body.className=
theme;
}

const wall=
localStorage.getItem(
"wallpaper"
);

if(wall){

window.addEventListener(
"load",
()=>{

document.getElementById(
"wallpaper"
).style.backgroundImage=
`url('${wall}')`;

}
);

}
}

function drag(win){

const tb =
win.querySelector(".titlebar");

let x=0;
let y=0;
let down=false;

tb.addEventListener("mousedown",
e=>{

down=true;

x=e.clientX-win.offsetLeft;
y=e.clientY-win.offsetTop;

});

document.addEventListener("mousemove",
e=>{

if(!down)return;

win.style.left=
e.clientX-x+"px";

win.style.top=
e.clientY-y+"px";

});

document.addEventListener(
"mouseup",
()=> down=false
);
}
