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





})
