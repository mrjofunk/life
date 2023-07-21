/*
todo --------------------------------------
datum eingabe auch manuell
tab key navigation  

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

var tttt = '';
colors.forEach((hex,index) => {
  var d = hexToRgb('#'+hex);
  tttt += '--life-'+index+'-rgb:'+d.r+','+d.g+','+d.b+';\r\n';
});
console.log(tttt);
*/

function twoDecimals(n) {
  var log10 = n ? Math.floor(Math.log10(n)) : 0,
    div = log10 < 0 ? Math.pow(1, 1 - log10) : 10;
  return Math.round(n * div) / div;
}

var max_age = 80;
var picker = new dw_time_picker();
var data = false;

// One day Time in ms (milliseconds)
var one_day = 1000 * 60 * 60 * 24;
var first_day_on_screen = false;

var days_per_year = 365;
var weeks_per_year = 52;
var months_per_year = 12;

var unit_birth = 0;
var unit_today = 0;
var unit_per_year = 0;
var unit_past = 0;
var unit_multi = 5; // einheit anzeige bei vielfachem von x
var unit = "months";
var total_days = 0;
var cookie_expiration_years = 5;
var dot_width = 0;
var dots = [];

var current_dot = false;

var main_from_date;
var main_to_date;

function day_of_year(d) {
  return Math.floor((d - new Date(d.getFullYear(), 0, 1)) / one_day);
}

function weeks(a, b) {
  // kalender woche von a
  if (b == undefined) return Math.min(Math.floor(day_of_year(a) / 7), 51);
  // wochen differenz zwischen a und b
  return weeks(a) + ((a.getFullYear() - b.getFullYear()) * 52);
}

function months(b, a) {
  var months;
  months = (b.getFullYear() - a.getFullYear()) * 12;
  months -= a.getMonth();
  months += b.getMonth();
  return months <= 0 ? 0 : months;
}

function build_content(data, u) {
  console.log('build_content');
  unit = u || unit;

  var content = document.createDocumentFragment();
  var xaxis = document.createDocumentFragment();
  var yaxis = document.createDocumentFragment();

  main_from_date  = saveBool(data.from) ? new Date(data.from) : new Date('1970,1,1'); 
  main_to_date    = saveBool(data.to) ? new Date(data.to) : new Date(new Date(main_from_date).setFullYear(main_from_date.getFullYear() + max_age));
  console.log(main_from_date);
  console.log(main_to_date);

  
  var today       = new Date();
  var years_past  = Math.abs(new Date(today - main_from_date).getFullYear() - 1970);
  total_days      = (today - main_from_date) / one_day; 

  var age = max_age - 1;
  if (saveBool(data.to)){
    age = Math.abs(new Date(main_from_date - new Date(data.to)).getFullYear() - 1970) - 1;
  }

  // default
  unit_birth = 0;
  unit_today = 0;
  unit_per_year = 0;
  unit_past = 0;
  unit_multi = 5; // einheit anzeige bei vielfachem von x
  dots = [];

  var cy = main_from_date.getFullYear();
  first_day_on_screen = new Date(main_from_date.getFullYear(), 00, 01);
  current_dot = false;

  if (unit == "weeks") {
    unit_per_year = weeks_per_year;
    unit_today = weeks(today);
    unit_birth = weeks(main_from_date);
  } else if (unit == "months") {
    unit_per_year = months_per_year;
    unit_today = today.getMonth() + 1;
    unit_birth = main_from_date.getMonth() + 1;
    unit_multi = 2;
  } else if (unit == "days") {
    unit_per_year = days_per_year;
    unit_today = today.getDate();
    unit_birth = main_from_date.getDate();
  }

  $(".body").attr("unit", unit);
  $('[type="radio"][name="unit"][value="' + unit + '"]').prop("checked", true);

  for (var y = 0; y <= age; y++) {

    // xaxis
    var wrap = document.createElement("div");
    var div = document.createElement("div");
    if ((y % 2) / 100 === 0) {
      var span = document.createElement("span");
      span.className = "year";
      span.innerHTML = cy;
      div.appendChild(span);

      span = document.createElement("span");
      span.className = "age";
      span.innerHTML = y;
      div.appendChild(span);
    }
    wrap.appendChild(div);
    xaxis.appendChild(wrap);
    cy++;

    // content
    var dot;
    for (var w = 1; w <= unit_per_year; w++) {
      dot = document.createElement("div");
      dot.title = dots.length + ' kw ' + w;
      if (
        !(y == 0 && w < unit_birth) &&
        (y < years_past || (years_past == y && w < unit_today))
      ) {
        dot.className = "past";
        unit_past++;

        // mark current
      } else if (unit_past > 0 && years_past == y && w == unit_today) {
        dot.className = "current";
        current_dot = $(dot);
      }
      content.appendChild(dot);
      dots.push(dot);
    }
  }

  $(".table #content").empty().get(0).appendChild(content);
  $(".table .xaxis").empty().get(0).appendChild(xaxis);
  if(!current_dot) current_dot = $(dot); // hack, take last dot for all tos outside the map

  // yaxis
  for (var w = 1; w <= unit_per_year; w++) {
    var div = document.createElement("div");
    if ((w % unit_multi) / 100 === 0) div.innerHTML = w;
    yaxis.appendChild(div);
  }
  $(".table .yaxis").empty().get(0).appendChild(yaxis);

  // mesure the first dot one
  dot_width = $(".table #content > div:first-child").width() + 2;
  //console.log(dot_width);

  headerHeight();
  totalWidth();
}

