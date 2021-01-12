// 检验表单数据
$(function () {
    layui.form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度必须在1~6个字符之间！"
            }
        }
    })
    //调用initUserInfo()函数
    initUserInfo()
    //初始化用户的基本信息  获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取用户信息失败！")
                }
                // console.log(res);
                //data: {id: 1129, username: "httt", nickname: "", email: "", user_pic: null}
                // message: "获取用户基本信息成功！"
                // status: 0
                // 调用form.val()方法为表单赋值
                layui.form.val("formUserInfo", res.data)
            }
        })
    }
    // 实现表单的重置效果
    $("#reBtn").on("click", function (e) {
        e.preventDefault()
        //重置后拿到最新数据渲染页面  重新获取用户信息
        initUserInfo()
    })

    // 发起请求更新用户的信息
    // 监听表单提交事件
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            // 获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新用户信息失败！")
                }
                layui.layer.msg("更新用户信息成功！")
                // 调用父页面中的方法，重新渲染用户的头像和用户信息
                window.parent.getUserInfo()
            }

        })
    })

})