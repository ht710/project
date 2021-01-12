$(function () {

    // 为密码框校验验证规则
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 原密码与新密码的值进行比较
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新旧密码不能相同！"
            }
        },
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次密码不一致！"
            }
        }
    })

    // 发起请求  实现重置密码的功能
    // 给form表单绑定submit事件
    $(".layui-form").on("submit", function (e) {
        // 阻止表单默认行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新密码失败！")
                }
                layui.layer.msg("更新密码成功！")
                // 重置表单
                // 将jQuery对象转换为DOM对象
                $(".layui-form")[0].reset()
            }
        })
    })



})