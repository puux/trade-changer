var mainMenuOptions = {
  columns: 1,
  action: 0
};

var mainMenuStyles = '<style>\
.tools-menu[columns-2] { left: -288px !important; width: 324px !important; }\
.tools-menu[columns-2] .item { width: 145px !important; }\
</style>';

function clickMainMenuHeader() {
  if(mainMenuOptions.action == 1) {
    window.location = "overview.php";
  }
}

if(window.localStorage[mainmenuStorageKey()]) {
  var data = JSON.parse(window.localStorage[mainmenuStorageKey()]);
  mainMenuOptions.columns = data.columns;
  mainMenuOptions.action = data.action;
}

function xgInjectMainMenu() {
  var bar = $(".menu-item").parent();

  var arr = $(".menu-item select");

  var planets = '<div class="planet-menu"><div class="content">';
  var tagOpened = false;
  var numPlanets = 0;
  var itemIndex = 0;
  var currentIconStyle = "";
  var headerTitle = "";
  for(var nIndex = 0; nIndex < arr[0].childNodes.length; nIndex++) {
    var node = arr[0].childNodes[nIndex];
    if(node.tagName == "OPTION") {
      var current = arr[0].selectedIndex == itemIndex;
      var planetName = node.innerHTML;
      var isMoon = planetName.indexOf("]*") > 0;
      if(isMoon) {
        planets += '<a class="planet-moon ' + (current ? "cur-moon" : "") + '" href="' + node.value + '"></a></div>';
        tagOpened = false;
        if(current) {
          currentIconStyle = 'background-image: url(\'' + node.getAttribute("image") + '\');';
          if(node.getAttribute("image") != "/images/planets/moon.png")
            currentIconStyle += "background-size: 32px;";
        }
      }
      else {
        if(tagOpened) {
          planets += '<div class="moon-empty"></div></div>';
        }
        var offsetY = 32*(parseInt(node.getAttribute("y"))/44);
        var style = node.getAttribute("y") ? 'background-position-y: ' + offsetY + 'px;' : "background-size: 32px;";
        var image = node.getAttribute("image");
        if(image != "/mini_planets.png")
          style += 'background-image: url(\'' + image + '\');';
        if(current)
          currentIconStyle = style;

        planets += '<div class="item std-box"><a class="planet-link" href="' + node.value + '"><div class="planet-icon ' + (current ? "cur-planet" : "") + '" style="' + style + '"></div><div style="overflow: hidden; text-overflow: ellipsis; max-width: 136px;">' + planetName + '</div></a>';
        tagOpened = true;
        numPlanets ++;
      }
      if(current)
        headerTitle = planetName;
      
      itemIndex ++;
    }
  }

  if(tagOpened) {
    planets += '<div class="moon-empty"></div></div>';
  }
  //if(numPlanets % 2 == 1) {
  //  planets += '<div class="item std-box"></div>';
  //}
  planets += '</div></div>';

  window.xgShowLeftMenu = function() {
    if($(".planet-menu").css("display") == "none") {
      window.removeEventListener("click", closeLeftMenu);
      $(".planet-menu").slideDown('fast');
      setTimeout(function(){ window.addEventListener("click", closeLeftMenu);}, 1);
    }
    else {
      $(".planet-menu").css("display", "none");
      window.removeEventListener("click", closeLeftMenu);
    }
  }

  function closeLeftMenu(event) {
    event.preventDefault();
    $(".planet-menu").css("display", "none");
    window.removeEventListener("click", closeLeftMenu);
    return false;
  }

  var cmdItems = [
      { icon: "icon-profile", url: "user.php", title: "Профиль"},
      { icon: "icon-friends", url: "buddy.php", title: "Друзья"},
      { icon: "icon-ignore", url: "buddy.php?a=3", title: "Игнорировать"},
      { icon: "icon-ref", url: "referrals.php", title: "Наставник"},
      { icon: "icon-hall", url: "hall.php", title: "Зал Славы"},
      { icon: "icon-dock", url: "dock.php", title: "Док"},
      { icon: "icon-quest", url: "quest.php", title: "Квесты"},
      { icon: "icon-questions", url: "questions.php", title: "Вопросы"},
      { icon: "icon-savekb", url: "savekb.php", title: "Доклады"},
      { icon: "icon-allykasse", url: "allykasse.php", title: "Склад альянса"},
      { icon: "icon-portal", url: "buildings.php?gid=43", title: "Врата"},
      { icon: "icon-auction", url: "auction.php", title: "Аукцион"},
      { icon: "icon-market", url: "market.php", title: "Рынок"},
      { icon: "icon-marchand", url: "marchand.php", title: "Скупщики"},
      { icon: "icon-vip flip", url: "vip.php", title: "VIP"},
      { icon: "icon-shop", url: "shop.php", title: "Аккаунты"},
      { icon: "icon-stavki", url: "stavki.php", title: "События"},
      { icon: "icon-banned", url: "banned.php", title: "Баны"},
      { icon: "icon-notes", url: "notes.php", title: "Заметки"},
      { icon: "icon-fleetshortcut", url: "fleetshortcut.php", title: "Координаты"},
      { icon: "icon-overview", url: "overview.php?mode=1", title: "Планета"},
      { icon: "icon-relax", url: "relax.php", title: "Развлечения"},
      { icon: "icon-chat", url: "chat.php", title: "Станция связи"},
      { icon: "icon-rules", url: "rules.php", title: "Правила"},
      { icon: "icon-news", url: "news.php", title: "Обновления"},
      { icon: "icon-messages", url: "messages.php?id=admin", title: "Администрация"},
      { icon: "icon-forum", url: "../forum/", title: "Форум", blank: true},
      { icon: "icon-vk", url: "../vk/", title: "ВКонтакте", blank: true},
      { icon: "icon-spellage", url: "../spellage/", title: "Spellage", blank: true},
      { icon: "icon-logout", url: "logout.php", title: "Выход"},
  ];

  var commands = '<div class="tools-menu" ' + (mainMenuOptions.columns == 0 ? " columns-2" : "") + '><div class="content">';
  for(var cIndex in cmdItems)
      commands += '<a class="item std-box" href="' + cmdItems[cIndex].url + '"' + (cmdItems[cIndex].blank ? ' target="_blank"' : '') + '><div><div class="' + cmdItems[cIndex].icon + '"></div></div>' + cmdItems[cIndex].title + '</a>';
  commands += '</div></div>';

  window.xgShowRightMenu = function() {
    if($(".tools-menu").css("display") == "none") {
      window.removeEventListener("click", closeRightMenu);
      $(".tools-menu").slideDown('fast');
      setTimeout(function(){ window.addEventListener("click", closeRightMenu);}, 1);
    }
    else {
      $(".tools-menu").css("display", "none");
      window.removeEventListener("click", closeRightMenu);
    }
  }

  function closeRightMenu() {
    event.preventDefault();
    $(".tools-menu").css("display", "none");
    window.removeEventListener("click", closeRightMenu);
    return false;
  }

  bar.removeClass("row").addClass("main-menu").parent().css("overflow", "inherit");
  bar.html(mainMenuStyles + '<div class="leftmenu" onclick="window.xgShowLeftMenu();"><div class="leftmenu-icon" style="' + currentIconStyle + '">' + planets + '</div></div><div class="time" onclick="clickMainMenuHeader()" style="cursor: pointer; display: flex; padding: 0 14px; align-items: center; text-shadow: 2px 2px 2px black;"><div>' + headerTitle + '</div><span id="times" style="flex-grow: 1; text-align: right;">00:00:00</span></div><div class="rightmenu" onclick="window.xgShowRightMenu();"><div class="rightmenu-icon" style="background-image: url(https://xgame.f2h.ru/img/menu.png)">' + commands + '</div></div>');
}

