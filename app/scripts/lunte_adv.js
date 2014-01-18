function Player(image, imageIndex)
{
  this.location = new Vector2d(0,0);
  this.orientation = new Vector2d(0, 1);
  this.animationStartTimeStamp = null;
  this.image = image;
  this.imageIndex = imageIndex;
  this.speed = 0;
  this.bulletproofCountdown = 0;
  this.energy = 100;
  
  this.move = function (timeSpan)
  {
    var playerCellPosition = new Vector2d(Math.floor((this.location.x + 24.5) / 50), Math.floor((this.location.y + 24.5) / 50));
    
    var cellLocation = playerCellPosition.mul(50);
    
    var distanceToCellLocation = (cellLocation.x - this.location.x) * this.orientation.x
			      + (cellLocation.y - this.location.y) * this.orientation.y;
			      
    var currentPlayerSpeed = this.speed;
    if (currentPlayerSpeed > distanceToCellLocation)
    {
      //Pruefe, ob naechtse Zelle begehbar ist.
      if (gameMaze.getFieldValue(playerCellPosition.x + this.orientation.x, playerCellPosition.y + this.orientation.y) == 1)
      {
	currentPlayerSpeed = distanceToCellLocation;
      }
      else
      {
	  var distanceToOtherCellLocation = ((cellLocation.x - this.location.x) * Math.abs(this.orientation.y)
				+ (cellLocation.y - this.location.y) * Math.abs(this.orientation.x));

	  var currentPlayerOtherSpeed = Math.min(currentPlayerSpeed, Math.abs(distanceToOtherCellLocation));

	  var sgn = distanceToOtherCellLocation > 0 ? 1 : -1;
	  this.location.x += sgn * Math.abs(this.orientation.y) * currentPlayerOtherSpeed;
	  this.location.y += sgn * Math.abs(this.orientation.x) * currentPlayerOtherSpeed;
	  currentPlayerSpeed -= currentPlayerOtherSpeed;
      }
    }

    this.location = this.location.add(this.orientation.mul(currentPlayerSpeed));
    
    if (this.bulletproofCountdown > 0)
    {
      this.bulletproofCountdown -= timeSpan;
      if (this.bulletproofCountdown < 0)
      {
	this.bulletproofCountdown = 0;
      }
    }
  };
  
  this.isCollided = function(otherPlayer)
  {
    if (this == otherPlayer)
    {
      return false;
    }
    var playerCellPosition = new Vector2d(Math.floor((this.location.x + 24.5) / 50), Math.floor((this.location.y + 24.5) / 50));
    var otherPlayerCellPosition = new Vector2d(Math.floor((otherPlayer.location.x + 24.5) / 50), Math.floor((otherPlayer.location.y + 24.5) / 50));    
    return playerCellPosition.equals(otherPlayerCellPosition);
  };
}

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

  for (var playerIndex = 0; playerIndex < allPlayers.length; playerIndex++)
  {
    var currentPlayer = allPlayers[playerIndex];
    currentPlayer.move(timeSpan);
    if (humanPlayer.bulletproofCountdown == 0 && currentPlayer.isCollided(humanPlayer))
    {
      humanPlayer.bulletproofCountdown = 3000;
      humanPlayer.energy = Math.max(0, humanPlayer.energy - 35);
    }
  }
  
  CorrectViewPort();
  DrawCanvas(timeSpan);
   
  if (humanPlayer.energy <= 0)
  {
    alert("You are death");
    return;
  }
  
   if (Math.floor((humanPlayer.location.x + 25) / 50) == endCellColumn && Math.floor((humanPlayer.location.y  + 25) / 50) == endCellRow)
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
  DrawMaze(viewPort);
  for (var playerIndex = 0; playerIndex < allPlayers.length; playerIndex++)
  {
    DrawPlayer(allPlayers[playerIndex], viewPort, timeSpan);
  }
  
  doubleBufferCanvasContext.font = "italic 30pt Arial";
  doubleBufferCanvasContext.textBaseline = "top";
  doubleBufferCanvasContext.textAlign = "right";
  doubleBufferCanvasContext.fillText(humanPlayer.energy.toString() + " %", windowWidth - 10, 10);
  
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
  
  var currentPlayer = humanPlayer;
  
  if (currentPlayer.location.x - viewPort.x > windowWidth - 150)
  {
    viewPort.x = currentPlayer.location.x - windowWidth + 150 ;
  }
  if (currentPlayer.location.x - viewPort.x < 100)
  {
    viewPort.x = currentPlayer.location.x - 100 ;
  }
  if (currentPlayer.location.y - viewPort.y > windowHeight - 150)
  {
    viewPort.y = currentPlayer.location.y - windowHeight + 150 ;
  }
  if (currentPlayer.location.y - viewPort.y < 100)
  {
    viewPort.y = currentPlayer.location.y - 100 ;
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

function DrawMaze(viewPort)
{
  var width = gameMaze.width;
  var height = gameMaze.height;
    
  var startColumn = Math.floor(viewPort.x / 50);
  var startRow = Math.floor(viewPort.y / 50);
  
  var endColumn = Math.ceil((viewPort.x + viewPort.width) / 50);
  var endRow = Math.ceil((viewPort.y + viewPort.height) / 50);
    
  width = Math.min(width, endColumn);
  height = Math.min(height, endRow);
  
  for (var cellColumn = startColumn; cellColumn < width; cellColumn++)
  {
    for (var cellRow = startRow; cellRow < height; cellRow++)
    {
      var spriteIndex = GetSpriteIndex(cellColumn, cellRow);
      
      var spriteY = Math.floor(spriteIndex / 5);
      var spriteX = spriteIndex % 5;
      doubleBufferCanvasContext.drawImage(dungeonImage, 50 * spriteX, 50 * spriteY, 50, 50, cellColumn * 50 - viewPort.x, cellRow * 50 - viewPort.y, 50, 50);
    }
  }  
}

function DrawPlayer(currentPlayer, viewPort, timeSpan)
{
  var animationIndex = 0;
  if (currentPlayer.speed != 0)
  {
    currentPlayer.animationStartTimeStamp += timeSpan;
    animationIndex = Math.floor(currentPlayer.animationStartTimeStamp / 100) % 8;
  }
  var spriteIndex = 0;
  if (currentPlayer.orientation.x > 0)
  {
    spriteIndex = 24;
  }
  if (currentPlayer.orientation.x < 0)
  {
    spriteIndex = 8;
  }
  if (currentPlayer.orientation.y > 0)
  {
    spriteIndex = 16;
  }
  spriteIndex += currentPlayer.imageIndex * 4 * 8 + animationIndex;
  var spriteY = Math.floor(spriteIndex / 8);
  var spriteX = spriteIndex % 8;
  
  if ((Math.floor(currentPlayer.bulletproofCountdown / 100)) % 3 < 2)
  {
    doubleBufferCanvasContext.drawImage(currentPlayer.image, 50 * spriteX, 50 * spriteY, 50, 50, currentPlayer.location.x - viewPort.x, currentPlayer.location.y - viewPort.y, 50, 50);
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

    allPlayers = new Array();

    humanPlayer = new Player(activeImage, 1);
    humanPlayer.location.x = 50;
    humanPlayer.location.y = 50;
    allPlayers.push(humanPlayer);

    gameMaze = new Maze(width, height);

    enemyPlayers = new Array();

    for (var fieldPartX = 0; fieldPartX < size; fieldPartX++)
    {
      for (var fieldPartY = 0; fieldPartY < size; fieldPartY++)
      {
	var enemyPlayer = new Player(passiveImage, Math.floor(Math.random() * 2));
	var v = GetNearestFreeFieldVector(gameMaze, new Vector2d(8 * (2 * fieldPartX + 1), 6 * ( 2 * fieldPartY + 1)));

	enemyPlayer.location.x = 50 * v.x;
	enemyPlayer.location.y = 50 * v.y;
	enemyPlayer.speed = 2;
	allPlayers.push(enemyPlayer);
	enemyPlayers.push(enemyPlayer);	
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
  var xArray = new Array( 0, -1, -1, -1,  0, +1, +1, +1);
  var yArray = new Array(-1, -1,  0, +1, +1, +1,  0, -1);
  
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
  for (var playerIndex = 0; playerIndex < enemyPlayers.length; playerIndex++)
  {
  var currentPlayer = enemyPlayers[playerIndex];
  var playerCellPosition = new Vector2d(Math.floor((currentPlayer.location.x + 24.5) / 50), Math.floor((currentPlayer.location.y + 25.5) / 50));

  if (gameMaze.getFieldValue(playerCellPosition.x + currentPlayer.orientation.x, playerCellPosition.y + currentPlayer.orientation.y) == 1)
  {
      var possibleWays = new Array();
      if (gameMaze.getFieldValue(playerCellPosition.x + 0, playerCellPosition.y + 1) == 0 && !currentPlayer.orientation.equals(new Vector2d(0, -1)))
      {
	possibleWays.push(new Vector2d(0, 1));
      }
      if (gameMaze.getFieldValue(playerCellPosition.x + 1, playerCellPosition.y + 0) == 0 && !currentPlayer.orientation.equals(new Vector2d(-1, 0)))
      {
	possibleWays.push(new Vector2d(1, 0));
      }
      if (gameMaze.getFieldValue(playerCellPosition.x + 0, playerCellPosition.y - 1) == 0 && !currentPlayer.orientation.equals(new Vector2d(0, 1)))
      {
	possibleWays.push(new Vector2d(0, -1));
      }
      if (gameMaze.getFieldValue(playerCellPosition.x - 1, playerCellPosition.y + 0) == 0 && !currentPlayer.orientation.equals(new Vector2d(1, 0)))
      {
	possibleWays.push(new Vector2d(-1, 0));
      }

      if (possibleWays. length > 0)
      {
	currentPlayer.orientation = possibleWays[Math.floor(Math.random() * possibleWays.length)];
      }
      else
      {
	currentPlayer.orientation = currentPlayer.orientation.mul(-1);
      }
  }
  }
}

function OnKeyDown(event)
{
    switch(event.keyCode)
    {
        case 40: event.preventDefault(); playerMove(DOWN); break;
        case 38: event.preventDefault(); playerMove(UP); break;
        case 39: event.preventDefault(); playerMove(RIGHT); break;
        case 37: event.preventDefault(); playerMove(LEFT); break;
    }
}

function OnKeyUp()
{
    playerStop();
}

function playerMove(orientation)
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
    humanPlayer.orientation = orientation;
    humanPlayer.speed = 4;
}

function playerStop()
{
    humanPlayer.speed = 0;
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
