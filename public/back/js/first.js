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
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);

                var htmlstr = template('firstTpl', data);
                $('tbody').html(htmlstr);

                // 分页插件
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





    var inputText;
    $('#add').on('click', function () {
        // console.log(22);
        $('#addModal').modal('show');
        
        
    })
    
    $('#addBtn').on('click', function () {
        inputText=$('#addModal .modal-body input').val().trim();
        // console.log(inputText);

        $.ajax({
            type:'post',
            url:'/category/addTopCategory',
            data: {
                categoryName:inputText,
            },
            dataType:'json',
            success:function(data) {

                console.log(data);

                $('#addModal').modal('hide');
                render();
                
            }
        })
    })
})

