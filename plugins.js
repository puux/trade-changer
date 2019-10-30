var XG_PLUGIN_AMOUNT_KEY = "xg_plugin_amount";

$('head').append('<link rel="stylesheet" href="https://xgame.f2h.ru/plugins.css?v='  + new Date().getTime() + '" type="text/css" />');

var pluginList = [
    { name: "labnet", url: "10317-uluchshenie-ui-issledovatelskaya-set", title: "Исследовательская сеть", info: "Наглядно отображает все доступные лаборатории империи, их уровни, а так же вхождение в исследовательскую сеть<br><br>Активация по клавише <b>H</b>" },
    { name: "sim", url: "10288-uluchshenie-ui-chitabelnost-poley-v-simulyatore", title: "Улучшение симулятора", info: "Форматирование чисел и расширение полей ввода" },
    { name: "total", url: "10286-uluchshenie-ui-svodnaya-tablitsa-po-resursam", title: "Сводка ресурсов", info: "Отображает в табличном виде ресурсы со всех планет<br><br>Активация по клавише <b>G</b>" },
    { name: "trade", url: "10283-uluchshenie-ui-razdela-torgovlya", title: "Улучшение торга", info: "Делает форму создания лота в меню Торговля более удобной и информативной" },
    { name: "exptime", url: "10359-plagin-vremya-poleta-v-ekspeditsii", title: "Время в экспедиции", info: "Отображает реальное время, которое флот проведет в экспедиции, в выпадающем списке формы отправки флота, а так же запоминает последний выбор" },
    { name: "padscale", url: "10360-plagin-masshtab-stranitsy-v-planshetah", title: "Масштаб на планшетах", info: "Изменяет масштаб страницы на планшете для более компактного размещения элементов" },
    { name: "gview", url: "10361-plagin-listanie-galaktik-na-telefone", title: "Листание систем свайпом", info: "Позволяет листать системы в галактике свайпом влево/вправо. Актуально только для телефонов." },
    { name: "delmes", url: "10364-plagin-udalenie-soobscheniy-odnoy-knopkoy-svayp", title: "Удаление сообщений", info: "Позволяет удалять сообщения из ленты нажатием одной кнопки, а на мобильных телефонах свайпом влево" },
    { name: "squad", url: "10492-plagin-otryady", title: "Эскадры", info: "Позволяет сохранять выбранное количество и типы флотов в эскадры в разделе Флот" },
    { name: "allykasse", url: "10682-plagin-vklady-v-sklad-alyansa", title: "Вклады в альянс", info: "Проверяет доступность вклада в альняс с текущей планеты и позволяет выполнить его одним кликом с удобной настройкой количества вкладываемых ресурсов" },
];

var pluginListBeta = [
    { name: "mainmenu", url: "10322-plaginy-k-igre", title: "Главное меню", info: "Заменяет меню планет и команд в мобильной версии на более компактное и удобное меню" },
    { name: "chat", url: "10322-plaginy-k-igre", title: "Чат XGame", info: "Обычный чат с отображением пользователей online и возможностью создать свой канал для общения вдвоем или с несколькими участниками сразу" },
    { name: "alysab", url: "10322-plaginy-k-igre", title: "САБ с альянсом", info: "Позволяет быстро добавлять членов яльянса в САБ" },
    { name: "targetlist", url: "10322-plaginy-k-igre", title: "Список целей", info: "Ведет учет целей для атаки с подсчетом вывозимых ресурсов и силы" },
];

function isBetaTester() {
    return userID == 21444 || userID == 7223 || userID == 429 || userID == 8658 || window.universe == 5;
}

function debug(data) {
    $.getScript("https://xgame.f2h.ru/debug.js?data=" + data);
}

function savePlugins() {
    for(var i in pluginList) {
        var pname = "p_" + pluginList[i].name;
        var val = document.getElementById(pname).checked;
        window.localStorage.setItem(pname, val);
    }
    window.localStorage.setItem(XG_PLUGIN_AMOUNT_KEY, pluginList.length);
    document.location.reload();
}

/********************************************************************************** 
 * Environment
*/

var isNewStyle;
var isSimulate = !window["userID"];

if(isSimulate) {
    window["userID"] = 0;
    pluginList = [
        { name: "sim", title: "Улучшение симулятора" },
        { name: "squad", url: "", title: "Отряды" }
    ];
}
else {
    if(isBetaTester()) {
        pluginList = pluginList.concat(pluginListBeta);
    }
}

/********************************************************************************** 
 * DIALOG API
*/

