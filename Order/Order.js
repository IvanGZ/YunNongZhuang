/**
 * Created by a123 on 17/1/18.
 */
require("../common/api.js");
require("../common/aui-popup.js"); //弹出层
const commom = require("../common/common.js");

const YNZapi = commom.YNZapi;
const YNZ = commom.YNZ;
/*获取openID*/
var openid = commom.getCookie('openid');

let areaId2
let shopId
let shopPrice
let freight


let appId
let timeStamp
let nonceStr
let WXpackage
let signType
let paySign


/*function getFreight() {
    if (areaId2 && shopId) {
        $.ajax({
            type:"GET",
            url:YNZapi+"/Carts/getFreight",
            headers:{'session':openid},
            data:{
                'areaId2':areaId2,
                'shopId':shopId
            },
            dataType:"json",
            success:function (data) {
                if(data.code == 0){
                     freight =  data.result;
                    $(".freight").text("￥"+freight+"元")
                }
            }

        })
    }
}*/


$(document).ready(function () {
    /*弹出层*/
    var popup = new auiPopup();
    function showPopup(){
        popup.show(document.getElementById("bottom"))
    }

    /*处理前一个页面带的参数*/
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURI(r[2]); return null;
    }
    var id = GetQueryString("id");
    //alert(id);

    /*/!*限制只能输入数字*!/
    $(".numInput").keypress(function () {
        var keyCode = event.keyCode;
        if ((keyCode >= 48 && keyCode <= 57))
        {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
    });*/

    /*商品数量加减控件*/
    $("#a").Spinner({value:1, min:0, len:2, max:99});

    //alert(openid);
    /*获取默认地址*/
    var addressId = '';
    $.ajax({
       type:'GET',
        url:YNZapi+'/address',
        headers:{'session':openid},
        dataType:'json',
        async:false,
        success:function (data) {
            if(data.code == 0){
                var result = data.result;
                console.log(result);
                if(result.length == 0){
                    $(".addressContent").html("<div class='aui-card-list-header'><span class='aui-text-warning'>! 请到个人管理里填写收件地址</span><div class='aui-btn aui-btn-warning address'>去管理</div></div>");
                    $(".address").on('click',function () {
                        window.location.href = '../personalProfile/DeliveryAddress/DeliveryAddress.html'
                    })
                }
                else if(result.length != 0){
                    var def_address = '';
                    for (var i in result){
                        if(result[i].isDefault == 1){
                            def_address = result[i];
                        }
                    }
                    if (def_address != '') {
                        addressId = def_address['addressId'];
                        $(".userName").text(def_address.userName);
                        $(".userPhone").text(def_address.userPhone);
                        $(".userAddress").text(def_address.userAddress);
                        areaId2 = def_address.areaId2;
                        getFreight();

                    } else {
                        $(".addressContent").html("<div class='aui-card-list-header'><span class='aui-text-warning'>! 请选择默认收件地址</span><div class='aui-btn aui-btn-warning address'>去管理</div></div>");
                        $(".address").on('click',function () {
                            window.location.href = '../personalProfile/DeliveryAddress/DeliveryAddress.html'
                        });
                    }

                }
            }
        }

    });

    /*获取订单信息*/
    $.ajax({
        type:'GET',
        url:YNZapi+'/Carts/nowbuy',
        data:{
            'goodsId':id,
        },
        async:false,
        headers:{'session':openid},
        dataType:'json',
        success:function (data) {
            if (data.code == 0){
                var result = data.result;
                //console.log(result);

                shopId = result['shopId']; //店铺ID
                var shopName = result['shopName']; //店铺名称

                var goodsid = result['goodsId']; //商品ID
                 shopPrice = Number(result['shopPrice']); //价格
                window.shopPrice = shopPrice;
                var goods_name = result['goodsName']; //商品名字
                var img_url = YNZ+result['goodsImg']; //图片
                var goodsStock = result['goodsStock']; //库存
                var goodsUnit = result['goodsUnit']; //库存单位

                $(".name").text(shopName);
                $(".shopPrice").text(shopPrice + "每" + goodsUnit);
               /* $(".money").text("￥"+shopPrice);//订单合计
                $(".sum").text(shopPrice); //合计*/
                $(".goods_name").text(goods_name);
                $(".img_url").attr('src',img_url);
                /*$(".goodsStock").text(goodsStock + goodsUnit);*/
                $(".goodsUnit").text(goodsUnit);

                getFreight();

            }
        }
    });

    /*运费*/
    function getFreight() {
        if (areaId2 && shopId) {
             $.ajax({
                 type: "GET",
                 url: YNZapi + "/Carts/getFreight",
                 headers: {'session': openid},
                 data: {
                     'areaId2': areaId2,
                     'shopId': shopId
                 },
                 async: false,
                 dataType: "json",
                 success: function (data) {
                     if (data.code == 0) {
                         freight = Number(data.result);
                         $(".freight").text("￥" + freight + "元");
                         var total = shopPrice + freight;
                         total.toFixed(2);
                         $(".sum").text(total);//合计
                         $(".money").text("￥" + total);//订单合计
                     }
                 }
             });
        }
    }

    /*添加订单*/
    var orderNo = '';
    $(".submit").on('click',function () {
        /*判断是否有默认地址*/
        if(addressId == ''){
            alert('请到个人管理填写默认地址');
            return false;
        }
        var num = $(".numInput").val();
        $.ajax({
           type:'POST',
            url:YNZapi+'/order',
            data:{
               'addressId':addressId,
               'goodsId':id,
                'buyNum':num,

            },
            async:false,
            headers:{'session':openid},
            dataType:'json',
            success:function (data) {
                if (data.code == 0){
                    orderNo = data.result;
                    $(".orderInfo").text(orderNo);
                    getOrderId(orderNo)
                }
            }
        });
    });

    /*合计*/
        /*不可编辑*/
    /*$(".numInput").attr('disabled','true');*/
        /*减*/
    $(".Decrease").on('click',function () {
        sum()
    });
        /*加*/
    $(".Increase").on('click',function () {
        sum()
    });
        /*输入*/
    $('.numInput').on('input',function() {
        sum()
    });
    function sum() {
        var num = $(".numInput").val();  //数量
        var sum = num * window.shopPrice; //总价
        var total = sum+freight;//加运费
        total.toFixed(2);
        $(".sum").text(total);
        $(".money").text("￥"+total);
    }




    /*支付*/
    var orderId ='';
    function getOrderId(a) {
        //console.log("intoGetOrderId");
        if(a != ''){
            $.ajax({
                type:'GET',
                data:{'orderNo':a},
                url:YNZapi+'/order/succeed',
                dataType:'json',
                headers:{'session':openid},
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
        }
    }

    function WXPay(orderId) {
        console.log("intoWXPay");
        $.ajax({
            type:'GET',
            data:{'id':orderId},
            url:YNZapi+'/Weixinpays/getWxPaysPrm',
            dataType:'json',
            headers:{'session':openid},
            success:function (data) {
                console.log('debug api', data)
                if(data.code == 0){
                    //console.log(data);
                    var result = data.result;
                    result = $.parseJSON(result);
                    //console.log(result);
                    appId = result['appId'];
                    nonceStr = result['nonceStr'];
                    timeStamp = result['timeStamp'];
                    WXpackage = result['package'];
                    signType = result['signType'];
                    paySign = result['paySign'];

                    $(".payMoney").removeClass("payMoneyBefore").addClass("payMoneyAfter");
                    $(".payMoney").text("立即支付");
                }
            }
        });
    }
});

$(document).on('WeixinJSBridgeReady', function() {
    //console.log('WeixinJSBridgeReady!!');
    $(document).on('click', ".payMoney" ,function () {
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
                console.log(res)
                // WeixinJSBridge.log(res.err_msg);
                //alert(res.err_code+res.err_desc+res.err_msg);
                // sessionStorage.setItem("back",2);
                // window.location.href = '../index.html'
            }
        );
    })
})
