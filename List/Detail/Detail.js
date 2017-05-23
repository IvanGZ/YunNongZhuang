/**
 * Created by a123 on 17/1/18.
 */
require("../../common/api.js");
require("../../common/aui-slide.js");/*轮播*/
require("../../common/aui-tab.js");
require("../../common/aui-popup");/*弹框*/
require("../../common/aui-dialog");/*dialog*/
const commom = require("../../common/common.js");

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
    var id = GetQueryString("id");
    //alert(id);

    /*弹出菜菜单*/
    var popup = new auiPopup();
    function showPopup(){
        popup.show(document.getElementById("top"));
    }

    /*tab菜单*/
    var tab = new auiTab({
        element:document.getElementById("tab"),
        index:1,
        repeatClick:false
    },function(ret){
        if(ret.index==1) {
            $(".detail").removeClass("aui-hide");
            $(".parameter").addClass("aui-hide");
        }
        if(ret.index==2) {
            $(".detail").addClass("aui-hide");
            $(".parameter").removeClass("aui-hide");
        }
    });

    /*底部订购跳转*/
    $("#footer").on('click',function () {
        window.location.href='../../Order/Order.html?id='+id;
    });

    /*获取截图*/
    $(".screenshot").on('click',function () {
        $.ajax({
            type: "POST",
            contentType: "application/json;utf-8",
            url: "http://120.77.182.79/LCService/LCService.asmx/GetDeviceSnap",
            data: "{parm : 'appId=lc1b9757f83d3b4b9d&appSecret=c8c20d647e6d4400865598f37dfebf&phone=18588864504&deviceId=2M03982PAD01662&channelId=0'}",
            dataType: 'json',
            success: function (result) {
                const src = result.d;
                // var img = "<img src='"+result.d+"' class='screenImg'>";


                const getImage = function() {
                    const img = $("<img />")
                        .attr('src', src)
                        .addClass('screenImg')
                        .on('error', function(){
                            img.remove();
                            setTimeout(function(){
                                getImage()
                            }, 300);
                        })
                        .on('load', function(){
                            //$(".goods_name").append(img);

                            const canvas = document.getElementById('canvas');
                            const ctx = canvas.getContext('2d');
                            console.log('Painting image...');
                            ctx.drawImage(img[0], 0, 0);
                            console.log('Attempting to get image data');
                            try {
                                const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                                console.log('Success!', data);
                            } catch (e) {
                                console.log(e);
                            }

                            // $.ajax(src).done(function (data) {
                            //     console.log(data)
                            // })
                        })

                };
                getImage();

                const dialog = new auiDialog({});
                window.openDialog = function(){
                    $("#video1").css('display','none');
                    if(result.d ==''){
                        var content = "加载中...";
                    }else {
                        var content = "<img src='"+result.d+"' class='screenImg'>";
                    }
                    dialog.alert({
                        title:"当前截图",
                        msg:content,
                        buttons:['取消','长按图片保存']
                    },function(ret){
                        $("#video1").css('display','block');
                        console.log(ret)
                    });
                };
            }
        });
    });




    /*获取商品信息*/
    $.ajax({
       type:'GET',
        url:YNZapi+'/goods/'+id,
        dataType:'json',
        success:function (data) {
            if(data.code == 0){
                var result = data.result;
                console.log(result);
                var goodsId = result['goodsId']; //商品ID
                var goods_name = result['goodsName']; //商品名称
                var seller_id = result['shopId']; //店铺ID
                var img_url = result['gallery']; //图片
                var shop_price = result['shopPrice']; //商品价格
                var sales_sum = result['saleNum']; //销量
                var store_count = result['goodsStock']; //库存
                var goodsUnit = result['goodsUnit']; //单位
                var score = result['score']; //评分
                var cmt_count = result['cmt_count']; //评价数量
                var goodsDesc = result['goodsDesc']; //商品详情
                var shopName = result['shop']['shopName']; //店铺名
                var shopTel = result['shop']['shopTel']; //店铺电话
                var shopImg = YNZ+result['shop']['shopImg']; //店铺图片
                var shopAddress = result['shop']['shopAddress']; //店铺地址
                var shopGoodsTotal = result['shopGoodsTotal']; //店铺商品量

                var cacheVideo = YNZ+result['cacheVideo']; //延时视频缓存
                var video = result['video']; //直播视频链接
                var videoImg = YNZ+result['videoImg']; //视频图片


                $(".goods_name").text(goods_name);
                $(".goodsUnit").text(goodsUnit);
                $(".store_count").text("库存"+store_count+goodsUnit);
                $(".payment").text("￥"+shop_price);
                $(".sales_sum").text(sales_sum);
                $(".shopName").text(shopName);
                /*弹窗*/
                $(".logo").attr('src',shopImg);
                $(".shopNamePopup").text(shopName);
                $(".shopAddress").text("地址："+shopAddress);
                $(".shopGoodsTotal").text("商品量："+shopGoodsTotal);


                if(video){
                    $("#video1").attr('src',video); //直播视频链接
                    $("#video1").attr('poster',videoImg); //视频图片
                }else {
                    $(".video1UL").remove();
                    $("#video1").remove();
                }

                if(result['cacheVideo'] == null){
                    $(".video2UL").remove();
                    $("#video2").remove();
                }else {
                    $("#video2").attr('src',cacheVideo);//延时视频连接
                }



                /*轮播图*/
                for(var i in img_url){
                    var template = "<div class='aui-slide-node bg-dark'><img src='"+YNZ+img_url[i]+"'/></div>";
                    $(".slideWarp").append(template);
                }

                /*轮播*/
                var slide = new auiSlide({
                    container:document.getElementById("aui-slide"),
                    // "width":300,
                    "height":250,
                    "speed":300,
                    "pageShow":true,
                    "autoPlay": 3000, //自动播放
                    "pageStyle":'dot',
                    "loop":true,
                    'dotPosition':'center'
                });

                /*详情*/
                $(".detail").append(goodsDesc);

                /*规格，属性*/
                var attrs = result['attrs'];
                if(attrs.length == 0){$(".attrs").remove()}//如果没有属性，就删除属性按钮
                for(var i in attrs){
                    var attrName = attrs[i]['attrName']; //属性名
                    var attrVal = attrs[i]['attrVal']; //属性
                    var exp = "<li class='aui-list-item'><div class='aui-list-item-inner'><div class='aui-list-item-label'>"+attrName+" :</div><div class='aui-list-item-input'>"+attrVal+"</div></div></li>";
                    $(".attrsContent").append(exp);
                }
                console.log(attrs);

                /*店铺电话*/
                var shopTelDiv = "<a href='tel:"+shopTel+"' class='tel'></a>";
                $(".phoneIconContent").append(shopTelDiv);
            }
        }
    });

   /* /!*解决视频安卓端透明问题*!/
    var video1 = $("#video1");
    window.myFunction=function() {
        video1.css('visibility','hidden');
    }*/

});