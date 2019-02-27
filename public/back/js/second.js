$(function () {

    //1. 渲染用户列表


    // 思路:
    // 发送ajax请求,获取用户的数据
    // 结合模板引擎,把数据渲染到页面
    var currentPage = 1;
    var pageSize = 5;

    render();

    function render() {

        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);

                var htmlStr = template('secondTpl', data);
                $('tbody').html(htmlStr);

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

    // 2.添加分类按钮,渲染ul里面的数据
    $('#add').on('click', function () {

        $('#addModal').modal('show');

        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);

                var htmlStr = template('ulTpl', data);
                $('#ul_menu').html(htmlStr);
            }
        })
    })


    // 3.给a注册事件委托
    $('#ul_menu').on('click', 'a', function () {

        // console.log(23);

        // 获取这个a的文本
        var text = $(this).text();
        // console.log(text);

        //    修改button按钮里面的内容
        $('#spanFirst').text(text);
        var id = $(this).data("id");
        console.log(id);
        // 将选中的id设置给隐藏域
        $('[name="categoryId"]').val(id);
        console.log($('[name="categoryId"]').val(id));
        
        $('#formcheck').data("bootstrapValidator").updateStatus("categoryId", "VALID")


    })

    // 4.配置图片上传
    $('#fileupload').fileupload({
        url: '/category/addSecondCategoryPic',
        dataType: 'json',
        done: function (e, data) {
            console.log(data);
            // picAddr=data.result;
            // console.log(picAddr);
            // 获取图片上传的路径
            needSrc = data.result.picAddr;
            console.log(needSrc);
            // 给把获取到的src给img
            $('#imgbox').attr('src', needSrc);
            $('[name="brandLogo"]').val(needSrc);
            $('#formcheck').data("bootstrapValidator").updateStatus("brandLogo", "VALID")


        }
    })

    // 5.表单校验
    // console.log($('#formcheck'));

    $('#formcheck').bootstrapValidator({


        // 指定不校验的类型
        excluded: [],
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 3.指定校验字段
        fields: {
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '二级分类不为空'
                    }
                }
            },
            brandLogo: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '图片不能为空'
                    }
                }
            }
        }


    })

    // 6.点击添加按钮后，完成添加，通过ajax
    $('#addBtn').click(function (e) {

        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $('#formcheck').serialize(),
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if(data.success) {

                    // 关闭模态框
                    $('#addModal').modal("hide");
                    // 重置模态框里面的内容
                    $('#formcheck').data("bootstrapValidator").resetForm(true);
    
                    // 找到下拉菜单文本重置
                    $('#spanFirst').text("请选择1级分类")
    
                    // 找到图片重置
                    $('#imgbox').attr("src", "images/none.png");
    
                    // 重新渲染页面
                    currentPage=1;
                    render();
                }

            }
        })
    })
})