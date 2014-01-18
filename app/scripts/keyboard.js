var keyboard =
{
    playerId: "",

    setPlayerId: function (id)
    {
        this.playerId = id;
    },

    OnKeyDown: function(event)
    {
        direction = false;

        switch(event.keyCode)
        {
            case 40: direction = DOWN; break;
            case 38: direction = UP; break;
            case 39: direction = RIGHT; break;
            case 37: direction = LEFT; break;
        }

        if (direction)
        {
            event.preventDefault();
            playerMove(direction);

        }
    },

    OnKeyUp: function()
    {
        playerStop();
    }


}