$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var indexAdd = null;
    var indexEdit = null;
    initArtCateList();
    //获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败！')
                }
                var htmlstr = template('tpl-table', res);
                $('tbody').html(htmlstr);
            }
        })
    };
    //为添加类别绑定事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    });
    //通过代理，为form-add绑定提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                initArtCateList();
                layer.msg("新增文章分类成功！");
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    });
    // 通过代理，为btnedit绑定点击事件

    $('tbody').on('click', '#btnedit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        // 发起Ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                };
                form.val('form-edit', res.data)
            }
        });
    });
    // 通过代理，为form-edit绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        // 发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                layer.msg('更新分类信息成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });
    // 通过代理，为btnremove绑定点击事件
    $('tbody').on('click', '#btnremove', function() {
        var id = $(this).attr('data-id');
        //提示框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            // 发起Ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    initArtCateList();
                }
            });

            layer.close(index);
        });
    });




})