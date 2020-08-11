var url = "http://192.168.80.201:8080/ebpool.web";
var userName;var isNew;
var hasUserInfo = handleStorage("userName") ? true : false;
if (hasUserInfo) { userName = JSON.parse(handleStorage("userName")); }
$(function() {
    //	头部子账户下拉菜单
    $("#subAccount").click(function() {
        $("#subAccountMeanu").toggle();
        $("#setMeanu").hide();
    });

    $("#setBtn").click(function() {
        $("#setMeanu").toggle();
        $("#subAccountMeanu").hide();
    });

    $("#closeBtn").click(function() {
        $(this).parent().hide();
    })

    $("#password").keypress(enterLogin);
    $("#checkCode").keypress(enterRegist);
    $(".changeTelmbe").keypress(enterChangeTel);

    var count = 0;
    var outTime = 30000;//30分钟
    window.setInterval(go, 1000);//每隔1秒

    function go() {
        count++;
        if (count == outTime * 60) {
            window.location.href = url + '/static/login.html';
            clearStorage("userName");
            // window.localStorage.clear();
            // window.sessionStorage.clear();
        }
    }

    var x;
    var y;
    //  监听鼠标
    document.onmousemove = function(event) {
        var x1 = event.clientX;
        var y1 = event.clientY;
        if (x != x1 || y != y1) {
            count = 0;
        }
        x = x1;
        y = y1;
    };

    //  监听键盘
    document.onkeydown = function() {
        count = 0;
    };
})

//判断浏览器是否支持localStorage,存取数据
function handleStorage(){ 
    //console.log(arguments);
    if(arguments.length> 1){
        var name = arguments[0];var val = arguments[1];
        try{
            localStorage.setItem(name, val);
        }catch(e){
            setCookie(name,val,'d365');//抛出异常使用cookie存储
        }
    }else {
        var name = arguments[0];
        var dataStr='';
        try{
            localStorage.setItem('cookieTest', 'test');//判断是否支持存储
            dataStr = localStorage.getItem(name);
        }catch(e){
            dataStr = getCookie(name)//同样抛出异常我们使用cookie去取值
        }
        return dataStr;
    }
}

//设置Cookie
function getCookie(name){//取cookies值
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        if(!arr[2]){
             return null ;
        }else if(arr[2] !='null'){
             return unescape(arr[2]) ;
        }else{
             return null ;
        };
    }else{
        return null;
    }
}

//存储Cookie
function setCookie(name, value, time){
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
}
function getsec(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}

//  清除Cookie
function clearStorage(name){    // 清除存储
    if(!name) { return false;}
    try{
        localStorage.setItem('cookieTest', 'test');//正常清除
        localStorage.removeItem(name);
    }catch(e){
        document.cookie = name + "=" + null + ";expires=" + 0+";path=/";//抛出异常，存储到了cookie，因此清除cookie。
    }

}

//	退出登陆，清理本地存储
function goOut() {
    window.location.href = url + '/';
    clearStorage("userName");
    // window.localStorage.clear();
    // window.sessionStorage.clear();
}

//	提醒创建子账户
function noticeCreate(addr) {
    layer.confirm('哎呀，还没创建子账户！', { btn: ['立马创建'] }, function() {
        window.location.href = url + '/static/' + addr + '.html';
    })
}

//  解决子账户名中文编码问题
function reconvert(str) {
    str = str.replace(/(\\u)(\w{1,4})/gi, function($0) {
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });
    return str;
}

//	校验input输入框是否为空值
function checkIpt(ipt) {
    //console.log($(ipt).val());
    var keyVal = $(ipt).val();
    if (keyVal == 0) {
        layer.msg('输入内容不能为空！', { icon: 7, time: 4000 });
        $(ipt).focus();
        return false;
    }
}

