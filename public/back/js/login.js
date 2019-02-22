
$(function() {

$('#form').bootstrapValidator({
    // //设置小图标
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },

    //设置校验规则
    fields: {

        // 在这步的时候千万不要忘记给input的name属性设置对应的值,如果没写的话,下面的代码不会执行
        // 校验用户名，对应name表单的name属性

        username: {
            validators: {
                notEmpty: {
                    message: "用户名不能为空"
                },
                stringLength: {
                    min: 2,
                    max: 6,
                    message: "用户名长度必须是 2-6 位"
                },
                callback: {
                    message:'用户名不存在'
                }
            }
        },
        password: {
            validators: {
                notEmpty: {
                    message: "密码不能为空"
                },
                stringLength: {
                    min: 6,
                    max: 12,
                    message: "密码长度必须是 6-12 位"
                },
                callback: {
                    message:'密码错误'
                }
            }
        }

    }

});


$("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑

    //使用ajax进行提交
    $.ajax({
        type: "post",
        url: "/employee/employeeLogin",
        data: $('#form').serialize(),
        dataType: "json",
        success: function (data) {
            // console.log(data);

            if(data.error==1000) {
                // alert('用户名错误')
                $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback")
            }
            if(data.error==1001) {
                // alert('密码错误')
                $('#form').data("bootstrapValidator").updateStatus("password", "INVALID", "callback")
            }
            if(data.success) {
                location.href='index.html';
            }           
        }
    });
});

// 点击重置按钮时，还需要重置表单的错误提示信息。
$("[type='reset']").on("click", function(){
  
    //重置表单样式
    $("form").data("bootstrapValidator").resetForm();
    
  });
})
