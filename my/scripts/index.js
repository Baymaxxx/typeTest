function getStringLen(Str, Num) {
    var len = Str.length;
    var divArr = [];
    for (var i = 0; i <= len / Num; i++) {
        divArr[i] = [];
    }
    if (Str == null || Str == "" || len <= Num) {
        return 0;
    }
    for (var i = 0; i < Str.length; i++) {
        var code = Str.charCodeAt(i);
        //code > 255为汉字 len=2
        if (code > 255) {
            len++;
        }
    }
    var strArr = Str.split('');
    var jArr = [];
    for (var j = 0; j <= strArr.length; j++) {
        if (Num && j % Num == 0) {
            jArr.push(j);
        }
    }
    for (var j = 0; j <= jArr[j]; j++) {
        for (var i = jArr[j]; i <= jArr[j + 1] - 1; i++) {
            divArr[j].push(strArr[i]);
        }
    }
    for (var i = 0; i <= divArr.length; i++) {
        if (divArr[i].length == 0) {
            divArr.pop();
        }
    }
    divArr[divArr.length] = [];
    var lastNum = divArr.length - 1;
    for (var i = strArr.length; i > jArr[jArr.length - 1]; i--) {
        divArr[lastNum].push(strArr[i]);
    }
    divArr[lastNum].reverse();
    for (var i = 0; i < divArr.length; i++) {
        divArr[i] = '<span>' + divArr[i].join('') + '</span>'
    }
    return divArr;
}
function ajaxHandler(Data) {
    var dataArr;
    var html='';
    //文本去除换行  中文需去除空格使用replace(/\s+/g,"")
    var data = Data.replace(/\r\n/g, "").replace(/\s+/g,"");
    dataArr = getStringLen(data, 50);
    for(var i=0;i < dataArr.length;i++){
        html += "<div class='u-list'>"
              +     "<p class='oldText'>"
              +         dataArr[i]
              +     "</p>"
              +     "<input class='newText' type='text'>"
              + "</div>"
    }
    $(".m-type").html(html);
}
$.ajax({
    url: 'article.txt',
    type: 'GET',
    success: ajaxHandler
});