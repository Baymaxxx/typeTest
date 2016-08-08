$(function() {
    function showMarked(loc, msg) {
        var input = $(".line").eq(loc).children("input");
        input.val("");
        input.addClass("fail");
        var marked = $(".line").eq(loc).children(".marked");
        marked.html(msg);
        marked.show();
        input.on("focus", function(){
            marked.hide();
            input.removeClass("fail");
            input.off();
        })
    }
    $(".submit").on("click", function(){
        var json = {};
        json.account = $("input[name=account]").val();
        json.pwd = $("input[name=pwd]").val();
        json.op = 'login';
        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            data: json,
            dataType: 'JSON',
            success: function(data) {
                if (data.status == 1) {
                    window.location = data.url;
                }
                else if (data.status == 0) {
                    showMarked(data.location, data.msg);
                }
            }
        });
    })
})