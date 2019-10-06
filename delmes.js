var _gvms__start = false;
var _gvms__startX = 0;
var _gvms__startY = 0;
var _gvms__delta = 0;

window.xgDeleteMessage = function(obj) {
  var params = {};
  params["delmes" + obj] = 'on';
  params["messages"] = 1;
  params["deletemessages"] = 'deletemarked';
  params["deletemessages2"] = 'deletemarked';
  params["category"] = 100;
  $.post("messages.php?mode=show&messcat=100&lim=1", params, function(){
    // do nothing
  });
  
  var line = $("input[name=showmes" + obj + "]").parent();
  line.fadeOut();
  line.next().fadeOut();
};

function applyEvents(element, id) {
  element.ontouchstart = function(e) {
      _gvms__startX = e.touches[0].screenX;
      _gvms__startY = e.touches[0].screenY;
  }

  element.ontouchmove = function(e) {
      _gvms__delta = -_gvms__startX + e.touches[0].screenX;
      _gvms__delta2 = -_gvms__startY + e.touches[0].screenY;
      if(_gvms__start || Math.abs(_gvms__delta) > 10 && Math.abs(_gvms__delta2) < 10) {
          _gvms__start = true;
          if(_gvms__delta > 0) _gvms__delta = 0;
          var value = 'translate(' + _gvms__delta + "px)";
          $(this).prev().css("transform", value);
          this.style.transform = value;
      }
  }

  element.ontouchend = function(e) {
      if(_gvms__start) {
          _gvms__start = false;
          if(Math.abs(_gvms__delta) > 100) {
              var sys = _gvms__delta < 0 ? 1 : -1;
              window.xgDeleteMessage(id);
          }
          else {
              $(this).prev().css("transform", "");
              this.style.transform = "";
          }
      }
  }
}

function parseMessagesForDelete() {
  var arr = $("input[name=sortDesc]");
  if(arr.length) {
    
    var rows = arr[0].parentNode.childNodes[2];
    rows.style.overflow = 'hidden';
    for(var i = 0; i < rows.childNodes.length; i++) {
      if(rows.childNodes[i].childNodes.length && rows.childNodes[i].childNodes[0].tagName == "INPUT") {
        var date = rows.childNodes[i].childNodes[2].innerHTML;
        var from = rows.childNodes[i].childNodes[3].innerHTML;
        var subject = rows.childNodes[i].childNodes[4].innerHTML;
        
        var id = rows.childNodes[i].childNodes[0].value;
        rows.childNodes[i+1].childNodes[2].innerHTML = '<a title="Удалить сообщение" onclick="window.xgDeleteMessage(\'' + id + '\')"><div class="icons_min icons_min_delete1">&nbsp;</div></a>';
        
        var element = rows.childNodes[i+1];
        applyEvents(element, id);
      }
    }
  }
}

if(modalFormAction) {
  var mfadel = modalFormAction;
  modalFormAction = function(r) { mfadel(r); parseMessagesForDelete(); }
}
parseMessagesForDelete();