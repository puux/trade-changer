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

function _set_max(value) {
  $('#sel_kol1').val(gap(value));
  $("#sel_kol1")[0].onkeyup();
}

function detectTrade(){
  var arr = $(".shadow-hover");
  
  if($("select[name=res_vid1").length) {
      var lots = arr[0].childNodes[1].childNodes[1].childNodes[5].childNodes[0].onmouseover.toString().replace(/\n|}/g, "").replace(/.*<td class=h>(.*)<\/td>.*/, function(s, f){ return f; });
      var sell = arr[0].childNodes[1].childNodes[1].childNodes[3].innerHTML;
      var buy = arr[0].childNodes[1].childNodes[1].childNodes[7].innerHTML;
    
      var btn = arr[0].childNodes[1].childNodes[1].childNodes[1].innerHTML.replace("no_padding", "");
    
      var complite = $(".shadow-hover")[1].childNodes[1].childNodes[1].childNodes[13].innerHTML.toString().replace(/\n|}/g, "").replace(/.*<td class=h>(.*)<\/td>.*/, function(s, f){ return f; });
    
      arr[0].innerHTML = '<tr><th class="c" colspan="4"></th>\
</tr><tr>\
    <th rowspan="6" width="125"><img style="cursor: pointer;" href="#marchand.php" src="/images/starwars/mercenaries/buyers_res.png" width="120" height="120"></th>\
    <td class="c" align="center">' + lots + '</td><td class="c" align="center">' + complite + '</td>\
	<td class="c" width="120" align="center" id="maxmin">Курс обмена</td>\
</tr>\
<tr><th class="c" colspan="3"></th>\
</tr><tr>\
	<th colspan="2"><font color="#CDB5CD">Продать</font> &nbsp;&nbsp;' + sell.replace("14", "19") + '</th>\
	<th id="kurs_res1" style="cursor: pointer">1 <font color="#CDB5CD">к</font> 4 <font color="#CDB5CD">металла</font></th>\
</tr>\
<tr>\
	<th colspan="2"><font color="#CDB5CD">Получить</font>&nbsp;' + buy.replace("14", "19") + '</th>\
	<th id="kurs_res2" style="cursor: pointer">1 <font color="#CDB5CD">к</font> 1 <font color="#CDB5CD">алмазов</font></th>\
</tr>\
<tr><th class="c" colspan="3"></th>\
</tr><tr>\
    <td class="c" align="center" id="max-lot" style="color: #a0a0a0" colspan="2">' + '' + '</td>\
	<td class="c" align="center">' + btn + '</td>\
</tr>\
<tr><th class="c" colspan="4"></th>\
</tr>';

    changeInput($("#sel_kol1")[0]);
    changeInput($("input[name=sel_kol2]")[0]);
    
    var max = $("#sel_kol1")[0].title.replace(/^(.*)Max: /, "");
    $("#max-lot").html('Максимум на продажу: <span style="color: white;"><span style="cursor: pointer;" onclick="_set_max(' + max.replace(/&nbsp;|\ /g, "") + ')">' + max + '</span></span>');
    
    $("input[type=submit]")[0].onclick = function() {
      blockClick(this);
      $("#sel_kol1").val( $("#sel_kol1").val().replace(/ /g, "") );
      $("input[name=sel_kol2]").val($("input[name=sel_kol2]").val().replace(/ /g, "") );
    }
    
    $("#kurs_res1").click(function(){
      $("input[name=sel_kol2]").val(gap(parseInt($("#kurs_res1").html())));
    });
    $("#kurs_res2").click(function(){
      $("input[name=sel_kol2]").val(gap(parseInt($("#kurs_res2").html())));
    });

    var save_vibor_resa1 = vibor_resa1;
    vibor_resa1 = function(value) {
      var val1 = $('#sel_kol1').val().replace(/ /g, "");
      $('#sel_kol1').val(val1);
      save_vibor_resa1(value);
      $('#sel_kol1').val(gap(val1));
    };
    var save_vibor_resa2 = vibor_resa2;
    vibor_resa2 = function(value) {
      var val1 = $('#sel_kol1').val().replace(/ /g, "");
      var val2 = $('input[name=sel_kol2]').val().replace(/ /g, "");
      $('input[name=sel_kol2]').val(val2);
      $('#sel_kol1').val(val1);
      save_vibor_resa2(value);
      $('input[name=sel_kol2]').val(gap(val2));
      $('#sel_kol1').val(gap(val1));
    };
  }
}

detectTrade();

if(modalFormAction) {
  var mfa = modalFormAction;
  modalFormAction = function(r) { mfa(r); detectTrade(); }
}