'use strict';
/* global console */

// abhängig von: jQuery
//
//
// $().jshow().jhide() benötigen im css .hidden { display: none !important; }. Wenn es allerdings so eingebunden wird
// hat das den Vorteil gegenüber dem originalen show, dass der ursprüngliche display-Zustand wiederhergestellt wird
// während $().show display: block setzt.

var tools = {
    log: function(msg) {
        // nicht jeder Browser verfügt über das console Objekt. Der IE<9 würde einen Scriptfehler liefern.
        try {
            console.log(msg);
        } catch (e) {}

    }
};
