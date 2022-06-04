$(function() {
    //点击"去注册账号"的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    //点击"去登录"的链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 从layui中引入form模块
    var form = layui.form;
    var layer = layui.layer;
    // 初始化表单验证
    form.verify({
        // 密码验证
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码验证
        repwd: function(value) {
            if (value !== $('#form_reg [name = password]').val()) {
                return '两次密码输入不一致';
            }
        }
    });
    // 监听注册提交
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        // 发起ajax请求的POST请求
        var data = {
            username: $('#form_reg [name = username]').val(),
            password: $('#form_reg [name = password]').val()
        };
        $.post('http://www.liulongbin.top:3007/api/reguser', data,
            function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                };
                layer.msg(res.message);
                // 注册成功后，跳转到登录页面
                $('#link_login').click();
            });

    });
    // 监听登录提交
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        // 发起ajax请求的POST请求
        $.ajax({
            url: 'http://www.liulongbin.top:3007/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                console.log(res.token);
                // 登录成功后，跳转到首页
                // location.href = '/index.html';
            }
        });
    })







})