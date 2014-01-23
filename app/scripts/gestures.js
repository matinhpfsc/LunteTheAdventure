'use strict';

var gestures =
{
    playerId: "",

    touchSchwellwert: 1,
    lunteObj: "",
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
        this.lunteObj = $("#lunte-canvas");
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
        $("html")
            .on('mousemove', gestures.mouseMove )
            .on('touchmove', gestures.touchMove )
            .on('mouseup', gestures.mouseEnd )
            .on('touchend touchcancel', gestures.touchEnd );

        document.oncontextmenu = function(event) { tools.log("contextmenu called. dropBomb!"); return false;};

    },

    mouseStart: function (event)
    {
        tools.log("mouseStart");
        //tools.log(event);

        if (event.button == 0 )
        {
            gestures.isMouseStart = true;

            // Bei Es wird der Wert von pageX verwendet. Bei Tablets gibt es den aber nicht.
            // Dort werte ich den pageX des ersten Fingers aus.
            gestures.mouseStartX = (event.pageX );
            gestures.mouseStartY = (event.pageY );
            event.preventDefault();
        }

        if (event.button == 2)
        {
            // Call Drop Bomb
            tools.log("drop Bomb!");
        }
    },

    touchStart: function (event)
    {
       //tools.log("touchStart touch:"+event.originalEvent.touches.length);
       //tools.log(event);

        if ( event.originalEvent.touches.length == 1)
        {
            gestures.isTouchStart = true;

            // Bei Es wird der Wert von pageX verwendet. Bei Tablets gibt es den aber nicht.
            // Dort werte ich den pageX des ersten Fingers aus.
            gestures.touchStartX = (event.originalEvent.touches[0].pageX);
            gestures.touchStartY = (event.originalEvent.touches[0].pageY);
            event.preventDefault();
        }

        if ( event.originalEvent.touches.length == 2)
        {
            // Call Drop Bomb
            event.preventDefault();
            tools.log("drop Bomb!");
        }
    },

    mouseMove: function (event)
    {

        if (gestures.isMouseStart && event.button == 0)
        {
            event.preventDefault();
            var deltaX =  event.pageX - gestures.mouseStartX;
            var deltaY =  event.pageY - gestures.mouseStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY))
            {
                // horizontale Bewegung
                if (deltaX > gestures.touchSchwellwert)
                {
                    //tools.log ("Gesture nach rechts "+deltaX+":"+deltaY);
                    figureMove("RIGHT");
                }

                if (deltaX < -gestures.touchSchwellwert)
                {
                    //tools.log ("Gesture nach links "+deltaX+":"+deltaY);
                    figureMove("LEFT");
                }
            }
            else
            {
                // vertikale Bewegung
                if (deltaY > gestures.touchSchwellwert)
                {
                    //tools.log ("Gesture nach unten "+deltaX+":"+deltaY);
                    figureMove("DOWN");
                }

                if (deltaY < -gestures.touchSchwellwert)
                {
                    //tools.log ("Gesture nach oben "+deltaX+":"+deltaY);
                    figureMove("UP");
                    //gestures.isTouchStart = false;
                }
            }


        }

    },

 touchMove: function (event)
    {
       // log("touchMove touches:"+event.touches.length);

        if (gestures.isTouchStart && event.originalEvent.touches[0])
        {
            event.preventDefault();
            var deltaX = event.originalEvent.touches[0].pageX - gestures.touchStartX;
            var deltaY = event.originalEvent.touches[0].pageY - gestures.touchStartY;
            //tools.log("touchmove mit touches [0] deltaX:"+ deltaX+" deltaY:"+deltaY);

            if (Math.abs(deltaX) > Math.abs(deltaY))
            {
                // horizontale Bewegung
                if (deltaX > gestures.touchSchwellwert)
                {
              //      tools.log ("Gesture nach rechts "+deltaX+":"+deltaY);
                    figureMove("RIGHT");
                   // gestures.isTouchStart = false;
                }

                if (deltaX < -gestures.touchSchwellwert)
                {
                //    tools.log ("Gesture nach links "+deltaX+":"+deltaY);
                    figureMove("LEFT");
                    //gestures.isTouchStart = false;
                }
            }
            else
            {
                // vertikale Bewegung
                if (deltaY > gestures.touchSchwellwert)
                {
                  //  tools.log ("Gesture nach unten "+deltaX+":"+deltaY);
                    //gestures.isTouchStart = false;
                    figureMove("DOWN");
                }

                if (deltaY < -gestures.touchSchwellwert)
                {
                  //  tools.log ("Gesture nach oben "+deltaX+":"+deltaY);
                    figureMove("UP");
                    //gestures.isTouchStart = false;
                }
            }


        }

    },

    mouseEnd: function (event)
    {
        tools.log("mouseEnd");
       // tools.log(event);
        if (event.button == 0)
        {
            gestures.isMouseStart = false;
            figureStop();
        }

    },

    touchEnd: function (event)
    {
        //tools.log("touchEnd touches:"+event.originalEvent.touches);
        if (event.originalEvent.touches.length == 0)
        {
            tools.log("now 0 touches")
            gestures.isTouchStart = false;
            figureStop();
            //tools.log("touchEnd Player Stopd");
        }

        if (event.originalEvent.touches.length == 1)
        {
            tools.log("now 1 touches");
        }
    }

}

