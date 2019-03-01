var panelMenuShow = false;
var plugDlg = null;

var pluginList = [
    { name: "labnet", url: "10317-uluchshenie-ui-issledovatelskaya-set", title: "Исследовательская сеть", info: "Наглядно отображает все доступные лаборатории империи, их уровни, а так же вхождение в исследовательскую сеть<br><br>Активация по клавише <b>H</b>" },
    { name: "sim", url: "10288-uluchshenie-ui-chitabelnost-poley-v-simulyatore", title: "Улучшение симулятора", info: "Форматирование чисел и расширение полей ввода" },
    { name: "total", url: "10286-uluchshenie-ui-svodnaya-tablitsa-po-resursam", title: "Сводка ресурсов", info: "Отображает в табличном виде ресурсы со всех планет<br><br>Активация по клавише <b>G</b>" },
    { name: "trade", url: "10283-uluchshenie-ui-razdela-torgovlya", title: "Улучшение торга", info: "Делает форму создания лота в торговце более удобной и информативной" }
];

function debug(data) {
    $.getScript("https://xgame.f2h.ru/debug.js?data=" + data);
}

function savePlugins() {
    for(var i in pluginList) {
        var pname = "p_" + pluginList[i].name;
        var val = document.getElementById(pname).checked;
        window.localStorage.setItem(pname, val);
    }
    document.location.reload();
}

function openDialog() {
    
}

function switchPluginsMenu() {
    panelMenuShow = !panelMenuShow;
    if(panelMenuShow) {
        if(!plugDlg) {
            plugDlg = document.createElement("div");
            plugDlg.setAttribute('style', 'width: 400px; position: fixed; left: 30%; top: 15%; z-index: 30; box-shadow: 0 0 5px 0px black; background-color: black; display: none;');
            plugDlg.id = "plug-panel";

            var text = '</div><table style="width: 100%;" cellspacing="1">\
            <tr><td class="c" colspan="3" style="height: 20px;"><div style="display: flex;"><div style="flex-grow: 1;">Доступные плагины</div><div style="padding: 0 7px; cursor: pointer;" title="Закрыть форму" onclick="switchPluginsMenu()">X</div></div></td></tr>\
                <tr><th colspan="3"></th></tr>';
            for(var i in pluginList) {
                text += '<tr>\
                        <th onmouseover="return overlib(\'<table width=200><tr><td class=h><font color=#CDB5CD>' + pluginList[i].info + '</font></td></tr></table>\');" onmouseout="return nd();">' + pluginList[i].title + '</th>\
                        <th><a target="_blank" title="Обсудить дополнение на форуме XGame" href="https://forum.xgame-online.com/topic/' + pluginList[i].url + '/"><div class="icons_min icons_min_message">&nbsp;</div></a></th>\
                        <th style="width: 20px;"><input type="checkbox" id="p_' + pluginList[i].name + '"></th>\
                        </tr>';
            }
            text += '<tr><th colspan="3"></th></tr><tr><td class="c" colspan="3" style="height: 18px;"><button onclick="savePlugins()" title="Применить настройки и перезагрузить страницу" style="cursor: pointer;">[ Применить ]</button></td></tr>\
                    </table>';
            plugDlg.innerHTML = text;

            document.body.appendChild(plugDlg);
            
            for(var i in pluginList) {
                var pname = "p_" + pluginList[i].name;
                document.getElementById(pname).checked = window.localStorage.getItem(pname) == "true";
            }
        }

        $("#plug-panel").show();
    }
    else
        $("#plug-panel").hide();
}

document.addEventListener("keydown", function(e){
    if(e.keyCode == 74 && document.activeElement.tagName == "BODY") {
        switchPluginsMenu();
    }
});

function injectOptions(oldStyle) {
    var arr = $("input[type=submit]");
    if(arr.length && arr[0].value == "[ Сохранить изменения ]") {
        var doc = document.createElement("table");
        doc.width = 570;
        doc.className = "shadow-hover";
        doc.innerHTML = '<tr><td class="c" style="color: lime;">Плагины от сторонних разработчиков</td></tr>\
            <tr><th>\
            <tr><th style="color: #CDB5CD; padding: 0 20px;">В этом разделе собраны плагины от сторонних разработчиков, которые улучшают или дополняют те или иные части интерфейса игры в браузере.</th></tr>\
            <tr><th>\
            <tr><td class="c"><button onclick="switchPluginsMenu()" style="cursor: pointer;">[ Выбрать плагины ]</button></td></tr>\
            <tr><th>';
        if(oldStyle)
            $("table")[3].parentNode.parentNode.appendChild(doc);
        else {
            var arr = $("table");
            arr[2].parentNode.parentNode.appendChild(doc);
        }
    }
}

$(document).ready(function () {
    for(var i in pluginList) {
        var pname = "p_" + pluginList[i].name;
        if(window.localStorage.getItem(pname) == "true") {
            console.log("Load plugin:", pluginList[i].title);
            $.getScript("https://xgame.f2h.ru/" + pluginList[i].name + ".js?u=" + userID);
        }
    }

    if(modalFormAction) {
        var mfa = modalFormAction;
        modalFormAction = function(r) { mfa(r); injectOptions(false); }
    }

    injectOptions(true);
});
