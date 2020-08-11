$(function () {
    ajaxHourChart();
    ajaxBalance();
    $("button.btn-report").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active")
    })
});
var poolChart;

function historyMapInit() {
    if (poolChart != null && poolChart != "" && poolChart != undefined) {
        poolChart.dispose()
    }
    poolChart = echarts.init(document.getElementById("poolChart"), "blue");
    poolChart.showLoading({
        text: "正在努力的读取数据中...",
    })
}

function ajaxHourChart() {
    var dataX = [];
    var dataY = [];
    historyMapInit();
    var option = {
        xAxis: {
            type: "category",
            splitNumber: 1,
            maxInterval: 2,
            boundaryGap: false,
            data: dataX,
            axisLabel: {
                formatter: function (value) {
                    return value.substring(11)
                }
            }
        },
        yAxis: {
            type: "value",
            name: "算力(PH/s)"
        },
        tooltip: {
            trigger: "axis",
            formatter: "算力：{c} PH/s<br/>时间：{b}"
        },
        series: [{
            data: dataY,
            type: "line",
            smooth: true,
            lineStyle: {
                color: "rgba(60, 120, 194,0.8)"
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: "rgba(60, 120, 194,0.8)"
                }, {
                    offset: 1,
                    color: "rgba(250, 250, 250,0.8)"
                }], false)
            },
            itemStyle: {
                borderColor: "rgba(60, 120, 194,0.8)"
            }
        }]
    };
    $.ajax({
        type: "post",
        url: url + "/getPoolHourChart.do",
        data: {},
        dataType: "json",
        success: function (result) {
            if (result.code == 10000) {
                if (result.data.length > 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        dataY.push(result.data[i].hourCalcPower);
                        dataX.push(result.data[i].time);
                        dataX.sort()
                    }
                    poolChart.hideLoading();
                    poolChart.setOption(option, true);
                    window.onresize = poolChart.resize()
                }
            } else if (result.code == 10602) {
            		poolChart.hideLoading();
                    $("#poolChart").empty();
                    $("#poolChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该子账户还没有图表数据呢~" style="max-width:100px;"/>图表数据加载失败！</div></div>')
                } else {
                	poolChart.hideLoading();
                    $("#poolChart").empty();
                    $("#poolChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该图表数据空空如也！" style="max-width:100px;"/>该图表数据空空如也！</div></div>')
                }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
	            poolChart.hideLoading();
	            $("#poolChart").empty();
	            $("#poolChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="数据加载失败，请检查网络！" style="max-width:100px;"/>数据加载失败，请检查网络是否正常！</div></div>')
        }
    })
}

function ajaxDayChart() {
    var dataX = [];
    var dataY = [];
    historyMapInit();
    var option = {
        xAxis: {
            type: "category",
            splitNumber: 1,
            maxInterval: 2,
            boundaryGap: false,
            data: dataX,
            axisLabel: {
                formatter: function (value) {
                    var newVal = value.slice(6);
                    return newVal
                }
            }
        },
        yAxis: {
            type: "value",
            name: "算力(PH/s)"
        },
        tooltip: {
            trigger: "axis",
            formatter: "算力：{c} PH/s<br/>时间：{b}"
        },
        series: [{
            data: dataY,
            type: "line",
            smooth: true,
            lineStyle: {
                color: "rgba(60, 120, 194,0.8)"
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: "rgba(60, 120, 194,0.8)"
                }, {
                    offset: 1,
                    color: "rgba(250, 250, 250,0.8)"
                }], false)
            },
            itemStyle: {
                borderColor: "rgba(60, 120, 194,0.8)"
            }
        }]
    };
    $.ajax({
        type: "post",
        url: url + "/getPoolDayChart.do",
        data: {},
        dataType: "json",
        success: function (result) {
            if (result.code == 10000) {
                if (result.data.length > 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        dataY.push(result.data[i].dayCalcPower);
                        dataX.push(result.data[i].time);
                        dataX.sort()
                    }
                    poolChart.hideLoading();
                    poolChart.setOption(option, true);
                    window.onresize = poolChart.resize()
                }
            } else {
            	poolChart.hideLoading();
                $("#poolChart").empty();
                $("#poolChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="该子账户还没有图表数据呢~" style="max-width:100px;"/>图表数据加载失败！</div></div>')
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            poolChart.hideLoading();
            $("#poolChart").empty();
            $("#poolChart").append('<div class="noneTip" style="height:400px;width:100%;padding:20px;"><div class="text-center text-muted" style="padding:40px;font-size:18px;"><img src="img/empty.png" class="img-responsive center-block" alt="数据加载失败，请检查网络！" style="max-width:100px;"/>数据加载失败，请检查网络是否正常！</div></div>')
        }
    })
}

