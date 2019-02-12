var panelShow = false;
var imp = null;

document.addEventListener("keydown", function(e){
  if(e.keyCode == 71) {
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
          
          var text = '<table style="width: 100%;" cellspacing="1">';
          for(var i = 1; i < node.childNodes.length; i++) {
            if(node.childNodes[i].innerHTML) {
              text += '<tr>\
                    <th>' + (i == 1 ? "" : images.childNodes[i].innerHTML.replace(/^[0-9]{1,2}/, "").replace("zeroAbsolute", "").replace(/style="width:(.*)px;"/, 'style="width: 16px; height: 16px; background-size: 32px; display: block;"')) + '</th>\
                    <th>' + node.childNodes[i].innerHTML + '</th>\
                    <th>' + metal.childNodes[i].innerHTML.replace(/<font color="#CDB5CD">\/(.*)</, "<") + '</th>\
                    <th>' + cry.childNodes[i].innerHTML.replace(/<font color="#CDB5CD">\/(.*)</, "<") + '</th>\
                    <th>' + uran.childNodes[i].innerHTML.replace(/<font color="#CDB5CD">\/(.*)</, "<") + '</th>\
                    </tr>';
            }
          }
          text += '</table>';
          cont.innerHTML = text;
        };
        document.body.appendChild(imp);
      }
    }
    else
      $("#res-panel").hide();
  }
});

var cont = document.createElement("div");
cont.setAttribute('style', 'width: 400px; position: absolute; left: 30%; top: 15%; z-index: 16; box-shadow: 0 0 5px 0px black; background-color: black; display: none;');
cont.id = "res-panel";
document.body.appendChild(cont);
