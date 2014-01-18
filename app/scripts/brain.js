var brain =
{
    playerId:"",

    setPlayerId: function (id)
    {
        this.playerId = id;
    },

    changeDirection: function (direction)
    {
        game.player[this.playerId].direction = direction;
    },

    stop: function ()
    {
        game.player[this.playerId].stop();
    },

    walk: function ()
    {
        game.player[this.playerId].walk();
    }


}