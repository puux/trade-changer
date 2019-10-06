var isSimulate = !window["userID"];

var shiptitles = {
    ship202: "Малый танкер",
    ship203: "Большой танкер",
    ship210: "Шпионский зонд",
    ship208: "Колонизатор",
    ship209: "Переработчик",
    ship204: "Корвет",
    ship205: "Фрегат",
    ship206: "Крейсер",
    ship207: "Линкор",
    ship215: "Линейный крейсер",
    ship211: "Броненосец",
    ship216: "Эсминец",
    ship213: "Флагман",
    ship217: "Авианосец",
    ship214: "Сверхновая Звезда",
};

var shipIds = [
    202,
    203,
    210,
    208,
    209,
    204,
    205,
    206,
    207,
    215,
    211,
    216,
    213,
    217,
    214,
];

if (isSimulate)
    window.universe = $("input[name=uni]").val().substring(3);

var lastId = parseInt(window.localStorage['xg_unions_lid'] || 1);
var unions = JSON.parse(window.localStorage['xg_unions_' + universe] || "[]");

window.onstorage = function (event) {
    unions = JSON.parse(window.localStorage['xg_unions_' + universe] || "[]");
    insertTable();
};

window.xgDeleteUnion = function (id) {
    if(confirm("Вы действительно хотите удалить эскадру?")) {
        for (var i in unions) {
            if (unions[i].id == id) {
                unions.splice(i, 1);
                $("#union-" + id).fadeOut("fast", insertTable);
                break;
            }
        }
        xgStoreUnions();
    }
};

function makeUnion() {
    var union = {
        id: ++lastId,
        name: "",
        ships: []
    };
    for (var i in shipIds) {
        var ship = 'ship' + shipIds[i];
        var amount = parseInt($('#' + ship).val());
        if (amount)
            union.ships.push({ id: ship, amount: amount });
    }
    return union;
}

function xgStoreUnions() {
    window.localStorage['xg_unions_' + universe] = JSON.stringify(unions);
    window.localStorage['xg_unions_lid'] = lastId;
}

window.xgSaveUnion = function (id) {
    if(confirm("Вы действительно хотите перезапись эскадру?")) {
        var u = makeUnion();
        for (var i in unions) {
            if (unions[i].id == id) {
                unions[i].ships = u.ships;
                break;
            }
        }
        xgStoreUnions();
        insertTable();
    }
};

window.xgCreateUnion = function () {
    var u = makeUnion();
    u.name = prompt("Введите название зскадры", "Эскадра " + lastId);
    if (u.name) {
        unions.push(u);
        insertTable();
        xgStoreUnions();
    }
};

window.xgLoadUnion = function (id) {
    for (var i in unions) {
        if (unions[i].id == id) {
            for (var s in unions[i].ships)
                $('#' + unions[i].ships[s].id).val(unions[i].ships[s].amount);
            break;
        }
    }
    calc_capacity();
};

function pad(value) {
    return String(value).split(/(?=(?:...)*$)/).join(" ");
}

function insertTable() {
    $("#unions").remove();

    var table = $($(".th-hover.shadow-hover")[0].parentNode);
    var text = '<table id="unions" width="570" class="shadow-hover"><tr><th colspan="5" class="c"></th></tr>';
    for (var i in unions) {
        union = unions[i];
        var amount = 0;
        var hintBody = '';
        for (var a in union.ships) {
            amount += union.ships[a].amount;
            hintBody += '<tr><td class=h>' + shiptitles[union.ships[a].id] + '</td><td class=h>' + pad(union.ships[a].amount) + '</td></tr>';
        }
        var hint = 'onmouseover="return overlib(\'<table width=200><tr><td class=c>Тип корабля</td><td class=c>Количество</td></tr>' + hintBody + '</table>\', STICKY, MOUSEOFF, DELAY, 1000, LEFT, OFFSETX, -1, OFFSETY, 20);" onmouseout="return nd();"';
        text += '<tr id="union-' + union.id + '"><th><a ' + hint + ' href="javascript: xgLoadUnion(' + union.id + ')">' + union.name + '</a></th><th>' + pad(amount) + '</th><th><a href="javascript: xgSaveUnion(' + union.id + ')">[ <font color="#CDB5CD">Сохранить</font> ]</a></th><th><a href="javascript: xgDeleteUnion(' + union.id + ')">[ <font color="#CDB5CD">Удалить</font> ]</a></th>';
        if (i == 0)
            text += '<th rowspan="' + unions.length + '" style="width: 50px;"><button onclick="return xgCreateUnion(),false" style="font-size: 30px;">+</button></th>';
        text += '</tr>';
    }
    if(unions.length == 0)
        text += '<tr><th colspan="5"><button onclick="return xgCreateUnion(),false">[ сохранить эскадру ]</button></th></tr>';
    text += '<tr><th colspan="5" class="c"></th></tr><tr></table>';

    table.append(text);
}

function parseUnions() {
    var arr = $("form[name=floten1]");
    if (arr.length) {

        insertTable();
    }
}

function makeUnionFromSim() {
    var union = {
        id: ++lastId,
        name: "",
        ships: []
    };
    for (var i in shipIds) {
        var ship = shipIds[i];
        var amount = parseInt($('input[name=gr0-' + ship + ']').val());
        if (amount)
            union.ships.push({ id: 'ship' + ship, amount: amount });
    }
    return union;
}

if (isSimulate) {
    window.saveSquad = function () {
        var id = parseInt($("#squad").val());
        var u = makeUnionFromSim();
        if (id) {
            for (var i in unions) {
                if (unions[i].id == id) {
                    unions[i].ships = u.ships;
                    break;
                }
            }
            xgStoreUnions();
        }
        else {
            u.name = prompt("Введите название эскадры", "Эскадра " + lastId);
            unions.push(u);
            xgStoreUnions();
        }
        $("#btn-save-squad").html('[ <font color="yellow">готово!</font> ]');
        setTimeout(function () { $("#btn-save-squad").html('[ запись ]') }, 2000);
    };

    var __opt = "";
    for (var i in unions) {
        __opt += '<option value="' + unions[i].id + '">' + unions[i].name + '</option>';
    }
    $("#def_td").append('Эскадра: <select id="squad">\
          <option value="0">(новый)</option>\
          ' + __opt + '\
      </select>\
      <button id="btn-save-squad" onclick="return saveSquad(), false" style="cursor: pointer;">[ запись ]</button>');
}
else {
    if (window.modalFormAction) {
        var mfaunion = modalFormAction;
        modalFormAction = function (r) { mfaunion(r); parseUnions(); }
    }
    parseUnions();
}
