$(function () {

    // 渲染用户列表


    // 思路:
    // 发送ajax请求,获取用户的数据
    // 结合模板引擎,把数据渲染到页面

    var currentPage = 1;
    var pageSize = 5;

    render();
    function render() {

        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: currentPage,     //page:页码
                pageSize: pageSize  //pageSize:每页条数
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);

                // 模板引擎
                var htmlstr = template('userTemp', data);
                $('tbody').html(htmlstr);

                $('#pagination').bootstrapPaginator({

                    bootstrapMajorVersion: 3,
                    currentPage: currentPage,
                    totalPages: Math.ceil(data.total / pageSize),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }



    // 启用禁用功能
    $('tbody').on('click', '.btn', function () {

        console.log(333);
        $('#userModal').modal('show');

        // 获取id
        var id = $(this).parent().data('id');
        // console.log(id);
        // 获取将来要将用户btn设置成什么样子
        var isDelete = $(this).hasClass('btn-success') ? 1 : 0;

        $('#sumbitBtn').click(function() {

            $.ajax({
                type:'post',
                url:'/user/updateUser',
                data:{
                    id:id,
                    isDelete:isDelete
                },
                dataType:'json',
                success:function(data) {

                    console.log(data);
                    if(data.success) {
                        $('#userModal').modal('hide');
                    }
                    render();
                    
                }
            })
        })

    })

})

