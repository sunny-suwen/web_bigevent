$(function(){
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value){
            if(value.lenght >6){
                return '昵称长度必须在1-6个字符之间！'
            }
        } 
    })
    initUserInfo();
    function initUserInfo(){
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res){
                console.log(res);
                form.val('formUserInfo',res.data)
            }
        })
    }
    $('#btnReset').on('click',function(e){
        e.preventDefault();
        initUserInfo();
    });
    //更新用户信息
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('用户更新信息失败')
                }
                layer.msg(res.message);
                window.parent.getUserInfo();
            }
        })
    })
})