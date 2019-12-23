function loadAllySubList() {
    if($("input[name=addtogroup]").length) {
        $.get("/uni" + universe + "/alliance.php?mode=memberslist", function(data){
            var reg = /OFFSETY, -54\);" onmouseout="return nd\(\);">(.*)<\/a/g;
            var l;
            var list = document.createElement("datalist");
            list.id = "mList";
            $("input[name=addtogroup]").attr("list", "mList");
            $("input[name=addtogroup]").parent().append(list);
            while(l = reg.exec(data)) {
                $(list).append('<option value="' + l[1].replace(/<font color=[\w]+>|<\/font>/g, '') + '">');
            }
        });
    }
}

$(document).ready(function () {
    loadAllySubList();
});

if(modalFormAction) {
    var mfa_sub = modalFormAction;
    modalFormAction = function(r) { mfa_sub(r); loadAllySubList(); }
}