//	登陆成功后，文字滚动效果
function textScroll() {
    $("#welcome").text("欢迎 " + userName + " 成功登陆！").css("color", "rgb(130,165,205)");
    var speed = 30; //数字越大速度越慢
    var tab = document.getElementById("welScroll");
    var tab1 = document.getElementById("welcome");
    var tab2 = document.getElementById("welScroll2");
    tab2.innerHTML = tab1.innerHTML;

    function Marquee() {
        //console.log(tab2.offsetWidth);
        //console.log(tab.scrollLeft);
        if (tab2.offsetWidth - tab.scrollLeft <= 0) {
            tab.scrollLeft -= tab1.offsetWidth;
        } else {
            tab.scrollLeft++;
        }
    }
    var MyMar = setInterval(Marquee, speed);
    tab.onmouseover = function() { clearInterval(MyMar) };
    tab.onmouseout = function() { MyMar = setInterval(Marquee, speed) };
}

//  对手机号进行校验
function moblieTest(tel){
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
	if (reg.test(tel)) {
		return true;
	}else{
		return false;
	};
}
//  验证密码
function passTest(pwd){
    var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
	if (reg.test(pwd)) {
		return true;
	}else{
		return false;
	};
}

//  对验证通过的密码进行校验
function addM(elm) {
    var passWord = MD5($(elm).val() + "jhiohk.;");
    $("#pwd").val(passWord);
    //console.log($("#pwd").val())
}

//获取验证码
var verifyOff=true;//获取验证码的开关
function mbe(phoneNum){
    $("#errorTxt").text("");
    var mobile = $(phoneNum).val();
	if (mobile == ""){$("#codeError").text("手机号码不能为空！");return false;}$("#errorTxt").text("");
	if( moblieTest(mobile)&&verifyOff ){
		$('#sendBtn').text("获取中");
		$.post(url+"/sendSmsCode.do",{mobile:mobile},function(data){
			if(data.code == 10000){
                verifyOff=false;
                $("#codeError").hide();
				$('#sendBtn').text("60秒");
				var time=60;//倒计时60秒
				var timeSet=setInterval(function(){
					time--;
					$('#sendBtn').text(time+"秒");
					if(time<1){ verifyOff=true; 
					clearInterval(timeSet); 
					$('#sendBtn').text("再次获取");}//打开获取验证码的开关，并且关闭循环
				},1000);
			} else if(data.code == 10007) {
                $('#sendBtn').text("获取验证码");
                $("#codeError").show().text('一天最多8次。');
            }else{
				$("#codeError").show().text(data.message);
				$('#sendBtn').text("获取验证码");
			}
		});
	}else{
        if(!verifyOff){$("#codeError").show().text("一分钟内无法继续发送");return false;}$("#codeError").hide();
        if(!moblieTest(phoneNum)){$("#errorTxt").text("请输入正确的手机号");return false;}$("#errorTxt").text("");
	}
}

//  校验验证码
function verifyCode(mobile, Scode) {
    var mob = $(mobile).val();
    var checkCode = $(Scode).val().trim();
    if (checkCode != "") {
        //请求校验接口
        $.ajax({
            type: "get",
            url: url + '/checkSmsCode.do',
            data: { mobile: mob, smsCode: checkCode },
            success: function(result) {
                if (result.code !== 10000) {
                    var msg = result.message;
                    $("#codeError").show().text(msg);
                    return false;
                } else {
                    $("#codeError").hide().text("");
                    return true;
                }
            },
            error: function(result) {
            	$("#codeError").show().text('网络故障，请检查网络！');
            }
        });
    } else {
        $("#codeError").show().text('请输入验证码！');
        return false;
    }

}

//  登陆成功回车键提交
function enterLogin(e) {
    // 获取用户单击键盘的“键值”
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    // 如果是回车键
    if (keyCode == 13) {
        loginAction();
    }
}

//	注册成功回车键提交
function enterRegist(e) {
    // 获取用户单击键盘的“键值”
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    // 如果是回车键
    if (keyCode == 13) {
        registerAction();
    }
}

