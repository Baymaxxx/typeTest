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
function compareTextUp(){

}
function compareText(e){
    //input的id
    var inputId = e.target.id;
    var oldText = $('#'+inputId).parent().find('.oldText');
    //原文文字转数组
    var oTextArr = oldText.text().split('');
    //原文文字长度
    var oTextArrLen = oTextArr.length;
    //id为input的id中数字
    var id = parseInt(inputId.slice(4));
    //input的value
    var inputVal = $('#'+inputId).val();
    //input的长度
    var inputLen = inputVal.length;
    //多出文字在下一行显示
    if (inputLen >= oTextArrLen) {
        $('#'+inputId).val(inputVal.slice(0, oTextArrLen));
        //文本行数
        var lineLen = $('.u-list').length;
        if (id != lineLen - 1) {
            $('#text'+ (id + 1)).focus();
            $('#text'+ (id + 1)).val($('#text'+ (id + 1)).val() + inputVal.slice(oTextArrLen));
        }
    }
    var html = '', t = 0;
    console.log(oTextArr);
    for(var i = 0;i < inputLen;i++){
        if(inputLen <= oTextArrLen){
            if(oTextArr[i] === inputVal[i]) {
                html+='<span class="true">'+ oTextArr[i] +'</span>';
                t++;
            } else {
                html+='<span class="false">'+ oTextArr[i] +'</span>';
            }
        }
    }
    html += oldText.text().slice(inputLen);
    if(html) {
        oldText.html(html);
    }
}
function ajaxHandler(Data) {
    var dataArr;
    var html='';
    //文本去除换行  replace(/\s+([\u4e00-\u9fa5])/ig,'$1'):去除中文的空格，
    var data = Data.replace(/\r\n/g, "").replace(/\s+([\u4e00-\u9fa5])/ig,'$1');
    dataArr = getStringLen(data, 20);
    for(var i = 0;i < dataArr.length;i++){
        html += "<div class='u-list'>"
              +     "<p class='oldText'>"
              +         dataArr[i]
              +     "</p>"
              +     "<input class='newText' id='text"
              +     i+ "' type='text' />"
              + "</div>"
    }
    $(".m-type").html(html);
    //textchange事件，中文输入法输出后触发
    $('input').unbind('textchange').bind("textchange", function (e) {
        compareText(e);
    })
}
$.ajax({
    url: 'article.txt',
    type: 'GET',
    success: ajaxHandler
});

