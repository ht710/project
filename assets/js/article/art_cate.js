$(function () {
    initArtCateList()
    //发起请求获取数据
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // template("id", "数据")
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
            }
        })
    }
    // 点击添加类别 弹出弹出层
    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $("#btnAddCate").on("click", function () {
        indexAdd = layui.layer.open({
            type: 1,
            // 在area中指定宽高
            area: ["500px", "250px"],
            title: '添加文章分类',
            //获取弹出层表单的内容
            content: $("#dialog-add").html()
        });
    })

    // 发起Ajax请求，注意，按钮不是写死的，而是弹框出来的时候动态生成的，所以我们通过事件委派方式给表单绑定'submit'事件
    //通过代理的方式给form-add 绑定submit提交事件
    $("body").on("submit", "#form-add", function (e) {
        // console.log("111");
        //阻止默认提交事件
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            //收集数据
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("新增分类失败！")
                }
                initArtCateList()
                layui.layer.msg("新增分类成功！")
                //根据索引，关闭对应的弹出层
                layui.layer.close(indexAdd)
            }
        })
    })
    // 通过事件委托的形式  为btn-edit 按钮绑定点击事件
    var indexEdit = null
    $("tbody").on("click", ".btn-edit", function () {
        indexEdit = layui.layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html()
        })
        // 为修改文章分类的 弹出层填充表单数据  当弹出层展示出来之后  根据id的值发起请求获取文章分类的数据
        // 获取自定义属性值   attr("属性名称")
        var id = $(this).attr("data-id")
        // 发起ajax请求
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                // console.log(res);   
                // data: { Id: 1, name: "科技", alias: "科dddsds", is_delete: 0 }
                layui.form.val("form-edit", res.data)
            }
        })
    })
    // 通过事件委托  给修改按钮绑定submit提交事件  发起ajax请求  status等于0，则表示编辑成功
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg("更新分类信息失败！")
                }
                layui.layer.msg("更新分类信息成功！")
                // 关闭弹出层
                layui.layer.close(indexEdit)
                // 调用initArtCateList()获取最新的数据
                initArtCateList()
            }
        })
    })
    // 通过代理的形式 为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function () {
        // 获取自定义属性值   attr("属性名称")  通过拿到id来删除文章分类
        var id = $(this).attr("data-id")
        // 提示用户是否要删除
        // confirm 询问框复制
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg("删除文章分类失败！")
                    }
                    layui.layer.msg("删除文章分类成功！")
                    layer.close(index);
                    // 调用initArtCateList()获取最新的数据
                    initArtCateList()
                }
            })

        })


    })
})
