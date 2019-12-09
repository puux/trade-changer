var panelShow = false;
var totalImpRes = { m: 0, c: 0, u: 0 };
var resTimerId = 0;

function pad(value) {
    return String(value).split(/(?=(?:...)*$)/).join(" ");
}

function resStorageKey() {
  return "xg_plug_total_opt_" + universe;
}

if(window.localStorage.getItem("xg_res_target_" + universe))
  window.localStorage.removeItem("xg_res_target_" + universe);

var storedOpt = window.localStorage.getItem(resStorageKey());
var pResOptions = storedOpt ? JSON.parse(storedOpt) : {m: 0, c: 0, u: 0, moon: true, autoLoad: true, showProgress: false, storageLimit: 90};

window.formatRes = function(e) {
  e.target.value = pad(e.target.value.replace(/ /g, ''));
}

window.saveRes = function() {
  pResOptions = {
    m: $("#res-0").val().replace(/ /g, ''),
    c: $("#res-1").val().replace(/ /g, ''),
    u: $("#res-2").val().replace(/ /g, ''),
    moon: $("#moon-visible")[0].checked,
    autoLoad: $("#res-auto")[0].checked,
    showProgress: $("#res-storage")[0].checked,
    storageLimit: parseInt($("#res-storage-limit").val())
  };
  
  window.localStorage[resStorageKey()] = JSON.stringify(pResOptions);
  fillResourceDialog();
  
  if(pResOptions.autoLoad) {
    if(!resTimerId)  
      resTimerId = setInterval(fillResourceDialog, 5000);
  }
  else {
    clearInterval(resTimerId);
    resTimerId = 0;
  }
}

window.paramsResDlg = function () {
  if(!document.getElementById("res-params"))
    dlgCreate("res-params");
  dlgShow("res-params");

  var text = '<table style="width: 100%;" cellspacing="1">\
          <tr><td class="c" colspan="2" style="height: 20px;"><div style="display: flex;"><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="dlgBeginMove(event, \'res-params\')">Настройки</div><div class="close-btn" title="Закрыть форму" onclick="dlgHide(\'res-params\')"></div></div></td></tr>\
          <tr><th colspan="2" style="color: #CDB5CD">Настройки цели</th></tr>\
          <tr><th>Металл</th><th><input onblur="saveRes()" oninput="formatRes(event)" id="res-0" style="width: 100%;text-align: center;"></th></tr>\
          <tr><th>Алмаз</th><th><input onblur="saveRes()" oninput="formatRes(event)" id="res-1" style="width: 100%;text-align: center;"></th></tr>\
          <tr><th>Уран</th><th><input onblur="saveRes()" oninput="formatRes(event)" id="res-2" style="width: 100%;text-align: center;"></th></tr>\
          <tr><th colspan="2" style="color: #CDB5CD">Прогресс занятости складов</th></tr>\
          <tr><th>Отображать</th><th><input type="checkbox" oninput="saveRes()" id="res-storage"></th></tr>\
          <tr><th style="white-space: nowrap;">Предупреждать от</th><th><input onblur="saveRes()" id="res-storage-limit" style="width: 30px;text-align: center;">&nbsp;%</th></tr>\
          <tr><th colspan="2" style="color: #CDB5CD">Прочие настройки</th></tr>\
          <tr><th style="white-space: nowrap;">Скрывать луны</th><th><input type="checkbox" oninput="saveRes()" id="moon-visible"></th></tr>\
          <tr><th>Автообновление</th><th><input type="checkbox" oninput="saveRes()" id="res-auto"></th></tr>';
  
  text += '</table>';     
  $("#res-params").css("width", "220px").html(text);

  $("#res-0").val(pad(pResOptions.m));
  $("#res-1").val(pad(pResOptions.c));
  $("#res-2").val(pad(pResOptions.u));
  $("#moon-visible")[0].checked = pResOptions.moon;
  $("#res-auto")[0].checked = pResOptions.autoLoad;
  $("#res-storage")[0].checked = pResOptions.showProgress;
  $("#res-storage-limit").val(pResOptions.storageLimit);
}

window.updateResTarget = function() {
  if(pResOptions.m > 0 || pResOptions.c > 0 || pResOptions.u > 0) {
    for(var type of ["m", "c", "u"]) {
      if(pResOptions[type] > 0) {
        $("#target-res-" + type).html(pad(pResOptions[type]));
        var total = pResOptions[type] - totalImpRes[type];
        $("#target-res-need-" + type).html((total < 0 ? '-' : '') + pad(Math.abs(total))).css("color", total > 0 ? "#FF6A6A" : "#CDB5CD");
      }
    }
    $(".res-target").show();
  }
  else {
    $(".res-target").hide();
  }
  
  if(pResOptions.moon) {
    $(".planet-type-3").hide();
    $(".moons-total").show();
  } else {
    $(".planet-type-3").show();
    $(".moons-total").hide();
  }
}

