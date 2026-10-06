const desktop = document.getElementById("desktop");
const dock = document.getElementById("dock");
const wallpaper = document.getElementById("wallpaper");

let zIndex = 100;

const apps = [
{
name: "Nebulo",
icon: "☁️",
url: "https://plat.primebuildings.bg/"
},
{
name: "Settings",
icon: "⚙️",
settings: true
}
];

window.addEventListener("beforeunload", e => {
e.preventDefault();
e.returnValue = "";
});

loadCustomApps();
renderDock();

function renderDock() {

dock.innerHTML = "";

apps.forEach(app => {

const icon = document.createElement("div");

icon.className = "app";
icon.innerHTML = app.icon;

icon.title = app.name;

icon.onclick = () => {

if(app.settings){
openSettings();
}else{
openWindow(app.name, app.url);
}

};

dock.appendChild(icon);

});
}

function openWindow(title,url){

const win = document.createElement("div");

win.className = "window";
win.style.left = "150px";
win.style.top = "120px";
win.style.zIndex = ++zIndex;

win.innerHTML = `
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

${url}</iframe>
`;

desktop.appendChild(win);

const iframe = win.querySelector("iframe");

win.addEventListener("mousedown", () => {
win.style.zIndex = ++zIndex;
});

win.querySelector(".refresh").onclick = () => {
iframe.src = iframe.src;
};

win.querySelector(".close").onclick = () => {

if(confirm(`Close "${title}"?`)){
win.remove();
}

};

let minimized = false;

win.querySelector(".min").onclick = () => {

if(!minimized){

win.dataset.oldDisplay = "block";
win.style.display = "none";

}else{

win.style.display = "block";

}

minimized = !minimized;

};

let fullscreen = false;

win.querySelector(".max").onclick = () => {

if(!fullscreen){

win.dataset.oldLeft = win.style.left;
win.dataset.oldTop = win.style.top;
win.dataset.oldWidth = win.style.width || "1000px";
win.dataset.oldHeight = win.style.height || "700px";

win.style.left = "10px";
win.style.top = "70px";
win.style.width = "calc(100vw - 20px)";
win.style.height = "calc(100vh - 100px)";
win.style.borderRadius = "24px";

}else{

win.style.left = win.dataset.oldLeft;
win.style.top = win.dataset.oldTop;
win.style.width = win.dataset.oldWidth;
win.style.height = win.dataset.oldHeight;
win.style.borderRadius = "36px";

}

fullscreen = !fullscreen;

};

dragWindow(win);
}

function openSettings(){

const win = document.createElement("div");

win.className = "window";

win.style.left = "220px";
win.style.top = "100px";

win.style.zIndex = ++zIndex;

win.innerHTML = `
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

<input
id="wallInput"
placeholder="https://example.com/bg.jpg">

<button onclick="saveWallpaper()">
Apply Wallpaper
</button>

<br><br>

<h2>Create New App</h2>

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

win.querySelector(".close").onclick = () => {

if(confirm("Close Settings?")){
win.remove();
}

};

dragWindow(win);
}

function createApp(){

const name =
document.getElementById("appName").value;

const url =
document.getElementById("appUrl").value;

if(!name || !url){
alert("Fill in all fields");
return;
}

const newApp = {
name,
url,
icon:"🌐"
};

apps.push(newApp);

localStorage.setItem(
"customApps",
JSON.stringify(
apps.filter(
a => !a.settings && a.name !== "Nebulo"
)
)
);

renderDock();

alert("App Created");
}

function toggleTheme(){

if(document.body.classList.contains("light")){

document.body.classList.remove("light");
document.body.classList.add("dark");

}else{

document.body.classList.remove("dark");
document.body.classList.add("light");

}

localStorage.setItem(
"theme",
document.body.className
);
}

function saveWallpaper(){

const url =
document.getElementById("wallInput").value;

wallpaper.style.backgroundImage =
`url('${url}')`;

wallpaper.style.backgroundSize = "cover";
wallpaper.style.backgroundPosition = "center";

localStorage.setItem(
"wallpaper",
url
);
}

function loadCustomApps(){

const customApps =
JSON.parse(
localStorage.getItem("customApps") || "[]"
);

customApps.forEach(app => {
apps.push(app);
});

const savedTheme =
localStorage.getItem("theme");

if(savedTheme){
document.body.className = savedTheme;
}

const savedWallpaper =
localStorage.getItem("wallpaper");

if(savedWallpaper){

wallpaper.style.backgroundImage =
`url('${savedWallpaper}')`;

wallpaper.style.backgroundSize = "cover";
wallpaper.style.backgroundPosition = "center";
}
}

function dragWindow(win){

const titleBar =
win.querySelector(".titlebar");

let dragging = false;
let offsetX = 0;
let offsetY = 0;

titleBar.addEventListener("mousedown", e => {

dragging = true;

offsetX =
e.clientX - win.offsetLeft;

offsetY =
e.clientY - win.offsetTop;

});

document.addEventListener("mousemove", e => {

if(!dragging) return;

win.style.left =
e.clientX - offsetX + "px";

win.style.top =
e.clientY - offsetY + "px";

});

document.addEventListener("mouseup", () => {

dragging = false;

});
}
