'use strict';

var gestures =
{
    playerId: '',

    touchSchwellwert: 1,
    lunteObj: '',
    isTouchStart: false,
    touchStartX:false,
    touchStartY:false,
    isMouseStart: false,
    mouseStartX:false,
    mouseStartY:false,



    init: function ()
    {
        gestures.setObj();
        gestures.addHandler();
    },

    setObj: function ()
    {
        this.lunteObj = $('#lunte-canvas');
    },

    setPlayerId: function (id)
    {
      this.playerId = id;
    },

    addHandler: function ()
    {
        // Touchgesten
        // Bewegungen durch Touchgesten können nur innerhalb des Canvas initiiert werden
        $(gestures.lunteObj).on('mousedown', gestures.mouseStart );
        $(gestures.lunteObj).on('touchstart', gestures.touchStart );

        // Aber um die Gesten auszuführen und zu beenden steht die gesamte Seite zur Verfügung
        $('html')
            .on('mousemove', gestures.mouseMove )
            .on('touchmove', gestures.touchMove )
            .on('mouseup', gestures.mouseEnd )
            .on('touchend touchcancel', gestures.touchEnd );

        document.oncontextmenu = function() { tools.log('contextmenu called. dropBomb!'); return false;};

    },

    mouseStart: function (event)
    {
        if (event.button === 0 )
        {
            gestures.isMouseStart = true;

            gestures.mouseStartX = (event.pageX );
            gestures.mouseStartY = (event.pageY );
            event.preventDefault();
        }

        if (event.button === 2)
        {
            // Call Drop Bomb
            tools.log('drop Bomb!');
        }
    },

    touchStart: function (event)
    {
        if ( event.originalEvent.touches.length === 1)
        {
            gestures.isTouchStart = true;

            gestures.touchStartX = (event.originalEvent.touches[0].pageX);
            gestures.touchStartY = (event.originalEvent.touches[0].pageY);
            event.preventDefault();
        }

        if ( event.originalEvent.touches.length === 2)
        {
            event.preventDefault();
            // Call Drop Bomb
            tools.log('"drop Bomb!');
        }
    },

    mouseMove: function (event)
    {

        if (gestures.isMouseStart && event.button === 0)
        {
            event.preventDefault();
            var deltaX =  event.pageX - gestures.mouseStartX;
            var deltaY =  event.pageY - gestures.mouseStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY))
            {
                // horizontale Bewegung
                if (deltaX > gestures.touchSchwellwert)
                {
                    figureMove('RIGHT');
                }

                if (deltaX < -gestures.touchSchwellwert)
                {
                    figureMove('LEFT');
                }
            }
            else
            {
                // vertikale Bewegung
                if (deltaY > gestures.touchSchwellwert)
                {
                    figureMove('DOWN');
                }

                if (deltaY < -gestures.touchSchwellwert)
                {
                    figureMove('"UP');
                }
            }


        }

    },

 touchMove: function (event)
    {
       if (gestures.isTouchStart && event.originalEvent.touches[0])
        {
            event.preventDefault();
            var deltaX = event.originalEvent.touches[0].pageX - gestures.touchStartX;
            var deltaY = event.originalEvent.touches[0].pageY - gestures.touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY))
            {
                // horizontale Bewegung
                if (deltaX > gestures.touchSchwellwert)
                {
                    figureMove('RIGHT');
                }

                if (deltaX < -gestures.touchSchwellwert)
                {
                    figureMove('LEFT');
                }
            }
            else
            {
                // vertikale Bewegung
                if (deltaY > gestures.touchSchwellwert)
                {
                    figureMove('DOWN');
                }

                if (deltaY < -gestures.touchSchwellwert)
                {
                    figureMove('UP');
                }
            }


        }

    },

    mouseEnd: function (event)
    {
        if (event.button === 0)
        {
            gestures.isMouseStart = false;
            figureStop();
        }

    },

    touchEnd: function (event)
    {
        if (event.originalEvent.touches.length === 0)
        {
            gestures.isTouchStart = false;
            figureStop();
        }
    }

};

