/**
 * Created by a123 on 17/1/18.
 */
require("../common/api.js");
const commom = require("../common/common.js");

const YNZapi = commom.YNZapi;
const YNZ = commom.YNZ;

$(document).ready(function () {
    /*搜索条*/
    /*apiready = function(){
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

    $("#search-input").keydown(function (e) {
        if (e.keyCode == 13) {
        }
    });*/

    /*处理前一个页面带的参数*/
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  decodeURI(r[2]); return null;
    }
    var id = GetQueryString("id");
    var keyword = GetQueryString("keyword");
    var search = GetQueryString("search"); /*0是分类进入，1是搜索,2是新品上市*/
    //alert(search);

    /*wx获取当前位置*/
    /* 根据坐标获取地址 逆地理编码 */
    var adcode ='';
    function getAddress(longitude,latitude) {
        var url = "http://restapi.amap.com/v3/geocode/regeo?key=6019f4ef8062fd442c7badd15c322352&s=rsv3&location="+longitude+","+latitude+"&radius=1";
        $.get(url,function(data) {
            if (data.status == 1) {
                var regeocode = data.regeocode;
                var addressComponent = regeocode.addressComponent;
                 adcode = addressComponent.adcode;
                //这里将adcode作为地区条件
                //alert(adcode);
            }
        })
    }
    var url = YNZapi+'/location/config';
    $.get(url,{'url':location.href.split('#')[0]},function(data) {
        if (data.code != 0) {
            console.log(data);
            //获取所以地区的商品
            alert('接口参数获取失败!');
            return;
        }
        var result = data.result;
        var appId  = result.appId;
        var timestamp = result.timestamp;
        var nonceStr  = result.nonceStr;
        var signature = result.signature;
        //初始化
        wx.config({
            debug: false,
            appId: appId, // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳，切记时间戳是整数型，别加引号
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名，见附录1
            jsApiList: [
                'checkJsApi',
                'openLocation',
                'getLocation',
            ]
        });
    });

    wx.ready(function () {
        //获取当前地理位置
        wx.getLocation({
            success: function (res) {
                var longitude = res.longitude;
                var latitude = res.latitude;
                getAddress(longitude,latitude);
            },
            cancel: function (res) {
                alert('用户拒绝授权获取地理位置');
            }
        });
    });
    /*分类进入*/
    if(search == 0){
        /*获取分类下农产品品种*/
        $.ajax({
            type:'GET',
            url:YNZapi+'/category/'+id,
            dataType:'json',
            success:function (data) {
                var result = data.result;
                for(var i in result){
                    var catId = result[i]['catId'];
                    var catName = result[i]['catName'];

                    var template = "<option id='"+catId+"'>"+catName+"</option>";
                    $(".breed").append(template);
                }
            }
        });

        /*获取地区*/
        $.ajax({
            type:'GET',
            url:YNZapi+'/Areas',
            dataType:'json',
            success:function (data) {
                if(data.code == 0){
                    var result = data.result;
                    //console.log(result)

                    for(var i in result){
                        var areaName = result[i]['areaName']; //地区名
                        var areaId = result[i]['areaId']; //地区编码
                        var template = "<option id='"+areaId+"'>"+areaName+"</option>";
                        $(".area").append(template);
                    }
                }
            }
        });
        /*获取成熟度*/
        $.ajax({
            type:'GET',
            url:YNZapi+'/category/'+id+'/maturity',
            dataType:'json',
            success:function (data) {
                var result = data.result;
                //console.table(result);
                for(var i in result){
                    var maturityId = result[i]['maturityId'];
                    var maturityName = result[i]['maturityName'];

                    var template = "<option id='"+maturityId+"'>"+maturityName+"</option>";
                    $(".maturity").append(template);
                }
            }
        });

        /*获取类别下商品列表*/
        $.ajax({
            type:'GET',
            url:YNZapi+'/category/'+id+'/goods',
            data:{
                'sortby':'score',
                'order':'asc',
                'areaId':adcode,
                //'page':'1',
                //'pagesize':'10',
            },
            dataType:'json',
            success:function (data) {
                if(data.code == 0){
                    var result = data.result;
                    //console.table(result);
                    for(var i in result){
                        var id = result[i]['goodsId'];  //商品id
                        var goods_name = result[i]['goodsName']; //商品名
                        var label = result[i]['label'];  //标签名
                        var img_url = YNZ+result[i]['goodsImg']; //图片url
                        var shop_price = result[i]['shopPrice']; //商品价格
                        var sales_sum = result[i]['saleNum'];  //线上成交量
                        var seller_name = result[i]['shopName'];  //商户名称
                        var address = result[i]['shopAddress'];  //商户地址


                        var template = "<a href='Detail/Detail.html?id="+id+"'><li class='aui-list-item'><div class='aui-media-list-item-inner'><div class='aui-list-item-media'><img src='"+img_url+"' class='img'></div><div class='aui-list-item-inner'><div class='aui-list-item-text'><div class='aui-list-item-title'>"+goods_name+"</div></div><div class='aui-list-item-text'><p class='payment'>"+shop_price+"</p><span class='off'>线上成交"+sales_sum+"单</span></div><div class='aui-list-item-text'><span>"+address+"</span><span>"+seller_name+"</span></div></div></div></li></a>";
                        $(".content").append(template);
                    }
                }
            }
        });

        /*筛选*/
        $(".select").change(function () {
            $(".content").empty(); //清空列表
            var data ={};
            data['isNew']=0;
            data['order']=0; //顺序
            if(typeof($(".area").find("option:selected").attr('value'))=="undefined"){
                data['areaId']= $(".area").find("option:selected").attr('id'); //地区ID
            }
            if(typeof($(".maturity").find("option:selected").attr('value'))=="undefined"){
                data['maturityId']=$(".maturity").find("option:selected").attr('id'); //成熟度ID
            }
            if(typeof($(".month").find("option:selected").attr('value'))=="undefined"){
                data['month']=$(".month").find("option:selected").attr('id'); //月份
            }
            if(typeof($(".breed").find("option:selected").attr('value'))=="undefined"){
                var breed = $(".breed").find("option:selected").attr('id'); //品类ID
            }else{
                var breed = id;
            }

            var a = $(".order").find("option:selected").attr('id'); //排序类型，价格or评价
            if ( a == "assess") {data['orderBy']=2}
            if ( a == 'money') {data['orderBy']=1}

            $.ajax({
                type:'GET',
                url:YNZapi+'/category/'+breed+'/goods',
                data:data,
                dataType:'json',
                success:function (data) {
                    if(data.code == 0){
                        var result = data.result;
                        console.log(result);

                        for(var i in result){
                            var id = result[i]['goodsId'];  //商品id
                            var goods_name = result[i]['goodsName']; //商品名
                            var label = result[i]['label'];  //标签名
                            var img_url = YNZ+result[i]['goodsImg']; //图片url
                            var shop_price = result[i]['shopPrice']; //商品价格
                            var sales_sum = result[i]['saleNum'];  //线上成交量
                            var seller_name = result[i]['shopName'];  //商户名称
                            var address = result[i]['shopAddress'];  //商户地址


                            var template = "<a href='Detail/Detail.html?id="+id+"'><li class='aui-list-item'><div class='aui-media-list-item-inner'><div class='aui-list-item-media'><img src='"+img_url+"' class='img'></div><div class='aui-list-item-inner'><div class='aui-list-item-text'><div class='aui-list-item-title'>"+goods_name+"</div></div><div class='aui-list-item-text'><p class='payment'>"+shop_price+"</p><span class='off'>线上成交"+sales_sum+"单</span></div><div class='aui-list-item-text'><span>"+address+"</span><span>"+seller_name+"</span></div></div></div></li></a>";
                            $(".content").append(template);
                        }
                    }
                }
            })
        });
    }

    /*搜索进入*/
    else if(search == 1){
        $(".sort").remove(); //删除条件搜索

        $.ajax({
           type:'GET',
            url:YNZapi+'/search',
            dataType:'json',
            data:{
               'keyword':keyword,
            },
            success:function (data) {
                if(data.code == 0){
                    var result = data.result;
                    //console.log(result);
                    if (result.length != 0){
                        for(var i in result){
                            var id = result[i]['goodsId'];  //商品id
                            var goods_name = result[i]['goodsName']; //商品名
                            var label = result[i]['label'];  //标签名
                            var img_url = YNZ+result[i]['goodsImg']; //图片url
                            var shop_price = result[i]['shopPrice']; //商品价格
                            var sales_sum = result[i]['saleNum'];  //线上成交量
                            var distance = result[i]['distance'];  //距离
                            var seller_name = result[i]['shopName'];  //商户名称
                            var address = result[i]['shopAddress'];  //商户地址

                            var template = "<a href='Detail/Detail.html?id="+id+"'><li class='aui-list-item'><div class='aui-media-list-item-inner'><div class='aui-list-item-media'><img src='"+img_url+"' class='img'></div><div class='aui-list-item-inner'><div class='aui-list-item-text'><div class='aui-list-item-title'>"+goods_name+"</div></div><div class='aui-list-item-text'><p class='payment'>"+shop_price+"</p><span class='off'>线上成交"+sales_sum+"单</span></div><div class='aui-list-item-text'><span>"+address+"</span><span>"+seller_name+"</span></div></div></div></li></a>";
                            $(".content").append(template);
                        }
                    }else if(result.length == 0){
                        $(".notFound").removeClass("aui-hide");
                    }
                }
            }
        });
    }

    /*新品上市*/
    else if(search = 2){
        $(".sort").remove(); //删除条件搜索

        $.ajax({
           type:'GET',
            url:YNZapi+'/category/'+0+'/goods',
            dataType:'json',
            data:{
               'isNew':1
            },
            success:function (data) {
                if(data.code == 0){
                    var result = data.result;
                    //console.log(result);

                    for (var i in result){
                        var goodsId = result[i]['goodsId']; //商品ID
                        var goodsName = result[i]['goodsName']; //商品名
                        var goodsImg = YNZ +result[i]['goodsImg']; //图片
                        var goodsStock = result[i]['goodsStock']; //库存
                        var shopPrice = result[i]['shopPrice'];//价格
                        var saleNum = result[i]['saleNum']; //成交量
                        var appraiseNum = result[i]['appraiseNum']; //评价数
                        var shopName = result[i]['shopName']; //商户名称
                        var shopAddress = result[i]['shopAddress'];  //商户地址

                        var template = "<a href='Detail/Detail.html?id="+goodsId+"'><li class='aui-list-item'><div class='aui-media-list-item-inner'><div class='aui-list-item-media'><img src='"+goodsImg+"' class='img'></div><div class='aui-list-item-inner'><div class='aui-list-item-text'><div class='aui-list-item-title'>"+goodsName+"</div></div><div class='aui-list-item-text'><p class='payment'>"+shopPrice+"</p><span class='off'>线上成交"+saleNum+"单</span></div><div class='aui-list-item-text'><span>"+shopAddress+"</span><span>"+shopName+"</span></div></div></div></li></a>";
                        $(".content").append(template);
                    }
                }
            }
        });
    }
});