var settings =
{
    human: 1,
    bots: 2,
    mazeSize: 24,

    init: function ()
    {
        this.addHandler();
    },

    addHandler: function()
    {
        $("#settings .bots .add").on("click", settings.addBot);
        $("#settings .bots .remove").on("click", settings.removeBot);

    },

    addBot: function()
    {
        settings.bots += 1;
        $("#settings .bots .value").html(settings.bots);
        game.addFigure("bot",3)

        $("#settings .bots .remove").addClass("active");
    },

    removeBot: function()
    {
        if (settings.bots > 0)
        {
        settings.bots -= 1;
        $("#settings .bots .value").html(settings.bots);
        game.removeBot();

            if (settings.bots == 0)
            {
                $("#settings .bots .remove").removeClass("active");
            }
        }
    }
}