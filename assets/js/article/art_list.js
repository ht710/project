$(function () {
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        // 通过截取字符串的方式美化时间
        // console.log(data.split("."));    ["2021-01-13 18:54:27", "321"]
        // return data.split(".")[0]
        var dt = new Date(data)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + "-" + m + "-" + d + "    " + hh + ":" + mm + ":" + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }

    // 定义查询参数q
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2,// 每页显示几条数据，默认每页显示2条
        cate_id: '',// 文章分类的 Id
        state: ''// 文章的发布状态
    }
    initTable()
    initCate()
    // 定义获取文章列表数据的方法
    function initTable() {
        // 发起ajax
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取文章列表失败！")
                }
                // layui.layer.msg("获取文章列表成功！")
                // 使用模板引擎渲染页面的数据
                var htmlStr = template("tpl-table", res)
                // 将获取到的模板引擎的数据添加到tbody中
                $("tbody").html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    // 定义initCate 初始化文章的分类
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates/",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取分类数据失败！")
                }
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                // 通过layui  重新渲染表单区域的UI结构
                layui.form.render()
            }
        })
    }
    // 实现筛选的功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 获取表单中选中的值
        var cate_id = $("[name=cate_id]").val()
        var state = $("[name=state]").val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);    渲染到数据就显示1 
        // 调用laypage.render() 方法来渲染分页的结构
        layui.laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号  分页的容器ID
            count: total,//数据总数，从服务端得到  总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置被选中的那一页分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时  触发jump回调
            jump: function (obj, first) {
                // console.log(obj);
                // console.log(first);//true  
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。 默认1
                // console.log(obj.limit); //得到每页显示的条数   默认2
                // 把最新的页码值  赋值到q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // initTable()
                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }

    // 为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function () {
        // console.log(111);
        // 获取到文章的id
        var id = $(this).attr("data-id")
        // console.log(id);

        // 获取删除按钮的个数
        var len = $(".btn-delete").length
        // console.log(len);

        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg("删除失败！")
                    }
                    layui.layer.msg("删除成功！")
                    //当数据删除完成之后，需要判断当前这页是否还有剩余数据
                    //没有剩余数据  则让页码值-1之后再重新渲染页面
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable();
                }
            })
            layer.close(index);
        });

    })






})