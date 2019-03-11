$('head').append('<link rel="stylesheet" href="https://xgame.f2h.ru/plugins.css?v='  + new Date().getTime() + '" type="text/css" />');

var pluginList = [
    { name: "labnet", url: "10317-uluchshenie-ui-issledovatelskaya-set", title: "Исследовательская сеть", info: "Наглядно отображает все доступные лаборатории империи, их уровни, а так же вхождение в исследовательскую сеть<br><br>Активация по клавише <b>H</b>" },
    { name: "sim", url: "10288-uluchshenie-ui-chitabelnost-poley-v-simulyatore", title: "Улучшение симулятора", info: "Форматирование чисел и расширение полей ввода" },
    { name: "total", url: "10286-uluchshenie-ui-svodnaya-tablitsa-po-resursam", title: "Сводка ресурсов", info: "Отображает в табличном виде ресурсы со всех планет<br><br>Активация по клавише <b>G</b>" },
    { name: "trade", url: "10283-uluchshenie-ui-razdela-torgovlya", title: "Улучшение торга", info: "Делает форму создания лота в меню Торговля более удобной и информативной" },
    { name: "exptime", url: "", title: "Время в экспедиции", info: "Отображает реальное время, которое флот проведет в экспедиции, в выпадающем списке формы отправки флота, а так же запоминает последний выбор" },
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

/********************************************************************************** 
 * DIALOG API
*/

var __zIndex = 20;
var __moveObject = null;
var ___sliderDragObj = null;
function __formMove(event) {
    if(__moveObject) {
        var deltaX = Math.max(0, ___sliderDragObj.l - (___sliderDragObj.x - event.clientX));
        __moveObject.style.left = deltaX.toString() + "px";
        var deltaY = Math.max(0, ___sliderDragObj.t  - (___sliderDragObj.y - event.clientY));
        __moveObject.style.top = deltaY.toString() + "px";
    }
}

function __formMoveUp() {
    document.removeEventListener("mousemove", __formMove);
    document.removeEventListener("mouseup", __formMoveUp);
    window.localStorage["pos_x_" + __moveObject.id] = __moveObject.style.left;
    window.localStorage["pos_y_" + __moveObject.id] = __moveObject.style.top;
    __moveObject = null;
}

function dlgBeginMove(event, obj) {
    __moveObject = document.getElementById(obj);
    __moveObject.style.zIndex = __zIndex++;
    ___sliderDragObj = {x: event.clientX, y: event.clientY, l: __moveObject.offsetLeft, t: __moveObject.offsetTop};
    document.addEventListener("mousemove", __formMove);
    document.addEventListener("mouseup", __formMoveUp);
}

function dlgCreate(name) {
    var dlg = document.createElement("div");
    dlg.setAttribute('style', 'width: 400px; position: fixed; left: 30%; top: 15%; z-index: 16; box-shadow: 0 0 5px 0px black; background-color: black; display: none;');
    dlg.id = name;
    document.body.appendChild(dlg);

    if(window.localStorage["pos_x_" + name]) {
        dlg.style.left = window.localStorage["pos_x_" + name];
        dlg.style.top = window.localStorage["pos_y_" + name];
    }
}

function dlgShow(name) {
    $("#" + name).show();
}

function dlgHide(name) {
    $("#" + name).hide();
}

/**********************************************************************************/

function injectOptions(oldStyle) {
    var arr = $("input[type=submit]");
    if(arr.length && arr[0].value == "[ Сохранить изменения ]") {
        var text = "";
        for(var i in pluginList) {
            if(!pluginList[i].user || userID == pluginList[i].user)
                text += '<tr>\
                    <th onmouseover="return overlib(\'<table width=200><tr><td class=h><font color=#CDB5CD>' + pluginList[i].info + '</font></td></tr></table>\');" onmouseout="return nd();">' + pluginList[i].title + '</th>\
                    <th><a target="_blank" title="Обсудить дополнение на форуме XGame" href="https://forum.xgame-online.com/topic/' + pluginList[i].url + '/"><div class="icons_min icons_min_message">&nbsp;</div></a></th>\
                    <th style="width: 20px;"><input type="checkbox" style="cursor: pointer;" id="p_' + pluginList[i].name + '"></th>\
                    </tr>';
        }

        var doc = document.createElement("table");
        doc.width = 570;
        doc.className = "shadow-hover";
        doc.innerHTML = '<tr><th colspan="3"></th></tr>\
            <tr><td colspan="3" class="c" style="color: #EEDC82;">Плагины для дополнительных удобств</td></tr>\
            <tr><th colspan="3"></th></tr>\
            <tr><th colspan="3" style="color: #CDB5CD; padding: 0 20px;">В этом разделе собраны плагины от сторонних разработчиков, которые улучшают или дополняют те или иные части интерфейса игры в браузере. Количество плагинов: <span style="color: rgb(255, 165, 0);">' + pluginList.length + '</span></th></tr>\
            <tr><th colspan="3"></th></tr>' + text + '<tr><th colspan="3"></th></tr>\
            <tr><td colspan="3" class="c"><button onclick="savePlugins()" style="cursor: pointer;">[ Сохранить настройки плагинов ]</button></td></tr>\
            <tr><th colspan="3"></th></tr>';
        var splitter = document.createElement("div");
        splitter.id = "br";
        if(oldStyle) {
            try {
                $("table")[3].parentNode.parentNode.appendChild(splitter);
                $("table")[3].parentNode.parentNode.appendChild(doc);
            }
            catch(e) {
                $("table")[2].parentNode.parentNode.appendChild(splitter);
                $("table")[2].parentNode.parentNode.appendChild(doc);
            }
        }
        else {
            var arr = $("table");
            arr[2].parentNode.parentNode.appendChild(splitter);
            arr[2].parentNode.parentNode.appendChild(doc);
        }
        for(var i in pluginList) {
            var pname = "p_" + pluginList[i].name;
            document.getElementById(pname).checked = window.localStorage.getItem(pname) == "true";
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
