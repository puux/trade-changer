var _gv__start = false;
var _gv__startX = 0;
var _gv__startY = 0;
var _gv__delta = 0;

function gotoSystem(galaxy, sys) {
    return "galaxy.php?mode=1&galaxyGO=" + galaxy + "&systemGO=" + sys;
}

function getValidSystem(value) {
    if(value <= 0)
        return 999 + value;
    if(value >= 1000)
        return value - 1000 + 1;
    return value;
}

if(!isNewStyle) {
    var arr = $("input[name=system]");
    if(arr.length == 1) {
        var element = $("table")[2];
        element.style.overflow = "hidden";

        element.ontouchstart = function(e) {
            _gv__startX = e.touches[0].screenX;
            _gv__startY = e.touches[0].screenY;
        }

        element.ontouchmove = function(e) {
            _gv__delta = -_gv__startX + e.touches[0].screenX;
            _gv__delta2 = -_gv__startY + e.touches[0].screenY;
            if((_gv__start || Math.abs(_gv__delta) > 10 && Math.abs(_gv__delta2) < 10) && e.touches.length == 1) {
                _gv__start = true;
                this.childNodes[0].style.transform = 'translate(' + _gv__delta + "px)";
            }
        }

        element.ontouchend = function(e) {
            if(_gv__start) {
                _gv__start = false;
                if(Math.abs(_gv__delta) > 100) {
                    var sys = _gv__delta < 0 ? 1 : -1;
                    var result = getValidSystem(parseInt($("input[name=system]").val()) + sys);
                    var galaxy = parseInt($("input[name=galaxy]").val());

                    var table = this;
                    var content = "";
                    var effect = false;
                    $(table.childNodes[0]).fadeOut(400, function(){
                        effect = true;
                        if(content) {
                            table.childNodes[0].style.transform = "";
                            table.childNodes[0].innerHTML = content;
                            $(table.childNodes[0]).fadeIn();
                        }
                    });
                    $.get(gotoSystem(galaxy, result), function(data) {
                        var arr = data.match(/<\/script><table(.*)ю<\/font><\/a> \]<\/th><\/tr>/gs);
                        content = arr[0].substring(28);
                        $("input[name=system]").val(result);
                        var iTd = $("input[name=system]").parent();
                        iTd.prev().children().attr("href", gotoSystem(galaxy, getValidSystem(result-1)));
                        iTd.prev().prev().children().attr("href", gotoSystem(galaxy, getValidSystem(result-10)));
                        iTd.prev().prev().prev().children().attr("href", gotoSystem(galaxy, getValidSystem(result-100)));
                        iTd.next().children().attr("href", gotoSystem(galaxy, getValidSystem(result+1)));
                        iTd.next().next().children().attr("href", gotoSystem(galaxy, getValidSystem(result+10)));
                        iTd.next().next().next().children().attr("href", gotoSystem(galaxy, getValidSystem(result+100)));
                        if(effect) {
                            table.childNodes[0].style.transform = "";
                            table.childNodes[0].innerHTML = content;
                            $(table.childNodes[0]).fadeIn();
                            content = "";
                        }
                    })
                }
                else {
                    this.childNodes[0].style.transform = "";
                }
            }
        }
    }
}