<?php

function uptodate($path)
{
    return is_file($path) ? $path . '?' . filemtime($path) : $path;
}

/*

live chart has been written to visualize parts and phases of a/your life.
it helps to bring feelings and beleeves about your life in sync with reality.
the same time it is a nice way to store information.
you can create sections with time entries in any order or size. 
take a look at my life to get a picture. 

non of your data will be send to our servers nor others ever. 
all your data will be stored in one cookie oly in your browser.
you can choose to download your data as file for later use on this site or to use it in other browsers on diferent devices.





 */

?><!DOCTYPE html>
<html lang="de">
  <head>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <meta charset="utf-8" />
    <meta name="robots" content="index,follow" />

    <title>a life chart</title>
    <meta name="description" content="take a look at your beautyfull life">

    <link rel="stylesheet" href="<?php echo uptodate('assets/style.css');?>">
    <link rel="stylesheet" href="<?php echo uptodate('assets/fonts/icons.css');?>">
    <link rel="stylesheet" href="<?php echo uptodate('assets/timepicker/timepicker.css');?>">
    <style id="styles2"></style>
    <style id="styles"></style>

    <!-- Prefetch DNS for external assets -->
    <!-- <link rel="dns-prefetch" href="//ajax.googleapis.com">
    <link rel="dns-prefetch" href="//cdn.jsdelivr.net">-->
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">

    <!-- 
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.21.0/moment.min.js"></script>
    
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" integrity="sha512-aVKKRRi/Q/YV+4mjoKBsE4x3H+BkegoM/em46NNlCqNTmUYADjBbeNefNxYV7giUp0VxICtqdrbqU7iVaeZNXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.0/js.cookie.min.js" integrity="sha512-7saYNuZ1Wama9mcySxAYgnayYvbAEyelZ2kRhb7SJJ9phI05kSl+D1JVnrM/elzOwPQPAI/2t0vmsuphg/sEfA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js" integrity="sha512-CryKbMe7sjSCDPl18jtJI5DR5jtkUWxPXWaLCst6QjH8wxDexfRJic2WRmRXmstr2Y8SxDDWuBO6CQC6IE4KTA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.0/js.cookie.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>


    <script src="<?php echo uptodate('assets/timepicker/timepicker.js');?>"></script>
    <script src="<?php echo uptodate('assets/defaults.js');?>"></script>
    <script src="<?php echo uptodate('assets/filesaver/FileSaver.js');?>"></script>
    <script src="<?php echo uptodate('assets/life-backup.js');?>"></script>

  </head>
  <body>

    <div class="app-menu">
      <div class="wrapper">
        <div class="close icon icons-cross-mark"></div>
        <div class="row">
          <div class="column">
            <h2>Titel</h2><span class="info">Um wen oder was gehts es?</span>
            <input type="text" name="main-title" placeholder="Name" maxlength="50">
          </div>
          <div class="column">
            <h2>Zeitraum</h2><span class="info">z.B. Geburtstag - Todestag</span> 
            <div class="date date-range empty" name="main-range">Datum - Datum</div>
          </div>
        </div>
        <div class="inner"></div>
        <div class="button button-add addgroup icon icons-cross-mark">Neue Gruppe</div><br>
        <div class="button button-save">Speichern</div>
        <div class="cookie_expiration"></div>
      </div>
    </div>

    <div class="body" unit="months" mode="compare">

      <div class="header">
      <h1 class="main-title"></h1>
          <div class="switches">
                <!--<label>Tage <input type="radio" name="unit" value="days"></label>-->

                <div class="item">
                  <span onclick="saveAsFile();">Download</span> | <div class="inputWrapper">Öffnen<input class="fileInput" type="file"/></div>
                </div>

                <div class="item">
                <div class="label">Einheit</div>
                <ul class="radio-switch">
                  <li>
                    <input name="unit" value="weeks" type="radio" id="radio1" name="radioSwitch" checked>
                    <label for="radio1">Wochen</label>
                  </li>
                  <li>
                    <input name="unit" value="months" type="radio" id="radio2" name="radioSwitch">
                    <label for="radio2">Monate</label>
                    <div class="radio-switch__marker" aria-hidden="true"></div>
                  </li>
                </ul>
                </div>

                <div class="item">
                <div class="label">Ansicht</div>
                <ul class="radio-switch">
                  <li>
                    <input name="mode" value="compare" type="radio" id="radio4" name="radioSwitch" checked>
                    <label for="radio4">Vergleich</label>
                  </li>
                  <li>
                    <input name="mode" value="time" type="radio" id="radio3" name="radioSwitch" >
                    <label for="radio3">Zeit</label>
                    <div class="radio-switch__marker" aria-hidden="true"></div>
                  </li>
                </ul>
               </div>

               
                
                <div class="item open">
                  <div class="label">&nbsp;</div>
                  <div class="menu icon icons-gear"></div>
                </div>
              </div>

              

      </div>

      <div class="scroll" >

        <table class="table">
          <tr>
            <td></td>
            <td class="xaxis"></td>
            <td><div class="padding-right"></div></td>
          </tr>
          <tr>
            <td class="yaxis"></td>
            <td><div id="content"></div></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td class="sections"></td>
            <td></td>
          </tr>
        </table>
        </div>
    </div>

  </body>
</html>