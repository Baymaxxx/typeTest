//IE的indexOf方法
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;
    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;
    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

;(function(){
    function addEvent( obj, ev, fn, bool ) {
        if ( obj.addEventListener ) {
            obj.addEventListener( ev, fn, bool );
        } else if (obj.attachEvent) {
            obj.attachEvent( 'on'+ev, function(){fn.call(obj)} );
        }
    }
    function makeElem(name, inner) {
        if ( typeof name === 'string' ) {
            var elem = document.createElement(name);
            if ( inner ) {
                elem.innerHTML = inner
            }
            return elem;
        }
    }
    function hasClass(elem, cls) {
        cls = cls || '';
        if(cls.replace(/\s/g, '').length == 0) return false;
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    }
    function compareSelector(obj, str) {
        var a = str.split(/[#.]/), b = str.match(/[#.]/g) || [];
        var cTag = '', cId = '', cClass = [];
        if(a[0]) { cTag = a[0] };
        for (var i = 0; i < b.length; i++) {
            if(b[i] === '#') {
                cId = a[i+1];
            } else if(b[i] === '.') {
                cClass.push(a[i+1]);
            }
        }
        if( cTag && obj.tagName !== cTag.toUpperCase() ) {
            return false;
        } else if ( cId && obj.id !== cId ) {
            return false;
        } else {
            for (var i=0; i<cClass.length; i++) {
                if( !hasClass(obj,cClass[i]) ) {
                    return false;
                }
            }
        }
        return true;
    }
    function  delegate( obj, ev, fn, str ){
        if( !str ) {
            addEvent(obj, ev, fn)
        } else {
            function func(e){
                e = e || window.event;
                var target = e.target || e.srcElement;
                while ( target ) {
                    if(compareSelector(target, str)) {
                        fn.call(target, e);
                    }
                    if(target === this) {
                        break;
                    }
                    target = target.parentNode;
                }
            }
            addEvent(obj, ev, func)
        }
    }
    addEvent(window, 'load', function(){
        document.getElementById('form').reset();
    });
    addEvent(window, 'beforeunload', function(){
        document.getElementById('form').reset();
    });
    function forbid(e){
        e = e || window.event;
        if ( e && e.preventDefault ) {
            e.preventDefault();
        } else if( e ) {
            e.returnValue = false;
        }
        return false;
    };









    var body = document.body;
    var evs = [ 'dragstart', 'selectstart', 'contextmenu', 'copy', 'cut', 'paste' ];
    for(var i = 0; i<evs.length; i++) {
        addEvent( body, evs[i], forbid, false );
    }
    
    $.ajax({
        url: 'article.txt',
        type: 'GET',
        success: ajaxHandler
    });
    var paras, textareas = [], sta = [], temp = [];
    var total = 0, time = 0, t, start = false;
    function ajaxHandler(data) {
        paras = getParas(data);
        setTimeout(function(){addParas(paras);},10);
        if('oninput' in window) {
            delegate(body, 'input', compareText, 'textarea');
        } else {
            delegate(body, 'keyup', compareText, 'textarea');
        }
        delegate(body, 'keydown', preventCheat, 'textarea');
    }
    function getParas(data) {
        data = data.replace(/ +/g,' ');
        data = data.replace(/ *[\r\n]+ */g,'\n');
        var paras = data.split(/[\r\n]+/);
        var l = paras.length;
        if(!paras[l-1]) { paras.pop() };
        if(!paras[0]) { paras.shift() };
        return paras;
    }
    function addParas(paras) {
        var oMain = document.getElementById('main');
        var l = paras.length;
        for ( var i = 0; i < l; i++ ) {
            var oDiv = makeElem('div');
            var oP = makeElem( 'p', paras[i] );
            var oLine = makeElem('div');
            var oText = makeElem('textarea');
            oText.type = 'text';
            oLine.className = 'oLine';
            oDiv.className = 'oDiv';oP.className = 'oP';
            oDiv.appendChild(oP);
            oDiv.appendChild(oLine);
            oMain.appendChild(oDiv);
            oText.style.height = (oDiv.children[0].offsetHeight+6) + 'px';
            oDiv.appendChild(oText);
            textareas.push(oText);temp[i] = '';
            
            total+= paras[i].length;
        }
        $('#total').html(total);
    }
    function preventCheat(e) {
        if(this.value !== temp[textareas.indexOf(this)]) {
            this.value = temp[textareas.indexOf(this)];
        }
    }
    function check(){
        var l = paras.length;
        for(var i=0;i<l;i++) {
            if(paras[i] !== temp[i]){
                return false;
            }
        }
        return true;
    }
    function compareText(e) {
        if(!start) {
            start =true;
            setTimeout(timer,1000);
        }
        var eq = textareas.indexOf(this);
        if(!sta[eq]) {
            sta[eq] = true;
            if(this.value.length>1) {this.value = ''}
        }
        var val = this.value; var l = val.length;
        var html = '', n = 0;
        if (l > paras[eq].length) { l = paras[eq].length }
        for(var i=0; i<l; i++) {
            if(paras[eq][i] === val[i]) {
                html+='<span class="true">'+paras[eq][i]+'</span>';
                n++;
            } else {
                html+='<span class="false">'+paras[eq][i]+'</span>';
            }
        }
        html += paras[eq].substr(l);
        this.parentNode.firstChild.innerHTML = html;
        
        if(n == paras[eq].length) {
            this.value = paras[eq];
            if( eq+1 !== textareas.length ) { textareas[eq+1].focus(); }
        }
        temp[eq] = this.value;
        
        var fini = $('#main').find('.true').length;
        $('#finish').html(fini);
        if (fini === total && check()) {
            clearTimeout(t);
        }
    }
    function timer(){
        time++;
        var min = Math.floor(time / 60);
        $('#min').html(min);
        $('#sec').html(time % 60);
        if (min % 10 == 0) {
            $.ajax({
                url: 'ajax.php',
                type: 'GET'
            });       
        }
        t = setTimeout(timer,1000);
    }
    $(".submit").on("click", function() {
        if (window.confirm("提交后成绩将不能更改，您确认要提交吗？"))
        {
            var json = {};
            json.total = total;
            json.have = $('#main').find('.true').length;
            json.time = time;
            json.op = 'submit';
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                data: json,
                dataType: 'JSON',
                success: function(data) {
                    if (data.status == 1) {
                        $("#form").hide();
                        $(".score").show();
                        $(".board").children("p").eq(1).html("文章字数：" + total + "字")
                        $(".board").children("p").eq(2).html("完成字数：" + json.have + "字")
                        $(".board").children("p").eq(3).html("所用时间：" + Math.floor(time / 60) +"分" + (time % 60) + "秒")
                    }
                }
            });
        }
    });
})();