function fillResourceDialog() {
  $.get("https://xgame-online.com/uni" + universe + "/sim.php", function(data){
    var imp = JSON.parse(data.substring(17));
    
    var resImp = {
      total: {m: 0, c: 0, u: 0},
      prod: {m: 0, c: 0, u: 0},
      stor: {m: 0, c: 0, u: 0},
      moons: {m: 0, c: 0, u: 0}
    }
    for(var i in imp.planets) {
      var planet = imp.planets[i];
      //planet.storage.metal /= 10;
      resImp.total.m += planet.resource.metal;
      resImp.total.c += planet.resource.crystal;
      resImp.total.u += planet.resource.uran;
      resImp.prod.m += planet.production.metal;
      resImp.prod.c += planet.production.crystal;
      resImp.prod.u += planet.production.uran;
      resImp.stor.m += planet.storage.metal;
      resImp.stor.c += planet.storage.crystal;
      resImp.stor.u += planet.storage.uran;

      if(planet.type == "3") {
        resImp.moons.m += planet.resource.metal;
        resImp.moons.c += planet.resource.crystal;
        resImp.moons.u += planet.resource.uran;
      }
    }

    var style = '<style>.res-storage{position: relative;} .res-storage .line{ content: \' \'; position: absolute; background-color: #9ba9c7; height: 1px; left: 0; bottom: -1px; }</style>'
    var text = style + '<table style="width: 100%;" cellspacing="1">\
         <tr><td class="c" colspan="5" style="height: 20px;"><div style="display: flex;"><div class="params-btn" title="Настройки" onclick="paramsResDlg()"></div><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="dlgBeginMove(event, \'res-panel\')">Сводка по ресурсам</div><div class="close-btn" title="Закрыть форму" onclick="switchTotalResDlg()"></div></div></td></tr>\
         <tr><th colspan="5"></th>\
         <tr><th style="width: 16px;"></th><th style="color: #CDB5CD">Название</th><th style="color: #CDB5CD">Металл</th><th style="color: #CDB5CD">Алмаз</th><th style="color: #CDB5CD">Уран</th></tr>';

    for(var i in imp.planets) {
      var planet = imp.planets[i];
      
      var style = 'width: 16px; height: 16px; background-image: url(\'' + planet.image + '\'); background-position-y: ' + (16*planet.y/44) + 'px; background-size: 32px;';
      if(planet.type == 3)
        style = 'width: 16px; height: 16px; background-image: url(\'https://xgame-online.com/images/planets/mini_moon.png\'); background-size: 32px;';
      if(imp.user.img_planet == 1 && !isNewStyle)
        style = 'width: 16px; height: 16px; background-image: url(\'' + planet.image_old + '\'); background-size: 16px;';
      
      var energy = planet.energy < 0 ? ' style="color:#FF6A6A"' : "";
      var baseURL = isNewStyle ? 'index.php?cp=' + planet.id + '&re=0#buildings.php?gid=' : 'buildings.php?cp=' + planet.id + '&gid=';
      text += '<tr class="planet-type-' + planet.type + '">\
              <th><div style="' + style + '"></div></th>\
              <th><a href="' + baseURL.replace("buildings", "resources") + '" ' + energy + '>' + planet.name + '</a></th>\
              <th class="res-storage"><a href="' + baseURL + (planet.resource.metal > planet.storage.metal*pResOptions.storageLimit/100 ? 22 : 1) + '">' + makeResourceCell(planet.resource.metal, planet.storage.metal, planet.production.metal) + (planet.type == 1 && pResOptions.showProgress ? makeResourceProgress(planet.resource.metal, planet.storage.metal) : '') + '</a></th>\
              <th class="res-storage"><a href="' + baseURL + (planet.resource.crystal > planet.storage.crystal*pResOptions.storageLimit/100 ? 23 : 2) + '">' + makeResourceCell(planet.resource.crystal, planet.storage.crystal, planet.production.crystal)+ (planet.type == 1 && pResOptions.showProgress ? makeResourceProgress(planet.resource.crystal, planet.storage.crystal) : '') + '</a></th>\
              <th class="res-storage"><a href="' + baseURL + (planet.resource.uran > planet.storage.uran*pResOptions.storageLimit/100 ? 24 : 3) + '">' + makeResourceCell(planet.resource.uran, planet.storage.uran, planet.production.uran)+ (planet.type == 1 && pResOptions.showProgress ? makeResourceProgress(planet.resource.uran, planet.storage.uran) : '') + '</a></th>\
              </tr>';
    }

    text += '<tr class="moons-total"><th colspan="2">Луны:</th><th>' + pad(resImp.moons.m) + '</th><th>' + pad(resImp.moons.c) + '</th><th>' + pad(resImp.moons.u) + '</th></tr>\
      <tr><td class="c" colspan="2">Всего:</td>\
            <td class="c">' + makeResourceCell(resImp.total.m, resImp.stor.m, resImp.prod.m) + '</td>\
            <td class="c">' + makeResourceCell(resImp.total.c, resImp.stor.c, resImp.prod.c) + '</td>\
            <td class="c">' + makeResourceCell(resImp.total.u, resImp.stor.u, resImp.prod.u) + '</td></tr>\
      <tr><th colspan="5"></th></tr>\
      <tr><td class="c" colspan="2">В полете:</td><td class="c" id="fly-res-m"></td><td class="c" id="fly-res-c"></td><td class="c" id="fly-res-u"></td></tr>';
    totalImpRes.m = resImp.total.m;
    totalImpRes.c = resImp.total.c;
    totalImpRes.u = resImp.total.u;

    text += '<tr class="res-target"><th colspan="5"></th></tr>\
      <tr class="res-target"><td class="c" colspan="2">Цель:</td><td class="c" id="target-res-m"></td><td class="c" id="target-res-c"></td><td class="c" id="target-res-u"></td></tr>\
      <tr class="res-target"><td class="c" colspan="2">Осталось:</td><td class="c" id="target-res-need-m"></td><td class="c" id="target-res-need-c"></td><td class="c" id="target-res-need-u"></td></tr>';

    text += '</table>';
    $("#res-panel").html(text);

    $.get("overview.php", function(data){
      var arr = data.match(/Всего.*ресурсов.*Металл:(.*),.*Алмаз:(.*),.*Уран:(.*)<\/font><\/td/);
      if(arr) {
        $("#fly-res-m").html(arr[1]);
        $("#fly-res-c").html(arr[2]);
        $("#fly-res-u").html(arr[3]);

        totalImpRes.m += parseInt(arr[1].replace(/&nbsp;| /g, ""));
        totalImpRes.c += parseInt(arr[2].replace(/&nbsp;| /g, ""));
        totalImpRes.u += parseInt(arr[3].replace(/&nbsp;| /g, ""));

        updateResTarget();
      }
    });

    updateResTarget();
  });
}

