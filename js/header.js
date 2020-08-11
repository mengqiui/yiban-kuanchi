$(function() {
    if (hasUserInfo) {
        $("#account").text(userName)
    } else {
        layer.msg("哎呀，您还没有登陆，5秒后自动跳转登陆页！", {
            icon: 5,
            time: 5000
        },
        function() {
            window.location = url + "/static/login.html"
        })
    }
    var accHtml = "";
    accHtml += '<div style="margin:10px;text-indent:20px;" class="text-muted">';
    accHtml += "GoodPool.Top 矿池在世界各地建立了多个数据中心，每个子账户将绑定一个数据中心，算力、收益均独立结算。";
    accHtml += "请您选择距离最近的区域，这将有助于提升连接质量。";
    accHtml += "请您选择正确的币种，否则您的矿机可能无法正确挖矿。";
    accHtml += "每个子账户对应固定的币种和区域，一旦创建完成，币种和区域将无法修改。如果有其他需要，可以创建新的子账户。";
    accHtml += '<button class="btn btn-primary center-block" style="margin-bottom:0;margin-top:10px;width:100%;" id="closeBtn">知道了</button></div>';
    accHtml += '<!--子账户管理--><div class="setItem setLine text-center link" style="padding-bottom:10px;margin-top:10px;"><a href="manageAccount.html" target="_blank" class="text-primary">子账户管理</a></div>';
    accHtml += '<div class="setItem text-center link" style="padding-bottom:10px;"><a href="createAccount.html" class="text-primary">创建子账户</a></div>';
    accHtml += '<div class="subInfo"></div>';
    $("#subAccountMeanu").append(accHtml);
    var setHtml = "";
    setHtml += '<!--BTC收款地址--><div class="setItem setLine txtLf" onclick="btcGathering()"><em class="em text-muted">BCH收款地址</em>';
    setHtml += '<div class="alert alert-warning alert-dismissible" role="alert" style="font-size:12px;margin-top:5px;">';
    setHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    setHtml += "<strong>*</strong> 请点击设置BCH收款地址</div></div>";
    setHtml += '<!--历史收益等--><div class="setItem setLine text-center link"><a href="' + url + '/static/historyEarning.html" class="text-primary">历史收益</a></div>';
    setHtml += '<div class="setItem setLine text-center link"><a href="' + url + '/static/userCenter.html" class="text-primary">用户中心</a></div>';
    setHtml += '<div class="setItem text-center link"><a href="javascript:goOut()" class="text-primary" style="padding-bottom:10px;">退出登录</a></div>';
    $("#setMeanu").append(setHtml);
    $("#subAccount").click(function() {
        subAccountList(subPageNo, 5)
    })
});
var subTotal;
var subPageNo = 1;
function subAccountList(pageNo, pageSize) {
    $.ajax({
        type: "POST",
        url: url + "/api/auth/getAllSubAccount.do",
        data: {
            accountStatus: "0003001",
            pageNo: pageNo,
            pageSize: pageSize
        },
        beforeSend: function() {
            $(".subInfo").append('<div id="loadingAct" class="text-center" style="margin:10px;padding:10px;border:1px solid #f5f5f5;color:#777;"><img src="img/loading.gif"/><span style="margin-left:10px;">信息加载中……</span></div>')
        },
        success: function(result) {
            var subHtml = "";
            if (result.code == 10000) {
                subTotal = Math.ceil((result.page.totalNum) / 5);
                var accountList = result.data;
                var userAccountName = accountList[0].belongUser;
                handleStorage("user_tel", userAccountName);
                //sessionStorage.setItem("user_tel", userAccountName);
                subHtml += '<div class="bg-gray" style="padding:4px 10px;">当前账户<p style="margin-bottom:0;">' + userAccountName + '</p></div><div class="accountBox">';
                var accName, curType;
                for (var i = 1; i < accountList.length; i++) {
                    $.each(accountList[i],
                    function(key, val) {
                        accName = accountList[i].accountName;
                        curType = accountList[i].currencyType
                    });
                    var dic = new Array();
                    dic["0005002"] = "BCH";
                    dic["0005001"] = "BTC";
                    for (var key in dic) {
                        if (key == curType) {
                            curType = dic[key].toUpperCase()
                        }
                    }
                    subHtml += '<div style="padding:10px;"><div>';
                    subHtml += '<p><b>子账户名称：<em class="em subName">' + accName + "</em></b></p>";
                    subHtml += '<p><span style="margin-right:20px;">当前模式：' + curType + "</span> <span>昨日总收益：" + accountList[i].yesterdayProfit + '</span><a href="javascript:void(0);" onclick="changeAccount(this)" class="text-primary fr" style="font-size:14px;">进入</a></p></div></div>'
                }
                if (subTotal > 1 && pageNo != subTotal) {
                    subHtml += '<div id="addMore"></div><div style="padding:0 10px 10px 10px;" class="text-center"><div><a href="javascript:void(0);" id="addInfo" class="text-primary" onclick="ajaxMore()">加载更多账号信息</a></div></div></div>'
                } else {
                    subHtml += '<div id="addMore" style="padding:10px;"></div><div style="padding:10px;" class="text-center"><div><a href="javascript:void(0);" id="addInfo" class="text-primary" onclick="ajaxMore()">没有更多子账号信息啦！</a></div></div></div>'
                }
                $(".subInfo").empty();
                $(".subInfo").append(subHtml);
                return subTotal
            } else {
                if (result.code == 10301) {
                    $(".subInfo").empty();
                    $(".subInfo").append('<div class="alert alert-danger text-center" style="margin:10px;padding:10px; font-size:16px;font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;" role="alert"><a href="#" class="alert-link">您还未创建子账户！</a></div>')
                } else {
                    $(".subInfo").empty();
                    $(".subInfo").append('<div class="alert alert-danger text-center" style="margin:10px;padding:10px; font-size:16px;font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;" role="alert"><a href="#" class="alert-link">加载出错,请刷新页面重新加载！</a></div>')
                }
            }
        },
        error: function() {
            $(".subInfo").empty();
            $(".subInfo").append('<div class="alert alert-danger text-center" style="margin:10px;padding:10px; font-size:16px;font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;" role="alert"><a href="#" class="alert-link">加载出错,请退出重新登录！</a></div>')
        }
    })
}
function ajaxMore() {
    subPageNo++;
    if (subPageNo <= subTotal) {
        ajaxMoreFuc(subPageNo, 5)
    }
}
function ajaxMoreFuc(pageNo, pageSize) {
    $.ajax({
        type: "POST",
        url: url + "/api/auth/getAllSubAccount.do",
        data: {
            accountStatus: "0003001",
            pageNo: pageNo,
            pageSize: pageSize
        },
        beforeSend: function() {
            $("#addInfo").parent().parent().append('<div id="loadingAct" class="text-center" style="margin:10px;padding:10px;border:1px solid #f5f5f5;color:#777;"><img src="img/loading.gif"/><span style="margin-left:10px;">信息加载中……</span></div>')
        },
        success: function(result) {
            var subHtml = "";
            if (result.code == 10000) {
                subTotal = Math.ceil((result.page.totalNum) / 5);
                var accountList = result.data;
                var accName, curType;
                for (var i = 1; i < accountList.length; i++) {
                    $.each(accountList[i],
                    function(key, val) {
                        accName = accountList[i].accountName;
                        curType = accountList[i].currencyType
                    });
                    var dic = new Array();
                    dic["0005002"] = "BCH";
                    dic["0005001"] = "BTC";
                    for (var key in dic) {
                        if (key == curType) {
                            curType = dic[key].toUpperCase()
                        }
                    }
                    subHtml += '<div style="padding:10px;"><div>';
                    subHtml += '<p><b>子账户名称：<em class="em subName">' + accName + "</em></b></p>";
                    subHtml += '<p><span style="margin-right:20px;">当前模式：' + curType + "</span> <span>昨日总收益：" + accountList[i].yesterdayProfit + '</span><a href="javascript:void(0);" onclick="changeAccount(this)" class="text-primary fr" style="font-size:14px;">进入</a></p></div></div>'
                }
                $("#loadingAct").remove();
                $("#addInfo").parent().parent().remove();
                if (subTotal > 1 && pageNo != subTotal) {
                    subHtml += '<div style="padding:10px;" class="text-center"><div><a href="javascript:void(0);" id="addInfo" class="text-primary" onclick="ajaxMore()">加载更多账号信息</a></div></div></div>'
                } else {
                    if (pageNo == subTotal) {
                        subHtml += '<div style="padding:10px;" class="text-center"><div><a href="javascript:void(0);" id="addInfo" class="text-primary" onclick="ajaxMore()">没有更多账号信息啦！</a></div></div></div>'
                    }
                }
                $("#addMore").append(subHtml);
                return subTotal
            } else {
                if (result.code == 10301) {
                    $("#addMore").append('<div class="alert alert-danger text-center" style="margin:10px;padding:10px; font-size:16px;font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;" role="alert"><a href="#" class="alert-link">您还未创建子账户！</a></div>')
                } else {
                    layer.msg("加载出错,请刷新页面重新加载！", {
                        icon: 5
                    })
                }
            }
        },
        error: function() {
        	layer.msg("哎呀，您还没有登陆，5秒后自动跳转登陆页！", {
                icon: 5,
                time: 5000
            }, function () {
                window.location = url + "/static/login.html"
            })
        }
    })
}
function btcGathering() {
    layer.prompt({
        title: "更改地址",
        formType: 0,
        btn: ["下一步"],
        content: '新地址<input type="text" class="layui-layer-input" style="margin:10px 0;"/><div class="text-danger" style="width:300px;" maxlength="50">注意：为了安全原因，修改地址后48小时内不予支付，您的收益将作为余额，在48小时后的第一个结算日支付。</div>'
    },
    function(value, index) {
        var newAddress = value.trim();
        if (newAddress == "") {
            layer.msg("地址不能为空！", {
                icon: 2
            });
            return false
        } else {
            layer.close(index);
            layer.confirm("您的新地址是：" + newAddress, {
                title: "请确认您的新地址",
                btn: ["确认"]
            },
            function() {
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: url + "/api/auth/updateSubAccount.do",
                    data: {
                        accountName: userName,
                        btcAddress: newAddress
                    },
                    success: function(data) {
                        if (data.code == 10000) {
                            layer.msg(data.message, {
                                icon: 1
                            })
                        } else {
                            layer.msg(data.message, {
                                icon: 5
                            })
                        }
                        layer.close(index)
                    },
                    error: function() {
                    	layer.msg('网络故障，请检查网络是否正常！', {
                            icon: 1
                        })
                        layer.close(index)
                    }
                })
            })
        }
    })
};