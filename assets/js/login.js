$(function () {
    $('#link_reg').on('click', function () {
        //console.log('ok');
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', function () {
        //console.log('ok');
        $('.login-box').show();
        $('.reg-box').hide();
    });
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !== value){
                return '两次密码不一致'
            }
        }
    })
    //监听注册事件
    $('#form_reg').on('submit',function(e){
        e.preventDefault();
        //发起post请求
        var data = {
            username:$('#form_reg [name=username]').val(),
            password:$('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',data,function(res){
            console.log(res);
            if(res.status !== 0){
                return layer.msg(res.message);
            }
            layer.msg(res.message);
        })
    })
    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        //阻止表单默认行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data:$(this).serialize(),
            success:function(res){
                console.log(res);
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                localStorage.setItem('token',res.token);
                location.href = '/index.html'
            }

        })
    })
})