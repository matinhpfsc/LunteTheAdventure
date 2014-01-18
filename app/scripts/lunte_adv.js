function Vector2d(x, y)
{
  this.x = x;
  this.y = y;

  this.mul = function(scalar)
  {
    return new Vector2d(this.x * scalar, this.y * scalar);
  };
  
  this.add = function(otherVector)
  {
    return new Vector2d(this.x + otherVector.x, this.y + otherVector.y);
  }
  
  this.equals = function(otherVector)
  {
    return this.x == otherVector.x && this.y == otherVector.y;
  }
}

UP = new Vector2d(0, -1);
DOWN = new Vector2d(0, +1);
LEFT = new Vector2d(-1, 0);
RIGHT = new Vector2d(+1, 0);

function ViewPort(width, height)  
{
  this.x = 0;
  this.y = 0;
  this.width = width;
  this.height = height;
}

lastTimeStamp = 0;

function GameLoop(timeStamp)
{
  var timeSpan = timeStamp - lastTimeStamp;
  timeSpan = Math.min(timeSpan, 1000); //To avoid greate jumps.
  lastTimeStamp = timeStamp;

  for (var figureIndex = 0; figureIndex < allFigures.length; figureIndex++)
  {
    var currentFigure = allFigures[figureIndex];
    currentFigure.move(timeSpan);
    if (humanFigure.bulletproofCountdown == 0 && currentFigure.isCollided(humanFigure))
    {
      humanFigure.bulletproofCountdown = 3000;
      humanFigure.energy = Math.max(0, humanFigure.energy - 35);
    }
  }
  
  CorrectViewPort();
  DrawCanvas(timeSpan);
   
  if (humanFigure.energy <= 0)
  {
    alert("You are death");
    return;
  }
  
   if (Math.floor((humanFigure.location.x + 25) / 50) == endCellColumn && Math.floor((humanFigure.location.y  + 25) / 50) == endCellRow)
   {
     alert("Exit achieved");
     return;
   }
/*     if (start == 0)
     {
       start = timeStamp;
     }
     counter++;
     if ((timeStamp - start) > 10000)
     {
       var fps = counter / 10;
       alert(fps);
     }
     else*/
     {
    window.requestAnimFrame(GameLoop);
     }
}

counter = 0;
start = 0;

function DrawCanvas(timeSpan)
{
  DrawMaze();
  
  for (var figureIndex = 0; figureIndex < allFigures.length; figureIndex++)
  {
    DrawFigure(allFigures[figureIndex], viewPort, timeSpan);
  }

  DrawInstrumentLayer();
  DrawToWindow();
}

function DrawMaze()
{
  doubleBufferCanvasContext.drawImage(gameMazeImage, viewPort.x, viewPort.y, viewPort.width, viewPort.height, 0, 0, windowWidth, windowHeight);
}

instrumentLayerImage = null;
lastFigureEnergy = null;

function DrawInstrumentLayer()
{

  if (instrumentLayerImage == null)
  {
    instrumentLayerImage = document.createElement("canvas");
    instrumentLayerImage.width = windowWidth;
    instrumentLayerImage.height = windowHeight;
    instrumentLayerImageContext = instrumentLayerImage.getContext("2d");
  }

  if (lastFigureEnergy != humanFigure.energy)
  {
    if (lastFigureEnergy == null)
    {
      instrumentLayerImageContext.fillStyle="#FF0000";
      instrumentLayerImageContext.strokeStyle="#000000";
    }
    lastFigureEnergy = humanFigure.energy;
    instrumentLayerImageContext.clearRect(windowWidth - 150, 0, 104, 50);
    instrumentLayerImageContext.fillRect(windowWidth - 148, 22, lastFigureEnergy, 10);
    instrumentLayerImageContext.strokeRect(windowWidth - 150, 20, 104, 14);
  }
  
  doubleBufferCanvasContext.drawImage(instrumentLayerImage, 0, 0);
}

function DrawToWindow()
{
  canvasContext.drawImage(doubleBufferCanvas, 0, 0);
}

function StartImageLoading()
{
   imageCount = 3;
   
   dungeonImage = new Image();
   dungeonImage.onload = OnImageLoaded;
   dungeonImage.src = "images/dungeon3.png"
   
   activeImage = new Image();
   activeImage.onload = OnImageLoaded;
   activeImage.src = "images/aktive.png";

   passiveImage = new Image();
   passiveImage.onload = OnImageLoaded;
   passiveImage.src = "images/passive.png";
}

function GetSpriteIndex(cellColumn, cellRow)
{
  if (gameMaze.getFieldValue(cellColumn, cellRow) == 0)
  {
    return 8;
  }
  else
  {
    var left = gameMaze.getFieldValue(cellColumn - 1, cellRow);
    var right = gameMaze.getFieldValue(cellColumn + 1, cellRow);
    var top = gameMaze.getFieldValue(cellColumn, cellRow - 1);
    var bottom = gameMaze.getFieldValue(cellColumn, cellRow + 1);

    var number = left * 8 + bottom * 4 + right * 2 + top * 1;
        
    return mazeSpriteIndexes[number];
  }  
}

