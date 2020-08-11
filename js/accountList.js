$(function() {
	if(!isPC()){
		moblieAccount(1, 10);
	}else{
		manageAccount(1, 10);
	}
	
});

function manageAccount(pageNo, pageSize) {
	$("#managePanel").empty();
	$.ajax({
		type: "POST",
		url: url + "/api/auth/getAllSubAccount.do",
		data: {
			accountStatus: "0003001",
			pageNo: pageNo,
			pageSize: pageSize
		},
		beforeSend: function() {
			$("#managePanel").append('<div id="loadingTable" class="text-center" style="min-height:400px;line-height:400px;"><img src="img/loading.gif"/></div>')
		},
		success: function(result) {
			if (result.code == 10000) {
				var data = result.data;
				for (var i = 1; i < data.length; i++) {
					var accName, curType, dicType;
					var accountList = result.data;
					var pageTotal = Math.ceil((result.page.totalNum) / (result.page.pageSize));
					var curPage = result.page.curPage;
					var accountHtml = "";
					if (data.length > 0) {
						accountHtml += '<div class="panel-heading accountList">';
						accountHtml += '<h3 class="panel-title">子账户管理<span class="fr" style="font-size:13px;"><a href="createAccount.html" class="text-primary">添加子账户</a> / <a href="javascript:void(0)" onclick="checkHide()" class="text-primary">查看隐藏子账户</a></span></h3></div>'
					} else {
						$("#countpage").html('<h3 class="panel-title">子账户管理 <span style="font-size:14px;">您还没有创建子账户！</span> <span class="fr" style="font-size:13px;"><a href="createAccount.html" class="text-primary">添加子账户</a> / <a href="javascript:void(0)" onclick="checkHide(1,10)" class="text-primary">查看隐藏子账户</a></span></h3></div>')
					}
					accountHtml += '<div class="luckyCoins manage">';
					accountHtml += '<table class="table" style="position:relative;"><tbody class="findFirstAccount">';
					for (var i = 1; i < accountList.length; i++) {
						$.each(accountList[i], function(key, val) {
							accName = accountList[i].accountName;
							curType = accountList[i].currencyType
						});
						var dic = new Array();
						dic["0005002"] = "BCH";
						dic["0005001"] = "BTC";
						for (var key in dic) {
							if (key == curType) {
								dicType = dic[key].toUpperCase()
							}
						}
						accountHtml += "<tr>";
						accountHtml += '<td class="text-overflow"><b class="subName">' + accName + "</b></td>";
						accountHtml += "<td>当前模式：</td>";
						accountHtml += "<td>" + dicType + "</td>";
						accountHtml += "<td>算力：</td>";
						accountHtml += "<td>" + accountList[i].immediatelyRate + "</td>";
						accountHtml += '<td style="width:15%;">昨日总收益：</td>';
						accountHtml += "<td><b>" + accountList[i].yesterdayProfit + "</b></td>";
						accountHtml += '<td style="text-align:center;"><a href="javascript:void(0);" onclick="changeAccount(this)" class="text-primary">进入</a></td>';
						accountHtml += '<td style="position:relative;"><a href="javascript:void(0);" class="text-primary dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);" role="button" aria-haspopup="true" aria-expanded="false">设置</a>';
						accountHtml += '<div class="dropdown-menu bg-white popover text-center" id="settingAccount" role="menu"><div>';
						accountHtml += '<div class="setItem text-center" onclick="hideAccount(this)"><a href="javascript:void(0);" class="text-muted">隐藏</a></div>';
						accountHtml += '<div class="setItem text-center"><a href="javascript:void(0);" onclick="btcGathering()" class="text-muted">收货地址修改</a></div>';
						accountHtml += "</div></div></td></tr>"
					}
					$("#managePanel").empty();
					accountHtml += '</tbody></table><div id="pager" class="fr"></div><div class="clearfix"></div>'
				}
				$("#managePanel").append(accountHtml);
				pagesfuc(result.page.curPage, result.page.pageSize, result.page.totalNum)
			} else {
				$("#managePanel").empty();
				$("#managePanel").append('<div class="panel-heading accountList"><h3 class="panel-title">子账户管理<span class="fr" style="font-size:13px;"><a href="createAccount.html" class="text-primary">添加子账户</a> / <a href="javascript:void(0)" onclick="checkHide()" class="text-primary">查看隐藏子账户</a></span></h3></div></div><div class="alert alert-warning text-center" style="margin:auto;">该用户下未查询到子账户！</div>');
				setTimeout("noticeCreate()", 2000)
			}
		},
		error: function() {
			alert("网络连接故障！")
		}
	})
}
function selVal(sel, curPage) {
	var pageSize = $(sel).find("option:selected").text();
	manageAccount(curPage, pageSize)
}
function pagesfuc(curPage, pageSize, totalNum) {
	if (totalNum == 0) {
		return false
	}
	var pageNum = Math.ceil(totalNum / pageSize);
	var strVar = "";
	strVar += '<input id="javaSel" type="hidden" value="' + pageSize + '"><nav><ul id="accountListPager" class="pagination"><li class="pageInfo"><a>子账户总数：<em class="em">' + totalNum + "</em></a></li>";
	strVar += '<li class="pageInfo"><a>每页数量：<select id="pageSize" onchange="selVal(this,' + curPage + ');"><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="40">40</option></select></a></li>';
	if (curPage != 1) {
		strVar += "<li onclick='manageAccount(" + (curPage - 1) + "," + pageSize + ")'><a href='javascript:void(0);'><span>上一页</span></a></li>"
	} else {
		strVar += "<li class='disabled'><a href='javascript:void(0);'><span>上一页</span></a></li>"
	}
	for (var i = 1; i <= pageNum; i++) {
		if (i == curPage) {
			strVar += "<li class='active'><a href='javascript:void(0);'>" + i + "</a></li>"
		} else {
			strVar += "<li onclick='manageAccount(" + i + "," + pageSize + ")'><a href='javascript:void(0);'>" + i + "</a></li>"
		}
	}
	if (curPage != pageNum) {
		strVar += "<li onclick='manageAccount(" + (curPage + 1) + "," + pageSize + ")'><a href='javascript:void(0);'><span>下一页</span></a></li>"
	} else {
		strVar += "<li class='disabled'><a href='javascript:void(0);'><span>下一页</span></a></li>"
	}
	strVar += "</ul></nav>";
	$("#pager").html(strVar);
	var Flag = $("#javaSel").val();
	if (Flag) {
		$("#pageSize option[value='" + Flag + "']").attr("selected", "selected")
	}
}
function hideAccount(sub) {
	var $sub = $(sub);
	var actStatus = "0003003";
	var acctName = $sub.parents("tr").find(".text-overflow").find(".subName").html();//当前点击的子账户名
	var newUserName = $(".findFirstAccount tr:first td.text-overflow .subName").text();//子账户列表里第一行的子账户名
	var listLength = $("#accountListPager li.pageInfo>a>em").text() - 1;
	var moblieLength = $(".findFirstAccount tr").length;
	if(isPC()){
		if (listLength > 0) {
			if (acctName == userName) {
				layer.msg("不能隐藏当前子账户！", {
					icon: 7,
					time: 10000
				});
				return false
			}else{
				clearStorage("userName");
				handleStorage("userName", JSON.stringify(newUserName));
			}
		} else {
			layer.msg("不能隐藏掉所有的子账户！", {
				icon: 7,
				time: 10000
			});
			return false
		}
	}else{
		if (moblieLength > 0) {
			if (acctName == userName) {
				layer.msg("不能隐藏当前子账户！", {
					icon: 7,
					time: 10000
				});
				return false
			} else {
				clearStorage("userName");
				handleStorage("userName", JSON.stringify(newUserName));
			}
		} else {
			layer.msg("不能隐藏掉所有的子账户！", {
				icon: 7,
				time: 10000
			});
			return false
		}
	}

	$.ajax({
		type: "post",
		dataType: "json",
		url: url + "/api/auth/updateSubAccountStatus.do",
		data: {
			accountName: acctName,
			accountStatus: actStatus
		},
		success: function(result) {
			if (result.code == 10000) {
				layer.confirm("子账户：“" + acctName + "” 已被隐藏", {
					btn: ["OK"],
					title: false,
					icon: 1,
					closeBtn: 0
				}, function() {
					$sub.parents("tr").remove();
					location.replace(location.href);
				})
			} else {
				if (result.code == 10302) {
					layer.msg("该子账户用户名称为空或不合法!"), {
						icon: 5
					}
				} else {
					if (result.code == 10308) {
						layer.msg("该子账户状态为空或不合法!"), {
							icon: 5
						}
					} else {
						layer.msg("该子账户不存在！"), {
							icon: 5
						}
					}
				}
			}
		},
		error: function(result) {
			alert("网络出错！")
		}
	})
}
function restAccount(rest) {
	var $rest = $(rest);
	var acctName = $rest.parent().find(".text-overflow").find(".subName").html();
	var actStatus = "0003001";
	$.ajax({
		type: "POST",
		dataType: "json",
		url: url + "/api/auth/updateSubAccountStatus.do",
		data: {
			accountName: acctName,
			accountStatus: actStatus
		},
		success: function(result) {
			if (result.code == 10000) {
				layer.confirm("子账户：“" + acctName + "” 已被还原", {
					btn: ["OK"],
					title: false,
					icon: 1,
					closeBtn: 0
				}, function() {
					$rest.parent().remove();
					location.replace(location.href)
				})
			} else {
				if (result.code == 10302) {
					layer.msg("该子账户用户名称为空或不合法!"), {
						icon: 5
					}
				} else {
					if (result.code == 10308) {
						layer.msg("该子账户状态为空或不合法!"), {
							icon: 5
						}
					} else {
						layer.msg("该子账户不存在！"), {
							icon: 5
						}
					}
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest.status);
			console.log(XMLHttpRequest.readyState);
			console.log(textStatus)
		}
	})
}
function checkHide(pageNo, pageSize) {
	$("#managePanel").empty();
	$.ajax({
		type: "POST",
		url: url + "/api/auth/getAllSubAccount.do",
		data: {
			accountStatus: "0003003",
			pageNo: pageNo,
			pageSize: pageSize
		},
		beforeSend: function() {
			$("#managePanel").append('<div id="loadingTable" class="text-center" style="min-height:400px;line-height:400px;"><img src="img/loading.gif"/></div>')
		},
		success: function(result) {
			console.log(result);
			if (result.code == 10000) {
				var accountHtml = "";
				var accountList = result.data;
				var accName, curType, dicType;
				accountHtml += '<div class="panel-heading accountList">';
				accountHtml += '<h3 class="panel-title">隐藏子账户管理 <span class="fr" style="font-size:13px;"><a href="manageAccount.html" onclick="" class="text-primary">子账户管理</a></span></h3></div>';
				accountHtml += '<div class="luckyCoins manage">';
				accountHtml += '<table class="table" style="position:relative;">';
				accountHtml += "<tbody>";
				for (var i = 1; i < accountList.length; i++) {
					$.each(accountList[i], function(key, val) {
						accName = accountList[i].accountName;
						curType = accountList[i].currencyType
					});
					var dic = new Array();
					dic["0005002"] = "BCH";
					dic["0005001"] = "BTC";
					for (var key in dic) {
						if (key == curType) {
							dicType = dic[key].toUpperCase()
						}
					}
					accountHtml += "<tr>";
					accountHtml += '<td class="text-overflow"><b class="subName">' + accName + "</b></td>";
					accountHtml += "<td>当前模式：</td>";
					accountHtml += "<td>" + dicType + "</td>";
					accountHtml += "<td>算力：</td>";
					accountHtml += "<td>" + accountList[i].immediatelyRate +"</td>";
					accountHtml += '<td style="position:relative;" onclick="restAccount(this)"><a class="text-primary" href="javascript:void(0);">还原</a>';
					accountHtml += "</div></div></td>";
					accountHtml += "</tr>"
				}
				$("#managePanel").empty();
				accountHtml += '</tbody></table><div id="pager" class="fr"></div><div class="clearfix"></div>';
				$("#managePanel").append(accountHtml);
				hiddenPags(result.page.curPage, result.page.pageSize, result.page.totalNum)
			} else {
				$("#managePanel").empty();
				$("#managePanel").append('<div class="panel-heading accountList"><h3 class="panel-title">隐藏子账户管理 <span class="fr" style="font-size:13px;"><a href="manageAccount.html" onclick="" class="text-primary">子账户管理</a></span></h3></div></div><div class="alert alert-warning text-center" style="margin:auto;">该用户下未查询到隐藏子账户！</div>');
				//console.log("子账户列表获取失败！")
			}
		},
		complete: function() {
			$("loading").hide()
		},
		error: function() {
			alert("接口连接失败！")
		}
	})
}
function hiddenPags(curPage, pageSize, totalNum) {
	if (totalNum == 0) {
		return false
	}
	//console.log("当前页数：" + curPage, "每页条数：" + pageSize, "总账户数：" + totalNum);
	var pageNum = Math.ceil(totalNum / pageSize);
	var strVar = "";
	strVar += '<input id="javaSel" type="hidden" value="' + pageSize + '"><nav><ul id="accountListPager" class="pagination"><li class="pageInfo"><a>隐藏账户总数：' + totalNum + "</a></li>";
	strVar += '<li class="pageInfo"><a>每页数量：<select id="pageSize" onchange="hideVal(this,' + curPage + ');"><option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="40">40</option></select></a></li>';
	if (curPage != 1) {
		strVar += "<li onclick='checkHide(" + (curPage - 1) + "," + pageSize + ")'><a href='javascript:void(0);'><span>上一页</span></a></li>"
	} else {
		strVar += "<li class='disabled'><a href='javascript:void(0);'><span>上一页</span></a></li>"
	}
	for (var i = 1; i <= pageNum; i++) {
		if (i == curPage) {
			strVar += "<li class='active'><a href='javascript:void(0);'>" + i + "</a></li>"
		} else {
			strVar += "<li onclick='checkHide(" + i + "," + pageSize + ")'><a href='javascript:void(0);'>" + i + "</a></li>"
		}
	}
	if (curPage != pageNum) {
		strVar += "<li onclick='checkHide(" + (curPage + 1) + "," + pageSize + ")'><a href='javascript:void(0);'><span>下一页</span></a></li>"
	} else {
		strVar += "<li class='disabled'><a href='javascript:void(0);'><span>下一页</span></a></li>"
	}
	strVar += "</ul></nav>";
	$("#pager").html(strVar);
	var Flag = $("#javaSel").val();
	if (Flag) {
		$("#pageSize option[value='" + Flag + "']").attr("selected", "selected")
	}
}
function hideVal(sel, curPage) {
	var pageSize = $(sel).find("option:selected").text();
	checkHide(curPage, pageSize)
}
function moblieAccount(pageNo, pageSize) {
	$("#managePanel").empty();
	$.ajax({
		type: "POST",
		url: url + "/api/auth/getAllSubAccount.do",
		data: {
			accountStatus: "0003001",
			pageNo: pageNo,
			pageSize: pageSize
		},
		beforeSend: function() {
			$("#managePanel").append('<div id="loadingTable" class="text-center" style="min-height:400px;line-height:400px;"><img src="img/loading.gif"/></div>')
		},
		success: function(result) {
			if (result.code == 10000) {
				var data = result.data;
				for (var i = 1; i < data.length; i++) {
					var accName, curType, dicType;
					var accountList = result.data;
					var pageTotal = Math.ceil((result.page.totalNum) / (result.page.pageSize));
					var curPage = result.page.curPage;
					var accountHtml = "";
					if (data.length > 0) {
						accountHtml += '<div class="panel-heading accountList">';
						accountHtml += '<h3 class="panel-title"><a href="javascript:history.go(-1)" class="glyphicon glyphicon-menu-left moblie-back"></a>子账户管理</h3><div style="font-size:13px;margin-top:10px;"><a href="createAccount.html" class="moblie-text">添加子账户</a> / <a onclick="clickHiddenList()" class="moblie-text">查看隐藏子账户</a></div></div>'
					} else {
						$("#countpage").html('<h3 class="panel-title"><a href="javascript:history.go(-1)" class="glyphicon glyphicon-menu-left moblie-back"></a>子账户管理</h3><span style="font-size:14px;">您还没有创建子账户！</span></h3> <div id="listBox" style="font-size:13px;margin-top:10px;"><a href="createAccount.html" class="moblie-text">添加子账户</a> / <a href="javascript:void(0)" onclick="clickHiddenList()" class="moblie-text">查看隐藏子账户</a></div>')
					}
					accountHtml += '<div class="luckyCoins manage table-responsive">';
					accountHtml += '<table class="table" style="position:relative;"><thead><tr><th style="width:25%;">账户名</th><th>模式</th><th>算力</th><th>总收益</th><th>操作</th></tr></thead><tbody class="findFirstAccount">';
					for (var i = 1; i < accountList.length; i++) {
						$.each(accountList[i], function(key, val) {
							accName = accountList[i].accountName;
							curType = accountList[i].currencyType
						});
						var dic = new Array();
						dic["0005002"] = "BCH";
						dic["0005001"] = "BTC";
						for (var key in dic) {
							if (key == curType) {
								dicType = dic[key].toUpperCase()
							}
						}
						accountHtml += "<tr>";
						accountHtml += '<td class="text-overflow"><span class="subName">' + accName + "</span></td>";
						accountHtml += "<td>" + dicType + "</td>";
						accountHtml += "<td>" + accountList[i].immediatelyRate + "</td>";
						accountHtml += "<td>" + accountList[i].yesterdayProfit + "</td>";
						accountHtml += '<td style="text-align:center;"><a href="javascript:void(0);" onclick="changeAccount(this)" class="moblie-text" style="display:block;">进入</a>';
						accountHtml += '<a href="javascript:void(0);" class="text-muted" onclick="hideAccount(this)" style="display:block;">隐藏</a></td></tr>';
					}
					$("#managePanel").empty();
					accountHtml += '</tbody></table><div id="pager" class="fr"></div><div class="clearfix"></div>'
				}
				$("#managePanel").append(accountHtml);
				mobliePages(result.page.totalNum,result.page.pageSize,result.page.curPage)
			} else {
				$("#managePanel").empty();
				$("#managePanel").append('<div class="panel-heading accountList"><h3 class="panel-title"><a href="javascript:history.go(-1)" class="glyphicon glyphicon-menu-left moblie-back"></a>子账户管理</h3><div id="listBox" style="font-size:13px;margin-top:10px;"><a href="createAccount.html" class="moblie-text">添加子账户</a> / <span onclick="clickHiddenList()" class="moblie-text">查看隐藏子账户</span></div></div><div class="alert alert-warning text-center" style="margin:auto;">该用户下未查询到子账户！</div>');
			}
		},
		error: function() {
			alert("网络连接故障！")
		}
	})
}
function mobliePages(totalNum, pageSize, curPage) {
    var totalPage = Math.ceil(totalNum / pageSize);
    var pageStr = "";
	pageStr += '<nav aria-label="..."><ul class="pager"><li style="display:none">第<b name="curentPage" id="curentPage">' + curPage + '</b>页  总共&nbsp;<b name="totalPage" id="totalPage">&nbsp;' + totalPage + '</b>&nbsp;页&nbsp;共<b id="totalNum">&nbsp;' + totalNum + '</b>&nbsp;记录&nbsp;</li>';
	if(curPage == 1 && totalPage > 1){
		pageStr += '<li class="previous disabled"><a class="pre" name="prePage" target="_self" href="javascript:void(0);"><span aria-hidden="true">&larr;</span> Previous</a></li>';
		pageStr += '<li class="next"><a target="_self" href="javascript:void(0);" onclick="moblieAccount(' + (curPage + 1) + ',' + pageSize + ')" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';
	}else if(curPage == 1 && totalPage == 1){
		pageStr += '<li class="previous disabled"><a class="pre" name="prePage" target="_self" href="javascript:void(0);"><span aria-hidden="true">&larr;</span> Previous</a></li>';
		pageStr += '<li class="next disabled"><a target="_self" href="javascript:void(0);" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';           
	}else if(curPage < totalPage && curPage > 1){
		pageStr += '<li class="previous"><a class="pre" name="prePage" target="_self" href="javascript:void(0);" onclick="moblieAccount(' + (curPage - 1) + ',' + pageSize + ')"><span aria-hidden="true">&larr;</span> Previous</a></li>';
		pageStr += '<li class="next"><a target="_self" href="javascript:void(0);" onclick="moblieAccount(' + (curPage + 1) + ',' + pageSize + ')" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';
	}else if(curPage == totalPage && totalPage > 1){
		pageStr += '<li class="previous"><a class="pre" name="prePage" target="_self" href="javascript:void(0);" onclick="moblieAccount(' + (curPage - 1) + ',' + pageSize + ')"><span aria-hidden="true">&larr;</span> Previous</a></li>';
		pageStr += '<li class="next disabled"><a target="_self" href="javascript:void(0);" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';
	}
	$("#pager").html(pageStr);
}
function moblieHidden(pageNo, pageSize){
	$("#managePanel").empty();
	$.ajax({
		type: "POST",
		url: url + "/api/auth/getAllSubAccount.do",
		data: {
			accountStatus: "0003003",
			pageNo: pageNo,
			pageSize: pageSize
		},
		beforeSend: function() {
			$("#managePanel").append('<div id="loadingTable" class="text-center" style="min-height:400px;line-height:400px;"><img src="img/loading.gif"/></div>')
		},
		success: function(result) {
			if (result.code == 10000) {
				var accountHtml = "";
				var accountList = result.data;
				var accName, curType, dicType;
				accountHtml += '<div class="panel-heading accountList">';
				accountHtml += '<h3 class="panel-title"><a href="javascript:history.go(-1)" class="glyphicon glyphicon-menu-left moblie-back"></a>隐藏子账户管理 <span class="fr" style="font-size:13px;"><a href="manageAccount.html" class="moblie-text">子账户管理</a></span></h3></div>';
				accountHtml += '<div class="luckyCoins manage">';
				accountHtml += '<table class="table" style="position:relative;"><thead><tr><th style="width:25%;">账户名</th><th>模式</th><th>算力</th><th>操作</th></tr></thead>';
				accountHtml += "<tbody>";
				for (var i = 1; i < accountList.length; i++) {
					$.each(accountList[i], function(key, val) {
						accName = accountList[i].accountName;
						curType = accountList[i].currencyType
					});
					var dic = new Array();
					dic["0005002"] = "BCH";
					dic["0005001"] = "BTC";
					for (var key in dic) {
						if (key == curType) {
							dicType = dic[key].toUpperCase()
						}
					}
					accountHtml += "<tr>";
					accountHtml += '<td class="text-overflow"><b class="subName">' + accName + "</b></td>";
					accountHtml += "<td>" + dicType + "</td>";
					accountHtml += "<td>" + accountList[i].immediatelyRate +"</td>";
					accountHtml += '<td style="position:relative;" onclick="restAccount(this)"><a class="moblie-text" href="javascript:void(0);">还原</a></td></tr>';
				}
				$("#managePanel").empty();
				accountHtml += '</tbody></table><div id="pager" class="fr"></div><div class="clearfix"></div>';
				$("#managePanel").append(accountHtml);
				moblieHiddenPages(result.page.totalNum, result.page.pageSize, result.page.curPage)
			} else {
				$("#managePanel").empty();
				$("#managePanel").append('<div class="panel-heading accountList"><h3 class="panel-title">隐藏子账户管理 <span class="fr" style="font-size:13px;"><a href="manageAccount.html" class="moblie-text">子账户管理</a></span></h3></div></div><div class="alert alert-warning text-center" style="margin:auto;">该用户下未查询到隐藏子账户！</div>');
			}
		},
		complete: function() {
			$("loading").hide()
		},
		error: function() {
			alert("接口连接失败！")
		}
	})
}
function moblieHiddenPages(totalNum, pageSize, curPage) {
    var totalPage = Math.ceil(totalNum / pageSize);
    var pageStr = "";
	pageStr += '<nav aria-label="..."><ul class="pager"><li style="display:none">第<b name="curentPage" id="curentPage">' + curPage + '</b>页  总共&nbsp;<b name="totalPage" id="totalPage">&nbsp;' + totalPage + "</b>&nbsp;页&nbsp;</li>";
	if(curPage == 1 && totalPage > 1){
		pageStr += '<li class="previous disabled"><a class="pre" name="prePage" target="_self" href="javascript:void(0);"><span aria-hidden="true">&larr;</span> Previous</a></li>';
		pageStr += '<li class="next"><a target="_self" href="javascript:void(0);" onclick="moblieHidden(' + (curPage + 1) + ',' + pageSize + ')" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';
	}else if(curPage == 1 && totalPage == 1){
		pageStr += '<li class="previous disabled"><a class="pre" name="prePage" target="_self" href="javascript:void(0);"><span aria-hidden="true">&larr;</span> Previous</a></li>';
		pageStr += '<li class="next disabled"><a target="_self" href="javascript:void(0);" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';           
	}else if(curPage < totalPage && curPage > 1){
		pageStr += '<li class="previous"><a class="pre" name="prePage" target="_self" href="javascript:void(0);" onclick="moblieHidden(' + (curPage - 1) + ',' + pageSize + ')"><span aria-hidden="true">&larr;</span> Previous</a></li>';
		pageStr += '<li class="next"><a target="_self" href="javascript:void(0);" onclick="moblieHidden(' + (curPage + 1) + ',' + pageSize + ')" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';
	}else if(curPage == totalPage && totalPage > 1){
		pageStr += '<li class="previous"><a class="pre" name="prePage" target="_self" href="javascript:void(0);" onclick="moblieHidden(' + (curPage - 1) + ',' + pageSize + ')"><span aria-hidden="true">&larr;</span> Previous</a></li>';
		pageStr += '<li class="next disabled"><a target="_self" href="javascript:void(0);" class="nex cur">Next <span aria-hidden="true">&rarr;</span></a></li></ul></nav>';
	}
	$("#pager").html(pageStr);
}
function clickHiddenList(){
	if(!isPC()){
		moblieHidden()
	}else{
		checkHide()
	}
}
