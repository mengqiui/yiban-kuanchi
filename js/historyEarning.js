$(function(){
	accountBal();
	todayYest();
	earningTable();
})

//收益页面上左模块：子账户余额接口
function accountBal(){
	$.ajax({
		type:"post",
		url:url+'/api/auth/getbalance.do',
		data:{accountName:userName},
        beforeSend:function(){
        	$("#paid").append('<div class="text-center" style="min-height:52px;line-height:50px;"><img src="img/loading.gif"/> 拼命加载中……</div>');
        },
		success:function(data){
			//console.log(data);
			var payHtml = '';
			if(data.code == 10000){
                payHtml += '<li class="text-muted fz16">已支付<em class="em fr text-muted">'+data.data.paidBtc+'</em></li>';
                payHtml += '<li class="text-muted fz16">余额<em class="em fr text-muted">'+data.data.balance+'</em></li>';
			}else{
				forHtml += '<div class="text-center" style="min-height:50px;line-height:50px;"><div class="text-center text-muted" style="font-size:16px;"><img src="img/empty.png" class="img-responsive center-block" alt="什么也没有呢" style="max-width:70px;"/>'+data.message+'</div></div>';
			}
			$("#paid").empty();
			$("#paid").append(payHtml);
		},error:function(){
			//console.log("error");
		}
	})
}

//收益页面上右模块：今日预估接口
function todayYest(){
	$.ajax({
		type:"post",
		url:url+'/api/auth/getUserPanelInfo.do',
		data:{accountName:userName},
        beforeSend:function(){
        	$("#forecast").append('<div class="text-center" style="min-height:52px;line-height:50px;"><img src="img/loading.gif"/> 拼命加载中……</div>');
        },
		success:function(data){
			//console.log(data);
			var forHtml = "";
			if(data.code==10000){
				forHtml += '<li class="text-muted fz16">今日预估<em class="em fr text-muted">'+data.data.todayPredict+'</em></li>';
				forHtml += '<li class="text-muted fz16">昨日收益<em class="em fr text-muted">'+data.data.yesterdayProfit+'</em></li>';
				$("#tableType").html(data.data.currencyType);
			}else{
				forHtml += '<div class="text-center" style="min-height:50px;line-height:50px;"><div class="text-center text-muted" style="font-size:16px;"><img src="img/empty.png" class="img-responsive center-block" alt="什么也没有呢" style="max-width:70px;"/>'+data.message+'</div></div>';
			}
			$("#forecast").empty();
			$("#forecast").append(forHtml);
			
		},error:function(){
			//console.log("error");
		}
	})
}

var orderT = 'asc';
function sortFunc(ele, orderField) {
	$(ele).addClass("on").siblings("th.tableSort").removeClass("on");
	$(ele).addClass("on").siblings("th.tableSort").children('span').empty().html("&uarr;&darr;");
	$("#orderF").val(orderField);
	orderT = orderT == "asc" ? "desc" : "asc";
	if(orderT=='asc'){
		$(ele).children('span').empty().html("&uarr;");
	}else{
		$(ele).children('span').empty().html("&darr;");
	}
	earningTable();
	
}
//收益页面中间模块：收益记录数据表格
var pageSize = $("#selPageSize option:selected").text();
function earningTable(){
	$.ajax({
		type:"post",
		url:url+'/api/auth/selectProfitRecordsByAccountName.do',
		data:{accountName:userName,pageNo:$("#pageNo").val(),pageSize:pageSize,orderField:$("#orderF").val(),orderType:orderT},
        beforeSend:function(){
        	$("#historyData").append('<tr><td colspan="5"><div class="noneTip" style="min-height:400px;width:100%;padding:20px;"><div class="text-center" style="min-height:400px;line-height:200px;"><img src="img/loading.gif"/> 拼命加载中……</div></div></td></tr>');
        },
		success:function(data){
			var histHtml ='';
			if(data.code == 10000){
	            for(var i=0;i<data.data.length;i++){
	            	var reportDate = isNaN(data.data[i].reportDate) ? "--":data.data[i].reportDate;
        			var btc = isNaN(data.data[i].btc) ? "--":data.data[i].btc;
        			var workload = (data.data[i].workload == 'undefined') ? "--":data.data[i].workload;
	            	var netDifficuty = (data.data[i].netDifficuty == null) ? "--":data.data[i].netDifficuty;
        			var height = isNaN(data.data[i].height) ? "--":data.data[i].height;
        			
					histHtml +='<tr><td class="text-center">'+reportDate+'</td><td class="text-center">'+btc+'</td><td class="text-center">'+workload+'</td><td class="text-center">'+netDifficuty+'</td><td class="text-center">'+height+'</td></tr>';
	            }
			}else{
				histHtml +='<tr><td colspan="5"><div class="noneTip" style="min-height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:0px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="空空如也哦~" style="max-width:100px;"/>'+data.message+'</div></div></td></tr>';
			}
			$("#historyData").empty();
			$("#historyData").append(histHtml);
			initPagePomponent(data.page.totalNum, data.page.pageSize, data.page.curPage)
		},error:function(){
			$("#historyData").empty();
			//alert("数据表格加载网络失败！");
		}
	})
}

