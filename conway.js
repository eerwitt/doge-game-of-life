/* 
  # Conway's Game of Life implementation in DogeScript.
  # Author: Erik Erwitt (e3) <erike@cpan.org>
  # Original Author: Martin Foot <https://github.com/mfoo/CoffeeScript-Game-Of-Life>
  # License: Do what you want.
*/ 

var canvas = $('#conway')[0];
var iterationCount = 0;

// Specify the width and height of the square used to draw the entities. 
var entitySize = 10;

var entitiesX = Math.ceil(canvas.width/entitySize);
var entitiesY = Math.ceil(canvas.height/entitySize);

// The number of entities in our board. 
var numEntities = entitiesX * entitiesY ;

// Store for the JavaScript setInterval timerID for the 'play' functionality. 
var timerID = 0;

// A single dimensional array to store all the entities. Default value random. 
// Note: uses row-major ordering 
var entities = new Array(numEntities);
var newEntities = new Array(numEntities);

// This contains the coordinates to access the 8 surrounding neighbours by means 
// of an offset in a one-dimensional array. 
var grid = [-1+-1*entitiesX,-1*entitiesX,1+-1*entitiesX,-1,1,-1+entitiesX,entitiesX,1+entitiesX];

// Initialise the board to random entries (50% chance of being alive or dead). 
function initialize () { 
for ( var i  = 0 ; i  < numEntities ; i  += 1 ) {
var rand = Math.random();
entities[i] = Math.floor(rand+0.5);
newEntities[i] = entities[i]; 
iterationCount = 0; 
} 
} 

function color () { 
var colors = [];
colors.push("rgba(49, 247, 10, 0.4)", "rgba(255,245,238,0.7)", "rgba(251, 108, 108, 0.4)", "rgba(255, 3, 69, 0.4)", "rgba(224, 23, 182, 0.4)");
var pick = Math.floor(Math.random() * (5)) ;
return colors[pick];
} 

var easter = new Audio();
easter.setAttribute('src', 'http://soundbible.com/mp3/Dog%20Woof-SoundBible.com-457935112.mp3');
easter.load();

// Render the board 
function render () { 
var canvasExist = canvas.getContext;
if (canvasExist ) {
var ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "rgba(255,255,255,0.1)"; 
ctx.fillRect(0, 0, canvas.width, canvas.height);

for ( var i  = 0 ; i  < numEntities ; i  += 1 ) {
var x = i%entitiesX;
var y = Math.floor(i/entitiesX);
if (entities[i]  === 1 ) {
ctx.fillRect(entitySize*x, entitySize*y, entitySize, entitySize);
ctx.fillStyle = color();
} 
} 
} 

$("#iterationNumber").text(iterationCount);
} 

/* 
  # A single iteration of Conway's Game of Life. Do not modify the current board
  # (entities). Any changes go into the buffer (newEntities), which is then
  # swapped at the end of the function.
*/ 
function step () { 
for ( var i  = 0 ; i  < numEntities-1 ; i  += 1 ) {
// Get the number of live neighbours from the previous turn. 
var liveNeighbours = 0;

for ( var j  = 0 ; j  < grid.length ; j  += 1 ) {
var tile = i+grid[j];
var x = tile%entitiesX;
var y = Math.floor(tile/entitiesX);

// Wrap around the edge of the board. 
if (x  < 0 ) {
x = entitiesX+x; 
} 
if (y  < 0 ) {
y = entitiesY+y; 
} 
if (x  >= entitiesX ) {
x = entitiesX-x; 
} 
if (y  >= entitiesY ) {
y = entitiesY-y; 
} 

if (entities[y*entitiesX+x]  === 1 ) {
        liveNeighbours+=1;
} 

newEntities[i] = entities[i]; 

// Any live cell with fewer than two live neighbours dies, as if caused 
// by under-population. 
if (liveNeighbours  < 2  && entities[i]  === 1 ) {
newEntities[i] = 0; 
} 

// Any live cell with two or three live neighbours lives on to the next 
// generation. 
if (liveNeighbours  === 2  || liveNeighbours  === 3 ) {
if (entities[i]  === 1 ) {
newEntities[i] = 1; 
} 
} 

// Any live cell with more than three live neighbours dies, as if by 
// overcrowding. 
if (liveNeighbours  > 3  && entities[i]  === 1 ) {
newEntities[i] = 0; 
} 

// Any dead cell with exactly three live neighbours becomes a live cell, 
// as if by reproduction. 
if (liveNeighbours  === 3  && entities[i]  === 0 ) {
newEntities[i] = 1; 
} 
} 
} 

// Swap buffers 
var tmp = entities;
entities = newEntities; 
newEntities = tmp; 

  iterationCount+=1;
} 

function tick () { 
step();
render();
} 

// Allow somebody to click the mouse and toggle the status of a cell on the 
// board. 
function toggleEntity (event) { 
row = Math.floor((event.pageX-$("#conway").offset().left)/entitySize); 
column = Math.floor((event.pageY-$("#conway").offset().top)/entitySize); 
entities[entitiesX*column+row] = 1-entities[entitiesX*column+row]; 
render();
} 

initialize();
render();

function playClick () { 
timerID = setInterval(tick, 60);
} 

function pauseClick () { 
clearInterval(timerID);
} 

function conwayClick () { 
toggleEntity(event);
} 

function randomEyes () { 
pauseClick();
initialize();
render();
} 

function egg () { 
easter.play();
} 

$('#play').click(playClick);
$("#pause").click(pauseClick);
$("#stepper").click(tick);
$("#conway").click(conwayClick);
$("#randomise").click(randomEyes);
$("#conway").click(egg);
playClick();