function CorrectViewPort()
{
  var width = gameMaze.width;
  var height = gameMaze.height;
  
  var currentFigure = humanFigure;
  
  if (currentFigure.location.x - viewPort.x > windowWidth - 150)
  {
    viewPort.x = currentFigure.location.x - windowWidth + 150 ;
  }
  if (currentFigure.location.x - viewPort.x < 100)
  {
    viewPort.x = currentFigure.location.x - 100 ;
  }
  if (currentFigure.location.y - viewPort.y > windowHeight - 150)
  {
    viewPort.y = currentFigure.location.y - windowHeight + 150 ;
  }
  if (currentFigure.location.y - viewPort.y < 100)
  {
    viewPort.y = currentFigure.location.y - 100 ;
  }
  
  if (viewPort.x + windowWidth > width * 50)
  {
    viewPort.x = width * 50 - windowWidth;
  }
  if (viewPort.x < 0)
  {
    viewPort.x = 0;
  }
  if (viewPort.y + windowHeight > height * 50)
  {
    viewPort.y = height * 50 - windowHeight;
  }
  if (viewPort.y < 0)
  {
    viewPort.y = 0;
  }  
}

function CreateMazeImage()
{
  var mazeCanvas = document.createElement("canvas");
  mazeCanvas.width = gameMaze.width * 50;
  mazeCanvas.height = gameMaze.height * 50;
  var mazeCanvasContext = mazeCanvas.getContext("2d");
  
  for (var cellColumn = 0; cellColumn < gameMaze.width; cellColumn++)
  {
    for (var cellRow = 0; cellRow < gameMaze.height; cellRow++)
    {
      var spriteIndex = GetSpriteIndex(cellColumn, cellRow);
      
      var spriteY = Math.floor(spriteIndex / 5);
      var spriteX = spriteIndex % 5;
      mazeCanvasContext.drawImage(dungeonImage, 50 * spriteX, 50 * spriteY, 50, 50, cellColumn * 50, cellRow * 50, 50, 50);
    }
  }
  
  return mazeCanvas;
}

function DrawFigure(currentFigure, viewPort, timeSpan)
{
  var animationIndex = 0;
  if (currentFigure.speed != 0)
  {
    currentFigure.animationStartTimeStamp += timeSpan;
    animationIndex = Math.floor(currentFigure.animationStartTimeStamp / 100) % 8;
  }
  var spriteIndex = 0;
  if (currentFigure.orientation.x > 0)
  {
    spriteIndex = 24;
  }
  if (currentFigure.orientation.x < 0)
  {
    spriteIndex = 8;
  }
  if (currentFigure.orientation.y > 0)
  {
    spriteIndex = 16;
  }
  spriteIndex += currentFigure.imageIndex * 4 * 8 + animationIndex;
  var spriteY = Math.floor(spriteIndex / 8);
  var spriteX = spriteIndex % 8;
  
  if ((Math.floor(currentFigure.bulletproofCountdown / 100)) % 3 < 2)
  {
    doubleBufferCanvasContext.drawImage(currentFigure.image, 50 * spriteX, 50 * spriteY, 50, 50, currentFigure.location.x - viewPort.x, currentFigure.location.y - viewPort.y, 50, 50);
  }
}

function OnImageLoaded()
{
  imageCount--;
  if (imageCount == 0)
  {
    var size = 2;
    var width = 16 * size;
    var height = 12 * size;

    viewPort = new ViewPort(windowWidth, windowHeight);

    allFigures = new Array();

    humanFigure = new Figure(activeImage, 1);
    humanFigure.location.x = 50;
    humanFigure.location.y = 50;
    allFigures.push(humanFigure);

    gameMaze = new Maze(width, height);

    gameMazeImage = CreateMazeImage();
    
    enemyFigures = new Array();

    for (var fieldPartX = 0; fieldPartX < size; fieldPartX++)
    {
      for (var fieldPartY = 0; fieldPartY < size; fieldPartY++)
      {
	var enemyFigure = new Figure(passiveImage, Math.floor(Math.random() * 2));
	var v = GetNearestFreeFieldVector(gameMaze, new Vector2d(8 * (2 * fieldPartX + 1), 6 * ( 2 * fieldPartY + 1)));

	enemyFigure.location.x = 50 * v.x;
	enemyFigure.location.y = 50 * v.y;
	enemyFigure.maximumSpeed = 2;
	enemyFigure.startWalking(DOWN);
	allFigures.push(enemyFigure);
	enemyFigures.push(enemyFigure);	
      }      
    }

    //TODO Was passiert hier bei mehrmaligen Aufruf?
    window.addEventListener("keydown", OnKeyDown, false);
    window.addEventListener("keyup", OnKeyUp, false);

    doubleBufferCanvas = document.createElement("canvas");
    doubleBufferCanvas.width = windowWidth;
    doubleBufferCanvas.height = windowHeight;
    doubleBufferCanvasContext = doubleBufferCanvas.getContext("2d");

    //TODO Was passiert hier bei mehrmaligen Aufruf?
    setInterval(ComputerControledMove, 250);

    GameLoop(null);
  }
}

