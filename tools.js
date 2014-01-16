// abhängig von: jQuery
//
//
// $().jshow().jhide() benötigen im css .hidden { display: none !important; }. Wenn es allerdings so eingebunden wird
// hat das den Vorteil gegenüber dem originalen show, dass der ursprüngliche display-Zustand wiederhergestellt wird
// während $().show display: block setzt.

var tools=
{	
  log: function(msg)
  {

      // nicht jeder Browser verfügt über das console Objekt. Der IE<9 würde einen Scriptfehler liefern.
      try
      {
         console.log(msg);
      }
      catch(e)
      {}

  },

  clone: function(obj)
  {
  // From http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object

          // Handle the 3 simple types, and null or undefined
          if (null == obj || "object" != typeof obj) return obj;

          // Handle Date
          if (obj instanceof Date) {
              var copy = new Date();
              copy.setTime(obj.getTime());
              return copy;
          }

          // Handle Array
          if (obj instanceof Array) {
              var copy = [];
              for (var i = 0, len = obj.length; i < len; i++) {
                  copy[i] = tools.clone(obj[i]);
              }
              return copy;
          }

          // Handle Object
          if (obj instanceof Object) {
              var copy = {};
              for (var attr in obj) {
                  if (obj.hasOwnProperty(attr)) copy[attr] = tools.clone(obj[attr]);
              }
              return copy;
          }

          throw new Error("Unable to copy obj! Its type isn't supported.");

    }
}