//  提交注册
function registerAction() {
    $("#codeError").hide();
    var tel = $("#mobile").val();
    var newPwd = $("#newPassword").val();
    var checkPwd = $("#checkPassword").val();
    if(!moblieTest(tel)){$("#errorTxt").text("请输入正确的手机号");return false;}$("#errorTxt").text("");
    if(!passTest(newPwd)){$("#errorTxt").text("请输入8-16位密码。提示:须含有字母和数字,区分大小写");return false;}$("#errorTxt").text("");
    if(newPwd != checkPwd){$("#errorTxt").text("两次输入密码不一致");return false;}$("#errorTxt").text("");addM("#checkPassword");
    if ($("#checkCode").val() == ""){$("#errorTxt").text("验证码不能为空");return false;}$("#errorTxt").text("");
    //  发送请求
    $.ajax({
        url: url + "/api/user/register.do",
        data: { mobile: tel, password: $("#pwd").val(), code: $("#checkCode").val() },
        type: 'POST',
        success: function(result) {
            if (result.code == 10000) {
                var time = 3; //倒计时的秒数
                for (var i = time; i >= 0; i--) {
                    window.setTimeout('registJump(' + i + ')', (time - i) * 1000);
                }
            }else{
                $("#errorTxt").text(result.message);
            }
        },
        error: function() {
            $("#errorTxt").text('网络故障，请检查网络是否正常！');
        }
    });
}
//  注册成功后跳转
function registJump(num, text) {
    var URL = url + '/static/login.html';
    $("#errorTxt").text("恭喜操作成功，将在" + num + "秒后自动跳转到登陆页面！");
    if (num == 0) { window.location.href = URL; }
}
//  提交登陆
function loginAction() {
    var mobile = $("#username").val();
    var password = $("#password").val();
    if(!moblieTest(mobile)){$("#errorTxt").text("请输入正确的手机号");return false;}$("#errorTxt").text("");
    if(!passTest(password)){$("#errorTxt").text("请输入正确的密码");return false;}$("#errorTxt").text("");
    addM("#password");
    $.ajax({
        type: "POST",
        url: url + "/login.do",
        data: { username: mobile, password: $("#pwd").val() },
        success: function(result) {
            if (result.code != 10000) {
                var msg = result.msg;
                $("#errorTxt").show().text(msg);
                return false;
            } else if (result.code == 10000) {
                $("#errorTxt").hide();
                //登陆成功时存放子账户
                $.post(url + "/api/auth/getAccountName.do", { "mobile": mobile }, function(result) {
                    var obj = result.data;
                    for (var key in obj) {
                        if(isPC()){
                            if (key == "accountNameTemp") {
                                window.location.href = url + '/static/indexAccount.html';
                                clearStorage("userName");
                                handleStorage("userName", JSON.stringify(obj[key]));
                            } else if (key == "accountName") {
                                window.location.href = url + '/static/userPane.html';
                                clearStorage("userName");
                                handleStorage("userName", JSON.stringify(obj[key]));
                            }
                        }else{
                            if (key == "accountNameTemp") {
                                window.location.href = url + '/static/settingNew.html';
                                clearStorage("userName");clearStorage("isNew");
                                handleStorage("userName", JSON.stringify(obj[key]));
                                handleStorage("isNew", '1');
                            } else if (key == "accountName") {
                                window.location.href = url + '/static/userPane02.html';
                                clearStorage("userName");clearStorage("isNew");
                                handleStorage("userName", JSON.stringify(obj[key]));
                                handleStorage("isNew", '0');
                            }
                        }
                    }
                }, "json")
            }
        },
        error: function() {
            $("#errorTxt").show().text('网络故障，请检查网络是否正常！');
        }
    })
}
//	子账户创建校验
function checkCreatAccount() {
    var radVal = $("input:radio[name='currencyType']:checked").val();
    var accName = $("#accountName").val();
    var btcAddress = $("#btcAddress").val();
    if (radVal != "" && accName != "") {
        $("#codeError").text("");
        $.ajax({
            type: "POST",
            url: url + "/api/auth/createSubAccount.do",
            data: { accountName: accName, currencyType: radVal, btcAddress: btcAddress },
            success: function(result) {
                if (result.code != 10000) {
                    $("#codeError").text(result.message);
                    return false;
                } else if (result.code == 10000) {
                    $("#creatAccount").submit();
                    $("#codeError").text('恭喜创建成功！');
                    clearStorage("userName");
                    handleStorage("userName", JSON.stringify(accName));
                    if(!isPC()){
                        clearStorage("isNew");
                        handleStorage("isNew", '0');
                        window.location.href = url + '/static/userPane02.html';
                    }else{
                        window.location.href = url + '/static/userPane.html';
                    }
                    return true;
                }
            },
            error: function(result) {
                $("#codeError").text('创建失败，请退出重新登录！');
            }
        })
    } else {
        $("#codeError").text('请填写正确信息！');
    }
}

