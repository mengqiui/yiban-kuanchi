function initPagePomponent(totalNum, pageSize, curPage) {
    var totalPage = Math.ceil(totalNum / pageSize);
    var pageStr = "";
    if(!isPC()){
        pageStr += '<nav aria-label="..."><ul class="pager"><li style="display:none">第<b name="curentPage" id="curentPage">' + curPage + '</b>页  总共&nbsp;<b name="totalPage" id="totalPage">&nbsp;' + totalPage + "</b>&nbsp;页&nbsp;</li>";
        if(curPage == 1 && totalPage > 1){
            pageStr += '<li class="previous disabled"><a class="pre" name="prePage" target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())-1)"><span aria-hidden="true">&larr;</span> Previous</a></li>';
            pageStr += '<li class="next"><a target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())+1)" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';
        }else if(curPage == 1 && totalPage == 1){
            pageStr += '<li class="previous disabled"><a class="pre" name="prePage" target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())-1)"><span aria-hidden="true">&larr;</span> Previous</a></li>';
            pageStr += '<li class="next disabled"><a target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())+1)" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';           
        }else if(curPage < totalPage && curPage > 1){
            pageStr += '<li class="previous"><a class="pre" name="prePage" target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())-1)"><span aria-hidden="true">&larr;</span> Previous</a></li>';
            pageStr += '<li class="next"><a target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())+1)" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';
        }else if(curPage == totalPage && totalPage > 1){
            pageStr += '<li class="previous"><a class="pre" name="prePage" target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())-1)"><span aria-hidden="true">&larr;</span> Previous</a></li>';
            pageStr += '<li class="next disabled"><a target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())+1)" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';
        }
        $("#millTable tfoot").hide();
        $("#moblie-pages").html(pageStr);
    }else{
        pageStr += '<ul class="pagination"><li style="display: inline;float: left;line-height: 34px;">第<b name="curentPage" id="curentPage">' + curPage + '</b>页  总共&nbsp;<b name="totalPage" id="totalPage">&nbsp;' + totalPage + "</b>&nbsp;页&nbsp;</li>";
        pageStr += '<li style="float: left;line-height: 34px;margin-left:5px;margin-right:5px;">每页&nbsp;<select name="selPageSize" id="selPageSize" onchange="selPage();"><option value="10">10</option><option value="20">20</option><option value="40">40</option><option value="60">60</option><option value="80">80</option><option value="100">100</option></select>&nbsp;条</li>';
        pageStr += '<li><a class="pre" name="prePage" target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())-1)">上一页</a></li>';
        pageStr += '<li name="prePageHref"></li>';
        pageStr += '<li><a target="_self" href="javascript:void(0);" onclick="to_page(parseInt($(\'#curentPage\').text())+1)" class="nex">下一页</a></li>';
        pageStr += '<li>&nbsp;跳转至第 <input type="text" value="1" size="4" name="jump_page" style="width: 30px;text-align: center;"> 页';
        pageStr += ' <input type="button" value="GO" style="padding: 2px 6px;" onclick="jump_topage(this)" /></li><li class="pull-right" style="line-height:30px;margin-left: 3px;"><div><a href="#topGo" style="color: #3c78c2;">回顶部&uarr;</a></div></li></ul>';
        $(".pagination").html(pageStr);
    }
  
    var pagePom = "";
    if (totalPage <= 5) {
        for (var i = 1; i <= totalPage; i++) {
            pagePom += '<a target="_self" name="prePage' + i + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + i + "</a>"
        }
    } else {
        if (curPage <= 2) {
            for (var i = 1; i <= 5; i++) {
                pagePom += '<a target="_self" name="prePage' + i + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + i + "</a>"
            }
        } else {
            if (curPage >= totalPage - 1) {
                for (var i = totalPage - 4; i <= totalPage; i++) {
                    pagePom += '<a target="_self" name="prePage' + i + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + i + "</a>"
                }
            } else {
                pagePom += '<a target="_self" name="prePage' + (curPage - 2) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (curPage - 2) + "</a>";
                pagePom += '<a target="_self" name="prePage' + (curPage - 1) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (curPage - 1) + "</a>";
                pagePom += '<a target="_self" name="prePage' + (curPage) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (curPage) + "</a>";
                pagePom += '<a target="_self" name="prePage' + (curPage + 1) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (curPage + 1) + "</a>";
                pagePom += '<a target="_self" name="prePage' + (curPage + 2) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (curPage + 2) + "</a>"
            }
        }
    }
    $('[name="prePageHref"]').each(function () {
        $(this).html(pagePom)
    });
    $('[name="prePage' + curPage + '"]').each(function () {
        $(this).addClass("cur")
    })
    $('#selPageSize option:contains(' + pageSize + ')').each(function(){
	  if ($(this).text() == pageSize) {
	     $(this).attr('selected', true);
	  }
	});
}

function jump_topage(obj) {
    var n = $(obj).siblings('input[type="text"]').val();
    to_page(n)
}

function to_page(n) {
    $(this).addClass("active").siblings("li").removeClass("active");
    var totalPage = parseInt($("#totalPage").text());
    var p_cur_page = parseInt($("#curentPage").text());
    var select_page = parseInt(n);
    $("#pageNo").val(n);
    if (p_cur_page != select_page && parseInt(n) >= 1 && parseInt(n) <= totalPage) {
        $('[name="prePageHref"]').each(function () {
            $(this).find("a").removeClass("cur")
        });
        $('[name="curentPage"]').text(select_page);
        if (totalPage <= 5) {
            $('[name="prePage' + n + '"]').addClass("cur")
        } else {
            var pageStr = "";
            if (select_page <= 2) {
                for (var i = 1; i <= 5; i++) {
                    pageStr += '<a target="_self" name="prePage' + i + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + i + "</a>"
                }
            } else {
                if (select_page >= totalPage - 1) {
                    for (var i = totalPage - 4; i <= totalPage; i++) {
                        pageStr += '<a target="_self" name="prePage' + i + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + i + "</a>"
                    }
                } else {
                    pageStr += '<a target="_self" name="prePage' + (select_page - 2) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (select_page - 2) + "</a>";
                    pageStr += '<a target="_self" name="prePage' + (select_page - 1) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (select_page - 1) + "</a>";
                    pageStr += '<a target="_self" name="prePage' + (select_page) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (select_page) + "</a>";
                    pageStr += '<a target="_self" name="prePage' + (select_page + 1) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (select_page + 1) + "</a>";
                    pageStr += '<a target="_self" name="prePage' + (select_page + 2) + '" href="javascript:void(0);" onclick="to_page(this.innerText)" >' + (select_page + 2) + "</a>"
                }
            }
            $('[name="prePageHref"]').html(pageStr);
            $('[name="prePage' + select_page + '"]').addClass("cur")
        }
        millPane()
    }
};