function getTimesFromData(data) {
  console.log('times' in data, data);
  if ('times' in data) return data.times;
  console.log('rows' in data);
  if ('rows' in data) return getTimesFromData(data.rows);
  return false;
}

function headerHeight() {
  $('.scroll').css('padding-top', $('.header').outerHeight() + 'px');
}
function totalWidth() {
  $('.body').css('--total-width',$('.table').outerWidth() + 'px');
}

var isMobile = false;
$(window).resize(function () {
  headerHeight();
  totalWidth();

  // rebuild on resize
  if(document.body.clientWidth <= 500 && !isMobile){
    isMobile = true;
    generateSections(data);
  }else if(document.body.clientWidth > 500 && isMobile){
    isMobile = false;
    generateSections(data);
  }

  //$('.scroll').toggleClass('full-width',document.body.clientWidth > $('.table').outerWidth());
});

function totalDays(arr){
  var t = [];

  // prepair
  arr.every(test => {
    t.every((item, index) => {

      // test is bigger, invalidate it
      if (test.from <= item.from && test.to >= item.to) t.splice(index, 1);

      // item is bigger, invalidate it
      if (test.from >= item.from && test.to <= item.to) {
        test = false;
        return false;
      }
      if (test.from > item.from && test.from < item.to) test.from = item.to; // from anpassen
      if (test.from < item.from && test.to < item.to) test.to = item.from; // to anpassen
      return true;
    });

    // add only if stil valid
    if (test) t.push(test);
    return true;
  });
  
  // end calculation
  var days = 0;
  t.forEach(item => {
    days += Math.round((item.to - item.from) / one_day);
  });
  return days;
}

function isString(myVar){
  return typeof myVar === 'string' || myVar instanceof String;
}

function firstDate(arr){
  var t;
  arr.every(date => {
    if(saveBool(date.from) === false){ // false wins
      t = false;
      return true;
    }
    var date = new Date(date.from);
    //if(date < new Date(data.from)) date = new Date(data.from);
    if(t == undefined || (date !== false && t !== false && date < t) || date === false) t = date;
    return true;
  });
  return t;
}

function lastDate(arr){
  var t;
  arr.every(date => {
    if(saveBool(date.to) === false){ // false wins
      t = false;
      return true;
    }
    var date = new Date(date.to);
    //if(date > new Date(data.to)) date = new Date(data.to);
    if(t == undefined || (date !== false && t !== false && date > t) || date === false) t = date;
    return true;
  });
  return t;
}