//分页方法
function initPagePomponent(totalNum, pageSize, curPage) {
	var totalPage = Math.ceil(totalNum/pageSize);
	var pageStr = '';
		if(!isPC()){
			pageStr += '<nav aria-label="..."><ul class="pager" style="margin:0;"><li style="display:none">第<b name="curentPage" id="curentPage">' + curPage + '</b>页  总共&nbsp;<b name="totalPage" id="totalPage">&nbsp;' + totalPage + "</b>&nbsp;页&nbsp;</li>";
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
			$("#earnTable tfoot").hide();
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
		var pagePom ='';
		if (totalPage <=5) {
			for (var i=1;i<=totalPage;i++) {
				pagePom += '<a target="_self" name="prePage'+i+'" href="javascript:void(0);" onclick="to_page(this.innerText)" >'+i+'</a>'
			}
		}else {
			if (curPage <= 2) {
				for (var i = 1; i <= 5; i++) {
					pagePom += '<a target="_self" name="prePage'
							+ i
							+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
							+ i + '</a>'
				}
			} else if (curPage >= totalPage - 1) {
				for (var i = totalPage - 4; i <= totalPage; i++) {
					pagePom += '<a target="_self" name="prePage'
							+ i
							+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
							+ i + '</a>'
				}
			} else {
				pagePom += '<a target="_self" name="prePage'
						+ (curPage - 2)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (curPage - 2) + '</a>';
				pagePom += '<a target="_self" name="prePage'
						+ (curPage - 1)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (curPage - 1) + '</a>';
				pagePom += '<a target="_self" name="prePage'
						+ (curPage)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (curPage) + '</a>';
				pagePom += '<a target="_self" name="prePage'
						+ (curPage + 1)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (curPage + 1) + '</a>';
				pagePom += '<a target="_self" name="prePage'
						+ (curPage + 2)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (curPage + 2) + '</a>';
			}
		}
		
		$('[name="prePageHref"]').each(function(){
			$(this).html(pagePom);
		});
		$('[name="prePage' + curPage + '"]').each(function(){
			$(this).addClass("cur");
		});
		$('#selPageSize option:contains(' + pageSize + ')').each(function(){
		  if ($(this).text() == pageSize) {
		     $(this).attr('selected', true);
		  }
		});
		
}

//点击上一页，下一页方法
function jump_topage(obj) {
	var n = $(obj).siblings('input[type="text"]').val();
	to_page(n);
}

//点击页码请求方法
function to_page(n) {
	$(this).addClass("active").siblings("li").removeClass("active");
	var totalPage = parseInt($('#totalPage').text());//总页数
	var p_cur_page = parseInt($('#curentPage').text());//当前页
	var select_page = parseInt(n);//选中页数
	$("#pageNo").val(n);
	if (p_cur_page != select_page && parseInt(n) >= 1 && parseInt(n) <= totalPage) {
		// 去除class prePageHref
		$('[name="prePageHref"]').each(function() {
			$(this).find("a").removeClass("cur");
		})
		// 设置当前页
		$('[name="curentPage"]').text(select_page);
		if (totalPage <= 5) {
			$('[name="prePage' + n + '"]').addClass("cur");
		} else {
			var pageStr = "";
			if (select_page <= 2) {
				for (var i = 1; i <= 5; i++) {
					pageStr += '<a target="_self" name="prePage'+ i
							+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
							+ i + '</a>'
				}
			} else if (select_page >= totalPage - 1) {
				for (var i = totalPage - 4; i <= totalPage; i++) {
					pageStr += '<a target="_self" name="prePage'
							+ i
							+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
							+ i + '</a>'
				}
			} else {
				pageStr += '<a target="_self" name="prePage'
						+ (select_page - 2)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (select_page - 2) + '</a>';
				pageStr += '<a target="_self" name="prePage'
						+ (select_page - 1)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (select_page - 1) + '</a>';
				pageStr += '<a target="_self" name="prePage'
						+ (select_page)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (select_page) + '</a>';
				pageStr += '<a target="_self" name="prePage'
						+ (select_page + 1)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (select_page + 1) + '</a>';
				pageStr += '<a target="_self" name="prePage'
						+ (select_page + 2)
						+ '" href="javascript:void(0);" onclick="to_page(this.innerText)" >'
						+ (select_page + 2) + '</a>';
			}
			$('[name="prePageHref"]').html(pageStr);
			$('[name="prePage' + select_page + '"]').addClass("cur");
		}
		earningTable();
	}

}

function selPage(){
	pageSize = $("#selPageSize option:selected").text();
	earningTable();
}