function GetNearestFreeFieldVector(maze, startVector)
{
  var xArray = new Array(0,  0, -1, -1, -1,  0, +1, +1, +1);
  var yArray = new Array(0, -1, -1,  0, +1, +1, +1,  0, -1);
  
  for (var index = 0; index < xArray.length; index++)
  {
    var fieldVector = startVector.add(new Vector2d(xArray[index], yArray[index]));
    if (maze.getFieldValue(fieldVector.x, fieldVector.y) == 0)
    {
      return fieldVector;
    }
  }
  return null;
}

function StartNewLevel()
{
}

function EndLevel()
{
}

function ComputerControledMove()
{
  for (var figureIndex = 0; figureIndex < enemyFigures.length; figureIndex++)
  {
  var currentFigure = enemyFigures[figureIndex];
  var figureCellPosition = new Vector2d(Math.floor((currentFigure.location.x + 24.5) / 50), Math.floor((currentFigure.location.y + 25.5) / 50));

  if (gameMaze.getFieldValue(figureCellPosition.x + currentFigure.orientation.x, figureCellPosition.y + currentFigure.orientation.y) == 1)
  {
      var possibleWays = new Array();
      if (gameMaze.getFieldValue(figureCellPosition.x + 0, figureCellPosition.y + 1) == 0 && !currentFigure.orientation.equals(new Vector2d(0, -1)))
      {
	possibleWays.push(new Vector2d(0, 1));
      }
      if (gameMaze.getFieldValue(figureCellPosition.x + 1, figureCellPosition.y + 0) == 0 && !currentFigure.orientation.equals(new Vector2d(-1, 0)))
      {
	possibleWays.push(new Vector2d(1, 0));
      }
      if (gameMaze.getFieldValue(figureCellPosition.x + 0, figureCellPosition.y - 1) == 0 && !currentFigure.orientation.equals(new Vector2d(0, 1)))
      {
	possibleWays.push(new Vector2d(0, -1));
      }
      if (gameMaze.getFieldValue(figureCellPosition.x - 1, figureCellPosition.y + 0) == 0 && !currentFigure.orientation.equals(new Vector2d(1, 0)))
      {
	possibleWays.push(new Vector2d(-1, 0));
      }

      if (possibleWays. length > 0)
      {
	currentFigure.startWalking(possibleWays[Math.floor(Math.random() * possibleWays.length)]);
      }
      else
      {
	currentFigure.startWalking(currentFigure.orientation.mul(-1));
      }
  }
  }
}

function OnKeyDown(event)
{
    switch(event.keyCode)
    {
        case 40: event.preventDefault(); figureMove(DOWN); break;
        case 38: event.preventDefault(); figureMove(UP); break;
        case 39: event.preventDefault(); figureMove(RIGHT); break;
        case 37: event.preventDefault(); figureMove(LEFT); break;
    }
}

function OnKeyUp()
{
  humanFigure.stopWalking();
}

function figureMove(orientation)
{
    // MH: die Gesten sind in einem gestures-Objekt gekapselt. Von dort aus kann ich nicht einfach so die
    // Funktionen UP, DOWN... aufrufen. Daher übergebe ich das als String und konvertiere es hier,
    // wenn es denn ein String ist.
    // Das kann weg, wenn die lunte_adv.js auch Objekte sind.

    switch (orientation)
    {
        case "UP": orientation = UP; break;
        case "DOWN": orientation = DOWN; break;
        case "LEFT": orientation = LEFT; break;
        case "RIGHT": orientation = RIGHT; break;
    }
    
    humanFigure.startWalking(orientation);
}

function Start()
{
  //Set image indexes for the maze
  mazeSpriteIndexes = new Array(16);
  mazeSpriteIndexes[0] = 20;
  mazeSpriteIndexes[1] = 30;
  mazeSpriteIndexes[2] = 32;
  mazeSpriteIndexes[3] = 31;
  mazeSpriteIndexes[4] = 25;
  mazeSpriteIndexes[5] = 26;
  mazeSpriteIndexes[6] = 21;
  mazeSpriteIndexes[7] = 29;
  mazeSpriteIndexes[8] = 33;
  mazeSpriteIndexes[9] = 28;
  mazeSpriteIndexes[10] = 22;
  mazeSpriteIndexes[11] = 24;
  mazeSpriteIndexes[12] = 23;
  mazeSpriteIndexes[13] = 19;
  mazeSpriteIndexes[14] = 34;
  mazeSpriteIndexes[15] = 27;
  
   var canvas = document.getElementById("lunte-canvas");

   windowWidth = canvas.width;
   windowHeight = canvas.height;
   
   canvasContext = canvas.getContext("2d");
   
   window.requestAnimFrame = GetRequestAnimFrameFunction();
   
   StartImageLoading();
}

function GetRequestAnimFrameFunction()
{
  //These part copied from http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/:
  // shim layer with setTimeout fallback
  return  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(callback)
      {
	window.setTimeout(callback, 1000 / 60);
      };
}

$(document).ready(function() {
    Start();
    //addHandler();
    gestures.init();

});