$(function() {

    // 1.左侧的排他事件,用事件委托
    $('.cat_left').on('click','a',function() {
        // console.log(34);
        // console.log($(this));
        $(".cat_left ul li a").removeClass('current');
        $(this).addClass('current');

       var id=$(this).data("id");
        // console.log(id);
        renderBysecondid(id);
        
    })

    // 2.模板引擎渲染左边的数据
    $.ajax({
        type:'get',
        url:'/category/queryTopCategory',
        // data:'',
        dataType:'json',
        success:function(data) {
            console.log(data);

            var htmlStr=template('leftTpl',data)
            $('.cat_left ul').html(htmlStr);
            // 一进来就渲染第一页
            renderBysecondid(data.rows[0].id);
            // console.log(data.rows[0].id);
            
        }
    })

    

     // 3.模板引擎渲染右边的数据
     function renderBysecondid(id) {

         $.ajax({
            type:'get',
            url:'/category/querySecondCategory',
            data:{
                id:id
            },
            dataType:'json',
            success:function(data) {
                // console.log(data);
    
                var htmlStr=template('rightTpl',data)
                $('.cat_right ul').html(htmlStr);
                
            }
        })
     }
})
