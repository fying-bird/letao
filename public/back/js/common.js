$(function () {
    // 开启进度条功能
    $(document).ajaxStart(function () {

        NProgress.start();
    })


    // 结束进度条功能
    $(document).ajaxStop(function () {
        setTimeout(function () {
            NProgress.done();
        }, 1000)
    })
})

$(function () {

    // js实现二级分类显示隐藏
    // console.log($('.secondji'));
    $('.secondji').on('click', function () {

        // console.log($('.classify')); 
        // 让隐藏的二级菜单切换隐藏状态  
        //不加stop的话停不下来
        $('.classify').stop().slideToggle();
    })


    // 侧边栏显示隐藏效果
    $('.icon_menu').on('click',function() {
        console.log($('.icon_menu'));
        
        // 切换类会更简单一点,改变left值和padding-left的值
        // 再加transition动画
        $('.left_column').toggleClass('hidden_menu');
        $('.right_content').toggleClass('hidden_menu');
        $('.right_content .barAbove').toggleClass('hidden_menu');
    })


    // 点击退出按钮显示模态框
    $('.icon_logout').click(function() {

        $('#logoutModal').modal('show')
    })

    $('#logoutBtn').click(function() {
        console.log('haha');

        $.ajax({

            url:'/employee/employeeLogout',
            type:'get',
            // dataType:'',
            success:function(data) {

                location.href='login.html';
            }
        })
        
    })
})
