$(function () {

    //1. 渲染用户列表

    var currentPage = 1;
    var pageSize = 3;

    var picArr = [];
    render();
    function render() {

        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                var htmlStr = template('productTpl', data);
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
            url: '/category/querySecondCategoryPaging',
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

    // 3.把ul li下面a的值赋给button,用事件委托
    $('#ul_menu').on('click', 'a', function () {

        // console.log(23);
        var text = $(this).text();
        // console.log(text);
        $('#spanFirst').text(text);

        var id = $(this).data('id');
        // console.log(id);

        $('[name="brandId"]').val(id);
        // console.log($('[name="brandId"]').val(id));

        $('#formcheck').data("bootstrapValidator").updateStatus("brandId", "VALID");


    })

    // 4.配置图片上传

    $("#fileupload").fileupload({
        dataType: "json",
        url: '/product/addProductPic',
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            //   console.log(data);
            //   图片的地址
            var result = data.result.picAddr;
            // console.log(result);
            // console.log(picArr);
            // picArr数组在前面几行声明了
            picArr.unshift(result);
            $('#imgBox').prepend('<img src="' + result + '" alt="" style="height: 100px;" >');

            // console.log(picArr);
            if (picArr.length > 3) {
                //删除最后一个,数组的最后一张图也要删除
                picArr.pop();
                $('#imgBox img:last-of-type').remove();
            }
            if (picArr.length == 3) {
                $("#formcheck").data('bootstrapValidator').updateStatus('picStatus', 'VALID');
                console.log(23);

            }

        }
    });

    // 5.表单校验
    $('#formcheck').bootstrapValidator({

        // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置校验字段
        fields: {
            // 二级分类id, 归属品牌
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            // 商品名称
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            // 商品描述
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            // 商品库存
            // 要求: 必须是非零开头的数字, 非零开头, 也就是只能以 1-9 开头
            // 数字: \d
            // + 表示一个或多个
            // * 表示零个或多个
            // ? 表示零个或1个
            // {n} 表示出现 n 次
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 32-40'
                    }
                }
            },
            // 商品价格
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            // 商品原价
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            // 标记图片是否上传满三张
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    })

    // 6. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
    // $('#formcheck').on('success.form.bv', function (e) {
    //     e.preventDefault();
    //     //使用ajax提交逻辑

    //     var paramStr=$('#formcheck').serialize();

    //     paramStr+='$picArr'+JSON.stringify(picArr);

    //     $.ajax({
    //         type:'post',
    //         url:'/product/addProduct',
    //         data:paramStr,
    //         dataType:'json',
    //         success:function(data) {
    //             console.log(data);

    //         }
    //     })
    // });


    $('#formcheck').on('success.form.bv', function (e) {
        // $('#addBtn').click(function (e) {

        e.preventDefault();

        var paramsStr = $('#formcheck').serialize(); // 获取基础的表单数据

        // 还需要拼接上图片数据  picArr
        // key=value&key1=value1&key2=value2
        paramsStr += '&picArr=' + JSON.stringify(picArr);

        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: paramsStr,
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    // 关闭模态框
                    $('#addModal').modal('hide');
                    // 重新渲染第一页
                    currentPage = 1;
                    render();

                    // 重置表单元素的状态和内容
                    $('#formcheck').data('bootstrapValidator').resetForm(true);

                    // 重置按钮文本, 图片
                    $('#spanFirst').text('请选择二级分类');
                    $('#imgBox img').remove();
                    picArr = [];
                }
            }
        })

    })
})