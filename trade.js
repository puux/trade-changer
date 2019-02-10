function changeInput(obj) {
  obj.style.width = "120px";
  obj.style.fontSize = "12px";
  obj.style.textAlign = "center";
  obj.onkeyup = function(){
    var val1 = $('#sel_kol1').val().replace(/ /g, "");
    $('#sel_kol1').val(val1);
    var val2 = $('input[name=sel_kol2]').val().replace(/ /g, "");
    
    vibor_resa1(this.value);
    
    $('#sel_kol1').val(gap(val1));
    $('input[name=sel_kol2]').val(gap(val2));
  };
}

setInterval(function(){
  var arr = $(".shadow-hover");
  if(arr.length == 3 && arr[0].offsetHeight == 34) {
      var lots = arr[0].childNodes[1].childNodes[1].childNodes[5].childNodes[0].onmouseover.toString().replace(/\n|}/g, "").replace(/.*<td class=h>(.*)<\/td>.*/, function(s, f){ return f; });
      var sell = arr[0].childNodes[1].childNodes[1].childNodes[3].innerHTML;
      var buy = arr[0].childNodes[1].childNodes[1].childNodes[7].innerHTML;
    
      var btn = arr[0].childNodes[1].childNodes[1].childNodes[1].innerHTML.replace("no_padding", "");
    
      var complite = $(".shadow-hover")[1].childNodes[1].childNodes[1].childNodes[13].innerHTML.toString().replace(/\n|}/g, "").replace(/.*<td class=h>(.*)<\/td>.*/, function(s, f){ return f; });
    
      arr[0].innerHTML = '<tr><th class="c" colspan="3"></th>\
</tr><tr>\
    <th rowspan="6" width="125"><img style="cursor: pointer;" href="#marchand.php" src="/images/starwars/mercenaries/buyers_res.png" width="120" height="120"></th>\
    <td class="c" align="center">' + lots + '</td>\
	<td class="c" width="120" align="center" id="maxmin">Курс обмена</td>\
</tr>\
<tr><th class="c" colspan="2"></th>\
</tr><tr>\
	<th><font color="#CDB5CD">Продать</font> &nbsp;&nbsp;' + sell + '</th>\
	<th id="kurs_res1" style="cursor: pointer">1 <font color="#CDB5CD">к</font> 4 <font color="#CDB5CD">металла</font></th>\
</tr>\
<tr>\
	<th><font color="#CDB5CD">Получить</font>&nbsp;' + buy + '</th>\
	<th id="kurs_res2" style="cursor: pointer">1 <font color="#CDB5CD">к</font> 1 <font color="#CDB5CD">алмазов</font></th>\
</tr>\
<tr><th class="c" colspan="2"></th>\
</tr><tr>\
    <td class="c" align="center">' + complite + '</td>\
	<td class="c" align="center">' + btn + '</td>\
</tr>\
<tr><th class="c" colspan="3"></th>\
</tr>';

    changeInput($("#sel_kol1")[0]);
    changeInput($("input[name=sel_kol2]")[0]);
    
    $("input[type=submit]")[0].onclick = function() {
      blockClick(this);
      $("#sel_kol1").val( $("#sel_kol1").val().replace(/ /g, "") );
      $("input[name=sel_kol2]").val( $("input[name=sel_kol2]").val().replace(/ /g, "") );
    }
    
    $("#kurs_res1").click(function(){
      $("input[name=sel_kol2]").val(gap(parseInt($("#kurs_res1").html())));
    });
    $("#kurs_res2").click(function(){
      $("input[name=sel_kol2]").val(gap(parseInt($("#kurs_res2").html())));
    });
  }
}, 500);
