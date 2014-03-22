'use strict';
/* global $, console*/

function GestureController ()
{
    var _this = this;
    this.controlledFigure = false;
    this.touchSchwellwert = 1;
    this.lunteObj = '';
    this.isTouchStart = false;
    this.touchStartX = false;
    this.touchStartY = false;
    this.isMouseStart = false;
    this.mouseStartX = false;
    this.mouseStartY = false;



    this.start = function ( figure)
    {
        this.setObj();
        this.addHandler();
        this.controlledFigure = figure;

    };

    this.setObj = function ()
    {
        this.lunteObj = $('#lunte-canvas');
    };

    this.setControlledFigure = function (figure)
    {
      this.controlledFigure = figure;
    };

    this.addHandler = function ()
    {
        // Touchgesten
        // Bewegungen durch Touchgesten können nur innerhalb des Canvas initiiert werden
        $(this.lunteObj).on('mousedown', _this.mouseStart );
        $(this.lunteObj).on('touchstart', _this.touchStart );

        // Aber um die Gesten auszuführen und zu beenden steht die gesamte Seite zur Verfügung
        $('html')
            .on('mousemove', _this.mouseMove )
            .on('touchmove', _this.touchMove )
            .on('mouseup', _this.mouseEnd )
            .on('touchend touchcancel', _this.touchEnd );

        document.oncontextmenu = function() { return false;};

    };

    this.mouseStart = function (event)
    {
        if (event.button === 0 )
        {
            _this.isMouseStart = true;

            _this.mouseStartX = (event.pageX );
            _this.mouseStartY = (event.pageY );
            event.preventDefault();
        }

        if (event.button === 2)
        {
            // Call Drop Bomb
            _this.controlledFigure.dropBomb();
        }
    };

    this.touchStart =  function (event)
    {
        if ( event.originalEvent.touches.length === 1)
        {
            _this.isTouchStart = true;

            _this.touchStartX = (event.originalEvent.touches[0].pageX);
            _this.touchStartY = (event.originalEvent.touches[0].pageY);
            event.preventDefault();
        }

        if ( event.originalEvent.touches.length === 2)
        {
            event.preventDefault();
            // Call Drop Bomb
            _this.controlledFigure.dropBomb();
        }
    };

    this.mouseMove = function (event)
    {

        if (_this.isMouseStart && event.button === 0)
        {
            event.preventDefault();
            var deltaX =  event.pageX - _this.mouseStartX;
            var deltaY =  event.pageY - _this.mouseStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY))
            {
                // horizontale Bewegung
                if (deltaX > _this.touchSchwellwert)
                {
                    _this.controlledFigure.startWalkingRight();
                }

                if (deltaX < -_this.touchSchwellwert)
                {
                    _this.controlledFigure.startWalkingLeft();
                }
            }
            else
            {
                // vertikale Bewegung
                if (deltaY > _this.touchSchwellwert)
                {
                    _this.controlledFigure.startWalkingDown();
                }

                if (deltaY < -_this.touchSchwellwert)
                {
                    _this.controlledFigure.startWalkingUp();
                }
            }


        }

    };

 this.touchMove = function (event)
    {
       if (_this.isTouchStart && event.originalEvent.touches[0])
        {
            event.preventDefault();
            var deltaX = event.originalEvent.touches[0].pageX - _this.touchStartX;
            var deltaY = event.originalEvent.touches[0].pageY - _this.touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY))
            {
                // horizontale Bewegung
                if (deltaX > _this.touchSchwellwert)
                {
                    _this.controlledFigure.startWalkingRight();
                }

                if (deltaX < -_this.touchSchwellwert)
                {
                    _this.controlledFigure.startWalkingLeft();
                }
            }
            else
            {
                // vertikale Bewegung
                if (deltaY > _this.touchSchwellwert)
                {
                    _this.controlledFigure.startWalkingDown();
                }

                if (deltaY < -_this.touchSchwellwert)
                {
                    _this.controlledFigure.startWalkingUp();
                }
            }


        }

    };

    this.mouseEnd = function (event)
    {
        if (event.button === 0)
        {
            _this.isMouseStart = false;
            _this.controlledFigure.stopWalking();
        }

    };

    this.touchEnd = function (event)
    {
        if (event.originalEvent.touches.length === 0)
        {
            _this.isTouchStart = false;
            _this.controlledFigure.stopWalking();
        }
    }

}

