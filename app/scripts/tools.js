'use strict';

var tools=
{
  init: function ()
  {
    this.activateOSD();
  },

  log: function(msg, type)
  {
    // nicht jeder Browser verfügt über das console Objekt. Der IE<9 würde einen Scriptfehler liefern.
      if (settings.debug.active && settings.debug.loggingConsole && type != 'error')
      {
          try
          {
             console.log(msg);
          }
          catch(e)
          {}
      }

      if (settings.debug.active && settings.debug.loggingOSD)
      {
          var classes ='';

          switch (type)
          {
              case 'error': classes = 'error'; break;
              case 'code': classes = 'code'; break;
          }

          $('#osd-content').prepend('<p class="'+classes+'">'+tools.zeit.jetzt()+' - '+JSON.stringify(JSON.decycle(msg))+'</p>');


      }
  },


  clone: function(obj)
  {
  // From http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object

          // Handle the 3 simple types, and null or undefined
          if (null == obj || 'object' != typeof obj) return obj;

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

          throw new Error('Unable to copy obj! Its type isn\'t supported.');

    },

    activateOSD: function ()
    {
        if ($('#osd').length === 0)
        {
            var osdString = '<div id="osd">';
            osdString = osdString + '<div id="osd-content-wrapper">';
            osdString = osdString + '<div id="osd-content"></div></div>';
            osdString = osdString + '<div id="osd-input">';
            osdString = osdString + '<form><input name="osd-input-field" type="text"><button>eval</button></form>';
            osdString = osdString + '</div>';

            $('body').append(osdString);
            $(window).on('error',function (a) {tools.log(a,'error'); });
            $("#osd-input button").on('click', function ()
                {
                     var msg = $('#osd-input input').val();
                    $('#osd-input input').val('');
                    tools.log(msg,'code');
                    tools.log(eval(msg));

                });

            $('#osd-input form').on('submit',function (e){e.preventDefault();});

        }
    },


    zeit: {
        startZeit:null,

        start: function ()
        {
            this.startZeit= $.now();
        },
        stop: function ()
        {
            var ret;
            if ( this.startZeit == null ) { ret='zeit.start() fehlt'; }
            else { ret = ($.now() - this.startZeit)+'ms';}

            return ret;
        },
        ping: function(msg)
        {
            if (this.startZeit == null)
            {
                this.start();
                tools.log('zeit.ping start bei msg:'+msg);
            }
            else
            {
                tools.log('zeit.ping '+($.now() - this.startZeit)+'ms bei msg:'+msg);
                this.start();
            }
        },

        jetzt: function()
        {
            return this.timestampToDate($.now())
        },

        timestampToDate: function (JS_timestamp)
        {
            //var a = new Date(UNIX_timestamp*1000);
            var a = new Date(JS_timestamp);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            //var month = months[a.getMonth()];
            var month = a.getMonth();
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();

            // Korrektur weil wir nicht mit Monat 0 anfangen
            month = parseInt(month)+1;
            if (month < 10) { month = "0"+month;}
            //var time = date+','+month+' '+year+' '+hour+':'+min+':'+sec ;
            // hier könnte man noch die Sprache abfragen und so sprachspezifische Ausgabeformate zurück geben
            var time = year+'.'+month+'.'+date+'T'+hour+':'+min+":"+sec;
            return time;
        }
    }



}