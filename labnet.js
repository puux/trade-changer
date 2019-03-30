var panelLabShow = false;
var impLab = null;

var zIndex = 16;
var moveObject = null;
var __sliderDragObj = null;
function _formMove(event) {
  if(moveObject) {
    var deltaX = Math.max(0, __sliderDragObj.l - (__sliderDragObj.x - event.clientX));
    moveObject.style.left = deltaX.toString() + "px";
    var deltaY = Math.max(0, __sliderDragObj.t  - (__sliderDragObj.y - event.clientY));
	  moveObject.style.top = deltaY.toString() + "px";
  }
}

function _formMoveUp() {
  document.removeEventListener("mousemove", _formMove);
  document.removeEventListener("mouseup", _formMoveUp);
  window.localStorage["pos_x_" + moveObject.id] = moveObject.style.left;
  window.localStorage["pos_y_" + moveObject.id] = moveObject.style.top;
  moveObject = null;
}

function beginMove(event, obj) {
  moveObject = document.getElementById(obj);
  moveObject.style.zIndex = zIndex++;
  __sliderDragObj = {x: event.clientX, y: event.clientY, l: moveObject.offsetLeft, t: moveObject.offsetTop};
  document.addEventListener("mousemove", _formMove);
	document.addEventListener("mouseup", _formMoveUp);
}

function switchLabPanel() {
  panelLabShow = !panelLabShow;
  if(panelLabShow) {
    $("#lab-panel").show();
    
    if(!impLab) {
      impLab = document.createElement("iframe");
      impLab.setAttribute('style', 'display: none;');
      impLab.src = "https://xgame-online.com/uni" + universe + "/imperium.php";
      impLab.onload = function(){
        
        var doc = impLab.contentWindow.document;
        var node = doc.getElementById("planet_name");
        var images = doc.getElementById("planet_image");
        
        var arr = doc.getElementsByTagName("table")[1].innerHTML.match(/Исследовательская сеть<\/font>&nbsp;&nbsp;<a href="(index\.php#b|b)uildings\.php\?mode=research&amp;cp=([\d]+)&amp;re=0&amp;planettype=3">([\d]+)<\/a>/);
        var netLevel = arr ? parseInt(arr[3]) : 0;
        var oldStyle = arr ? arr[1] == "b" : false;

        arr = doc.getElementsByTagName("table")[1].innerHTML.match(/art_academy">([\d]+)<\/a>/);
        var academy = arr ? parseInt(arr[1]) : 0;
        
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
        <tr><td class="c" colspan="3" style="height: 20px;"><div style="display: flex;"><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="beginMove(event, \'lab-panel\')">Исследовательская сеть</div><div class="close-btn" title="Закрыть форму" onclick="switchLabPanel()"></div></div></td></tr>\
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
          
          for(var l = 0; netLevel && l <= netLevel + academy; l++) {
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
                    <th style="width: 20px;">' + (i == 1 ? "" : images.childNodes[i].innerHTML.replace(/^[0-9]{1,2}/, "").replace("zeroAbsolute", "").replace(/style="width:(.*)px;"/, 'style="width: 16px; height: 16px; background-size: 32px; display: inline-block;"').replace('class="marg"', 'class="marg" style="width: 20px;"')) + '</th>\
                    <th>' + node.childNodes[i].innerHTML + '</th>\
                    <th><a style="' + (labFlagArray[i-2] ? "color: yellow;" : "") + '" href="' + url + '">' + (i == 1 ? "Ур." : (labArray[i-2] || "-")) + '</a></th>\
                    </tr>';
            }
          }
        }
        text += '<tr><th colspan="3"></th></tr>\
          <tr><th colspan="2"><a href="' + labSci + 'buildings.php?mode=research&gid=123">Исследовательская сеть</a></th><th style="color: orange;">' + netLevel + '</th></tr>\
          <tr><th colspan="2"><a href="' + labSci + 'user.php?art=art_academy">Академии</a></th><th style="color: orange;">' + academy + '</th></tr>\
          <tr><th colspan="3"></th></tr>\
          <tr><td colspan="2" class="c">Суммарный уровень лабораторий</td><td class="c">' + totalLevel + '</td></table>';
        labDlg.innerHTML = text;
      };
      document.body.appendChild(impLab);
    }
  }
  else
    $("#lab-panel").hide();
}

document.addEventListener("keydown", function(e){
  if(e.keyCode == 72 && document.activeElement.tagName == "BODY") {
    switchLabPanel();
  }
});

var labDlg = document.createElement("div");
labDlg.setAttribute('style', 'width: 255px; position: fixed; left: 40%; top: 15%; z-index: 16; box-shadow: 0 0 5px 0px black; background-color: black; display: none;');
labDlg.id = "lab-panel";
document.body.appendChild(labDlg);

if(window.localStorage["pos_x_" + labDlg.id]) {
  labDlg.style.left = window.localStorage["pos_x_" + labDlg.id];
  labDlg.style.top = window.localStorage["pos_y_" + labDlg.id];
}