//	切换子账户
function changeAccount(account) {
    //console.log(account);
    var $account = $(account);
    var accountName = $account.parent().prevAll().find(".subName").html();
    $.post(url + "/api/auth/changeSubAccount.do", { "accountName": accountName },
        function(result) {
            //console.log(result);
            if (result.code == 10000) {
                clearStorage("userName");
                handleStorage("userName", JSON.stringify(result.data.accountName));
                if(!isPC()){
                    window.location = url + '/static/userPane02.html';
                }else{
                    window.location = url + '/static/userPane.html';
                }
                
            }
        }, "json");
}

//  时间戳转换
function getMyDate(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen); //最后拼接时间  
    return oTime;
};

//  补0操作
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}

//  用户中心页面
function userCenterInfo() {
    $.post(url + "/api/auth/getUserLoginInfo.do", function(result) {
        var creatTime = getMyDate(result.data.createTime);
        var mobile = result.data.mobile;
        var loginHistory = getMyDate(result.data.loginTime);
        handleStorage("user_tel", mobile);
        //sessionStorage.setItem("user_tel", mobile);
        var userHtml = "";
        if(isPC()){
            userHtml += '<dl class="dl-horizontal myInfo"><dt>手机：</dt><dd>' + mobile + '<a href="userCenter-tel.html" class="fr">编辑</a> </dd></dl>';
            userHtml += '<dl class="dl-horizontal"><dt>注册日期：</dt><dd>' + creatTime + '</dd></dl>';
            $("#userInfo").append(userHtml);
            $("#loginHist").text(loginHistory);
        }else{
            $("#userMoblie").text(mobile);
            $("#loginHist").text(loginHistory);

        }
        
    }, "json");
}

//	获取用户名
function getTel() {
    var mobile = handleStorage("user_tel");
    //var mobile = sessionStorage.getItem("user_tel");
    //console.log(mobile);
    if (mobile == null) {
        layer.msg('哎呀，登陆失效，5秒后重新登陆！', { icon: 5, time: 5000 }, function() {
            window.location.href = url + '/static/login.html';
        })
    } else {
        $("#oldTel").val(mobile);
    }
}

