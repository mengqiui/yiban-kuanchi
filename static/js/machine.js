var groupName;
var minStatus;
var marker;
var pageNo;
var pageSize = $("#selPageSize option:selected").text();
var minerCharts;
var workerName;
$(function() {
	numStatus();
	grounpMoudle();
	millPane();
	$("button.btn-report").on("click", function() {
		$(this).addClass("active").siblings().removeClass("active")
	});
	$(".reportDay").click(function() {
		ajaxDayMiner()
	});
	$(".reportHour").click(function() {
		ajaxHourMiner()
	});
	$("#minerChartBox").on("shown.bs.modal", function() {
		ajaxDayMiner()
	});
	$('#minerChartBox').on('hidden.bs.modal', function (e) {
		$(".reportDay").addClass("active").siblings().removeClass("active")
	});
	$("#searchMiner").keypress(keySearch);
	$("#selGroup").click(function(e) { 
		$(".selBox").toggle();
		e.stopPropagation();
		$("body").click(function() {
			$(".selBox").hide()
		})
	})
	
	
});

function grounpMoudle() {
	$.ajax({
		type: "post",
		url: url + "/api/auth/selectGroupByAccount.do",
		data: {
			accountName: userName
		},
		success: function(result) {
			$(".newGroup").empty();
			var groupHtml = "";
			var changeHtml = '<li value="all">未分组</li>';
			if (result.code == 10000) {
				if (result.data.length > 0) {
					$.each(result.data, function(i, val) {
						groupHtml += '<button type="button" class="list-group-item text-center" onclick="delShow(this)">' + val.groupName + "</button>";
						changeHtml += '<li value="' + val.groupName + '">' + val.groupName + "</li>"
					});
				}
			}
			$(".newGroup").append(groupHtml);
			$(".selBox").append(changeHtml);
			$(".selBox li").click(function() {
				$("#ssid_name").html($(this).text()).attr("value", $(this).attr("value"));
				$("#selMiner").val($(this).attr("value"));
				updateMiner()
			})
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$(".newGroup").empty()
		}
	})
}
var orderT = "asc";

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
	millPane();
	
}
function statusClick(elm, status) {
	if(isPC()){//若是PC端
		$(elm).addClass("active").siblings("li").removeClass("active");
		$("#allChose").prop("checked", false);
		$("#selGroup").addClass("hide");
		$("#minStatus").val(status);
		$("#searchBox").show();
		millPane()
	}else{
		$(elm).addClass("active").siblings("li").removeClass("active");
		$("#allChose").prop("checked", false);
		$("#minStatus").val(status);
		millPane()
	}
	
}
function keySearch() {
	var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (keyCode == 13) {
		searchList()
	}
}
function millPane() {
	var workerName1 = $("#searchMiner").val();
	var pageNo1 = $("#pageNo").val();
	var params = {
		accountName: userName,
		minerStatus: $("#minStatus").val(),
		groupName: $("#groupName").val(),
		marker: $("#marker").val(),
		pageNo: pageNo1,
		pageSize: pageSize,
		orderField: $("#orderF").val(),
		orderType: orderT,
		workerName: workerName1
	};
	var index;
	$.ajax({
		type: "post",
		url: url + "/api/auth/queryMinerStats.do",
		data: params,
		beforeSend: function() {
			index = layer.load(2)
		},
		success: function(result) {
			if (result.code == 10000) {
				if(!isPC()){$(".ibox").show();}
				fillPage(result);
				layer.close(index)
			} else {
				if (result.code == 10407) {
					layer.close(index);
					$(".totalTab").empty();
					$(".noneTip").remove();
					$(".tab-content .tab-pane").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="矿工空空如也哦~" style="max-width:100px;"/>该分组未检测到矿工</div></div>');
					$("table tfoot").hide();
					if(!isPC()){$(".ibox").hide();}
				} else {
					layer.close(index);
					$(".totalTab").empty();
					$(".noneTip").remove();
					$(".tab-content .tab-pane").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="矿工空空如也哦~" style="max-width:100px;"/>' + result.message + "</div></div>");
					$("table tfoot").hide();
					if(!isPC()){$(".ibox").hide();}
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.close(index);
			$(".noneTip").remove();
			$(".totalTab").empty();
			$(".tab-content .tab-pane").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="矿工空空如也哦~" style="max-width:100px;"/>网络加载失败，请重新登录！</div></div>');
			$("table tfoot").hide();
			if(!isPC()){$(".ibox").hide();}
			layer.msg("哎呀，您还没有登陆，5秒后自动跳转登陆页！", {
                icon: 5,
                time: 5000
            }, function () {
                window.location = url + "/static/login.html"
            })
		}
	})
}
function fillPage(result) {
	var totalHtml = "";
	var minerS;
	var dic = new Array();
	dic["0007001"] = "活跃";
	dic["0007002"] = "无效";
	dic["0007003"] = "不活跃";
	for (var i = 0; i < result.data.length; i++) {
		var mStatus = isNaN(result.data[i].minerStatus) ? "--" : result.data[i].minerStatus;
		var acceptCount = isNaN(result.data[i].acceptCount) ? "--" : result.data[i].acceptCount;
		var workerName = (typeof result.data[i].workerName === "undefined") ? "未知" : result.data[i].workerName;
		var immediatelyCalcPower = isNaN(result.data[i].immediatelyCalcPower.calcPowerValue) ? "--" : result.data[i].immediatelyCalcPower.calcPowerValue;
		var dayCalcPower = isNaN(result.data[i].dayCalcPower.calcPowerValue) ? "--" : result.data[i].dayCalcPower.calcPowerValue;
		var reject = (result.data[i].rejectRate == "undefined") ? "--" : result.data[i].rejectRate;
		var time = (typeof result.data[i].lastShareTime === "undefined") ? "--" : result.data[i].lastShareTime;
		for (var key in dic) {
			if (key == mStatus) {
				minerS = dic[key]
			}
		}
		if (mStatus == "0007001") {
			totalHtml += '<tr><td><input type="checkbox" name="minerS" value="' + result.data[i].workerName + '" onclick="updateShow()"/></td><td class="minerName"><span class="minerN">' + workerName + "</span></td><td>" + immediatelyCalcPower + result.data[i].immediatelyCalcPower.calcPowerUnit + "H/s</td><td>" + dayCalcPower + result.data[i].dayCalcPower.calcPowerUnit + "H/s</td><td>" + acceptCount + "</td><td>" + reject + "</td><td>" + time + '</td><td style="line-height:20px;"><a href="#" class="millStatus" onclick="checkInfo(this)">' + minerS + '<img src="img/report1.png" style="width:14px;margin-bottom:4px;"/></a></td><td></td></tr>'
		} else {
			totalHtml += '<tr><td><input type="checkbox" name="minerS" value="' + result.data[i].workerName + '" onclick="updateShow()"/></td><td>' + workerName + '</td>'+"<td>" + immediatelyCalcPower + result.data[i].immediatelyCalcPower.calcPowerUnit + "H/s</td><td>" + dayCalcPower + result.data[i].dayCalcPower.calcPowerUnit + "H/s</td><td>" + acceptCount + "</td><td>" + reject + "</td><td>" + time + '</td><td style="line-height:20px;">' + minerS + '</td><td></td></tr>'
		}
	}
	$(".totalTab").empty(); 
	$(".noneTip").remove();
	$(".totalTab").append(totalHtml);
	$("table tfoot").show();
	numStatus();
	initPagePomponent(result.page.totalNum, result.page.pageSize, result.page.curPage)
}
function searchList() {
	var workerName1 = $("#searchMiner").val();
	var pageNo1 = $("#pageNo").val();
	pageNo1 = workerName1 != "" ? "1" : pageNo1;
	var params = {
		accountName: userName,
		minerStatus: $("#minStatus").val(),
		groupName: $("#groupName").val(),
		marker: $("#marker").val(),
		pageNo: pageNo1,
		pageSize: pageSize,
		orderField: $("#orderF").val(),
		orderType: orderT,
		workerName: workerName1
	};
	var index;
	$.ajax({
		type: "post",
		url: url + "/api/auth/queryMinerStats.do",
		data: params,
		beforeSend: function() {
			index = layer.load(2)
		},
		success: function(result) {
			if (result.code == 10000) {
				fillPage(result);
				layer.close(index);
			} else {
				if (result.code == 10407) {
					layer.close(index);
					numStatus();
					$(".totalTab").empty();
					$(".noneTip").remove();
					$(".tab-content .tab-pane").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="矿工空空如也哦~" style="max-width:100px;"/>该分组未检测到矿工</div></div>');
					$("table tfoot").hide()
				} else {
					layer.close(index);numStatus();
					$(".totalTab").empty();
					$(".noneTip").remove();
					$(".tab-content .tab-pane").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="矿工空空如也哦~" style="max-width:100px;"/>' + result.message + "</div></div>");
					$("table tfoot").hide()
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.close(index);
			$(".noneTip").remove();numStatus();
			$(".tab-content .tab-pane").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="矿工空空如也哦~" style="max-width:100px;"/>网络加载失败，请重新登录！</div></div>');
			$("table tfoot").hide();
		}
	})
}
function addGroup() {
	layer.prompt({
		title: "创建分组",
		formType: 0,
		maxlength: 10,
		btn: ["提交"],
		content: '<input type="text" maxlength="10" class="layui-layer-input" placeholder="分组名称"/>'
	}, function(pass, index) {
		layer.close(index);
		$.ajax({
			type: "post",
			url: url + "/api/auth/insertMinerGroup.do",
			data: {
				groupName: pass,
				accountName: userName
			},
			success: function(result) {
				if (result.code == 10000) {
					layer.msg("恭喜添加成功！", {
						icon: 1
					});
					if(isPC()){
						$(".newGroup").append('<button type="button" class="list-group-item text-center" onclick="delShow(this)">' + pass + "</button>");
						$(".selBox").append('<li value="' + pass + '">' + pass + "</li>")
					}else{
						$(".newGroup").append('<button type="button" class="list-group-item text-center" onclick="delShow(this)">' + pass + "</button>");
					}
				} else {
					if (result.code == 10401) {
						layer.msg("分组创建失败，请输入正确的名称！", {
							icon: 5
						})
					} else {
						layer.msg("分组创建失败，请重新创建！", {
							icon: 5
						})
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg("网络出现故障，请检查网络是否正常！", {
					icon: 5,
					time: 5000
				})
			}
		})
	})
}
function delShow(del) {
	if(isPC()){
		var gName = $(del).text();
		$("#groupName").val(gName);
		$("#marker").val("");
		$("#pageNo").val("1");
		millPane();
		numStatus();
		$(del).siblings().removeAttr("id");
		$(del).attr("id", "letDel");
		$("#delGroup").show();
		$("#selGroup").addClass("hide");
		$("#searchBox").show();
		$("#allChose").prop("checked", false)
	}else{
		var gName = $(del).text();
		$("#groupName").val(gName);
		$("#marker").val("");
		$("#pageNo").val("1");
		millPane();
		numStatus();
		$(del).siblings().removeAttr("id");
		$(del).attr("id", "letDel");
		$(".moblie-groups #delGroup").show();
		$("#allChose").prop("checked", false)
	}
	
}
function delGroup() {
	var gName = $("#groupName").val();
	layer.confirm("确认删除 " + gName + " 分组吗？", {
		title: "删除分组",
		btn: ["确认"]
	}, function(pass, index) {
		$.ajax({
			type: "post",
			url: url + "/api/auth/delMinerGroup.do",
			data: {
				minerGroup: gName,
				accountName: userName
			},
			success: function(result) {
				if (result.code == 10000) {
					if(isPC()){
						$("#letDel").remove();
						$("#delGroup").hide();
						$("#groupName").val("");
						$("#marker").val("all");
						millPane();
						numStatus();
						layer.msg(gName + " 分组删除成功！", {
							icon: 1
						});
						$(".selBox]").find("li[value='" + gName + "']").remove()
					}else{
						$("#letDel").remove();
						$("#delGroup").hide();
						$("#groupName").val("");
						$("#marker").val("all");
						millPane();
						numStatus();
						layer.msg(gName + " 分组删除成功！", {
							icon: 1
						});
					}
					
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg("哎呀，网络故障啦，快快检查网络是否正常！", {
					icon: 5,
					time: 6000
				})
			}
		})
	})
}
function allGroup() {
	if(isPC()){
		$("#delGroup").hide();
		$("#letDel").removeAttr("id");
		$("#groupName").val("");
		$("#marker").val("all");
		millPane();
		numStatus();
		$("#pageNo").val("1");
		$("#selGroup").addClass("hide");
		$("#searchBox").show();
		$("#allChose").prop("checked", false)
	}else{
		$(".moblie-groups #delGroup").hide();
		$("#letDel").removeAttr("id");
		$("#groupName").val("");
		$("#marker").val("all");
		millPane();
		numStatus();
		$("#pageNo").val("1");
		$("#allChose").prop("checked", false)
		$('#moblie-group').fadeToggle('slow','linear');
	}
	
}
function noGroup() {
	if(isPC()){
		$("#delGroup").hide();
		$("#letDel").removeAttr("id");
		$("#groupName").val("");
		$("#marker").val("unGrouped");
		millPane();
		numStatus();
		$("#pageNo").val("1");
		$("#selGroup").addClass("hide");
		$("#searchBox").show();
		$("#allChose").prop("checked", false)
	}else{
		$(".moblie-groups #delGroup").hide();
		$("#letDel").removeAttr("id");
		$("#groupName").val("");
		$("#marker").val("unGrouped");
		millPane();
		numStatus();
		$("#pageNo").val("1");
		$("#allChose").prop("checked", false)
		$('#moblie-group').fadeToggle('slow','linear');
	}
	
}
function allChecked() {
	if(isPC()){//若是PC端
		if ($(".totalTab input[type='checkbox']:checked").length == 0) {
			$(".totalTab input[type='checkbox']").prop("checked", true);
			$("#selGroup").removeClass("hide");
			$("#searchBox").hide()
		} else {
			$("#selGroup").addClass("hide");
			$(".totalTab input[type='checkbox']").prop("checked", false)
		}
	}else{
		if ($(".totalTab input[type='checkbox']:checked").length == 0) {
			$(".totalTab input[type='checkbox']").prop("checked", true);
		} else {
			$(".totalTab input[type='checkbox']").prop("checked", false)
		}
	}
	
}
function updateShow() {
	if(isPC()){//若是PC端
		if ($(".totalTab input[type='checkbox']:checked").length == 0) {
			$("#selGroup").addClass("hide");
			$("#searchBox").show();
			$("#allChose").prop("checked", false)
		} else {
			$("#selGroup").removeClass("hide");
			$("#searchBox").hide();
			$("#allChose").prop("checked", true)
		}
	}
}
var arr = [];
function updateMiner() {
	var minerGroup = $("#selMiner").val();
	//console.log(minerGroup);
	$(".totalTab input[type='checkbox']:checked").each(function() {
		arr.push(this.value)
	});
	if (arr.length > 0) {
		var workerNameList = JSON.stringify(arr)
	}
	$.ajax({
		type: "post",
		url: url + "/api/auth/updateMiner.do",
		data: {
			accountName: userName,
			minerGroup: minerGroup,
			workerNameList: workerNameList
		},
		success: function(result) {
			workerNameList.length = 0;
			arr.length = 0;
			if (result.code == 10000) {
				layer.msg("恭喜切换分组成功！", {
					icon: 1
				});
				millPane();
				numStatus();
				$("#selGroup").addClass("hide");
				$("#searchBox").show();
				$("#allChose").prop("checked", false)
			} else {
				layer.msg("不小心操作失败啦！", {
					icon: 5
				})
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			layer.msg("服务器未响应，请检查网络！", {
				icon: 0
			})
		}
	})
}
function historyMapInit() {
	if (minerCharts != null && minerCharts != "" && minerCharts != undefined) {
		minerCharts.dispose()
	}
	minerCharts = echarts.init(document.getElementById("minerCharts"), "blue");
	minerCharts.showLoading({
		text: "正在努力的读取数据中..."
	})
}
function checkInfo() {
	if (arguments.length == 1) {
		var $wName = $(arguments[0]);
		workerName = $wName.parent().siblings().find(".minerN").html();
		$("#mName").val(workerName)
	} else {
		if (arguments.length == 0) {
			workerName = $("#mName").val().trim()
		}
	}
	$("#minerChartBox").modal()
}
function ajaxDayMiner() {
	workerName = $("#mName").val().trim();
	var dataX = [];
	var dataYL = [];
	var dataYR = [];
	historyMapInit();
	var option = {
		tooltip: {
			trigger: "axis",
			formatter: function(params, ticket, callback) {
				var res = "日期 : " + params[0].name;
				if(params.length>1){
	            	res += "<br/>" + params[0].seriesName + " : " + params[0].value + "TH/S";
	                res += "<br/>" + params[1].seriesName + " : " + params[1].value + "%";
                }else{
                	if(params[0].seriesName=="算力"){
                		res += "<br/>" + params[0].seriesName + " : " + params[0].value + "TH/S";
                	}else if((params[0].seriesName=="拒绝率")){
                		res += "<br/>" + params[0].seriesName + " : " + params[0].value + "%";
                	}
                }
				return res
			},
			axisPointer: {
				type: "cross",
			}
		},
		legend: {
			data: ["算力", "拒绝率"]
		},
		toolbox: {
            feature: {
                magicType: {
                    show: true,
                    type: ["line", "bar"]
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            },
            iconStyle: {
                borderColor: "rgba(60, 120, 194, 1)"
            },
            right: "16%"
        },
		xAxis: {
			type: "category",
			splitNumber: 1,
			maxInterval: 2,
			boundaryGap: true,
			data: dataX,
			axisLabel: {
				formatter: function(value) {
					var newVal = value.slice(6);
					return newVal
				}
			}
		},
		yAxis: [{
			type: "value",
			name: "算力(TH/s)",
			axisLabel: {
				formatter: "{value}"
			}
		}, {
			type: "value",
			name: "拒绝率(%)",
			yAxisIndex: 1,
			max: function(value) {
				return value.max = 100
			},
			axisLabel: {
				formatter: "{value}"
			}
		}],
		series: [{
			name: "算力",
			type: "bar",
			data: dataYL,
			barCategoryGap: "50%",
			itemStyle: {
				normal: {
					color: "rgba(80, 138, 211, .8)",
				},
				emphasis: {
					color: "rgba(60, 120, 194, 1)",
				}
			}
		}, {
			name: "拒绝率",
			type: "line",
			yAxisIndex: 1,
			data: dataYR,
			symbolSize: 5,
			lineStyle: {
				normal: {
					color: "#2ec7c9",
					width: 2,
					borderColor: "#2ec7c9",
				}
			},
			itemStyle: {
				normal: {
					borderWidth: 2,
					borderColor: "#2ec7c9",
					color: "#2ec7c9"
				}
			}
		}]
	};
	$.ajax({
		type: "post",
		url: url + "/api/auth/getMinerDayChart.do",
		data: {
			accountName: userName,
			workerName: workerName
		},
		dataType: "json",
		success: function(result) {
			if (result.code == 10000) {
				if (result.data.length > 0) {
					for (var i = 0; i < result.data.length; i++) {
						dataYL.push(result.data[i].dayCalcPower);
						var rej = result.data[i].rejectRate;
						dataYR.push(rej.substring(0, rej.length - 1));
						dataX.push(result.data[i].time)
					}
					minerCharts.hideLoading();
					minerCharts.setOption(option, true);
					window.onresize = minerCharts.resize()
				}
			} else {
				if (result.code == 10602) {
					minerCharts.hideLoading();
					$("#minerCharts").empty();
					$("#minerCharts").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该子账户还没有图表数据呢~" style="max-width:100px;"/>该子账户还没有图表数据呢！</div></div>')
				} else {
					minerCharts.hideLoading();
					$("#minerCharts").empty();
					$("#minerCharts").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="' + result.message + '" style="max-width:100px;"/>' + result.message + "</div></div>")
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			minerCharts.hideLoading()
		}
	})
}
function ajaxHourMiner() {
	workerName = $("#mName").val();
	var dataX = [];
	var dataYL = [];
	var dataYR = [];
	historyMapInit();
	var option = {
		tooltip: {
			trigger: "axis",
			formatter: function(params, ticket, callback) {
				var res = "时间 : " + params[0].name;
				if(params.length>1){
	            	res += "<br/>" + params[0].seriesName + " : " + params[0].value + "TH/S";
	                res += "<br/>" + params[1].seriesName + " : " + params[1].value + "%";
                }else{
                	if(params[0].seriesName=="算力"){
                		res += "<br/>" + params[0].seriesName + " : " + params[0].value + "TH/S";
                	}else if((params[0].seriesName=="拒绝率")){
                		res += "<br/>" + params[0].seriesName + " : " + params[0].value + "%";
                	}
                }
				return res
			},
			axisPointer: {
				type: "cross",
			}
		},
		legend: {
			data: ["算力", "拒绝率"]
		},
		toolbox: {
            feature: {
                magicType: {
                    show: true,
                    type: ["line", "bar"]
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            },
            iconStyle: {
                borderColor: "rgba(60, 120, 194, 1)"
            },
            right: "16%"
        },
		xAxis: {
			type: "category",
			splitNumber: 1,
			maxInterval: 2,
			boundaryGap: true,
			data: dataX,
			axisLabel: {
				formatter: function(value) {
					return value.substring(11)
				}
			}
		},
		yAxis: [{
			type: "value",
			name: "算力(TH/s)",
			axisLabel: {
				formatter: "{value}"
			}
		}, {
			type: "value",
			name: "拒绝率(%)",
			yAxisIndex: 1,
			max: function(value) {
				return value.max = 100
			},
			axisLabel: {
				formatter: "{value}"
			}
		}],
		series: [{
			name: "算力",
			type: "bar",
			data: dataYL,
			barCategoryGap: "50%",
			itemStyle: {
				normal: {
					color: "rgba(80, 138, 211, .8)",
				},
				emphasis: {
					color: "rgba(60, 120, 194, 1)",
				}
			}
		}, {
			name: "拒绝率",
			type: "line",
			yAxisIndex: 1,
			data: dataYR,
			smooth: true,
			symbolSize: 5,
			lineStyle: {
				normal: {
					color: "#2ec7c9",
					width: 2,
					borderColor: "#2ec7c9",
				}
			},
			itemStyle: {
				normal: {
					borderWidth: 2,
					borderColor: "#2ec7c9",
					color: "#2ec7c9"
				}
			}
		}]
	};
	$.ajax({
		type: "post",
		url: url + "/api/auth/getMinerHourChart.do",
		data: {
			accountName: userName,
			workerName: workerName
		},
		dataType: "json",
		success: function(result) {
			if (result.code == 10000) {
				if (result.data.length > 0) {
					for (var i = 0;
					i < result.data.length; i++) {
						dataYL.push(result.data[i].hourCalcPower);
						var rej = result.data[i].rejectRate;
						dataYR.push(rej.substring(0, rej.length - 1));
						dataX.push(result.data[i].time)
					}
					minerCharts.hideLoading();
					minerCharts.setOption(option, true);
					window.onresize = minerCharts.resize()
				}
			} else {
				if (result.code == 10602) {
					minerCharts.hideLoading();
					$("#minerCharts").empty();
					$("#minerCharts").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该子账户还没有图表数据呢~" style="max-width:100px;"/>该子账户还没有图表数据呢！</div></div>')
				} else {
					$("#minerCharts").empty();
					$("#minerCharts").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该图表数据空空如也！" style="max-width:100px;"/>该图表数据空空如也！</div></div>')
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			minerCharts.hideLoading();
			$("#minerCharts").empty();
			$("#minerCharts").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="数据加载失败，请检查网络！" style="max-width:100px;"/>数据加载失败，请检查网络是否正常！</div></div>')
		}
	})
}
function numStatus() {
	groupName = $("#groupName").val();
	minStatus = $("#minStatus").val();
	marker = $("#marker").val();
	workerName = $("#searchMiner").val();
	$.ajax({
		type: "post",
		url: url + "/api/auth/getCountMinerGroupByStatus.do",
		data: {
			accountName: userName,
			groupName: groupName,
			marker: marker,
			workerName: workerName
		},
		success: function(result) {
			if (result.code == 10000) {
				$("#totalNum").empty();
				$("#totalNum").html("(" + result.data.total + ")");
				$("#livelyNum").empty();
				$("#livelyNum").html("(" + result.data.active + ")");
				$("#inactivelyNum").empty();
				$("#inactivelyNum").html("(" + result.data.inactive + ")");
				$("#failNum").empty();
				$("#failNum").html("(" + result.data.invalid + ")")
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("#totalNum").empty();
			$("#inactivelyNum").empty();
			$("#livelyNum").empty();
			$("#failNum").empty()
		}
	})
};
function selPage(){
	pageSize = $("#selPageSize option:selected").text();
	numStatus();millPane();
}




