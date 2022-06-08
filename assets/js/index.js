$(function() {
    getUserInfo();
    // 退出登录
    $('#btnlogout').on('click', function() {
        var layer = layui.layer;
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 1.清除本地存储的token
            localStorage.removeItem('token');
            // 2.回到登录页面
            location.href = '/login.html'

            layer.close(index);
        });
    });
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status != 1) {
                renderAvatar(res.data);
            }
        }
    })
};
//封装渲染用户头像函数
function renderAvatar(user) {
    var name = user.nickname || user.username;
    //渲染用户名
    $('.welcome').html('欢迎&nbsp&nbsp' + name);
    //渲染用户头像
    if (user.user_pic !== null) {
        //渲染用户自定义头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //渲染用户文本头像
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide();
    }
}