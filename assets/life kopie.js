/*
todo --------------------------------------
datum eingabe auch manuell
datepicker am element ausrichten 
datum 'ohne' unbekannt
datepicker: wenn mann jahe sucht vergisst mann einen Tag zu wählen 
ereignsse pro gruppe
als datei exportieren
mobile layout  
print layout
tab key navigation  

------------ 50%, 90 Monate / 1800 Tage sind vergangen
--------------------- 20%, 29 Monate / 18 Tage liegen in der Zukunft 



erledigt ----------------------------------
gruppen conologisch sortieren 
on hover section im content nur diese auswahl highlighten
bei vergliech % bei sections anzeigen 

*/

var colors = [
  "ef476fff",
  "54478cff",
  "2c699aff",
  "048ba8ff",
  "0db39eff",
  "16db93ff",
  "83e377ff",
  "b9e769ff",
  "efea5aff",
  "f1c453ff",
  "f29e4cff",
  "ffbe0bff",
  "fb5607ff",
  "ff006eff",
  "8338ecff",
  "3a86ffff",
];

function twoDecimals(n) {
  var log10 = n ? Math.floor(Math.log10(n)) : 0,
    div = log10 < 0 ? Math.pow(1, 1 - log10) : 10;
  return Math.round(n * div) / div;
}

var scale_factor = 1;
var picker = new dw_time_picker();
var data = false;

// One day Time in ms (milliseconds)
var one_day = 1000 * 60 * 60 * 24;
var first_day_on_screen = false;
var max_age = 80;

var unit_birth = 0;
var unit_today = 0;
var unit_per_year = 0;
var unit_total = 0;
var unit_past = 0;
var unit_multi = 5; // einheit anzeige bei vielfachem von x
var unit = "months";
var total_days = 0;
var cookie_expiration_years = 5;

function day_of_year(d) {
  var start = new Date(d.getFullYear(), 0, 1);
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

  var birthday = new Date(data.from); //new Date('1953,02,11');//new Date('1978,01,15');
  var today = new Date();
  var years_past = Math.abs(new Date(today - birthday).getFullYear() - 1970);
  total_days = (today - birthday) / one_day;

  var age = max_age - 1;
  if (saveBool(data.to)) {
    age = Math.abs(new Date(birthday - new Date(data.to)).getFullYear() - 1970) - 1;
  }

  var days_per_year = 365;
  var weeks_per_year = 52;
  var months_per_year = 12;

  // default
  unit_birth = 0;
  unit_today = 0;
  unit_per_year = 0;
  unit_total = 0;
  unit_past = 0;
  unit_multi = 5; // einheit anzeige bei vielfachem von x

  var cy = birthday.getFullYear();
  first_day_on_screen = new Date(birthday.getFullYear(), 00, 01);

  if (unit == "weeks") {
    unit_per_year = weeks_per_year;
    unit_today = weeks(today);
    unit_birth = weeks(birthday);
  } else if (unit == "months") {
    unit_per_year = months_per_year;
    unit_today = today.getMonth() + 1;
    unit_birth = birthday.getMonth() + 1;
    unit_multi = 2;
  } else if (unit == "days") {
    unit_per_year = days_per_year;
    unit_today = today.getDate();
    unit_birth = birthday.getDate();
  }

  $(".body").attr("unit", unit);
  $('[type="radio"][name="unit"][value="' + unit + '"]').prop("checked", true);

  for (var y = 0; y <= age; y++) {

    // xaxis
    var wrap = document.createElement("div");
    var div = document.createElement("div");
    if ((y % 2) / 100 === 0) {
      var span = document.createElement("span");
      span.className = "age";
      span.innerHTML = y;
      div.appendChild(span);

      span = document.createElement("span");
      span.className = "year";
      span.innerHTML = cy;
      div.appendChild(span);
    }
    wrap.appendChild(div);
    xaxis.appendChild(wrap);
    cy++;

    // content
    for (var w = 1; w <= unit_per_year; w++) {
      var div = document.createElement("div");
      div.title = unit_total + ' kw ' + w;
      if (
        !(y == 0 && w < unit_birth) &&
        (y < years_past || (years_past == y && w < unit_today))
      ) {
        div.className = "past";
        unit_past++;

        // mark current
      } else if (unit_past > 0 && years_past == y && w == unit_today) {
        div.className = "current";
      }
      content.appendChild(div);
      unit_total++;
    }
  }
  $(".table #content").empty().get(0).appendChild(content);
  $(".table .xaxis").empty().get(0).appendChild(xaxis);

  // yaxis
  for (var w = 1; w <= unit_per_year; w++) {
    var div = document.createElement("div");
    if ((w % unit_multi) / 100 === 0) div.innerHTML = w;
    yaxis.appendChild(div);
  }
  $(".table .yaxis").empty().get(0).appendChild(yaxis);

  /*$('.body').prepend('Woche '+unit_past+' von '+unit_total+' ('+ 
    Math.round((unit_past/unit_total) * 100)
    +'%)');*/
}

