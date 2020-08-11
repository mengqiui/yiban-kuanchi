$(function () {
    ajaxBalance();
    ajaxHourSubChart();
    getPoolStats();
    getbalance();
    $("button.btn-report").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active")
    })
});
var subChart;

function historyMapInit() {
    if (subChart != null && subChart != "" && subChart != undefined) {
        subChart.dispose()
    }
    subChart = echarts.init(document.getElementById("subChart"), "blue");
    subChart.showLoading({
        text: "正在努力的读取数据中...",
    })
}

function ajaxHourSubChart() {
    var dataX = [];
    var dataYL = [];
    var dataYR = [];
    historyMapInit();
    var option = {
        tooltip: {
            trigger: "axis",
            formatter: function (params, ticket, callback) {
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
            }, axisPointer: {
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
            right: "14%"
        },
        xAxis: {
            type: "category",
            splitNumber: 1,
            maxInterval: 2,
            boundaryGap: true,
            data: dataX,
            axisLabel: {
                formatter: function (value) {
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
            max: 100,
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
        url: url + "/api/auth/getAccountHourChart.do",
        data: {
            accountName: userName
        },
        dataType: "json",
        success: function (result) {
            if (result.code == 10000) {
                if (result.data.length > 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        dataYL.push(result.data[i].hourCalcPower);
                        var rej = result.data[i].rejectRate;
                        dataYR.push(rej.substring(0, rej.length - 1));
                        dataX.push(result.data[i].time)
                    }
                    subChart.hideLoading();
                    subChart.setOption(option, true);
                    window.onresize = subChart.resize()
                }
            } else {
                if (result.code == 10602) {
                    subChart.hideLoading();
                    $("#subChart").empty();
                    $("#subChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该子账户还没有图表数据呢~" style="max-width:100px;"/>该子账户还没有图表数据呢！</div></div>')
                } else {
                    subChart.hideLoading();
                    $("#subChart").empty();
                    $("#subChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该图表数据空空如也！" style="max-width:100px;"/>该图表数据空空如也！</div></div>')
                }
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            subChart.hideLoading();
            $("#subChart").empty();
            $("#subChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="数据加载失败，请检查网络！" style="max-width:100px;"/>数据加载失败，请检查网络是否正常！</div></div>')
        }
    })
}

function ajaxDaySubChart() {
    var dataX = [];
    var dataYL = [];
    var dataYR = [];
    historyMapInit();
    var option = {
        tooltip: {
            trigger: "axis",
            formatter: function (params, ticket, callback) {
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
            }, axisPointer: {
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
            right: "14%"
        },
        xAxis: {
            type: "category",
            splitNumber: 1,
            maxInterval: 2,
            boundaryGap: true,
            data: dataX,
            axisLabel: {
                formatter: function (value) {
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
            max: function (value) {
                return value.max = 100
            }, axisLabel: {
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
        url: url + "/api/auth/getAccountDayChart.do",
        data: {
            accountName: userName
        },
        dataType: "json",
        success: function (result) {
            if (result.code == 10000) {
                if (result.data.length > 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        dataYL.push(result.data[i].dayCalcPower);
                        var rej = result.data[i].rejectRate;
                        dataYR.push(rej.substring(0, rej.length - 1));
                        dataX.push(result.data[i].time)
                    }
                    subChart.hideLoading();
                    subChart.setOption(option, true);
                    window.onresize = subChart.resize()
                }
            } else {
                if (result.code == 10602) {
                    subChart.hideLoading();
                    $("#subChart").empty();
                    $("#subChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该子账户还没有图表数据呢~" style="max-width:100px;"/>该子账户还没有图表数据呢！</div></div>')
                }else {
                    subChart.hideLoading();
                    $("#subChart").empty();
                    $("#subChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该图表数据空空如也！" style="max-width:100px;"/>该图表数据空空如也！</div></div>')
                }
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            subChart.hideLoading();
            $("#subChart").empty();
            $("#subChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="数据加载失败，请检查网络！" style="max-width:100px;"/>数据加载失败，请检查网络是否正常！</div></div>')
        }
    })
}

function ajaxBalance() {
    $.ajax({
        type: "post",
        url: url + "/api/auth/getUserPanelInfo.do",
        data: {
            accountName: userName
        },
        success: function (result) {
            if (result.code == 10000) {
                var userHtml = "";
                userHtml += '<!--实时算力--><div id="timeCal" class="panel currentCal"><div class="panel-heading text-center">';
                userHtml += '<h3 class="panel-title">' + result.data.currencyType + ' 实时算力</h3></div><hr class="user-page-hr"/><div class="panel-body counts">';
                userHtml += '<div class="calTime text-muted">实时 <p class="clb" style="font-size:20px;">' + result.data.immediateCalcPower.calcPowerValue + '<span class="text-muted" style="font-size:16px;">&nbsp;' + result.data.immediateCalcPower.calcPowerUnit + "H/s</span></p></div>";
                userHtml += '<div class="calTime fr text-muted">24小时 <p class="clb" style="font-size:20px;">' + result.data.last24HoursCalcPower.calcPowerValue + ' <span class="text-muted" style="font-size:16px;">&nbsp;' + result.data.last24HoursCalcPower.calcPowerUnit + "H/s</span></p>";
                userHtml += '</div></div></div><!--矿机数--><div id="millNum" class="panel clearfix millTotal">';
                userHtml += '<div class="panel-heading text-center"><h3 class="panel-title">矿机数</h3></div>';
                userHtml += '<hr class="user-page-hr"/><div class="panel-body counts">';
                userHtml += '<div class="calTime text-muted">活跃 <p class="clb" style="font-size:20px;">' + result.data.activeNum + "</p>";
                userHtml += '</div><div class="calTime fr text-muted">非活跃 <p class="clb" style="font-size:20px;">' + result.data.inactiveNum + "</p>";
                userHtml += '</div></div></div><!--收益--><div id="earn" class="panel earnData">';
                userHtml += '<div class="panel-heading text-center"><h3 class="panel-title">' + result.data.currencyType + " 收益</h3></div>";
                userHtml += '<hr class="user-page-hr"/><div class="panel-body counts">';
                userHtml += '<div class="calTime text-muted">今日预估 <p class="clb" style="font-size:20px;">' + result.data.todayPredict + "</p></div>";
                userHtml += '<div class="calTime fr text-muted">昨日实收 <p class="clb" style="font-size:20px;">' + result.data.yesterdayProfit + "</p></div></div></div>";
                $("#threeData").empty();
                $("#threeData").append(userHtml)
            } else {
                if (result.code == 10302) {
                    layer.msg("哎呀，您还没有登陆，5秒后自动跳转登陆页！", {
                        icon: 5,
                        time: 5000
                    }, function () {
                        window.location = url + "/static/login.html"
                    })
                }
            }
        }, error: function () {
        	layer.msg("哎呀，您还没有登陆，5秒后自动跳转登陆页！", {
                icon: 5,
                time: 5000
            }, function () {
                window.location = url + "/static/login.html"
            })
        }
    })
}

function getPoolStats() {
    $.ajax({
        type: "post",
        url: url + "/getPoolStats.do",
        data: {},
        success: function (result) {
            if (result.code == 10000) {
                var userHtml = "";
                userHtml += '<ul class="list-unstyled">';
                userHtml += '<li class="text-muted">全网算力<em class="em fr clb">' + result.data.wholeNetworkCalcPower.calcPowerValue + result.data.wholeNetworkCalcPower.calcPowerUnit + "H/s</em></li>";
                userHtml += '<li class="text-muted">矿池算力<em class="em fr clb">' + result.data.poolImmediateCalcPower.calcPowerValue + result.data.poolImmediateCalcPower.calcPowerUnit + "H/s</em></li>";
                userHtml += '<li class="text-muted">BCH 每T收益<em class="em fr clb">1TH/s * 24H = ' + result.data.theoryProfit + " BCH</em></li>";
                userHtml += "</ul>";
                $("#network").empty();
                $("#network").append(userHtml)
            }
        }, error: function () {
            $("#network").append("模块加载失败！")
        }
    })
}

function getbalance() {
    $.ajax({
        type: "post",
        url: url + "/api/auth/getbalance.do",
        data: {
            accountName: userName
        },
        success: function (result) {
            if (result.code == 10000) {
                var balHtml = "";
                balHtml += '<ul class="list-unstyled"><li class="text-muted">余额<em class="em fr clb">' + result.data.balance + "</em></li>";
                balHtml += '<li class="text-muted">已支付<a href="historyEarning.html" class="text-primary" style="margin-left:5px;font-size:12px;">支付记录</a><em class="em fr clb">' + result.data.paidBtc + "</em></li>";
                balHtml += '<hr/><li class="text-muted">上一次支付时间<em class="em fr clb">-</em></li>';
                balHtml += '<li class="text-muted">待确认支付<em class="em fr clb">无</em></li></ul>';
                $("#income").empty();
                $("#income").append(balHtml)
            }else if(result.code == 10306){
                $("#panelCome").hide()
            }
        }, error: function () {}
    })
};