function makeResourceProgress(amount, storage) {
  var persent = amount/storage*100;
  var color = "#9ba9c7";
  if(persent >= 100) {
    color = "#FF6A6A"
  }
  else if(persent > pResOptions.storageLimit) {
    color = "rgb(255, 165, 0)"
  }
  return '<span class="line" style="width:' + Math.min(persent, 100) + '%; background-color: ' + color + ';"></span>';
}

function makeResourceCell(amount, storage, production) {
  var title = pad(amount);
  var hint = 'onmouseover="return overlib(\'<table width=200>\
      <tr><td class=h><font color=#CDB5CD>Вместимость</font></td><td class=h>' + pad(storage) + '</td></tr>\
      <tr><td class=h><font color=#CDB5CD>Добыча в час</font></td><td class=h>' + pad(production) + '</td></tr>\
      <tr><td class=h><font color=#CDB5CD>Добыча в сутки</font></td><td class=h>' + pad(production*24) + '</td></tr>\
      </table>\');" onmouseout="return nd();"'
  
  var color = "";
  if(production) {
    if(amount >= storage) {
      color = "#FF6A6A"
    }
    else if(amount >= storage*0.9) {
      color = "rgb(255, 165, 0)"
    }
  }
  
  return '<span ' + hint + (color ? ' style="color: ' + color + '"' : '') + '>' + title + '</span>';
}

window.switchTotalResDlg = function() {
  panelShow = !panelShow;
  if(panelShow) {
    $("#res-panel").show();
    fillResourceDialog();
    if(pResOptions.autoLoad)
      resTimerId = setInterval(fillResourceDialog, 5000);
  }
  else {
    $("#res-panel").hide();
    clearInterval(resTimerId);
  }
}

document.addEventListener("keydown", function(e){
  if(e.keyCode == 71 && document.activeElement.tagName == "BODY") {
    switchTotalResDlg();
  }
});

dlgCreate("res-panel");

if(window.enableOptionsButton)
  window.enableOptionsButton("total", paramsResDlg);