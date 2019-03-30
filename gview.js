var _gv__start = false;
var _gv__startX = 0;
var _gv__delta = 0;

if(!isNewStyle) {
    var arr = $("input[name=system]");
    if(arr.length == 1) {
        var element = $("table")[2];
        element.style.overflow = "hidden";

        element.ontouchstart = function(e) {
            _gv__start = true;
            _gv__startX = e.touches[0].screenX;
        }

        element.ontouchmove = function(e) {
            if(_gv__start) {
                _gv__delta = -_gv__startX + e.touches[0].screenX;
                if(Math.abs(_gv__delta) > 10)
                    this.childNodes[0].style.transform = 'translate(' + _gv__delta + "px)";
            }
        }

        element.ontouchend = function(e) {
            if(_gv__start) {
                _gv__start = false;
                if(Math.abs(_gv__delta) > 100) {
                    var sys = _gv__delta < 0 ? 1 : -1;
                    var result = parseInt($("input[name=system]").val()) + sys;
                    if(result == 0) result = 999;
                    if(result == 1000) result = 1;
                    window.location = "galaxy.php?mode=1&galaxyGO=1&systemGO=" + result;
                }
                else {
                    this.childNodes[0].style.transform = "";
                }
            }
        }
    }
}