//	校验新手机号
function verifyOldTel() {
    var OTel = handleStorage("user_tel");
    //var OTel = sessionStorage.getItem("user_tel");
    var NTel = $("#newTel").val().trim();
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/; //正则验证11位手机号码
    var flag = reg.test(NTel);
    if (NTel != "") {
        if (OTel == NTel) {$("#errorTxt").show().text("新旧手机号不能一致！");return false}
        else if (!flag) {$("#errorTxt").show().text("请输入正确的11位手机号！");return false} 
        else {$("#errorTxt").text("");mbe('#newTel');}
    } else {$("#errorTxt").text("新手机号不能为空！");return false;}
}
//	修改手机号提交
function changeTel() {
    var NTel = $("#newTel").val();
    var code = $("#checkChangeCode").val();
    if (NTel != "" && code != "") {
        $.ajax({
            type: "POST",
            url: url + '/api/auth/updateMobile.do',
            data: { mobile: NTel, smsCode: code },
            success: function(data) {
                if (data.code == 10000) {
                    $("#errorTxt").text("");
                    layer.msg('恭喜您修改成功，5秒后自动跳转登陆页面！', { icon: 6, time: 5000 }, function() {
                        window.location.href = url + '/static/login.html';
                    });
                } else{$("#errorTxt").text(data.message);}
            },
            error: function() {
            	$("#errorTxt").text('网络故障，请检查网络是否正常！');
            }
        })
    } else {$("#errorTxt").text('手机号或验证码不能为空！');}
}

//	修改成功回车键提交
function enterChangeTel(e) {
    // 获取用户单击键盘的“键值”
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    // 如果是回车键
    if (keyCode == 13) {
        changeTel();
    }
}

//	修改密码提交
function changePwd() {
    var vCode = $("#verifCode").val();
    var oldPwd = $("#nowPwd").val();
    var newPwd = $("#pwd").val();
    var pwd1 = $("#newPwd").val();
    var pwd2 = $("#okPwd").val();
    if (vCode != "" && oldPwd != "" && pwd2 != "") {
        $("#conError").text("");
        if(pwd1 != pwd2){$("#conError").text('两次密码输入不一致！');return false;}
        if(!passTest(pwd1)){$("#conError").text("请输入正确的密码");return false;}
        addM("#okPwd");
        $.ajax({
            type: "POST",
            url: url + '/api/auth/updatePasswd.do',
            data: { smsCode: vCode, oldPasswd: oldPwd, newPasswd: newPwd, newPasswdAgain: newPwd },
            success: function(data) {
                if (data.code == 10000) {
                    $("#conError").text("");
                    layer.msg('恭喜您修改成功，5秒后自动跳转登陆页面！', { icon: 6, time: 5000 }, function() {
                        window.location.href = url + '/static/login.html';
                    });
                } else if (data.code == 10102 || data.code == 10207 || data.code == 10109) {
                    $("#conError").text(data.message);
                } else {
                    $("#conError").text(data.message);
                }
            },
            error: function() {
            	$("#conError").text('修改失败，请退出重新登录！');
            }
        })
    }else {
        $("#conError").text('验证码和密码不能有空值！');
    }
}