function generateSections(data) {
  //console.log('generateSections', data);
  var sections = document.createDocumentFragment();

  $('.main-title').html(data.title);

  var color_count = 0;
  var styles = $("#styles2").empty();
  var style = "";

  //console.log($("#content > div").eq(52));

  // groups
  data.groups.forEach((group, d) => {

    var group_el = document.createElement("div");
    group_el.className = 'group';
    sections.appendChild(group_el);

    var h2 = document.createElement("h2");
    h2.innerHTML = group.title;
    group_el.appendChild(h2);

    var group_total = [];

    // abscnitte
    group.rows.forEach((abschnitt, o) => {

      var abs = document.createElement("div");
      abs.className = "abschnitt";

      // hover 
      $(abs)
        .on("mouseover", function () {
          highlite($(this));
        })
        .on("mouseout", function () {
          highlite();
        });

      var block;
      var from;
      var to;
      var color = 'rgb(var(--life-' + color_count + '-rgb))';
      var row_total = [];
      var most_recent;

      // parts 
      abschnitt.times.forEach(part => {

        // from
        var date_from = part.from ? new Date(part.from) : main_from_date;
        from = (date_from - first_day_on_screen) / one_day;
        if (unit == "weeks") {
          from = weeks(date_from, first_day_on_screen);
        } else if (unit == "months") {
          from = months(date_from, first_day_on_screen);
        }

        // to
        var date_to = part.to ? new Date(part.to) : new Date();
        to = (date_to - first_day_on_screen) / one_day;
        if (unit == "weeks") {
          to = weeks(date_to, first_day_on_screen);
        } else if (unit == "months") {
          to = months(date_to, first_day_on_screen);
        }

        // do not render parts outside the main range
        if(
          ((!saveBool(part.from) || date_from < main_from_date ) && date_to < main_from_date) ||
          ((!saveBool(part.to) || date_to > main_to_date ) && date_from > main_to_date)
        ){
          return;
        }

        block = document.createElement("div");
        block.className = "block";

        // check if from exists
        if (from > dots.length - 1) from = dots.length - 1;
        if (from < 0) from = 0;
        block.setAttribute("from", from);

        // check if to exists
        if (to > dots.length - 1) to = dots.length - 1;
        if (to < 0) to = 0;
        block.setAttribute("to", to);



        // position from
        var left = $(dots[from]).position().left;
        var width = $(dots[to]).position().left + dot_width - left;

        console.log($(dots[from]));


        // set style
        block.style = "background:" + color + "; margin-left:" + left + "px; width:" + width + "px;";
        abs.appendChild(block);
        //ttt +=10;

        // calculate --------------------------------------

        var dates = {
          from : date_from, 
          to   : date_to
        };  

        group_total.push(dates);
        row_total.push(dates);

        // find most recent to add the title to later 
        if(!most_recent || dates.to > most_recent.to){
          most_recent = {
            el: block,
            to: dates.to
          };
        }

        // color dots -------------------------------------

        style += "#content div:nth-child(n+" + (from + 1) + "):nth-child(-n+" + (to + 1) + "){ background-color:" + color + ";}" +
          "#content div:nth-child(n+" + (from + 1) + "):nth-child(-n+" + (to + 1) + "):not(.past){ background-color:" + color + "; }";
        //console.log(from, to);
      });

      // add only with children 
      if(abs.children.length) group_el.appendChild(abs);

      // compare mode: total width to the last block of each abschnitt
      // total days of the abschnitte
      var total_days_of_row = totalDays(row_total);
      var percent = Math.round((total_days_of_row / total_days) * 100);
      var width = (percent / 100) * current_dot.position().left + dot_width;
      style += '[mode="compare"] .group:nth-of-type(' + parseInt(d + 1) + ') .abschnitt:nth-of-type(' + parseInt(o + 1) + ') .block:last-child{ width:' + width + 'px!important; }';

      // color
      style += "#content div:nth-child(n+" + (from + 1) + "):nth-child(-n+" + (to + 1) + "){ background-color:" + color + ";}" +
        "#content div:nth-child(n+" + (from + 1) + "):nth-child(-n+" + (to + 1) + "):not(.past){ background-color:" + color + "; }";

      // title to last block
      var title = document.createElement("div");
      title.innerHTML = "<name>" + abschnitt.title + "</name>";

      // apply to the most recent
      if(most_recent) most_recent.el.appendChild(title);

      // info -------------------------------------------

      // dates
      var infoHTML = "<date>  " + picker.dateObjectsToHtmlValue([firstDate(row_total),lastDate(row_total)], "date") + "</date>";

      // years
      var years = twoDecimals(total_days_of_row / 365);
      infoHTML += "<time>, " + years + " " + (years == 1 ? "Jahr" : "Jahre");
      infoHTML += ", " + total_days_of_row + " " + (total_days_of_row == 1 ? "Tag" : "Tage") + "</time>";

      // %
      infoHTML += "<percent>, " + percent + "%</percent>";

      var info = document.createElement("span");
      info.className = "info";
      info.innerHTML = infoHTML;
      title.appendChild(info);

      // color the menu row
      style += ".app-menu .group:nth-child(" + (parseInt(d) + 1) + ") .row:nth-child(" + (parseInt(o) + 2) + ") {border-color:" + color + ";--timepicker-selected-rgb:var(--life-" + color_count + "-rgb);}";
      color_count++;
    });

    // total days of the group
    var total_days_of_group = totalDays(group_total);
    h2.innerHTML += " <span>" + Math.round((total_days_of_group / total_days) * 100) + "</span>";
  });

  $(".table .sections").empty().get(0).appendChild(sections);
  styles.html(style);

  headerHeight();
}

