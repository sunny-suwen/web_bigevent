$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 获取文章列表页的表单内容,需要带参数
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable();
    initCate();
    function initTable() {
        $.ajax({
          method: 'GET',
          url: '/my/article/list',
          data: q,
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('获取文章列表失败！')
            }
            // 使用模板引擎渲染页面的数据
            var htmlStr = template('tpl-table', res)
            $('tbody').html(htmlStr)
            // 调用渲染分页的方法
            renderPage(res.total);
          }
        })
    };
    // 初始化文章分类方法
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
               // console.log(res);
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 为筛选表单添加事件
    $('#form-search').on('submit',function(e){
        e.preventDefault();
        //获取表单的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });
    // 定义渲染分页
    function renderPage(total){
        // 使用layui的分页模块
        // 使用laypage.render(options)方法渲染分页结构
            //执行一个laypage实例
            laypage.render({
              elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号,
              count: total, //数据总数，从服务端得到
              limit:q.pagesize, //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
              curr:q.pagenum, // 设置默认被选中的分页
              layout:['count','limit','prev', 'page', 'next','skip'],
              limits:[2,3,5,10],//每页条数的选择项。
            //   分页发生切换，触发jump回调
            jump:function(obj,first){
                // console.log(first);
                // console.log(obj.curr);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if(!first){
                    initTable();
                }
            }

            });
    }
    //通过代理事件，为删除按钮添加事件
    $('tbody').on('click','.btn-delete',function(){
        var len = $('.btn-delete').length;
        //console.log(len);
        //获取文章的id
        var id = $(this).attr('data-id');
        //console.log(id);
        //询问客户是否要删除数据
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success:function(res){
                    console.log(res);
                    if(res.status !== 0){
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功');
                    // 删除成功后需要确定这一页中是否还有剩余数据
                    // 如果没有数据了，则让页面-1后条用initTable（）这个方法
                    if(len === 1){
                        // 如果len等于1，证明删除完毕之后就没有任何数据了
                        // 页码值最小是1
                        q.pagenum = q.pagenum === 1? 1:q.pagenum -1
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
     });
})