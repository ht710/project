$(function () {

    initCate()

    // 初始化富文本编辑器
    initEditor()
    // 定义initCate方法 加载文章分类
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("初始化文章分类失败！")
                }
                // layui.layer.msg("初始化文章分类成功！")
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                // 一定要记得调用form.render()方法
                layui.form.render()
            }
        })
    }
    //实现基本的裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面绑定点击事件
    $("#btnChooseImage").on("click", function () {
        // 模拟点击事件
        $("#coverFile").click()
    })
    // 监听file文件选择框的change事件  获取用户选择的文件列表
    $("#coverFile").on("change", function (e) {
        // 获取到文件的列表属性
        var file = e.target.files
        // 判断用户是否选择了该文件
        if (file.length === 0) {
            return
        }
        // 根据文件  创建对应的url地址
        var newImgURL = URL.createObjectURL(file[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 先定义文章的发布状态
    var art_state = "已发布";
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on("click", function () {
        art_state = "草稿"
    })
    // 为表单绑定submit提交事件
    $("#form-pub").on("submit", function (e) {
        e.preventDefault();
        // 基于form表单  快速创建一个FormData 列表
        var fd = new FormData($(this)[0])
        //将文章的发布状态存放到fd中
        fd.append("state", art_state)
        // 将封面裁剪过后的图片  输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob)
                // 发起ajax请求
                publishArticle(fd)
            })
    })
    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("发布文章失败！")
                }
                layui.layer.msg("发布文章成功！")
                // 发布文章成功后  跳转到文章列表页面
                location.href = "/article/art_list.html"
            }
        })
    }

})