var scientist = false;
var drones = 0;
var locators = 0;
var expTech = 0;
var loaded = false;

var timeFly = 0;

function fmt(value) {
  var m = value%60;
  var h = (value - m)/60;
  if(m == 0)
    return h + "ч";
  return h + "ч " + m + "м";
}

function rnd(value) {
  return Math.round(value*1000)/10;
}

function fmtZero(value) {
    return value < 10 ? "0" + value : value;
}

function fmtTime(value) {
    var s = Math.round(value%60);
    var m = Math.floor(value/60)%60;
    var h = Math.floor(value/3600);

    return fmtZero(h) + ":" + fmtZero(m) + ":" + fmtZero(s);
}

function detectExp(){
  var arr = $("select[name=expeditiontime]");
  if(arr.length) {

    if(!loaded) {
      loaded = true;

      $.get("user.php", function(data){
        var spS = data.indexOf("Ученый");
        var spF = data.indexOf("Летчик");
        var spM = data.indexOf("Шахтер");
        scientist = spS < spF && spS < spM;

        $.get("imperium.php", function(data){
          var arr = data.replace("\n", "").match(/Экспедиционная технология<\/font>&nbsp;&nbsp;<a href=(index\.php#b|b)uildings\.php\?mode=research&cp=([\d]+)&amp;re=0&amp;planettype=3>([\d]+)<\/a>/);
          if(arr)
            expTech = parseInt(arr[3]);
          arr = data.replace("\n", "").match(/Дроны<\/font>&nbsp;&nbsp;<a href=(index\.php#u|u)ser\.php\?art=art_dron>([\d]+)<\/a>/);
          if(arr)
            drones = parseInt(arr[2]);
          arr = data.replace("\n", "").match(/Локаторы<\/font>&nbsp;&nbsp;<a href=(index\.php#u|u)ser\.php\?art=art_lokator>([\d]+)<\/a>/);
          if(arr)
            locators = parseInt(arr[2]);

          detectExp();
        });
      });
      return;
    }

    var sel = arr[0];
    sel.title = "Время в экспедиции (частичная потеря / полная потеря)";
    sel.parentNode.childNodes[2].nodeValue = "";
    sel.onchange = function() {
        var minutes = parseInt(this.value)*(scientist ? 51 : 60);
        minutes -= minutes*drones*0.03;

        $("table")[0].childNodes[0].childNodes[7].childNodes[0].childNodes[0].innerHTML = fmtTime(timeFly*2 + minutes*60);
        $("table")[0].childNodes[0].childNodes[7].childNodes[3].childNodes[0].innerHTML = fmtTime(timeFly + minutes*60);
        //console.log(timeFly, minutes, fmtTime(timeFly*2 + minutes*60))
        window.localStorage["exptime"] = this.value;
    }
    for(var i = 0; i < sel.childNodes.length; i++) {
      if(sel.childNodes[i].value) {
        var hour = parseInt(sel.childNodes[i].value);
        var minutes = hour*(scientist ? 51 : 60);
        minutes -= minutes*drones*0.03;
        var result = fmt(Math.round(minutes));
        var seb = expTech + hour;

        var killAll = 0.02 - 0.002*(seb-1 + locators);
        if(killAll < 0) killAll = 0;

        var killPart = 0.03 - 0.0012*(seb-1 + locators);
        if(killPart < 0) killPart = 0;

        if(killAll || killPart) {
          if(killAll && killPart)
            result += " (" + rnd(killPart) + "% / " + rnd(killAll) + "%)";
          else
            result += ' (' + rnd(killPart) + '%)';
        }
        sel.childNodes[i].innerHTML = result;
      }
    }

    var time = $("table")[0].childNodes[0].childNodes[7].childNodes[3].childNodes[0].innerHTML.split(":");
    var timeFly = time[0] * 3600 + time[1] * 60 + time[2] * 1;
    if(window.localStorage["exptime"])
        sel.value = window.localStorage["exptime"];
    sel.onchange();
  }
}

detectExp();

if(modalFormAction) {
  var mfaexp = modalFormAction;
  modalFormAction = function(r) { mfaexp(r); detectExp(); }
}