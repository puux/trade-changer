var panelShow = false;
var imp = null;

var totalImpRes = { m: 0, c: 0, u: 0 };

function resStorageKey() {
  return "xg_res_target_" + universe;
}

function saveRes() {
  var res = {
    m: $("#res-0").val(),
    c: $("#res-1").val(),
    u: $("#res-2").val()
  };
  if(res.m || res.c || res.u)
    window.localStorage[resStorageKey()] = JSON.stringify(res);
  else
    window.localStorage.removeItem(resStorageKey());
  updateResTarget();
}

function paramsResDlg() {
  if(!document.getElementById("res-params"))
    dlgCreate("res-params");
  dlgShow("res-params");

  var text = '<table style="width: 100%;" cellspacing="1">\
          <tr><td class="c" colspan="2" style="height: 20px;"><div style="display: flex;"><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="dlgBeginMove(event, \'res-params\')">Настройки</div><div class="close-btn" title="Закрыть форму" onclick="dlgHide(\'res-params\')"></div></div></td></tr>\
          <tr><th colspan="2">Установить цель</th></tr>\
          <tr><th>Металл</th><th><input onblur="saveRes()" id="res-0"></th></tr>\
          <tr><th>Алмаз</th><th><input onblur="saveRes()" id="res-1"></th></tr>\
          <tr><th>Уран</th><th><input onblur="saveRes()" id="res-2"></th></tr>';
  
  text += '</table>';     
  $("#res-params").css("width", "220px").html(text);
  if(window.localStorage[resStorageKey()]) {
    var res = JSON.parse(window.localStorage[resStorageKey()]);
    $("#res-0").val(res.m);
    $("#res-1").val(res.c);
    $("#res-2").val(res.u);
  }
}

function updateResTarget() {
  if(window.localStorage[resStorageKey()]) {
    var res = JSON.parse(window.localStorage[resStorageKey()]);
    for(var type in res) {
      $("#target-res-" + type).html(pad(res[type]));
      var total = Math.max(0, res[type] - totalImpRes[type]);
      $("#target-res-need-" + type).html(pad(total));
    }
    $(".res-target").show();
  }
  else {
    $(".res-target").hide();
  }
}

function switchTotalResDlg() {
  panelShow = !panelShow;
  if(panelShow) {
    $("#res-panel").show();

    if(!imp) {
      imp = document.createElement("iframe");
      imp.setAttribute('style', 'display: none;');
      imp.src = "https://xgame-online.com/uni" + universe + "/imperium.php";
      imp.onload = function(){
        
        var doc = imp.contentWindow.document;
        var node = doc.getElementById("planet_name");
        var images = doc.getElementById("planet_image");
        var metal = doc.getElementById("planet_koord").parentNode.childNodes[11];
        var cry = doc.getElementById("planet_koord").parentNode.childNodes[12];
        var uran = doc.getElementById("planet_koord").parentNode.childNodes[13];
        
        var text = '<table style="width: 100%;" cellspacing="1">\
             <tr><td class="c" colspan="5" style="height: 20px;"><div style="display: flex;"><div class="params-btn" title="Настройки" onclick="paramsResDlg()"></div><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="dlgBeginMove(event, \'res-panel\')">Сводка по ресурсам</div><div class="close-btn" title="Закрыть форму" onclick="switchTotalResDlg()"></div></div></td></tr>\
             <tr><th colspan="5"></th>';
        
        var totalM = "";
        var totalC = "";
        var totalU = "";
        for(var i = 1; i < node.childNodes.length; i++) {
          if(node.childNodes[i].innerHTML) {
            var arr = metal.childNodes[i].innerHTML.match(/(.*)Всего:<\/font>(.*)<br><font color=#CDB5CD>За/);
            if(arr && arr.length == 3) {
              totalM = arr[2];
              arr = cry.childNodes[i].innerHTML.match(/(.*)Всего:<\/font>(.*)<br><font color=#CDB5CD>За/);
              totalC = arr[2];
              arr = uran.childNodes[i].innerHTML.match(/(.*)Всего:<\/font>(.*)<br><font color=#CDB5CD>За/);
              totalU = arr[2];
            }
            var overflowM = metal.childNodes[i].innerHTML.indexOf("#FF6A6A") > 0;
            var overflowC = cry.childNodes[i].innerHTML.indexOf("#FF6A6A") > 0;
            var overflowU = uran.childNodes[i].innerHTML.indexOf("#FF6A6A") > 0;

            var metalStr = metal.childNodes[i].innerHTML.replace(/<font color="#CDB5CD">\/(.*)</, "<");
            var cryStr = cry.childNodes[i].innerHTML.replace(/<font color="#CDB5CD">\/(.*)</, "<");
            var uranStr = uran.childNodes[i].innerHTML.replace(/<font color="#CDB5CD">\/(.*)</, "<");
            if(metal.childNodes[i].innerHTML.indexOf("<a") == 0) {
              metalStr = '<a' + (overflowM ? ' style="color:#FF6A6A;"' : '') + metalStr.substring(2);
              cryStr = '<a' + (overflowC ? ' style="color:#FF6A6A;"' : '') + cryStr.substring(2);
              uranStr = '<a' + (overflowU ? ' style="color:#FF6A6A;"' : '') + uranStr.substring(2);
            }
            else {
              metalStr = metalStr.replace(/<\/font>0/, "");
              cryStr = cryStr.replace(/<\/font>0/, "");
              uranStr = uranStr.replace(/<\/font>0/, "");
            }
            text += '<tr>\
                  <th>' + (i == 1 ? "" : images.childNodes[i].innerHTML.replace(/^[0-9]{1,2}/, "").replace("zeroAbsolute", "").replace(/style="width:(.*)px;"/, 'style="width: 16px; height: 16px; background-size: 32px; display: inline-block;"').replace('class="marg"', 'class="marg" style="width: 20px;"').replace("overview", "buildings")) + '</th>\
                  <th>' + node.childNodes[i].innerHTML + '</th>\
                  <th>' + metalStr + '</th>\
                  <th>' + cryStr + '</th>\
                  <th>' + uranStr + '</th>\
                  </tr>';
          }
        }
        text += '<tr><td class="c" colspan="2">Всего:</td><td class="c">' + totalM + '</td><td class="c">' + totalC + '</td><td class="c">' + totalU + '</td></tr>\
          <tr><th colspan="5"></th></tr>\
          <tr><td class="c" colspan="2">В полете:</td><td class="c" id="fly-res-m"></td><td class="c" id="fly-res-c"></td><td class="c" id="fly-res-u"></td></tr>';
        totalImpRes.m = parseInt(totalM.replace(/&nbsp;| /g, ""));
        totalImpRes.c = parseInt(totalC.replace(/&nbsp;| /g, ""));
        totalImpRes.u = parseInt(totalU.replace(/&nbsp;| /g, ""));

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
      };
      document.body.appendChild(imp);
    }
  }
  else
    $("#res-panel").hide();
}

document.addEventListener("keydown", function(e){
  if(e.keyCode == 71 && document.activeElement.tagName == "BODY") {
    switchTotalResDlg();
  }
});

if(window.dlgCreate) {
  dlgCreate("res-panel");
}
else {
  var totalDlg = document.createElement("div");
  totalDlg.setAttribute('style', 'width: 400px; position: fixed; left: 30%; top: 15%; z-index: 16; box-shadow: 0 0 5px 0px black; background-color: black; display: none;');
  totalDlg.id = "res-panel";
  document.body.appendChild(totalDlg);
}