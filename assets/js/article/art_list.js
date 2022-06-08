$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDay());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    };
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    };
    // 定义一个查询的参数对象,在请求数据时,将其提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    };
    initTable();
    initCate();
    //获取文章列表数据
    function initTable() {
        //发起Ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //调用渲染分页的方法
                renderPage(res.total);
            }
        });
    };

    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                var htmlStr1 = template('tpl-cate', res);
                $('[ name=cate_id]').html(htmlStr1);
                form.render();
            }
        })
    };
    //为筛选表单绑定submit事件
    $('#form_search').on('submit', function(e) {
            e.preventDefault();
            //为查询参数对象q重新赋值
            q.cate_id = $('[name =cate_id]').val();
            q.state = $('[name = state]').val();
            initTable();
        })
        //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                if (!first) {
                    initTable();
                }

            }
        })
    };
    //为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！');
                    }
                    layer.msg('删除成功！');
                    //判断当前页是否还有数据，无数据，页码值减1
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })

            layer.close(index);
        });

    });
    // //为编辑按钮绑定点击事件
    // $('tbody').on('click', '.btn-edit', function() {
    //     location.href = '/article/art_pub.html'
    // })
})