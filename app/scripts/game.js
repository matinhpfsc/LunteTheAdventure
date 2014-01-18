var game =
{
    player: [],

    init: function ()
    {
        maze.CreateLabyrinth();
        this.player = [];

        // Starting a game with 1 human with avatar 1 and 1 bot with avatar 2
        for (var i=1; i<= settings.human; i++)
            {
                this.addFigure("human",1);
            }

        for (var i=1; i<= settings.bots; i++)
        {
            this.addFigure("bot",2);
        }

        this.play();

    },

    addFigure: function(type, avatarId)
    {
        var newFigure = tools.clone(figure);
        newFigure.init(this.player.length,type,avatarId);
        this.player.push(newFigure);
    },

    removeBot: function ()
    {
        // Bots werden nicht gelöscht sondern nur in den Ruhestand versetzt. Sonst kommen die IDs durcheinander.
        var index = this.player.length -1;
        var removed = false;

        while (index >= 0 && removed == false)
        {
            //tools.log("index: "+index+" this.player[index]:"+game.player[index]);
            if (this.player[index].controler == "bot" && this.player[index].live > 0)
            {
                this.player[index].live = 0;
                removed = true;
            }
            else
            {
                index -=1;
            }
        }
    },

    play: function ()
    {
        for (var i= 0; i == this.player.length; i++)
        {
            if (this.player[i].controler == "bot" && this.player[i].live > 0)
            {
                this.player[i].tick();
            }

        }
    }


}