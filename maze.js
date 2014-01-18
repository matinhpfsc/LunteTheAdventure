var maze =
{
    matrix: "",
    width: "",
    height: "",

    getStartPoint: function ()
    {
        if (!this.matrix)
        {
            this.CreateLabyrinth();
        }

        var searching = true;

        //while ()
        var right = Math.floor(Math.random()*this.matrix.length);
        var top =   Math.floor(Math.random()*this.matrix[right].length);

        if (this.matrix[right][top] == 0)
        {
            return {x:right, y:top}
        }
        else
        {
            this.getStartPoint();
        }

    },

    CreateLabyrinth: function ()
    {

    this.width = settings.mazeSize;
    this.height = settings.mazeSize;

    this.EMPTY = 0;
    this.WALL = 1;


    this.matrix = new Array();

        for (var cellRow = 0; cellRow < this.height; cellRow++)
        {
            this.matrix[cellRow] = new Array();
            for (var cellColumn = 0; cellColumn < this.width; cellColumn++)
            {
                var value = 0;
                if (cellColumn == 0 || cellRow == 0 || cellColumn + 1 == this.width || cellRow + 1 == this.height)
                {
                    value = 1;
                }
                this.matrix[cellRow][cellColumn] = value;
            }
        }

        var side = Math.floor(Math.random() * 4);

        endCellColumn = 0
        endCellRow = 0;

        if (side == 0)
        {
            endCellRow = 0;
            endCellColumn = Math.floor(Math.random() * (this.width - 2)) + 1;
            this.matrix[0][endCellColumn] = 0;
        }
        else
        {
            if (side == 1)
            {
                endCellRow = Math.floor(Math.random() * (this.height - 2)) + 1;
                endCellColumn = this.width - 1;
            }
            else
            {
                if (side == 1)
                {
                    endCellRow = this.height - 1;
                    endCellColumn = Math.floor(Math.random() * (this.width - 2)) + 1;
                }
                else
                {
                    endCellRow = Math.floor(Math.random() * (this.height - 2)) + 1;
                    endCellColumn = 0;
                }
            }
            this.matrix[endCellRow][endCellColumn] = 0;
        }

        this.DivideChamber(1, 1, this.width - 2, this.height - 2);

        return this.matrix;
    },

    DivideChamber: function(chamberX, chamberY, chamberWidth, chamberHeight)
    {
        var minimumCellSize = 1;
        minimumCellSize = Math.max(minimumCellSize, 1);

        var wallXPosition = this.GetWallXPosition(chamberX, chamberY, chamberWidth, chamberHeight, minimumCellSize);
        var wallYPosition = this.GetWallYPosition(chamberX, chamberY, chamberWidth, chamberHeight, minimumCellSize);

        var topDoorCap = 1;
        var bottomDoorCap = 1;
        var leftDoorCap = 1;
        var rightDoorCap = 1;

        var noDoorIndex = 0;
        if (wallXPosition != null && wallYPosition != null)
        {
            noDoorIndex = Math.floor(Math.random() * 4);
        }
        else
        {
            if (wallXPosition != null)
            {
                noDoorIndex = Math.floor(Math.random() * 2);
            }
            else
            {
                noDoorIndex = Math.floor(Math.random() * 2) + 2;
            }
        }


        if (noDoorIndex == 0)
        {
            topDoorCap = 0;
        }
        else
        {
            if (noDoorIndex == 1)
            {
                bottomDoorCap = 0;
            }
            else
            {
                if (noDoorIndex == 2)
                {
                    rightDoorCap = 0;
                }
                else
                {
                    if (noDoorIndex == 3)
                    {
                        leftDoorCap = 0;
                    }
                }
            }
        }

        if (wallXPosition != null)
        {
            for (var y = chamberY + topDoorCap; y < chamberY + chamberHeight - bottomDoorCap; y++)
            {
                this.matrix[y][wallXPosition] = 1;
            }
        }
        if (wallYPosition != null)
        {
            for (var x = chamberX + leftDoorCap; x < chamberX + chamberWidth - rightDoorCap; x++)
            {
                this.matrix[wallYPosition][x] = 1;
            }
        }

        if (wallXPosition != null && wallYPosition != null)
        {
            //LT
            this.DivideChamber(chamberX, chamberY, wallXPosition - chamberX, wallYPosition - chamberY);
            //RT
            this.DivideChamber( wallXPosition + 1, chamberY, chamberX + chamberWidth - (wallXPosition + 1), wallYPosition - chamberY);
            //LB
            this.DivideChamber(chamberX, wallYPosition + 1, wallXPosition - chamberX, chamberY + chamberHeight - (wallYPosition + 1));
            //RB
           this.DivideChamber(wallXPosition + 1, wallYPosition + 1, chamberX + chamberWidth - (wallXPosition + 1), chamberY + chamberHeight - (wallYPosition + 1));
        }
        else
        {
            if (wallXPosition != null)
            {
                //L
                this.DivideChamber(chamberX, chamberY, wallXPosition - chamberX, chamberHeight);
                //R
                this.DivideChamber(wallXPosition + 1, chamberY, chamberX + chamberWidth - (wallXPosition + 1), chamberHeight);
            }
            else
            {
                if (wallYPosition != null)
                {
                    //T
                    this.DivideChamber(chamberX, chamberY, chamberWidth, wallYPosition - chamberY);
                    //B
                    this.DivideChamber(chamberX, wallYPosition + 1, chamberWidth, chamberY + chamberHeight - (wallYPosition + 1));
                }
            }
        }
    },

    GetWallXPosition: function(chamberX, chamberY, chamberWidth, chamberHeight, minimumCellSize)
    {
        var validWallPositions = new Array();
        for (var x = chamberX + minimumCellSize; x < chamberX + chamberWidth - minimumCellSize; x++)
        {
            if (this.matrix[chamberY - 1][x] == 1 && this.matrix[chamberY + chamberHeight][x] == 1)
            {
                validWallPositions[validWallPositions.length] = x;
            }
        }

        if (validWallPositions.length > 0)
        {
            var index = Math.floor(Math.random() * validWallPositions.length);
            return validWallPositions[index];
        }
    },

    GetWallYPosition: function (chamberX, chamberY, chamberWidth, chamberHeight, minimumCellSize)
    {
        var validWallPositions = new Array();
        for (var y = chamberY + minimumCellSize; y < chamberY + chamberHeight - minimumCellSize; y++)
        {
            if (this.matrix[y][chamberX - 1] == 1 && this.matrix[y][chamberX + chamberWidth] == 1)
            {
                validWallPositions[validWallPositions.length] = y;
            }
        }

        if (validWallPositions.length > 0)
        {
            var index = Math.floor(Math.random() * validWallPositions.length);
            return validWallPositions[index];
        }
    },

    getFieldValue: function(cellColumn, cellRow)
    {
        if (cellColumn < 0 || cellRow < 0 || cellRow >= this.height || cellColumn >= this.width)
        {
            return this.EMPTY;
        }
        return this.matrix[cellRow][cellColumn];
    }

}