function build_sections(data) {
  console.log('build_sections');
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

    var h2 = document.createElement("h2");
    h2.innerHTML = group.title;
    group_el.appendChild(h2);

    var dots = $("#content > div");
    var group_total = [];

    // abscnitte
    group.items.forEach((abschnitt, o) => {

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
      let part;
      var days = 0; // days of the block
      var alpa = color;
      var from;
      var to;
      var ifrom;
      var ito;
      var total_width = 0;
      var first_ifrom = false;

      // custom color
      var color = abschnitt.color || colors[color_count];
      //console.log(color);

      // parts 
      abschnitt.times.forEach((part, p) => {

        block = document.createElement("div");
        block.className = "block";

        // first valid day
        let lvd = p > 0 ? abschnitt.times[p - 1].to : first_day_on_screen;
        //console.log(part);

        // from
        var date_from = part.from ? new Date(part.from) : first_day_on_screen;
        from = (date_from - first_day_on_screen) / one_day;
        if (unit == "weeks") {
          from = weeks(date_from, first_day_on_screen);
        } else if (unit == "months") {
          from = months(date_from, first_day_on_screen);
        }

        // check if from exists
        if (from > dots.length - 1) from = dots.length - 1;
        if (from < 0) from = 0;
        block.setAttribute("from", from);

        // to
        var date_to = part.to ? new Date(part.to) : new Date();
        to = (date_to - first_day_on_screen) / one_day;
        if (unit == "weeks") {
          to = weeks(date_to, first_day_on_screen);
        } else if (unit == "months") {
          to = months(date_to, first_day_on_screen);
        }

        // check if to exists
        if (to > dots.length - 1) to = dots.length - 1;
        if (to < 0) to = 0;
        block.setAttribute("to", to);

        // position from
        var left  = dots.eq(from).position().left;
        var width = dots.eq(to).position().left - left;
        total_width += width;

        // set style
        block.style = "background:#" + color + "; margin-left:" + (left * (1 / scale_factor)) + "px; width:" + ((width + 10) * (1 / scale_factor)) + "px;";
        abs.appendChild(block);

        // days -------------------------------------------

        // from ist entweder definiert oder der geburtstag
        ifrom = part.from ? new Date(part.from) : new Date(data.from);
        if(!first_ifrom) first_ifrom = ifrom;

        // to ist entweder definiert oder heute
        ito = part.to ? new Date(part.to) : new Date(); 
        //console.log(ifrom, ito);

        // add days
        days += Math.round((ito - ifrom) / one_day);

        // calculate group total -------------------------

        var test = {
          from:ifrom,
          to  :ito,
          t   :abschnitt.title
        };

        group_total.every((item, index) => {
          //console.log(index);

          // test is bigger, invalidate it
         if(test.from <= item.from && test.to >= item.to){
            group_total.splice(index, 1);
            //console.log('test ' + test.t + ' is bigger than ' + item.t);
          }

           // item is bigger, invalidate it
          if(test.from >= item.from && test.to <= item.to){
            //console.log('item ' + item.t + ' is bigger than ' + test.t);
            test = false; 
            return false;
          }

          // from anpassen
          if(test.from > item.from && test.from < item.to){
            //console.log('anfang anpassen '+ item.t);
            test.from = item.to;
          }

          // to anpassen
          if(test.from < item.from && test.to < item.to){
            //console.log('ende anpassen '+ item.t);
            test.to = item.from;
          }

          return true;
        });

        // add only if still valid
        if(test) group_total.push(test);

        // color -------------------------------------------

        style += "#content div:nth-child(n+" +(from + 1) +"):nth-child(-n+" +(to + 1) +"){ background-color:#" +color +" ;}" +
          "#content div:nth-child(n+" +(from + 1) +"):nth-child(-n+" +(to + 1) + "):not(.past){ background-color:#" + alpa + "; }";
        //console.log(from, to);
      });

      // total width to the last block of each abschnitt
      style += '[mode="compare"] .group:nth-of-type(' + parseInt(d+1) + ') .abschnitt:nth-of-type(' + parseInt(o+1) +') .block:last-child{ width:' +((total_width + 10) * (1 / scale_factor)) + 'px!important; }';

      style += "#content div:nth-child(n+" +(from + 1) +"):nth-child(-n+" +(to + 1) +"){ background-color:#" +color +" ;}" +
      "#content div:nth-child(n+" +(from + 1) +"):nth-child(-n+" +(to + 1) + "):not(.past){ background-color:#" + alpa + "; }";

      // title to last block
      var title = document.createElement("div");
      title.innerHTML = "<name>" + abschnitt.title + "</name>";
      block.appendChild(title);

      // info -------------------------------------------

      // dates
      var infoHTML = "<date>  " + picker.dateObjectsToHtmlValue([first_ifrom, ito], "date") + "</date>";

      // years
      var years = twoDecimals(days / 365);
      infoHTML += "<time>, " + years + " " + (years == 1 ? "Jahr" : "Jahre");
      infoHTML += ", " + days + " " + (days == 1 ? "Tag" : "Tage") + "</time>";

      // %
      infoHTML += "<percent>, " + Math.round((days / total_days) * 100) + "%</percent>";

      var info = document.createElement("span");
      info.className = "info";
      info.innerHTML = infoHTML;
      title.appendChild(info);

      group_el.appendChild(abs);

      // color the meny
      style += ".app-menu .group:nth-child(" + (parseInt(d) + 1) + ") .row:nth-child(" + (parseInt(o) + 2) + ") input[type=\"text\"]{border-color:#" + color + ";}";

      color_count++;
      if (color_count > colors.length - 1) color_count = 0;
    });

    sections.appendChild(group_el);

    // total days of the group
    var total_days_of_group = 0;
    group_total.forEach(item => {
      total_days_of_group += Math.round((item.to - item.from) / one_day);
    });
    //console.log(group_total);

    h2.innerHTML +=
      " <span>" +
      Math.round((total_days_of_group / total_days) * 100) +
      "%</span>";
  });

  $(".table .sections").empty().get(0).appendChild(sections);
  styles.html(style);
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
      var color     = el.css("background-color");
      //var alpa      = color.replace('rgb', 'rgba').replace(')', ', .5)');
      var style     = ["#content div{background-color:var(--past-color)!important; transition:none;}"];

      // mark the blocks
      el.closest('.group').find('> div .block').each(function () {
        var from  = parseInt($(this).attr("from"), 10) + 1;
        var to    = parseInt($(this).attr("to"), 10) + 1;
        var css   = "#content div:nth-child(n+" + from + "):nth-child(-n+" + to + ")";

        // hover element must be last set
        if(abschnitt.index($(this)) != -1){
          style.push(css+"{background-color:" + color + " !important;}");
        }else{
          style.unshift(css+"{background-color:var(--past-over-section-color)!important;}");
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

$(document).ready(function () {

  if (document.body.clientWidth < 500) scale_factor = 0.9;


  $('[type="radio"][name="unit"]').on("change", function () {
    console.log($(this).val());
    build_content(data, $(this).val());
    build_sections(data);
  });

  $('[type="radio"][name="mode"]').on("change", function () {
    var value = $(this).val();

    //console.log(value);
    // mode 
    //if(value == 'compare')

    $(".body").attr("mode", value);
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
    data = generate_data();
    build_sections(data);
  });

  $(document).on(
    "click",
    ".app-menu .buttons > div, .app-menu .button, .app-menu .date",
    function (e) {
      console.log('menu changed');

      // delete group
      if ($(this).hasClass("deletegroup")) {
        console.log("deletegroup");
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
        console.log("deleterow");
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
        console.log("up");
        var group = $(this).closest(".group");
        group.prev().insertAfter(group);
      }

      // down
      else if ($(this).hasClass("down")) {
        console.log("down");
        var group = $(this).closest(".group");
        group.next().insertBefore(group);
      }

      // addrow
      else if ($(this).hasClass("addrow")) {
        console.log("addrow");
        $(new_row()).insertBefore(
          $(this).closest(".group").find(".button-add")
        );
      }

      // addgroup
      else if ($(this).hasClass("addgroup")) {
        console.log("addgroup");
        $(this).closest(".wrapper").find(".inner").append(new_group());
      }

      // date
      else if ($(this).hasClass("date")) {
        console.log("date");
        let el = $(this);

        // get dates
        var dates = [];
        if (el.attr("from") && el.attr("to")) {
          dates.push(
            el.attr("from") == "false" ? false : new Date(el.attr("from"))
          );
          dates.push(
            el.attr("to") == "false" ? false : new Date(el.attr("to"))
          );
        }

        var date = new dw_time_picker(
          false,
          $(document.body),
          dates,
          "daterange",
          function (dates) {
            //console.log(dates);

            var from = this.dateObjectToAttribute(dates[0]);
            var to = this.dateObjectToAttribute(dates[1]);

            // if nothing changed 
            if (el.attr("from") == from && el.attr("to") == to) return;

            // insert
            el.html(this.dateObjectsToHtmlValue(dates, "date"))
              .attr("from", from)
              .attr("to", to);

            // remove empty class
            if (dates[0] || dates[1]) {
              el.removeClass("empty");
            } else {
              el.addClass("empty");
            }

            // update data
            data = generate_data();

            // menu neu aufbauen, wenn sich ein eintrag ändert
            if (el.attr('name') != 'main-range') generate_menu_from_data(data);

            // content neu aufbauen wenn sich das hauptdatum ändert
            if (el.attr('name') == 'main-range') build_content(data);

            // sectionen immer neu aufbauen
            build_sections(data);
          }
        ).show(e);
        return;
      }

      // save
      else if ($(this).hasClass("button-save")) {
        save();
        return;
      }

      // update view
      data = generate_data();
      generate_menu_from_data(data);
      build_sections(data);
    }
  );

  // read data from cookie
  getData();

  // build content
  build_content(data);
  build_sections(data);

  // generate menu
  generate_menu_from_data(data);

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
          build_sections(data);
        }
      }
    }

    // on open
    else if (!saved) {
      generate_menu_from_data(data);
      saved = true;
    }
    $("body").toggleClass("show-app-menu");
  });
});