var clearStyleTO = false;
function highlite(el) {
  var styles = $("#styles");

  // 
  if (el && el.length) {
    el = el.find('.block');
    if (el.length) {

      if (clearStyleTO) {
        window.clearTimeout(clearStyleTO);
        clearStyleTO = false;
      }

      var abschnitt = el.closest('.abschnitt').find('.block');
      var color = el.css("background-color");
      //var alpa      = color.replace('rgb', 'rgba').replace(')', ', .5)');
      var style = ["#content div{background-color:var(--past-color)!important; transition:none;}"];

      // mark the blocks
      el.closest('.group').find('> div .block').each(function () {
        var from = parseInt($(this).attr("from"), 10) + 1;
        var to = parseInt($(this).attr("to"), 10) + 1;
        var css = "#content div:nth-child(n+" + from + "):nth-child(-n+" + to + ")";

        // hover element must be last set
        if (abschnitt.index($(this)) != -1) {
          style.push(css + "{background-color:" + color + " !important;}");
        } else {
          style.unshift(css + "{background-color:var(--past-over-section-color)!important;}");
        }
      });

      styles.html("@media screen{" + style.join('') + "}");
      return;
    }
  }

  clearStyleTO = window.setTimeout(function () {
    styles.empty();
    clearStyleTO = false;
  }, 100);
}

function attributeToDate(el, key) {
  return $(el).attr(key) == "false" ? false : new Date($(el).attr(key));
}