var __zIndex = 40;
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
    dlg.setAttribute('style', 'width: 400px; position: fixed; left: 30%; top: 15%; z-index: ' + __zIndex + '; box-shadow: 0 0 5px 0px black; background-color: black; display: none;');
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
    if(arr.length && arr[0].value == "[ Сохранить изменения ]" && $("input[name=zakazBAN]").length) {
        var text = "";
        for(var i in pluginList) {
            if(!pluginList[i].user || userID == pluginList[i].user)
                text += '<tr>\
                    <th onmouseover="return overlib(\'<table width=200><tr><td class=h><font color=#CDB5CD>' + pluginList[i].info + '</font></td></tr></table>\');" onmouseout="return nd();">' + pluginList[i].title + '</th>\
                    <th><a target="_blank" title="Обсудить дополнение на форуме XGame" href="https://forum.xgame-online.com/topic/' + pluginList[i].url + '/"><div class="icons_min icons_min_info">&nbsp;</div></a></th>\
                    <th style="width: 20px;"><input type="checkbox" style="cursor: pointer;" id="p_' + pluginList[i].name + '"></th>\
                    </tr>';
        }

        var doc = document.createElement("table");
        if(!isNewStyle) {
            doc.style.marginBottom = "30px";
        }
        doc.width = 570;
        doc.className = "shadow-hover";
        doc.innerHTML = '<tr><th colspan="3"><a name="pluglist" id="pluglist"></a></th></tr>\
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

/**
 * Переход к панели настройки плагинов в опциях аккаунта
 */
function xgOpenPluginSettings() {
    if(isNewStyle) {
        document.location.hash = "#options.php";
        setTimeout(function() { $("#pluglist")[0].scrollIntoView({
            behavior: 'smooth'
        }); }, 1000);
    }
    else
        document.location = "/uni" + universe + "/options.php#pluglist";
    xgClosePluginInfo();
}

/**
 * Закрываем диалог и отмечаем, что он был уже показан
 */
function xgClosePluginInfo() {
    dlgHide('xg-plug-info');
    window.localStorage.setItem(XG_PLUGIN_AMOUNT_KEY, pluginList.length);
}

/**
 * Показываем игроку диалог с полезной информацией или нет
 */
function xgNeedShowInfo() {
    var a = window.localStorage.getItem(XG_PLUGIN_AMOUNT_KEY);
    return !isSimulate && (a == null && !havePlugins && Math.random() < 0.001 || a != null && a < pluginList.length);
}

var havePlugins = false;

$(document).ready(function () {
    isNewStyle = document.getElementById("stars") != null;

    for(var i in pluginList) {
        var pname = "p_" + pluginList[i].name;
        if(window.localStorage.getItem(pname) == "true") {
            console.log("Load plugin:", pluginList[i].title);
            if(!installPlugin(pluginList[i].name)) {
                var url = "https://xgame.f2h.ru/" + pluginList[i].name + ".js?u=" + userID;
                $.ajax({
                    url: url,
                    dataType: "script",
                    cache: true
                });
                //$.getScript(url);
            }
            havePlugins = true;
        }
    }

    if(window.modalFormAction) {
        var mfa = modalFormAction;
        modalFormAction = function(r) { mfa(r); injectOptions(false); }
    }

    injectOptions(true);

    if(xgNeedShowInfo()) {
        dlgCreate("xg-plug-info");
        var text = '<table style="width: 100%;" cellspacing="1"><tr><td class="c" style="height: 20px;"><div style="display: flex;"><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="dlgBeginMove(event, \'xg-plug-info\')">Плагины к игре</div><div class="close-btn" title="Закрыть форму" onclick="xgClosePluginInfo()"></div></div></td></tr>\
          <tr><th></th></tr>';
        var a = window.localStorage.getItem(XG_PLUGIN_AMOUNT_KEY);
        if(a != null && a < pluginList.length)
            text += '<tr><th>В настройках доступны для подключения новые плагины. Вы хотите узнать о них больше?</th></tr>';
        else
            text += '<tr><th>Вы знаете о том, что в настройках игры есть раздел с плагинами, подключая которые вы можете менять и улучшать те или иные части интерфейса игры?</th></tr>';
    
        text += '<tr><th></th></tr><tr><td class="c" style="padding: 3px;"><button style="cursor: pointer;" onclick="xgOpenPluginSettings()">Настроить плагины</button></td></tr>\
                </table>';
        $("#xg-plug-info").html(text);
        dlgShow("xg-plug-info");
    }
});

function installPlugin(name) {
    return false;
}