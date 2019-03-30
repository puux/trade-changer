var panelShow = false;
var imp = null;

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
             <tr><td class="c" colspan="5" style="height: 20px;"><div style="display: flex;"><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="dlgBeginMove(event, \'res-panel\')">Сводка по ресурсам</div><div style="padding: 0 7px; cursor: pointer;" title="Закрыть форму" onclick="switchTotalResDlg()">X</div></div></td></tr>\
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
            text += '<tr>\
                  <th>' + (i == 1 ? "" : images.childNodes[i].innerHTML.replace(/^[0-9]{1,2}/, "").replace("zeroAbsolute", "").replace(/style="width:(.*)px;"/, 'style="width: 16px; height: 16px; background-size: 32px; display: inline-block;"').replace('class="marg"', 'class="marg" style="width: 20px;"')) + '</th>\
                  <th>' + node.childNodes[i].innerHTML + '</th>\
                  <th>' + metal.childNodes[i].innerHTML.replace(/<font color="#CDB5CD">\/(.*)</, "<") + '</th>\
                  <th>' + cry.childNodes[i].innerHTML.replace(/<font color="#CDB5CD">\/(.*)</, "<") + '</th>\
                  <th>' + uran.childNodes[i].innerHTML.replace(/<font color="#CDB5CD">\/(.*)</, "<") + '</th>\
                  </tr>';
          }
        }
        text += '<tr><td class="c" colspan="2">Всего:</td><td class="c">' + totalM + '</td><td class="c">' + totalC + '</td><td class="c">' + totalU + '</td></tr>\
          <tr><th colspan="5"></th></tr>\
          <tr><td class="c" colspan="2">В полете:</td><td class="c" id="fly-res-m"></td><td class="c" id="fly-res-c"></td><td class="c" id="fly-res-u"></td></tr>\
          </table>';
        $("#res-panel").html(text);

        $.get("overview.php", function(data){
          var arr = data.match(/Всего.*ресурсов.*Металл:(.*),.*Алмаз:(.*),.*Уран:(.*)<\/font><\/td/);
          if(arr) {
            $("#fly-res-m").html(arr[1]);
            $("#fly-res-c").html(arr[2]);
            $("#fly-res-u").html(arr[3]);
          }
        });
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