function generateDateRangesFromElement(element, reload) {
  console.log('generateDateRangesFromElement',element, reload);

  let el        = $(element);
  let column    = el.closest('.column');
  let row       = el.closest('.row');
  let calendar  = row.find('.calendar');
  let parts     = column.find('.data');

  // if calendar is already open, close it
  if (calendar.length) {
    calendar.remove();
    row.find('.button-done, .button-addpart').remove();
    if (!reload) return;
  }

  // done button 
  $('<div class="button button-done">Fertig</div>').insertAfter(column);

  // add range button if not main range 
  if(!el.attr('name')){
    $('<div class="button button-addpart icon icons-cross-mark">Neuer Abschnitt</div>').on('click',function(){
      column.append('<i class="data" from="false" to="false" hidden>');
    }).insertAfter(column);
  }
  
  // create calendars
  calendar = $('<div class="calendar"></div>');
  calendar.insertAfter(column);

  // get dates
  //var picker = [];
  var all    = [];
  parts.each(function () {

    var date = [
      attributeToDate($(this), "from"),
      attributeToDate($(this), "to")
    ];

    // visible dates
    all.push({
      from:date[0],
      to:date[1]
    });
   
    var part = $('<div class="part"/>')
    calendar.append(part);
    //console.log(dates);

    new dw_time_picker(
      part,
      false,
      date,
      "daterange",
      function (date) {
       //console.log(date);

        var index = $(this.timepicker).index();
        var parts = column.find('.data');
        var from  = date[0];
        var to    = date[1];
        reload    = false;

        // back
        /*
        for (var i = index - 1; i >= 0; i--) {
          //console.log('back',i);
          var f = attributeToDate(parts.eq(i), "from");
          var t = attributeToDate(parts.eq(i), "to");

          if (from == false) {
            parts.eq(i).remove();
            reload = true;

          // current from is over last to
          } else if (from < t) {
            reload = true;

            // but it's before last from, so valid
            if (from > f) {
              parts.eq(i).attr("to", from);

              // it's overlapping complete last part
            } else {
              parts.eq(i).remove();
            }
          }
        }

        // for
        for (i = index + 1; i < parts.length; i++) {
          //console.log('for',i);
          var f = attributeToDate(parts.eq(i), "from");
          var t = attributeToDate(parts.eq(i), "to");

          if (to == false) {
            parts.eq(i).remove();
            reload = true;

            // current to is over next from
          } else if (to > f) {
            reload = true;

            // but it's before next to, so valid
            if (to < t) {
              parts.eq(i).attr("from", to);

              // it's overlapping complete next part
            } else {
              parts.eq(i).remove();
            }
          }
        }
        */

        // if nothing changed 
        var current = parts.eq(index);
        if(
          current.attr("from") == this.dateObjectToAttribute(from) && 
          current.attr("to") == this.dateObjectToAttribute(to)
        ) return;

        // store data 
        current
          .attr("from", this.dateObjectToAttribute(from))
          .attr("to", this.dateObjectToAttribute(to));

        // visible dates
        var all = [];
        parts.each(function(){
          all.push({
            from : attributeToDate($(this), "from"),
            to : attributeToDate($(this), "to")
          });
        });
        var visible = [firstDate(all),lastDate(all)];
        //console.log(all,firstDate(all),lastDate(all));
  
        // insert visible dates
        el
          .html(this.dateObjectsToHtmlValue(visible, "date"))
          .toggleClass("empty", (!visible[0] && !visible[1]));

        // parts have changed, we need to reload
        if (reload) {
          generateDateRangesFromElement(element, reload);
          return;
        }

        // update data
        data = generateData();

        // if main range 
        if(el.attr('name')) build_content(data);

        // menu neu aufbauen, wenn sich ein eintrag ändert
        //if (el.attr('name') != 'main-range') generateMenuFromData(data);

        // content neu aufbauen wenn sich das hauptdatum ändert
        //if (el.attr('name') == 'main-range') build_content(data);

        // sectionen immer neu aufbauen
        generateSections(data);
      }
    ).show();
    
    // delete
    part.append(
      $('<div class="button button-delete">Abschnitt löschen</div>').on('click',function(){
        var row   = $(this).closest('.row');
        var parts = row.find('.data');
        if(parts.length > 1 && confirm(
          "Bist Du sicher dass Du diesen Abschnitt löschen möchtest?"
        )){

          var index = $(this).closest('.part').index(); // find index 
          row.find('.data').eq(index).remove(); // remove date element in index
          generateDateRangesFromElement(row.find('.date'),true);  

          data = generateData();
          generateSections(data);
        }
      })
    );
  });

  // insert visible dates
  var visible = [firstDate(all),lastDate(all)];
  el
  .html(picker.dateObjectsToHtmlValue(visible, "date"))
  .toggleClass("empty", (!visible[0] && !visible[1]));
}

