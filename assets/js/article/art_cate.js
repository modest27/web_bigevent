$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    // 获取文章分类列表数据
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var indexAdd = null;
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式为form-add绑定提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/my/article/addcates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: $('#form-add').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                initArtCateList();
                layer.msg('新增分类成功！');
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }

        })

    })

    var indexEdit = null;
    // 通过代理的形式为btn-edit绑定点击事件
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id');
        // 发起请求获取对应分类数据
        $.ajax({
            method: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates/' + id,
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })

        // 用代理的方式为修改分类的表单绑定submit事件
        $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: 'http://api-breakingnews-web.itheima.net/my/article/updatecate',
                headers: {
                    Authorization: localStorage.getItem('token') || ''
                },
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败！')
                    }
                    layer.msg('更新分类数据成功！')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })

        // 用代理的形式为删除按钮绑定点击事件
        $('tbody').on('click', '.btn-delete', function() {
            var id = $(this).attr('data-id')
                // 提示用户是否要删除
            layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    method: 'GET',
                    url: 'http://api-breakingnews-web.itheima.net/my/article/deletecate/' + id,
                    headers: {
                        Authorization: localStorage.getItem('token') || ''
                    },
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除分类失败！')
                        }
                        layer.msg('删除分类成功！')
                        layer.close(index)
                        initArtCateList()
                    }
                })
            })
        })
    })
})