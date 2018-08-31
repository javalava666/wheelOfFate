var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"), names = [], 
newNameForm = document.getElementById("newNameForm"),
spinSpeed = 53, allSpinSpeed = 53, handle = -1,
spinButton = document.getElementById("spinButton"),
removeButton = document.getElementById("removeName"),
refreshButton = document.getElementById("refresh"),
cleanButton = document.getElementById("clean"),
rotCount = 0;
spinButton.onclick = animate;
removeButton.onclick = removeName;
refreshButton.onclick = reset;
cleanButton.onclick = clean;      
ctx.translate(250,250);
loadSavedList();
drawGrid();
ctx.save();
ctx.beginPath();
ctx.moveTo(220,0);
ctx.lineTo(250,-7.5);
ctx.lineTo(250,7.5);
ctx.lineTo(220,0);
ctx.closePath();
ctx.fillStyle = "red";
ctx.fill();
ctx.restore();
ctx.beginPath();
ctx.arc(0, 0, 220, 0, Math.PI * 2, true);
ctx.clip();
drawWheel();
var image = new Image();
image.src = canvas.toDataURL();
drawCenter();
function reset() {
  location.reload();
}
function drawWheel() {
  ctx.setTransform(1,0,0,1,0,0);
  ctx.translate(250,250);
  ctx.save();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 4;
  ctx.fillStyle = "lightgrey";
  ctx.beginPath();
  ctx.arc(0, 0, 220, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.restore();
  ctx.save();
  var angMax = Math.PI * 2,
      angChng = angMax / names.length,
      angle;
  for (angle = angChng / 2; angle < angMax; angle += angChng) {
    ctx.save();
    var gradient = ctx.createRadialGradient(Math.cos(angle) * 214, Math.sin(angle) * 214, .1, Math.cos(angle) * 214, Math.sin(angle) * 214, 6);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(angle) * 214, Math.sin(angle) * 214);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(Math.cos(angle) * 214, Math.sin(angle) * 214, 6, 0, Math.PI * 2, false);
  ctx.closePath();
  gradient.addColorStop(0.05, "white");
  gradient.addColorStop(0.7, "silver");
  gradient.addColorStop(1.0, "black");
  ctx.fillStyle = gradient;
  ctx.fill();
  }
  var  angle = 0.0,
  w = 0;
  names.forEach(function(name) {
    angle = Math.PI * 2 * (0 + w) / names.length;
    w++;
    ctx.save();
    ctx.font = "bold 14pt Verdana";
    ctx.beginPath();
    ctx.fillStyle = "purple";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 50, 0);
    ctx.rotate(Math.PI * 2 / names.length);
  })
  rotCount = 180/names.length;
}
function drawCenter() {
var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2, true);
  gradient.addColorStop(0.05, "white");
  gradient.addColorStop(0.7, "silver");
  gradient.addColorStop(1.0, "black");
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}
function drawGrid() {
  ctx.save();
  var txt = "Created by: clstewart@kryptcorp.com";
  ctx.font = "bold 14pt Calibri";
  ctx.beginPath();
  ctx.fillStyle = "purple";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(txt, 0, 242);
  ctx.strokeText(txt, 0, 242);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, 223, 0, Math.PI * 2, true);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.stroke();
  ctx.restore();
}
function freshenUp() {
  drawWheel();
  image.src = canvas.toDataURL();
  drawCenter();
}
function update() {
  ctx.rotate(-Math.PI * spinSpeed / 180);
  rotCount += spinSpeed;
  spinSpeed = spinSpeed - 2.71828*(spinSpeed*Math.random() / 100);
} 
function animate() {
  update();
  ctx.drawImage(image,-250,-250);
  drawCenter();
  handle = requestAnimationFrame(animate);
  if(spinSpeed < .04) {
    cancelAnimationFrame(handle);
    spinSpeed = allSpinSpeed;
    highlight();
  }
}
function highlight() {
  var dex = Math.floor(rotCount/360*names.length);
  var end = Math.PI*2/names.length;
  ctx.save();
  ctx.rotate(end * (dex - 1/2));
  ctx.fillStyle = "rgba(255,182,193,0.2)";
  ctx.beginPath();
  ctx.moveTo(220, 0);
  ctx.arc(0, 0, 220, 0, end, false);
  ctx.lineTo(0, 0);
  ctx.lineTo(220, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function removeName() {
  rotCount %= 360;
  var nameToRemove = names[Math.floor(rotCount/360*names.length)];
  names = names.filter(function (val) { return val != nameToRemove; });
    sessionStorage.setItem("studentlist", JSON.stringify(names));
  freshenUp();
}
function clean() {
  if (window.confirm("This will remove your stored list from memory.\nAre you sure?")) { 
    names = names.filter(function (val) { return val === "zoinks"; });
    localStorage.setItem("studentlist", JSON.stringify(names));
    freshenUp();
  }
}
function loadSavedList() {
  var savedList = localStorage.getItem("studentlist");
  if (savedList != undefined) {
    names = JSON.parse(savedList);
  }
}
newNameForm.onsubmit = function() {
   var text = document.getElementById("name").value;
  names.push(text);
  freshenUp();
  localStorage.setItem("studentlist", JSON.stringify(names));
}