window.xgPhTimers = function time_last(){
    $(".pha-time").each(function(index, element) {
      var seconds = Math.floor(parseInt(element.getAttribute("data")) - Math.round(new Date().getTime()/1000));
      if (seconds < 0) {
          element.innerHTML = '<font color=#CDB5CD>прилетел</font>';
      } else {
          var hours = Math.floor(seconds / 3600);
          seconds -= hours * 3600;
  
          var minutes = Math.floor(seconds / 60);
          seconds -= minutes * 60;
  
          if (hours < 10) hours = "0" + hours;
          if (minutes < 10) minutes = "0" + minutes;
          if (seconds < 10) seconds = "0" + seconds;
  
          if (hours <= 24)
            element.innerHTML = hours + ":" + minutes + ":" + seconds;
          else {
              var days = Math.floor(hours / 24);
              hours -= days * 24;
              if (hours < 10) hours = "0" + hours;
              element.innerHTML = days + "д " + hours + ":" + minutes + ":" + seconds;
          }
  
      }
    });
    window.setTimeout(window.xgPhTimers, 1000);
  }
  
  window.xgScanRunning = false;
  
  window.xgCalcAmountTargets = function(){
    var amount = 0;
    
    var nodes = $("table")[isNewStyle ? 1 : 2].childNodes[0];
    for(var i = 2; i < nodes.childNodes.length-1; i+=2) {
      var planet = nodes.childNodes[i].childNodes[3] ? nodes.childNodes[i].childNodes[3].innerHTML : "";
      if(planet && planet.indexOf("Сканировать") >= 0)
        amount++;
    }
    
    return amount;
  };
  
  window.xgScanGalaxy = function() {
    if(!window.xgScanRunning) {
      window.xgScanRunning = true;
      window.setTimeout(window.xgPhTimers, 1000);
    }
    
    $(".pha-nodes").remove();
    
    var scanTimeout = 0;
    var nodes = $("table")[isNewStyle ? 1 : 2].childNodes[0];
    for(var i = 2; i < nodes.childNodes.length-1; i+=2) {
      var planet = nodes.childNodes[i].childNodes[3].innerHTML;
      if(planet && planet.indexOf("Сканировать") >= 0) {
        var planetNum = i/2;

        setTimeout(function(planetNum, row){ return function(){
          var url = "https://xgame-online.com/uni" + universe + "/phalanx.php?galaxy=" + $("input[name=galaxy]").val() + "&system=" + $("input[name=system]").val() + "&planet=" + planetNum;
          $.get(url, function(data){
            if(data.indexOf("Флоты не замечены") >= 0) {
              $('<tr class="pha-nodes"><th colspan=9 class=lolonginactive>Нет летящих флотов</td></tr>').insertAfter(row);
            }
            else {
              var arr = data.match(/<table width=570><th colspan=2><\/th>(.*)<scri/s);
              if(arr) {
                var time = data.match(/([\d]+);/g);
    
                var text = arr[1];
                for(var i = 1; i < time.length; i++) {
                  var t = Math.round(new Date().getTime()/1000) + parseInt(time[i-1]);
                  text = text.replace("id=div" + i, "class=pha-time data=" + t);
                }
                var rows = '<tr class="pha-nodes"><th colspan="9"></th></tr>' + 
                  text
                    .replace(/<th colspan=2><\/th><tr><th width=100>/g, '<tr class="pha-nodes"><th colspan=9></th></tr><tr class="pha-nodes"><th colspan="2"></th><th colspan=1>')
                    .replace(/<tr><th width=100/g, '<tr class="pha-nodes"><th colspan="2"></th><th colspan=1')
                    .replace(/<th width=430>/g, "<th colspan=6>") + '<tr class="pha-nodes"><th colspan="9"></th></tr>';
                $(rows).insertAfter(row);
              }
            }
          });
        }}(planetNum, nodes.childNodes[i]), scanTimeout);
        scanTimeout += 500;
      }
    }
    
    return false;
  };
  
  function injectScaner() {
    if(document.getElementById("galaxy_form")) {
      var a = window.xgCalcAmountTargets();
      $("#fleetstatusrow").parent().append(
        '<tr>\
            <td class="c" colspan="1"><span style="color: #CDB5CD">Целей:</span> ' + a + '</td>\
            <td class="c" colspan="1"><input type="submit" onclick="return xgScanGalaxy()" value="[ Сканировать систему ]"></td>\
            <td class="c" colspan="1"><span style="color: #CDB5CD">Затраты:</span> ' + gap(a*5000) + '</td>\
        </tr>');
    }
  }
  
  if(modalFormAction) {
    var galscan = modalFormAction;
    modalFormAction = function(r) { galscan(r); injectScaner(); }
  }
  
  if(!isNewStyle)
      injectScaner();