$(document).ready(function () {

  $('[type="radio"][name="unit"]').on("change", function () {
    //console.log($(this).val());
    build_content(data, $(this).val());
    generateSections(data);
  });

  $('[type="radio"][name="mode"]').on("change", function () {
    var value = $(this).val();

    //console.log(value);
    // mode 
    //if(value == 'compare')

    $(".body").attr("mode", value);
  });

  $('[type="radio"][name="screen-mode"]').on("change", function () {
    var value = $(this).val();
    $("body").attr("screen-mode", value);
  });

  window.setTimeout(function () {

    var value = "time";
    $('[type="radio"][name="mode"][value="' + value + '"]').prop(
      "checked",
      true
    );
    $(".body").attr("mode", value);

  }, 50);

  $(document).on("change", ".app-menu input", function () {
    console.log($(this).val());

    // update view
    data = generateData();
    generateSections(data);

    headerHeight();
  });

  /*
  $('.app-menu').on('transitionend',function(){
    console.log('animationend');
  });*/

 
  


  $(document).on(
    "click",
    ".app-menu .buttons > div, .app-menu .button, .app-menu .date",
    function (e) {
      console.log('menu changed');

      // delete group
      if ($(this).hasClass("deletegroup")) {
        //console.log("deletegroup");
        if (
          confirm(
            "Sind sie sicher das Sie diese Gruppe löschen wollen?"
          )
        ) {
          $(this).closest(".group").remove();
        }
      }

      // delete row
      else if ($(this).hasClass("deleterow")) {
        //console.log("deleterow");
        if (
          confirm(
            "Sind sie sicher das Sie diesen Eintrag löschen wollen?"
          )
        ) {
          $(this).closest(".row").remove();
        }
      }

      // up
      else if ($(this).hasClass("up")) {
        //console.log("up");
        var group = $(this).closest(".group");
        group.prev().insertAfter(group);
      }

      // down
      else if ($(this).hasClass("down")) {
        //console.log("down");
        var group = $(this).closest(".group");
        group.next().insertBefore(group);
      }

      // addrow
      else if ($(this).hasClass("addrow")) {
        //console.log("addrow");
        $(newMenuRow()).insertBefore(
          $(this).closest(".group").find(".button-add")
        );
      }

      // addgroup
      else if ($(this).hasClass("addgroup")) {
        //console.log("addgroup");
        $(this).closest(".wrapper").find(".inner").append(newMenuGroup());
      }

      // date
      else if ($(this).hasClass("date")) {
        //console.log("date");
        generateDateRangesFromElement(this);
        return;
      }

      // save
      else if ($(this).hasClass("button-save")) {
        save();
        return;
      }

      // addpart
      else if ($(this).hasClass("button-addpart")) {
        generateDateRangesFromElement($(this).closest('.row').find('.date'), true);
        return;
      }

      // done
      else if ($(this).hasClass("button-done")) {
        generateDateRangesFromElement($(this).closest('.row').find('.date'));
        return;
      }

      // update view
      data = generateData();
      generateMenuFromData(data);
      generateSections(data);
    }
  );

  // read data from cookie
  getData();

  // build content
  build_content(data);
  generateSections(data);

  // generate menu
  generateMenuFromData(data);

  $('.fileInput').on("change", readFile);

  // toggle menu
  $(".menu, .app-menu .close").on("click", function () {

    // on close
    if ($("body").hasClass('show-app-menu')) {
      if (!saved) {
        if (confirm("Sollen die Änderungen gespeichert werden?")) {
          save();
        } else {

          // read data from cookie
          getData();
          build_content(data);
          generateSections(data);
        }
      }
    }

    // on open
    else if (!saved) {
      generateMenuFromData(data);
      saved = true;
    }
    $("body").toggleClass("show-app-menu");
  });
});

function firstFrom(times){
  var from = false;
  times.forEach(part => {
    var ifrom = part.from ? new Date(part.from) : main_from_date;
    if(from === false || ifrom < from){
      from = ifrom;
    }
  });
  return from;
}

