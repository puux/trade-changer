window.closeXgChat = function(){
    $("#xg-chat").hide();
}

dlgCreate("xg-chat");

var text = '<div class="chat-panel">\
            <div class="std-title-box" style="height: 20px; display: flex; align-items: center;"><div style="flex-grow: 1; cursor: move; user-select: none; font-weight: bold;" onmousedown="dlgBeginMove(event, \'xg-chat\')">Чат XGame</div><div class="close-btn" title="Закрыть форму" onclick="window.closeXgChat()"></div></div>\
            <div class="std-box"></div>\
            <div style="display: flex; flex-grow: 1;">\
                <div class="vc-panel" style="margin-right: 1px;">\
                    <div class="std-title-box" style="width: 140px; margin-bottom: 1px; height: 18px; display: flex; align-items: center; justify-content: center;">Игроки online</div>\
                    <div class="std-box" style="flex-grow: 1; position: relative;"><div class="players" id="online-list"></div></div>\
                </div>\
                <div class="vc-panel" style="flex-grow: 1;">\
                    <div class="std-title-box" style="margin-bottom: 1px; height: 18px;">Канал чата: <select id="rooms"><option value="0">Вся вселенная</option></select> <button onclick="addRoom()"> + </button></div>\
                    <div class="std-box chat-content"><div id="xg-chat-messages"></div></div>\
                    <div class="std-box" style="margin-top: 1px; display: flex; align-items: center;"><textarea id="msg-text" class="chat-input" placeholder="нажми Enter для отправки сообщения" title="Shift+Enter перевод на новую строку"></textarea><button id="chat-send">>></button></div>\
                </div>\
            </div>\
            <div class="std-box"></div>\
            <div class="std-title-box" style="display: flex; flex-direction: row; padding: 2px;"><div style="flex-grow: 1;">Всего игроков online: 1</div><div><div id="ws-connection"></div></div></div>\
            </div>';

$("#xg-chat").html(text);

$("#xg-chat").show();

$("#rooms").change(function(){
    $("#xg-chat-messages").html("");
    $("#online-list").html("");
    lstMessageId = 0;
    socket.send(JSON.stringify(
        {cmd: "room", room: this.value}
    ));
    saveChannelList();
});
restoreChannelList();

function saveChannelList() {
    var obj = {select: $("#rooms").val(), list: []};
    $("#rooms").children("option").each(function(){
        if(this.value != "0")
            obj.list.push(this.value);
    });
    window.localStorage["channel-list"] = JSON.stringify(obj);
}

function restoreChannelList() {
    if(window.localStorage["channel-list"]) {
        var obj = JSON.parse(window.localStorage["channel-list"]);
        for(var i in obj.list) {
            $("#rooms").append('<option value="' + obj.list[i] + '">' + obj.list[i] + '</option>');
        }
        $("#rooms").val(obj.select);
    }
}

function addRoom() {
    var id = prompt("Введите уникальный ID канала");
    if(id) {
        socket.send(JSON.stringify(
            {cmd: "addroom", room: id}
        ));
    }
}

function zero(value) {
    return value < 9 ? "0" + value : value;
}

function getTimeStamp() {
    var date = new Date();
    return zero(date.getHours()) + ":" + zero(date.getMinutes());
}

function addMsg(login, time, text, type) {
    $("#xg-chat-messages").append('<div class="chat-line' + (type ? " msg-" + type : "") + '">\
            <div class="chat-title"><div class="chat-login">' + login + '</div><div class="chat-time">' + time + '</div></div>\
            <div class="chat-text">' + text.replace(/</g, "&lt;").replace(/\n/g, "<br>") + '</div>\
        </div>');
    $("#xg-chat-messages").scrollTop(32000);
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight + 4)+"px";
    $("#xg-chat-messages").scrollTop(32000);
}

$("#msg-text").keydown(function(e){
    if(e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        $("#chat-send").click();
    }
    auto_grow($("#msg-text")[0]);
});
$("#msg-text").keyup(function(e){
    auto_grow($("#msg-text")[0]);
});

$("#chat-send").on("click", function(){
    addMsg(myLogin, getTimeStamp(), $("#msg-text").val());
    socket.send(JSON.stringify(
        {cmd: "message", text: $("#msg-text").val()}
    ));

    $("#msg-text").val("");
    auto_grow($("#msg-text")[0]);
});

var lstMessageId = 0;

var socket;

var myLogin = $("#player-name").html() || "User" + userID;

function connectToChatServer() {
    $("#ws-connection").html("соединение...");
    socket = new WebSocket("wss://xgame.f2h.ru/ws/");

    socket.onopen = function() {
        $("#ws-connection").html("online");
        socket.send(JSON.stringify({
            cmd: "auth",
            login: myLogin,
            lastid: lstMessageId,
            room: document.getElementById("rooms").value,
            uni: universe
        }));
    };
    
    socket.onclose = function(event) {
        setTimeout(connectToChatServer, 1000);
    };

    socket.onmessage = function(event) {
        var cmd = JSON.parse(event.data);
        if(cmd.cmd == "message") {
            addMsg(cmd.login, cmd.time, cmd.msg, cmd.type);
            if(lstMessageId)
                document.getElementById("audio-massage").play();
            if(cmd.id)
                lstMessageId = cmd.id;
        }
        else if(cmd.cmd == "online-list") {
            var text = "";
            for(var i in cmd.list) {
                var item = cmd.list[i];
                text += '<div>' + item.login + '</div>';
            }
            $("#online-list").html(text);
        }
        else if(cmd.cmd == "addchannel") {
            $("#rooms").append('<option value="' + cmd.id + '">' + cmd.title + '</option>');
            saveChannelList();
        }
        else if(cmd.cmd == "channelinfo") {
            $("option[value=" + cmd.id + "]").text(cmd.title);
        }
    };

    socket.onerror = function(error) {
        // setTimeout(connectToChatServer, 1000);
    };
}

connectToChatServer();
