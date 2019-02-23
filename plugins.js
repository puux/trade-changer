var panelMenuShow = false;

var plugins = [
  { name: "labnet", title: "Исследовательская сеть", info: "Наглядно отображает все доступные лаборатории империи, их уровни, а так же вхождение в исследовательскую сеть" },
  { name: "sim", title: "Улучшение симулятора", info: "Форматирование чисел и расширение полей ввода" },
  { name: "total", title: "Сводка ресурсов", info: "Отображает в табличном виде ресурсы со всех планет" },
  { name: "trade", title: "Улучшение торга", info: "Делает форму создания лота в торговце более идобной и информативной" }
];

function savePlugins() {
  for(var i in plugins) {
    var pname = "p_" + plugins[i].name;
    var val = document.getElementById(pname).checked;
    window.localStorage.setItem(pname, val);
  }
  document.location.reload();
}

window.savePlugins = savePlugins;

for(var i in plugins) {
  var pname = "p_" + plugins[i].name;
  if(window.localStorage.getItem(pname) == "true") {
    console.log("Load plugin:", plugins[i].title);
    $.get("https://raw.githubusercontent.com/puux/trade-changer/master/" + plugins[i].name + ".js", function(data){ eval(data); })
  }
}

document.addEventListener("keydown", function(e){
  if(e.keyCode == 74) {
    panelMenuShow = !panelMenuShow;
    if(panelMenuShow) {
      $("#menu-panel").show();

      var text = '<table style="width: 100%;" cellspacing="1">\
          <tr><td class="c" colspan="2">Доступные плагины</td></tr>\
          <tr><th colspan="2"></th></tr>';
      for(var i in plugins) {
        text += '<tr>\
                <th onmouseover="return overlib(\'<table width=100><tr><td class=h><font color=#CDB5CD>' + plugins[i].info + '</font></td></tr></table>\');" onmouseout="return nd();">' + plugins[i].title + '</th>\
                <th style="width: 20px;"><input type="checkbox" id="p_' + plugins[i].name + '"></th>\
                </tr>';
      }
      text += '<tr><td class="c" colspan="2"><button onclick="savePlugins()" title="Применить настройки и перезагрузить страницу" style="cursor: pointer;">[ Применить ]</button></td></tr>\
              </table>';
      cont.innerHTML = text;
      
      for(var i in plugins) {
        var pname = "p_" + plugins[i].name;
        document.getElementById(pname).checked = window.localStorage.getItem(pname) == "true";
      }
    }
    else
      $("#menu-panel").hide();
  }
});

var cont = document.createElement("div");
cont.setAttribute('style', 'width: 400px; position: absolute; left: 30%; top: 15%; z-index: 16; box-shadow: 0 0 5px 0px black; background-color: black; display: none;');
cont.id = "menu-panel";
document.body.appendChild(cont);