function sortCronological(data) {
  if (data.groups != undefined) {
    for (var g in data.groups) {
      data.groups[g].items.sort(function (a, b) {
        if (!a.from && b.from) return -1;
        if (a.from && !b.from) return 1;
        if (!a.from && !b.from) return 0;
        var keyA = new Date(a.from), keyB = new Date(b.from);
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
  if (!data) data = defaults;

  // show cookie_expiration
  if (data.expiration) $('.cookie_expiration').html(new Date(data.expiration));

  // sort
  data = sortCronological(data)
  //console.log(data);
}

function save() {
  console.log('save');
  data = generate_data();
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
function generate_data() {
  console.log('generate_data');

  // create object
  var data = {
    title: $('.app-menu [name="main-title"]').val(),
    from: saveBool($('.app-menu [name="main-range"]').attr("from")),
    to: saveBool($('.app-menu [name="main-range"]').attr("to")),
    groups: [],
  };

  // loop groups
  $(".app-menu .group").each(function () {
    var group = $(this);

    // loop entries of group
    var entries = [];
    group.find(".entry").each(function () {
      var entry = $(this);
      entries.push({
        from: saveBool(entry.find(".date").attr("from")),
        to: saveBool(entry.find(".date").attr("to")),
        title: entry.find('[name="entry-title"]').val(),
        color: false,
      });
    });

    // add group
    data.groups.push({
      title: group.find('[name="group-title"]').val(),
      items: entries,
    });
  });

  saved = false;
  return sortCronological(data);
}

function generate_menu_from_data(data) {
  console.log('generate_menu_from_data');

  var inner = $('.app-menu .inner');

  // empty 
  inner.empty();

  // set title & range
  $('.app-menu [name="main-title"]').val(data.title);
  var range = $('.app-menu [name="main-range"]');
  range
    .attr("from", data.from)
    .attr("to", data.to)
    .html(
      picker.dateObjectsToHtmlValue(
        [saveBool(data.from), saveBool(data.to)],
        "date"
      )
    );

  // remove empty class
  if (data.from || data.to) range.removeClass("empty");

  // set groups & items
  for (var i in data.groups) {
    var g = data.groups[i];
    inner.get(0).appendChild(new_group(g.title));
    var group = $(".app-menu .wrapper .group").last();
    for (var o in g.items) {
      var e = g.items[o];
      $(new_row(e.title, e.from, e.to)).insertBefore(group.find(".button-add"));
    }
  }
}

function new_row(title, from, to) {
  var container = document.createDocumentFragment();
  var row = document.createElement("div");
  row.className = "row entry";

  var column = document.createElement("div");
  column.className = "column";
  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", "entry-title");
  input.setAttribute("placeholder", "Unbenannter Eintrag");
  input.setAttribute("value", title || "");
  column.appendChild(input);
  row.appendChild(column);

  var column = document.createElement("div");
  column.className = "column";
  var date = document.createElement("div");
  date.className = "date date-range " + (from || to ? "" : "empty");
  date.innerHTML = picker.dateObjectsToHtmlValue(
    [saveBool(from), saveBool(to)],
    "date"
  );
  date.setAttribute("from", from || "false");
  date.setAttribute("to", to || "false");
  column.appendChild(date);
  row.appendChild(column);

  var buttons = document.createElement("div");
  buttons.className = "buttons";
  var button = document.createElement("div");
  button.className = "icon icons-cross-mark deleterow";
  buttons.appendChild(button);
  row.appendChild(buttons);

  container.appendChild(row);
  return container;
}

function new_group(title) {
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
  if (title == undefined) group.appendChild(new_row());

  var button = document.createElement("div");
  button.className = "button button-add addrow icon icons-cross-mark";
  button.innerHTML = "Neuer Eintrag";
  group.appendChild(button);

  container.appendChild(group);
  return container;
}

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

function saveAsFile() {
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
    build_sections(data);

    // generate menu
    generate_menu_from_data(data);

    // save
    save();
  });
  reader.readAsText(files[0]);
}