if(!isNewStyle)
  xgInjectMainMenu();

function mainmenuStorageKey() {
  return "xg_mainmenu_" + universe;
}

function saveMainMenuOptions() {
  window.localStorage[mainmenuStorageKey()] = JSON.stringify(mainMenuOptions);
}

function mainMenuOptionsDialog(){
  if(!document.getElementById("mainmenu-params"))
    dlgCreate("mainmenu-params");
  dlgShow("mainmenu-params");

  var text = '<table style="width: 100%;" cellspacing="1">\
          <tr><td class="c" colspan="2" style="height: 20px;"><div style="display: flex;"><div style="flex-grow: 1; cursor: move; user-select: none;" onmousedown="dlgBeginMove(event, \'mainmenu-params\')">Настройки</div><div class="close-btn" title="Закрыть форму" onclick="dlgHide(\'mainmenu-params\')"></div></div></td></tr>\
          <tr><th colspan="2"></th></tr>\
          <tr><th>Колонок в меню</th><th><select id="param-1"><option value="0">2</option><option value="1">3</option></select></th></tr>\
          <tr><th>Клик по шапке</th><th><select id="param-2"><option value="0">(не задано)</option><option value="1">Перейти в Обзор</option></select></th></tr>\
          <tr><th colspan="2"></th></tr>';
  
  text += '</table>';     
  $("#mainmenu-params").css("width", "320px").html(text);
  $("#param-1").val(mainMenuOptions.columns).on("input", function(e){
    mainMenuOptions.columns = $("#param-1").val();
    saveMainMenuOptions();
    if(mainMenuOptions.columns == 0)
      $(".tools-menu").attr("columns-2", "");
    else
      $(".tools-menu").removeAttr("columns-2");
  });
  $("#param-2").val(mainMenuOptions.action).on("input", function(e){
    mainMenuOptions.action = $("#param-2").val();
    saveMainMenuOptions();
  });
}

if(window.enableOptionsButton)
  window.enableOptionsButton("mainmenu", mainMenuOptionsDialog);
