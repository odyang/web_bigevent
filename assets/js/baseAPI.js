$.ajaxPrefilter(function(options) {
    //拼接url请求地址
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // 统一为有权限的请求添加headers
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };
    // 全局挂载complete回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
            //   1.强制清除token
            localStorage.removeItem('token');
            // 2.强制退回登录页面
            location.href = '/login.html';
        }
    }

});