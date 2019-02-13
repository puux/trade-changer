function gap(n) {
    var reg = /(\d)(?=(\d\d\d)+\b)/ig
    var str = n+'';
    return str.replace(reg, '$1 ');
}

$(".number").each(function(i, e) {
  if(e.size == 7) e.size = 10;
  e.onblur2 = e.onblur;
  e.onblur = function(){
    this.value = gap(this.value);
    e.onblur2(e);
  };
})