function sortCronological(data) {
  if (data.groups != undefined) {
    for (var g in data.groups) {

      // sort times
      for (var t in data.groups[g].rows) {
        data.groups[g].rows[t].times.sort(function (a, b) {
          if (!a.to && b.to) return 1;
          if (a.to && !b.to) return -1;
          if (!a.to && !b.to) return 0;
          var keyA = new Date(a.to), keyB = new Date(b.to);
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
       });
      }

      // sort rows
      data.groups[g].rows.sort(function (a, b) {
        if (!a.times[0].from && b.times[0].from) return -1;
        if (a.times[0].from && !b.times[0].from) return 1;
        if (!a.times[0].from && !b.times[0].from) return 0;
        var keyA = firstFrom(a.times), keyB = firstFrom(b.times);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
    }
  }
  return data;
}

function getData() {
  console.log('getData');

  // try to get cookie data
  data = getCookie("life");
  data = false;

  // if no cookie is set, use default data 
  if (!data){

    // ajax calls ar synchronous
    $.ajaxSetup({
      async: false
    });

    // json defaults 
    $.getJSON("assets/defaults.json", function(json){
      data = json;
    }).fail(function(){
      console.log("An error has occurred.");
    });
  }

  // show cookie_expiration
  if (data.expiration) $('.cookie_expiration').html(new Date(data.expiration));

  // sort
  data = sortCronological(data)
  //console.log(data);
}

function save() {
  console.log('save');
  data = generateData();
  setCookie("life", data);
  saved = true;
}

function saveBool(v) {
  if (v == undefined) return false;
  if (typeof v == "string") {
    if (v == "true") return true;
    if (v == "false") return false;
  }
  return v;
}

var saved = true;

function generateData() {
  console.log('generateData');

  // create object & get main data
  var data = {
    title: $('.app-menu [name="main-title"]').val(),
    from: saveBool($('.app-menu .data.main-range').attr("from")),
    to: saveBool($('.app-menu .data.main-range').attr("to")),
    groups: [],
  };

  // loop groups
  $(".app-menu .group").each(function () {
    var group = $(this);

    // loop entries of group
    var entries = [];
    group.find(".entry").each(function () {
      var entry = $(this);
      var times = [];
      entry.find('.data').each(function () {
        times.push({
          from: saveBool($(this).attr("from")),
          to: saveBool($(this).attr("to"))
        });
      });
      entries.push({
        times: times,
        title: entry.find('[name="entry-title"]').val(),
        color: false,
      });
    });

    // add group
    data.groups.push({
      title: group.find('[name="group-title"]').val(),
      rows: entries,
    });
  });

  saved = false;
  return sortCronological(data);
}

/**
 * generates all the menu rows from the data beeing given
 * @param {object} data 
 */
function generateMenuFromData(data) {
  //console.log('generateMenuFromData');

  var inner = $('.app-menu .inner');

  // clear all 
  inner.empty();

  // set title & range
  $('.app-menu [name="main-title"]').val(data.title);
  $('.app-menu .data.main-range').attr("from", data.from).attr("to", data.to);
  $('.app-menu [name="main-range"]').html(
    picker.dateObjectsToHtmlValue([saveBool(data.from), saveBool(data.to)],"date")
  ).toggleClass("empty", (!data.from && !data.to));

  // set groups & abschnitte
  data.groups.forEach(group => {

    // add groups
    inner.get(0).appendChild(newMenuGroup(group.title));
    var el = $(".app-menu .wrapper .group").last();

    // add abschnitte
    group.rows.forEach(row => {
      $(newMenuRow(row)).insertBefore(el.find(".button-add"));
    });
  });
}

/**
 * generate abschnitt from data
 * @param {object} item 
 * @returns 
 */
function newMenuRow(row) {
  //console.log('newMenuRow', row);

  // new row
  if (row == undefined) row = {
    title: '',
    color: false,
    times: [{from: false, to: false}]
  };

  var container = document.createDocumentFragment();
  var entry = document.createElement("div");
  entry.className = "row entry";

  var column = document.createElement("div");
  column.className = "column";
  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", "entry-title");
  input.setAttribute("placeholder", "Unbenannter Eintrag");
  input.setAttribute("value", row.title);
  column.appendChild(input);
  entry.appendChild(column);

  // data elements
  var column = document.createElement("div");
  column.className = "column";

  // part data elements
  row.times.forEach((part, index) => {
    var range = document.createElement("i");
    range.className = 'data';
    range.setAttribute("from", part.from || "false");
    range.setAttribute("to", part.to || "false");
    range.setAttribute("hidden", "true");
    column.appendChild(range);
  });

  // insert visible dates
  var visible = [firstDate(row.times),lastDate(row.times)];
  var date = document.createElement("div");
  date.className = "date date-range " + (visible[0] || visible[1] ? "" : "empty");
  date.innerHTML = picker.dateObjectsToHtmlValue(visible,"date");
  column.appendChild(date);
  entry.appendChild(column);

  var buttons = document.createElement("div");
  buttons.className = "buttons";
  var button = document.createElement("div");
  button.className = "icon icons-cross-mark deleterow";
  buttons.appendChild(button);
  entry.appendChild(buttons);

  container.appendChild(entry);
  return container;
}

/**
 * genereate menu group element
 * @param {sting} title 
 * @returns HTML Element
 */
function newMenuGroup(title) {
  var container = document.createDocumentFragment();
  var group = document.createElement("div");
  group.className = "group";

  var row = document.createElement("div");
  row.className = "row";

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", "group-title");
  input.setAttribute("placeholder", "Unbenannte Gruppe");
  input.setAttribute("value", title || "");
  row.appendChild(input);

  group.appendChild(row);

  var buttons = document.createElement("div");
  buttons.className = "buttons";
  var button = document.createElement("div");
  button.className = "icon icons-chevron-up up";
  buttons.appendChild(button);
  var button = document.createElement("div");
  button.className = "icon icons-chevron-down down";
  buttons.appendChild(button);
  var button = document.createElement("div");
  button.className = "icon icons-cross-mark deletegroup";
  buttons.appendChild(button);
  row.appendChild(buttons);

  // add empty entry
  if (title == undefined) group.appendChild(newMenuRow());

  var button = document.createElement("div");
  button.className = "button button-add addrow icon icons-cross-mark";
  button.innerHTML = "Neuer Eintrag";
  group.appendChild(button);

  container.appendChild(group);
  return container;
}

/**
 * cookie handlers 
 */
function setCookie(name, data) {

  // store cookie_expiration_years inside the cookie
  data['expiration'] = new Date(new Date().setFullYear(new Date().getFullYear() + cookie_expiration_years)).getTime();
  Cookies.set(name, JSON.stringify(data), { expires: data['expiration'] - new Date().getTime() });
  //console.log(data,data['expiration'] - new Date().getTime());
}
function getCookie(name) {
  var c = Cookies.get(name);
  return typeof c !== "undefined" ? JSON.parse(c) : false;
}
function deleteCookie(name) {
  if (getCookie(name) !== false) Cookies.remove(name, { path: '' });
}

/**
 * 
 */
function exportDataObjectToFile(data) {
  var blob = new Blob([JSON.stringify(data)], { type: "text/plain;charset=utf-8" });
  window.saveAs(blob, 'life.txt');
}

function readFile(e) {
  var files = e.target.files,
    reader = new FileReader();
  reader.addEventListener("load", function () {
    /*if (
      confirm(
        "Die Daten in Datei werden nun geladen. Um sie dauerhaft zu verwenden "
      )
    ) {
      $(this).closest(".group").remove();
    }*/
    data = JSON.parse(this.result);

    // build content
    build_content(data);
    generateSections(data);

    // generate menu
    generateMenuFromData(data);

    // save
    save();
  });
  reader.readAsText(files[0]);
}
