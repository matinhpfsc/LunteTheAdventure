var io =
{
    saveMazeToDisk: function (maze)
    {
        try
        {
          localStorage.setItem("maze",maze.toString());
        }
        catch(e)
        {}

    },

    loadMazeFromDisk: function ()
    {
        var ret = false;
        try
        {
          ret = localStorage.getItem("maze");
        }
        catch(e)
        {}

        return ret;

    }

}