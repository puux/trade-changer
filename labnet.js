var panelLabShow = false;
var imp = null;

document.addEventListener("keydown", function(e){
  console.log(e.keyCode)
  if(e.keyCode == 72) {
    panelLabShow = !panelLabShow;
    if(panelLabShow) {
      $("#lab-panel").show();
      
      if(!imp) {
        imp = document.createElement("iframe");
        imp.setAttribute('style', 'display: none;');
        imp.src = "https://xgame-online.com/uni" + universe + "/imperium.php";
        imp.onload = function(){
          
          var doc = imp.contentWindow.document;
          var node = doc.getElementById("planet_name");
          var images = doc.getElementById("planet_image");
          
          var arr = doc.getElementsByTagName("table")[1].innerHTML.match(/Исследовательская сеть<\/font>&nbsp;&nbsp;<a href="(index\.php#b|b)uildings\.php\?mode=research&amp;cp=([\d]+)&amp;re=0&amp;planettype=3">([\d]+)<\/a>/);
          var netLevel = arr ? parseInt(arr[3]) : 0;
          var oldStyle = arr ? arr[1] == "b" : false;
          
          var nodes = doc.getElementById("planet_koord").parentNode.childNodes;
          var labIndex = -1;
          for(var n = 0; n < nodes.length; n++) {
            if(nodes[n].childNodes.length > 1 && nodes[n].childNodes[0].innerHTML && nodes[n].childNodes[0].innerHTML.indexOf("Лаборатория") > 0) {
              labIndex = n;
              break;
            }
          }
          
          var totalLevel = 0;
          
          var labSci = oldStyle ? '' : 'index.php#';
          
          var text = '<table style="width: 100%;" cellspacing="1">\
                <tr><td class="c" colspan="3"><a href="' + labSci + 'buildings.php?mode=research&gid=123">Исследовательская сеть</a>: ' + netLevel + '</td></tr>\
                <tr><th colspan="3"></th></tr>';
          if(labIndex > 0) {
            var lab = doc.getElementById("planet_koord").parentNode.childNodes[labIndex];
            var labArray = [];
            var labFlagArray = [];
            
            for(var i = 0; i < lab.childNodes.length; i++) {
              var ll = lab.childNodes[i].innerHTML.match(/>([\d]+)</);
              labArray[i] = ll == null ? 0 : parseInt(ll[1]);
              labFlagArray[i] = false;
            }
            
            for(var l = 0; netLevel && l <= netLevel; l++) {
              var mIndex = -1;
              var max = 0;
              for(var i in labArray) {
                if(!labFlagArray[i] && labArray[i] > max) {
                  max = labArray[i];
                  mIndex = i;
                }
              }
              
              if(mIndex >= 0) {
                totalLevel += max;
                labFlagArray[mIndex] = true;
              }
            }
            
            for(var i = 1; i < node.childNodes.length; i++) {
              if(node.childNodes[i].innerHTML) {
                var cp = 0;
                if(i > 1)
                  cp = images.childNodes[i].innerHTML.match(/cp=([\d]+)/)[1];
                
                var url = oldStyle ? 'buildings.php?gid=31&cp=' + cp : 'index.php?cp=' + cp + '&re=0#buildings.php?gid=31';
                text += '<tr>\
                      <th style="width: 20px;">' + (i == 1 ? "" : images.childNodes[i].innerHTML.replace(/^[0-9]{1,2}/, "").replace("zeroAbsolute", "").replace(/style="width:(.*)px;"/, 'style="width: 16px; height: 16px; background-size: 32px; display: block;"')) + '</th>\
                      <th>' + node.childNodes[i].innerHTML + '</th>\
                      <th><a style="' + (labFlagArray[i-2] ? "color: yellow;" : "") + '" href="' + url + '">' + (i == 1 ? "Лаба" : (labArray[i-2] || "-")) + '</a></th>\
                      </tr>';
              }
            }
          }
          text += '<tr><th colspan="3"></th><tr><th></th><th>Суммарный уровень лаб</th><th>' + totalLevel + '</th></table>';
          cont.innerHTML = text;
        };
        document.body.appendChild(imp);
      }
    }
    else
      $("#lab-panel").hide();
  }
});

var cont = document.createElement("div");
cont.setAttribute('style', 'width: 255px; position: absolute; left: 40%; top: 15%; z-index: 16; box-shadow: 0 0 5px 0px black; background-color: black; display: none;');
cont.id = "lab-panel";
document.body.appendChild(cont);
