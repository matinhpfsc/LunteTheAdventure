var game =
{
    player: [],

    init: function ()
    {
        // Starting a game with 1 human with avatar 1 and 1 bot with avatar 2
        this.addFigure("human",1);
        this.addFigure("bot",2);
        this.play;

    },

    addFigure: function(type, avatarId)
    {
        var newFigure = tools.clone(figure);
        newFigure.init(this.player.length,type,avatarId);
        this.player.push(newFigure);
    },

    play: function ()
    {
        for (var i= 0; i == this.player.length; i++)
        {
            if (this.player[i].controler == "bot")
            {
                this.player[i].brain.walk();
            }

        }
    }


}