function ajaxBalance() {
    $.ajax({
        type: "get",
        url: url + "/getPoolStats.do",
        data: {},
        beforeSend: function () {
            $("#btcMoney").append('<div class="text-center" style="min-height:90px;line-height:90px;"><img src="img/loading.gif"/> 拼命加载中……</div>')
        }, success: function (data) {
            var tbHtml = "";
            if (data.code == 10000) {
                tbHtml += '<div style="margin-top:20px;"><span class="cls">总算力</span><span class="fr cls"><em class="clb em">' + data.data.poolImmediateCalcPower.calcPowerValue + "</em>&nbsp;" + data.data.poolImmediateCalcPower.calcPowerUnit + "H/s</span></div>";
                tbHtml += '<div><span class="cls">矿机总数</span><span class="fr cls clb">' + data.data.poolCountActiveMiner + "</span></div>";
                tbHtml += '<div><span class="cls">挖矿所得收益</span><span class="fr cls"><em class="clb em">' + data.data.poolTotalProfit + "</em> BCH</span></div>"
            }
            $("#btcMoney").empty();
            $("#btcMoney").append(tbHtml)
        }, error: function () {
            $("#btcMoney").empty();
            layer.msg("哎呀，您还没有登陆，5秒后自动跳转登陆页！", {
                icon: 5,
                time: 5000
            }, function () {
                window.location = url + "/static/login.html"
            })
        }
    });
    luckyValue()
}

function luckyValue() {
    $.ajax({
        type: "get",
        url: url + "/getLuckyValue.do",
        data: {},
        success: function (data) {
            if (data.code == 10000) {
                var luckyHtml = "";
                luckyHtml += '<div class="luckyVal1">3日 <h4 class="clb">' + data.data.last3DaysLuckyValue + '</h4></div><div class="luckyVal2">7日 <h4 class="clb">' + data.data.last7DaysLuckyValue + '</h4></div><div class="luckyVal3">30日 <h4 class="clb">' + data.data.last30DaysLuckyValue + "</h4></div>";
                $("#luckVal").empty();
                $("#luckVal").append(luckyHtml)
            }
        }, error: function () {}
    })
}

function chartData() {
    $.ajax({
        type: "POST",
        url: url + "/getPoolStats.do",
        data: {},
        success: function (result) {
            var dataHtml = "";
            dataHtml += '<div class="col-xs-12 col-sm-6 text-center"><span class="V">' + result.data.poolImmediateCalcPower.calcPowerValue + '</span><span class="K"> ' + result.data.poolImmediateCalcPower.calcPowerUnit + 'H/s</span><span class="K">丨</span><span class="V">' + result.data.poolCountActiveMiner + '</span><span class="K"> 在线矿机</span></div>';
            dataHtml += '<div class="col-xs-12 col-sm-6"><span class="K">已挖：</span><span class="V">' + result.data.poolTotalFoundBlock + '</span><span class="K"> 区块</span><span class="V">' + result.data.poolTotalProfit + '</span><span class="K"> BCH</span></div>';
            $(".reportChart").append(dataHtml)
        }, error: function () {
            console.log("error")
        }
    })
};