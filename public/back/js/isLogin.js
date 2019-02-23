    $.ajax({

        url: '/employee/checkRootLogin',
        type: 'get',
        dataType:'json',
        success: function (data) {

            if (data.error === 400) {

                location.href = 'login.html';
            }
        }
    })
