var gestures = 
{
    playerId: "",
    isTouchStart: false,
    touchSchwellwert: 1,
    lunteObj: "",
    touchStartX:false,
    touchStartY:false,



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
        $(gestures.lunteObj).on('touchstart mousedown', gestures.touchStart );
        // Aber um die Gesten auszuführen und zu beenden steht die gesamte Seite zur Verfügung
        $("html")
            .on('touchmove mousemove', gestures.touchMove )
            .on('touchend mouseup', gestures.touchEnd );

    },

    touchStart: function (event)
    {
        gestures.isTouchStart = true;

        // Bei Es wird der Wert von pageX verwendet. Bei Tablets gibt es den aber nicht.
        // Dort werte ich den pageX des ersten Fingers aus.

        gestures.touchStartX = (event.pageX || event.originalEvent.touches[0].pageX);
        gestures.touchStartY = (event.pageY || event.originalEvent.touches[0].pageY);
        //tools.log(event);
        event.preventDefault();

    },

    touchMove: function (event)
    {
        //tools.log("touchMove"+event);

        if (gestures.isTouchStart)
        {
            event.preventDefault();
            var deltaX = (event.pageX || event.originalEvent.touches[0].pageX) - gestures.touchStartX;
            var deltaY = (event.pageY || event.originalEvent.touches[0].pageY)- gestures.touchStartY;


            if (Math.abs(deltaX) > Math.abs(deltaY))
            {
                // horizontale Bewegung
                if (deltaX > gestures.touchSchwellwert)
                {
                    tools.log ("Gesture nach rechts "+deltaX+":"+deltaY);
                    playerMove("RIGHT");
                   // gestures.isTouchStart = false;
                }

                if (deltaX < -gestures.touchSchwellwert)
                {
                    tools.log ("Gesture nach links "+deltaX+":"+deltaY);
                    playerMove("LEFT");
                   // gestures.isTouchStart = false;
                }
            }
            else
            {
                // vertikale Bewegung
                if (deltaY > gestures.touchSchwellwert)
                {
                    tools.log ("Gesture nach unten "+deltaX+":"+deltaY);
                    //gestures.isTouchStart = false;
                    playerMove("DOWN");
                }

                if (deltaY < -gestures.touchSchwellwert)
                {
                    tools.log ("Gesture nach oben "+deltaX+":"+deltaY);
                    playerMove("UP");
                    //gestures.isTouchStart = false;
                }
            }


        }

    },

    touchEnd: function (event)
    {
      //  tools.log("touchEnd");
        gestures.isTouchStart = false;
        playerStop();

    }


}