$(function () {
    //点击“去注册账号”的链接
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show()
    })
    //点击“去登录”的链接
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide()
    })
    //自定义校验规则
    //先得到form模块对象
    var form = layui.form;
    //自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    })
    //监听注册表单的提交事件
    $("#form_reg").on("submit", function (e) {
        //阻止默认提交行为
        e.preventDefault()
        //发起ajax请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post("/api/reguser", data, function (res) {
            // console.log(res);//message: "身份认证失败！"   status: 1
            if (res.status !== 0) {
                layer.msg(res.message)
            } else {
                layer.msg("注册成功，请登录")
            }
        })
    })
    //监听登录表单的提交事件
    $("#form_login").on("submit", function (e) {
        // console.log("111");
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("登录失败！")
                }
                layui.layer.msg("登录成功！")
                localStorage.setItem("token", res.token)
                location.href = "index.html"
            }
        })

    })




})


