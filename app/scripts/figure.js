var figure =
{
    playerId: false,
    avatarId: false,
    team: 0,
    live: 3,
    strength: 1,
    bombpower: 0,
    //position: [1,1],
    location: {x:"",y:""},
    maxSpeed: 4,
    speed: 0,
    direction: "DOWN",
    controler: "",

    init: function (id, controler, avatarId, team)
    {
        this.position = maze.getStartPoint();
        this.playerId = id;
        this.avatarId = avatarId;
        this.controler = controler;

        if ( team == undefined)
        {
            if (controler == "human")
            {
                    this.team = 1;
            }
            if (controler == "bot")
            {
                this.team = 2;
            }
        }
        else
        {
            this.team = team;
        }

        this.selectControler();

    },

    tick: function ()
    {
        // Mit jedem Frame wird jede Figur gesetzt. Dazu ruft die Game.js die Ticks in allen Playern auf.

        // askBrain - oder informBrain am Ende ?

        // change direction, wenn in der Mitte des Feldes oder die Mitte während des Moves erreicht wird

        // move

        // hit

        // draw
    },
    walk: function ()
    {
        this.speed = this.maxSpeed;
    },

    stop: function ()
    {
        this.speed = 0;
    },

    areYouAtPosition: function (location)
    {
        if ((this.location.x == location.x) && (this.location.y == location.y))
        {
            return this.team;
        }
        else
        {
            return false;
        }

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
