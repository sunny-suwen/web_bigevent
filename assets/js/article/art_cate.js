$(function(){
    //获取layui 的layer和form
    var layer = layui.layer;
    var form = layui.form;
    //1.获取文章列表
    initArtCateList();
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                //console.log(res);
                if(res.status !== 0){
                    return layer.msg('文章列表获取失败');
                }
                var htmlStr = template('tpl-table',res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //2.给添加类型按钮添加绑定事件
    var indexAdd = null;
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
          });  
    })
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
               // console.log(res);
               if(res.status !== 0){
                   return layer.msg('新增文章分类失败')
               }
               layer.msg('新增文章分类成功');
               //重新渲染页面
               layer.close(indexAdd)
               initArtCateList();
            }
        })
    })
    // 给编辑按钮绑定事件
    //因为编辑按钮是template渲染添加，所以不能直接绑定事件，需要在html现有标签通过代理的方式绑定事件
    var indexEdit = null;
    $('tbody').on('click','.btn-edit',function(){
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
          }); 
          //先获取修改的内容
          var id = $(this).attr('data-id')
       $.ajax({
           mtthod: 'GET',
           url: '/my/article/cates/' + id,
           success: function(res){
               
            //    if(res.status !== 0){
            //        return layer.msg('获取文章分类数据失败');
            //    }
            form.val('form-edit', res.data)
           // console.log(res);
           }
       })
    })
    // 通过代理的形式为表单绑定事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();
        //console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            
            data: $(this).serialize(),
            success: function(res){
                //console.log(res);
                if(res.status !== 0){
                    return layer.msg('更新分类信息失败')
                }
                layer.msg('更新分类信息成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })
    // 通过代理的形式给删除按钮添加绑定事件
    $('tbody').on('click','.btn-delete',function(){
        //获取要删除信息的id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    //console.log(res);
                    if(res.status !== 0){
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    layer.close(index);
                    initArtCateList();
                }
            })
            
          });
    })
})