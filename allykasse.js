var amount = 0;
var key = "xg_aly_res_" + universe;

var parts = window.localStorage[key] ? JSON.parse(window.localStorage[key]) : [50,25,25];

window.pad = function(value) {
  return String(value).split(/(?=(?:...)*$)/).join(" ");
};

window.xgCalcParts = function(){
  var total = 0;
  var totalRes = 0;
  for(var i = 0; i < parts.length; i++) {
    var p = Math.min(parseFloat($("#ap-" + i).val()), 100 - total);
    total += p;
    var res = Math.min(Math.round(amount*(p/100)), amount - totalRes);
    totalRes += res;
    $("#aly-" + i).val(pad(res));
    $("#part-" + i).html(Math.round(p) + "%");
    parts[i] = p;
  }
  window.localStorage[key] = JSON.stringify(parts);
};

window.xgSaveAlyRes = function() {
  var total = 0;
  for(var i = 0; i < parts.length; i++) {
    var p = Math.max(Math.min(parseInt($("#aly-" + i).val().replace(/ /g, "")), amount - total), 0);
    total += p;
    $("#aly-" + i).val(pad(p));
    
    p = p/amount*100;
    $("#ap-" + i).val(p);
    $("#part-" + i).html(Math.round(p) + "%");
    parts[i] = p;
  }
  xgCalcParts();
};

window.xgSendToAly = function() {
  $.post("allykasse.php", {
    metall: $("#aly-0").val().replace(/ /g, ""),
    kristall: $("#aly-1").val().replace(/ /g, ""),
    deuterium: $("#aly-2").val().replace(/ /g, ""),
    go: 1
    //submit: "[ Положить в склад альянса ]"
  }, function(data) {
    $.get("/uni" + universe + "/allykasse.php", function(resp){
      arr = resp.match(/положено:<\/font>&nbsp;&nbsp;(.*)<\/td>/);
      var totalSend = arr && arr.length == 2 ? arr[1] : "-";
      $("#xgTotalSend").html(totalSend);
      arr = resp.match(/планеты:<\/font>&nbsp;&nbsp;(.*)<\/td>/);
      var availSend = arr && arr.length == 2 ? arr[1] : "-";
      $("#xgAvailSend").html(availSend);
    });
  });
};

$.get("/uni" + universe + "/allykasse.php", function(data){
  var arr = data.match(/планеты:<\/font>&nbsp;&nbsp;<font color=#([0-9A-F]+)>(.*)<\/font>/);
  if(arr && arr.length == 3) {
    // вклад пока не доступен
  }
  else {
    var arr = data.match(/планеты:<\/font>&nbsp;&nbsp;(.*)<\/td>/);
    if(arr && arr.length == 2) {
      //var color = arr[1];
      amount = parseInt(arr[1].replace(/&nbsp;/g, ""));
  //    if(color == "FF6A6A") {
        dlgCreate("aly");

        var text = '<table style="width: 100%;" cellspacing="1"><tr><td class="c" colspan="4" style="height: 20px;"><div style="display: flex;"><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="dlgBeginMove(event, \'aly\')">Вклад в альянс</div><div class="close-btn" title="Закрыть форму" onclick="dlgHide(\'aly\')"></div></div></td></tr>\
              <tr><th colspan="4"></th></tr>\
              <tr><td class="c" colspan="2">Можно положить:</td><td class="c" colspan="2" id="xgAvailSend">' + arr[1] + '</td></tr>\
              <tr><th colspan="4"></th></tr>';

              text += '<tr><th><img src="/images/resources/ico_metal.png"></th><th><input onblur="xgSaveAlyRes()" style="padding: 3px;" id="aly-0"></th><th><input type="range" value="'+parts[0]+'" min="0" max="100" id="ap-0" oninput="xgCalcParts();"></th><th style="width: 30px" id="part-0"></th></tr>\
            <tr><th><img src="/images/resources/ico_crystal.png"></th><th><input onblur="xgSaveAlyRes()" style="padding: 3px;" id="aly-1"></th><th><input type="range" value="'+parts[1]+'" min="0" max="100" id="ap-1" oninput="xgCalcParts();"></th><th id="part-1"></th></tr>\
            <tr><th><img src="/images/resources/ico_deuterium.png"></th><th><input onblur="xgSaveAlyRes()" style="padding: 3px;" id="aly-2"></th><th><input type="range" value="'+parts[2]+'" min="0" max="100" id="ap-2" oninput="xgCalcParts();"></th><th id="part-2"></th></tr>';

        arr = data.match(/положено:<\/font>&nbsp;&nbsp;(.*)<\/td>/);
        var totalSend = arr && arr.length == 2 ? arr[1] : "-";

        text += '<tr><th colspan="4"></th></tr>\
                <tr><td class="c" colspan="2">Всего было Вами положено:</td><td class="c" colspan="2" id="xgTotalSend">' + totalSend + '</td></tr>\
                <tr><th colspan="4"></th></tr>\
                <tr><td class="c" colspan="4"><button style="cursor: pointer;" onclick="xgSendToAly()">Положить</button></td></tr>\
                </table>';

        $("#aly").html(text);
        $("#aly").css("width", "370px");

        xgCalcParts();

        dlgShow("aly");
  //    }
    }
  }
});

document.addEventListener("keydown", function(e){
    if(e.keyCode == 192 && document.activeElement.tagName == "BODY") {
        $.get("/uni" + universe + "/allykasse.php", function(data){
            dlgCreate("aly2");
            var text = '<table style="width: 100%;" cellspacing="1"><tr><td class="c" style="height: 20px;"><div style="display: flex;"><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="dlgBeginMove(event, \'aly2\')">Отладка</div><div class="close-btn" title="Закрыть форму" onclick="dlgHide(\'aly2\')"></div></div></td></tr>\
                    <tr><th></th></tr>';

            var arr = data.match(/планеты:<\/font>&nbsp;&nbsp;<font color=#([0-9A-F]+)>(.*)<\/font>/);
            text += '<tr><th>Args 1: ' + (arr ? arr.length : '-') + '</th></tr>';
            if(arr && arr.length == 3) {
                text += '<tr><th>Arg val: ' + arr[1] + '</th></tr>';
            }
            else {
                var arr = data.match(/планеты:<\/font>&nbsp;&nbsp;(.*)<\/td>/);
                text += '<tr><th>Args 2: ' + (arr ? arr.length : '-') + '</th></tr>';
                if(arr)
                    text += '<tr><th>Arg 2 val: ' + arr[1] + '</th></tr>';
            }

            text += '<tr><th></th></tr></table>';

            $("#aly2").html(text);

            dlgShow("aly2");
        });
    }
});