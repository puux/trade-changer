var bar = $(".menu-item").parent();

var arr = $(".menu-item select");

var planets = '<div class="planet-menu"><div class="content">';
var tagOpened = false;
var numPlanets = 0;
var itemIndex = 0;
for(var i = 0; i < arr[0].childNodes.length; i++) {
  var node = arr[0].childNodes[i];
  if(node.tagName == "OPTION") {
    var current = arr[0].selectedIndex == itemIndex;
    var name = node.innerHTML;
    var isMoon = name.indexOf("]*") > 0;
    if(isMoon) {
      planets += '<a class="planet-moon ' + (current ? "cur-moon" : "") + '" href="' + node.value + '"></a></div>';
      tagOpened = false;
    }
    else {
      if(tagOpened) {
        planets += '<div class="moon-empty"></div></div>';
      }
      var b = 32*numPlanets;
      planets += '<div class="item std-box"><a class="planet-link" href="' + node.value + '"><div class="planet-icon ' + (current ? "cur-planet" : "") + '" style="background-position-y: -' + b + 'px;"></div><div>' + name + '</div></a>';
      tagOpened = true;
      numPlanets ++;
    }
    
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
  window.removeEventListener("click", closeLeftMenu);
  $(".planet-menu").slideDown('fast');
  setTimeout(function(){ window.addEventListener("click", closeLeftMenu);}, 1);
}

function closeLeftMenu() {
  $(".planet-menu").css("display", "none");
  window.removeEventListener("click", closeLeftMenu);
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
    { icon: "icon-forum", url: "../forum/", title: "Форум"},
    { icon: "icon-vk", url: "../vk/", title: "ВКонтакте"},
    { icon: "icon-spellage", url: "../spellage/", title: "Spellage"},
    { icon: "icon-logout", url: "logout.php", title: "Выход"},
];

var commands = '<div class="tools-menu"><div class="content">';
for(var i in cmdItems)
    commands += '<a class="item std-box" href="' + cmdItems[i].url + '"><div><div class="' + cmdItems[i].icon + '"></div></div>' + cmdItems[i].title + '</a>';
commands += '</div></div>';

window.xgShowRightMenu = function() {
  window.removeEventListener("click", closeRightMenu);
  $(".tools-menu").slideDown('fast');
  setTimeout(function(){ window.addEventListener("click", closeRightMenu);}, 1);
}

function closeRightMenu() {
  $(".tools-menu").css("display", "none");
  window.removeEventListener("click", closeRightMenu);
}

bar.removeClass("row").addClass("main-menu").parent().css("overflow", "inherit");
bar.html('<div class="leftmenu" onclick="window.xgShowLeftMenu();"><div class="leftmenu-icon">' + planets + '</div></div><div class="time" id="times">00:00:00</div><div class="rightmenu" onclick="window.xgShowRightMenu();"><div class="rightmenu-icon">' + commands + '</div></div>');
