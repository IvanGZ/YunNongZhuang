/**
 * Created by a123 on 17/2/9.
 */
require("../common/api.js");
const commom = require("../common/common.js");

const YNZapi = commom.YNZapi;
const YNZ = commom.YNZ;

$(document).ready(function () {

    /*取头像，名字*/
    var openid = commom.getCookie('openid');
    $.ajax({
        headers:{'session': openid},
        type:'GET',
        url:YNZapi+'/user',
        dataType:'json',
        success:function (data) {
            if (data.code == 0){
                var result = data.result;
                var headimgurl = result['headimgurl'];
                var nickname = result['nickname'];

                $(".headImg").attr('src',headimgurl);
                $(".userName").text(nickname);
            }
        }
    });

    /*页面跳转*/
    $(".DeliveryAddress").on('click',function () {
        window.location.href = 'DeliveryAddress/DeliveryAddress.html'
    })
});