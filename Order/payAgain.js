/**
 * Created by a123 on 17/3/17.
 */
require("../common/api.js");
const commom = require("../common/common.js");

const YNZapi = commom.YNZapi;
const YNZ = commom.YNZ;

$(document).ready(function () {
    /*处理前一个页面带的参数*/
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURI(r[2]); return null;
    }
    var orderNo = GetQueryString("orderNo");
    //alert(orderNo);

    /*发起支付*/
    $.ajax({
        type:'GET',
        data:{
            'orderNo':orderNo,
            'isBatch':0
        },
        url: YNZapi+'/order/succeed',
        dataType:'json',
        async:false,
        success:function (data) {
            if(data.code == 0){
                var list = data.result.list;
                for (var i in list){
                    var orderId = list[i]['orderId'];
                    break;
                }
                WXPay(orderId)
            }
        }
    });

    function WXPay(orderId) {
        $.ajax({
            type:'GET',
            data:{'id':orderId},
            url:YNZapi+'/Weixinpays/getWxPaysPrm',
            dataType:'json',
            success:function (data) {
                if(data.code == 0){
                    console.log(data);
                    var result = data.result;
                    result = $.parseJSON(result);
                    console.log(result);
                    let appId = result['appId'];
                    let nonceStr = result['nonceStr'];
                    let timeStamp = result['timeStamp'];
                    let WXpackage = result['package'];
                    let signType = result['signType'];
                    let paySign = result['paySign'];

                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',{
                            "appId": appId,     //公众号名称，由商户传入
                            "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数
                            "nonceStr": nonceStr, //随机串
                            "package": WXpackage,
                            "signType": signType,         //微信签名方式：
                            "paySign": paySign //微信签名
                        },
                        function(res){
                            WeixinJSBridge.log(res.err_msg);
                            //alert(res.err_code+res.err_desc+res.err_msg);
                            history.back(-1);
                        }
                    );

                }
            }
        });
    }
});