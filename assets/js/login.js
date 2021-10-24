$(function() {
    // 点击去注册切换注册
    $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 点击去登陆切换到登陆
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从layui中获取form对象
    var form = layui.form;

    // 从layui中获取layer对象
    var layer = layui.layer;

    // 使用form.verify()来自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则

        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听注册表单事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post('http://api-breakingnews-web.itheima.net/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登陆！');
            $('#link_login').click();
        })
    })

    // 监听登陆表单事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: 'http://api-breakingnews-web.itheima.net/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！');
                }
                // 将获取的token值存储在localstorage里面
                localStorage.setItem('token', res.token);
                // 跳转页面
                location.href = 'index.html';
            }
        })
    })
})