//	重置密码
function resetPassword() {
    var tel = $("#findMobile").val();
    var newPwd = $("#Password1").val();
    var checkPwd = $("#Password2").val();
    var ckCode = $("#findCode").val();    
    if(!moblieTest(tel)){$("#errorTxt").text("请输入正确的手机号");return false;}$("#errorTxt").text("");
    if (ckCode == ""){$("#codeError").text("验证码不能为空");return false;}$("#codeError").text("");
    if(!passTest(newPwd)){$("#errorTxt").text("请输入8-16位密码。提示:须含有字母和数字,区分大小写");return false;}$("#errorTxt").text("");
    if(newPwd != checkPwd){$("#errorTxt").text("两次输入密码不一致");return false;}$("#errorTxt").text("");addM("#Password2");
    var mdPwd = $("#pwd").val();
    if (mdPwd == "") {$("#errorTxt").text("密码不能为空");return false;}
    $("#errorTxt").text("");
    $.ajax({
        url: url + "/api/user/resetPassword.do",
        data: { mobile: tel, newPassword: mdPwd, code: ckCode },
        type: 'POST',
        success: function(result) {
            if (result.code != 10000) {
                var msg = result.message;
                $("#errorTxt").text(msg);
                return false;
            } else if (result.code == 10000) {
                var time = 3; //倒计时的秒数
                for (var i = time; i >= 0; i--) {
                    window.setTimeout('registJump(' + i + ')', (time - i) * 1000);
                }
                $("#restBtn").submit();
                return true;
            }
        },
        error: function() {
            $("#errorTxt").text('网络故障，请检查网络是否正常！');
        }
    });
}
// 判断浏览器是否支持placeholder属性  
function isSupportPlaceholder() {
    var input = document.createElement('input');
    return 'placeholder' in input;
};
(function() {
    IEVersion();
    //判断是否是IE浏览器，包括Edge浏览器  
    function IEVersion() {
        //取得浏览器的userAgent字符串  
        var userAgent = navigator.userAgent;
        //判断是否IE浏览器  
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion < 10 || !isSupportPlaceholder()) {
                $("<div class='head tips'>抱歉，您正在使用的浏览器版本过低，无法正常使用我们的网站，请升级后再试！<a href='browser.html' target='_blank'>下载链接</a></div>").prependTo("body")
                $(".head.tips").css("display", "block");
                if ($(".head.tips").is(':visible')) { $(".head.tips").nextAll().css("display", "none");
                    $("body").removeClass(); }
            } else {
                $(".head.tips").css("display", "none");
            }
        }
    }
})();

$(function(){
    // 判断设备以及访问页面
    if(!isPC()){
        var strVar = "";
        strVar += "<div class=\"fixed b l pad5 center BGwhite menuBox\">\n";
        strVar += window.location.pathname.indexOf("userPane02.html")<0?"<div>":"<div  class=\"on\">";
        strVar += "<a href=\"userPane02.html\"><div class=\"footer-icon glyphicon-home\"><\/div>主页<\/a><\/div>";
        strVar += window.location.pathname.indexOf("machine02.html")<0?"<div>":"<div  class=\"on\">";
        strVar += "<a href=\"machine02.html\"><div class=\"footer-icon glyphicon-tasks\"><\/div>矿机<\/a><\/div>\n";
        strVar += window.location.pathname.indexOf("Info.html")<0?"<div>":"<div  class=\"on\">";
        strVar += "	<a href=\"Info.html\"><div class=\"footer-icon glyphicon-signal\"><\/div>统计<\/a><\/div>\n";
        if(handleStorage("isNew") == 0){
            strVar += window.location.pathname.indexOf("settingMoblie.html")<0?"<div>":"<div  class=\"on\">";
            strVar += "<a href=\"settingMoblie.html\"><div class=\"footer-icon glyphicon-user\"><\/div>我的<\/a><\/div>\n";
        }else{
            strVar += window.location.pathname.indexOf("settingNew.html")<0?"<div>":"<div  class=\"on\">";
            strVar += "<a href=\"settingNew.html\"><div class=\"footer-icon glyphicon-user\"><\/div>我的<\/a><\/div>\n";
        }
        strVar += "<\/div>\n";
        $(".moblie-pages-item").append(strVar);
    }

    

})

//判断用什么打开
var browser = {
	versions: function() {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return { //移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
if (browser.versions.mobile) { //判断是否是移动设备打开。browser代码在下面
	var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
	if (browser.versions.ios) {
	   console.log("ios打开");
	}
	if (browser.versions.android) {
		console.log("安卓打开");
	}
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		console.log("micromessenger打开");
	}
	if (ua.match(/WeiBo/i) == "weibo") {
	   console.log("微博 打开");
	}
	   if (ua.match(/QQ/i) == "qq") {
	   console.log("QQ 打开");
	}
} else {
	//否则就是PC浏览器打开
	console.log("浏览器 打开");
}

function isPC() 
{  		
   var userAgentInfo = navigator.userAgent;  
   var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"); 
   var flag = true;  
   for (var v = 0; v < Agents.length; v++) {  
	   if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
   }  
   return flag; 
}   
























