var figure =
{
    playerId: false,
    avatarId: false,
    live: 3,
    strength: 1,
    bombpower: 0,
    position: [1,1],
    maxSpeed: 4,
    speed: 0,
    direction: "DOWN",
    controler: "",

    init: function (id, controler, avatarId)
    {
        this.position = maze.getStartPoint();
        this.playerId = id;
        this.avatarId = avatarId;
        this.controler = controler;
        this.selectControler();

    },

    walk: function ()
    {
        this.speed = this.maxSpeed;
    },

    stop: function ()
    {
        this.speed = 0;
    },

    getHit: function (power)
    {
        this.live = this.live - power;
        if (this.live <= 0)
        {
            // Stirb
        }
    },

    selectControler: function()
    {
        if (this.controler = "human")
        {
            keyboard.setPlayerId(this.playerId);
            gestures.setPlayerId(this.playerId);
        }

        if (this.controler = "bot")
        {
            this.brain = tools.clone(brain);
            this.brain.setPlayerId(this.playerId);
        }

    }


}
