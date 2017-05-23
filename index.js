
require("./common/api.js");
var commom = require("./common/common.js");
require("./common/aui-slide.js");/*轮播*/
require("./common/aui-tab.js");/*底部导航*/
require("./common/aui-dialog.js");/**/
require("./common/aui-toast.js");/**/
require("./common/gundong.js");/*滚动文字*/
require("./common/gundong2.js");/*滚动文字*/


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
    var openid = GetQueryString("openid");
    //alert(openid);
    document.cookie="openid="+openid;

    /*底部导航*/
    /*tab菜单*/
    var tab = new auiTab({
        element:document.getElementById("footer"),
        index:1,
        repeatClick:false
    },function(ret){
        //console.log(ret);
        if(ret.index==1) {
            $(".farmImports").removeClass("aui-hide");
            $(".order").addClass("aui-hide");
            $(".mine").addClass("aui-hide");
            sessionStorage.setItem("back",1);
        }
        if(ret.index==2) {
            $(".farmImports").addClass("aui-hide");
            $(".order").removeClass("aui-hide");
            $(".mine").addClass("aui-hide");
            sessionStorage.setItem("back",2);
        }
        if(ret.index==3) {
            $(".farmImports").addClass("aui-hide");
            $(".order").addClass("aui-hide");
            $(".mine").removeClass("aui-hide");
            sessionStorage.setItem("back",3);
        }
    });

    /*判断返回页面*/
    window.onload = function()
    {
        var back = sessionStorage.getItem("back");
        if(back == 2){
            $(".farmImports").addClass("aui-hide");
            $(".order").removeClass("aui-hide");
            $(".mine").addClass("aui-hide");

            $(".orderBack").addClass("aui-active").siblings().removeClass("aui-active");//底部导航图标颜色
        }else if(back == 3){
            $(".farmImports").addClass("aui-hide");
            $(".order").addClass("aui-hide");
            $(".mine").removeClass("aui-hide");

            $(".myBack").addClass("aui-active").siblings().removeClass("aui-active");//底部导航图标颜色
        }
    };

    /*订单tab切换*/
    var tab = new auiTab({
        element:document.getElementById("tab"),
        index:1,
        repeatClick:false
    },function(ret){
        var i = ret.index-1;
        $("#tab-content").children(".page").eq(i).show().siblings().hide();
    });

    /*九宫格导航*/
    $.ajax({
        type:"GET",
        url:YNZapi+'/category/0',
        dataType:"json",
        success:function (data) {
            if (data.code==0){
                var result = data.result;
                //console.table(result);
                for(var i in result){
                    var name = result[i]['catName'];
                    var id = result[i]['catId'];
                    var catSort = result[i]['catSort'];
                    var icon = result[i]['ico'];

                    var template = "<a href='List/List.html?id="+id+"&search="+0+"'><div class='aui-col-xs-3 aui-text-default aui-padded-t-10 aui-padded-b-5'><img src='img/"+catSort+".png' style='height: 2rem'><div class='aui-grid-label'>"+name+"</div></div></a>";
                    $(".content").append($(template))
                }

                var more = "<a href='List/List.html?id=0&search="+0+"'><div class='aui-col-xs-3 aui-text-default aui-padded-t-10 aui-padded-b-5'><img src='img/8.png' style='height: 2rem'><div class='aui-grid-label'>更多</div></div></a>";
                $(".content").append($(more));
            }
        }
    });

    /*轮播图*/
    $.ajax({
       type:'GET',
        url:YNZapi+'/ads',
        data:{
          'code':'ads-index',
            'num':'5'
        },
        dataType:'json',
        success:function (data) {
            if(data.code == 0){
                var result = data.result;
                //console.log(result);
                for(var i in result){
                    var id = result[i]['adId'];
                    var ad_img = YNZ+result[i]['adFile'];
                    var adURL = result[i]['adURL'];//图片跳转

                    var template = "<a href='"+adURL+"'><div class='aui-slide-node bg-dark' id='"+id+"'><img src='"+ad_img+"'/></div></a>";
                    $(".slideWarp").append(template);
                }

                /*轮播*/
                var slide = new auiSlide({
                    container:document.getElementById("aui-slide"),
                    // "width":300,
                    "height":200,
                    "speed":300,
                    "pageShow":true,
                    "autoPlay": 3000, //自动播放
                    "pageStyle":'dot',
                    "loop":true,
                    'dotPosition':'center'
                });
            }
        }
    });

    /*资讯*/
    $.ajax({
       type:'GET',
        url:YNZapi+'/Newscenter/news',
        dataType:'json',
        success:function (data) {
            if (data.code == 0){
                var result = data.result.Rows;
                //console.log(result);
                for(var i in result){
                    var id = result[i]['articleId'];
                    var title = result[i]['articleTitle'];
                    var image = YNZ+result[i]['articleImg'];
                    var page_view = result[i]['clickNum'];
                    var addtime = result[i]['createTime'];

                    var template = "<a href='article/article.html?id="+id+"'><li class='aui-list-item'><div class='aui-media-list-item-inner'><div class='aui-list-item-media'><img src='"+image+"'></div><div class='aui-list-item-inner'><div class='aui-list-item-text'><div class='aui-list-item-title titleDiv'>"+title+"</div></div><div class='aui-list-item-text aui-pull-right'>"+addtime+"</div></div></div></li></a>";
                    $(".noticeContent").append($(template));
                }
            }
        }
    });

    /*资讯滚动文字*/
    var str='';
    $.ajax({
        type:'GET',
        url:YNZapi +'/messages',
        dataType:'json',
        success:function (data) {
            if (data.code == 0){
                var result = data.result;
                console.log(result);
                for(var i in result){
                    str = "<li>"+result[i]['msgContent']+"</li>";
                    $(".zixunUL").append(str);
                    $(".zixunUL").find('br').remove();
                }


            }
        }
    });

    /*滚动文字*/
    var dd = $('.vticker').easyTicker({
        direction: 'up',
        easing: 'easeInOutBack',
        speed: 'slow',
        interval: 2000,
        height: '30',
        visible: 1,
        mousePause: 0,
        controls: {
            up: '.up',
            down: '.down',
            toggle: '.toggle',
            stopText: 'Stop !!!'
        }
    }).data('easyTicker');


    /*获取订单*/
    function getOrder(url,elmName) {
        if(!elmName) {
            throw('not elmName present')
        }

        $.ajax({
            type:'GET',
            url:YNZapi+url,
            dataType:'json',
            success:function (data) {
                if(data.code == 0){
                    var result = data.result;
                    //console.log(result);

                    for (var i in result ){
                        var orderId = result[i]['orderId']; //订单ID
                        var orderNo = result[i]['orderNo']; //订单编号
                        var createTime = result[i]['createTime']; //创建时间
                        var deliverType = result[i]['deliverType']; //配送方式
                        var goodsMoney = result[i]['goodsMoney']; //商品价格
                        var payTypeName = result[i]['payTypeName']; //支付方式
                        var shopName = result[i]['shopName']; //店铺名称
                        var status = result[i]['status']; //订单状态
                        var orderStatus = result[i]['orderStatus']; //订单状态
                        var realTotalMoney = result[i]['realTotalMoney']; //实际订单总额
                        var totalMoney = result[i]['totalMoney']; //订单总价
                        var list = result[i]['list']; //商品

                        var template =`<li class='aui-list-item aui-padded-l-0 aui-margin-b-15 li' id='${orderId}' orderNo='${orderNo}'>
                                            <div class='aui-list-item goods'>
                                                <div>
                                                    <div class='aui-margin-t-10 shopName'>${shopName}</div>
                                                    <div class='aui-pull-right aui-margin-r-10 aui-margin-t-5 aui-btn aui-btn-outlined aui-hide closeOrder'>删除订单</div>
                                                    <div class='aui-pull-right aui-margin-r-15 aui-margin-t-10 status'>${status}</div>
                                                </div>
                                            </div>
                                            <div class='aui-list-item middle'>
                                                <div class='aui-media-list-item-inner goodsList'></div>
                                            </div>
                                            <div class='aui-list-item'>
                                                <div class='aui-pull-left aui-margin-t-10 orderNum'>订购量 <span class='goodsNum'></span></div>
                                                <div class='aui-btn aui-pull-right aui-margin-t-5 aui-margin-r-5 aui-hide confirmBtn'>确认收货</div>
                                                <div class='aui-btn aui-pull-right aui-margin-t-5 aui-margin-r-10 aui-hide aui-btn-outlined cancelOrder'>取消订单</div>
                                                <div class='aui-btn aui-pull-right aui-margin-t-5 aui-margin-r-5 aui-hide toPayBtn'>去支付</div>
                                            </div>
                                        </li>`;
                        $(elmName).append(template);
                        /*跳转到订单详情*/
                        $(".middle:last").on('click',function () {
                            var jumpId = $(this).parent().attr('id');
                            window.location.href = 'orderDetail/orderDetail.html?orderId='+jumpId;
                        });

                        if(orderStatus == 1){$('.confirmBtn:last').removeClass("aui-hide")}//显示确认收货按钮
                        if(orderStatus == -2){$('.toPayBtn:last').removeClass("aui-hide")}//显示去支付按钮
                        if(orderStatus == -2){$('.closeOrder:last').removeClass("aui-hide")}//显示删除按钮
                        if(orderStatus == -2){$('.cancelOrder:last').removeClass("aui-hide")}//显示取消按钮
                        if(orderStatus == -2){$('.status:last').addClass("aui-hide")}//删除状态

                        for (var n in list){
                            var goodsImg = YNZ+list[n]['goodsImg']; //图片
                            var goodsName = list[n]['goodsName']; //名称
                            var goodsNum = list[n]['goodsNum']; //购买数量
                            var goodsPrice = list[n]['goodsPrice']; //价格

                            var listTemplate = "<div class='aui-list-item-media'><img src='"+goodsImg+"'></div><div class='aui-list-item-inner'><div class='aui-list-item-text'><div class='aui-list-item-title'>"+goodsName+"</div></div><div class='aui-list-item-text aui-margin-t-15'><div class='aui-list-item-title pay'>￥<span>"+goodsPrice+"</span></div></div></div>";
                            $(".goodsList:last").append(listTemplate);
                            $(".goodsNum:last").text(goodsNum);
                        }
                    }
                }
            }
        })
    }

    /*获取订单*/
    getOrder('/order', '.allOrder'); //全部订单
    getOrder('/order/waitDelivery', '.waitDelivery'); //待发货订单
    getOrder('/order/waitReceive', '.waitReceive'); //待收货订单
    getOrder('/order/waitAppraise', '.waitAppraise'); //已完成订单

    /*确认收货*/
    $(document).on('click', '.confirmBtn', function (){
        var that = $(this);
        var comfirmId = that.parent().parent().attr('id');
        //alert(comfirmId);
        var dialog = new auiDialog({});
        dialog.alert({
            title:"确认收货",
            msg:'',
            buttons:['取消','确定']
        },function(ret){
            console.log(ret);
            if(ret.buttonIndex == 1){}
            if(ret.buttonIndex == 2){
                $.ajax({
                    type:'POST',
                    url:YNZapi+'/order/receive',
                    data:{
                        'id':comfirmId
                    },
                    dataType:'json',
                    success:function (data) {
                        if(data.code == 0){
                            that.text('已确认');
                            that.parent().parent().find(".status").text("已收货");
                            var toast = new auiToast({
                            });
                            toast.success({
                                title:"已确认",
                                duration:1500
                            });

                            /*重刷待收货数据*/
                            $(".waitReceive").empty();
                            getOrder('/order/waitReceive', '.waitReceive'); //待收货订单
                        }
                    }
                });
            }
        });
    });

    /*去支付*/
    $(document).on('click', '.toPayBtn', function() {
        var orderNo = $(this).parent().parent().attr('orderNo');
        window.location.href = 'Order/payAgain.html?orderNo='+orderNo ;
    });

    /*取消订单*/
    $(document).on('click', '.cancelOrder', function () {
        var that =$(this);
        var orderId = that.parent().parent().attr('id');
        $.ajax({
            type:'POST',
            url:YNZapi+'/order/cancel',
            data:{
                'id':orderId
            },
            dataType:'json',
            success:function (data) {
                if (data.code == 0){
                    var toast = new auiToast({
                    });
                    toast.success({
                        title:"已取消",
                        duration:1500
                    });                    that.text('已取消');
                    that.next().addClass('aui-hide');//隐藏去支付按钮
                }
            }
        })
    });

    /*删除订单*/
    $(document).on('click', '.closeOrder', function () {
        var that = $(this);
        var orderId = that.parent().parent().parent().attr('id');
        //alert(orderId);
        $.ajax({
            type:'POST',
            url:YNZapi+'/order/delete',
            data:{
                'id':orderId
            },
            dataType:'json',
            success:function (data) {
                if (data.code == 0){
                    var toast = new auiToast({
                    });
                    toast.success({
                        title:"已删除",
                        duration:1500
                    });
                    that.parent().parent().parent().remove();
                }
            }
        })
    });

    /*取头像，名字*/
    /*var openid = commom.getCookie('openid');*/
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

    /*搜索条*/
    var apiready = function(){
        api.parseTapmode();
    };
    var searchBar = document.querySelector(".aui-searchbar-input");
    if(searchBar){
        searchBar.onclick = function(){
            document.querySelector(".aui-searchbar-cancel").style.marginRight = 0;
        }
    }
    document.querySelector(".aui-searchbar-cancel").onclick = function(){
        this.style.marginRight = "-"+this.offsetWidth+"px";
        document.getElementById("search-input").value = '';
        document.getElementById("search-input").blur();
    };

    /*搜索条跳转*/
    $("#search-input").keydown(function (e) {
        if (e.keyCode == 13) {
            var keyword = $('#search-input').val();
            window.location.href = 'List/List.html?keyword='+keyword+'&search='+1;
        }
    });

    /*名优特产跳转*/
    $(".specialty").on('click',function () {
        window.location.href = 'specialty/specialty.html';
    });

    /*新品上市跳转*/
    $(".newProduct").on('click',function () {
       window.location.href= 'List/List.html?search='+2;
    });

    /*收货地址跳转*/
    $(".personalProfile").on('click',function () {
        window.location.href = 'personalProfile/DeliveryAddress/DeliveryAddress.html';
    });

    /*关于跳转*/
    $(".about").on('click',function () {
        window.location.href = 'my/about/about.html';
    });

    /*常见问题跳转*/
    $(".FAQ").on('click',function () {
        window.location.href = 'my/FAQ/FAQ.html';
    });

    /*意见反馈跳转*/
    $(".feedback").on('click',function () {
        window.location.href = 'my/feedback/feedback.html';
    });

});



