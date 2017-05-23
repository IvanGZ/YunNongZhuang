/**
 * Created by a123 on 17/2/27.
 */
require("../../common/api.js");
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

    /*获取名优特产*/
    $.ajax({
       type:'GET',
        url:YNZapi+'/Famou/'+id,
        dataType:'json',
        success:function (data) {
            if (data.code == 0){
                let result = data.result;
                //console.log(result);
                /*头部图片*/
                let famou = result.famou;

                let famouId = famou['famouId'];
                let famouTitle = famou['famouTitle'];
                let famouImg = YNZ+famou['famouImg'];
                let famouDosc = famou['famouDosc'];

                $(".titleImg").attr('src',famouImg); //头部图片

                /*商品列表*/
                let list = result.list;
                for(let i in list){
                    let goodsId = list[i]['goodsId'];  //商品ID
                    let goodsName = list[i]['goodsName'];  //商品名
                    let goodsSn = list[i]['goodsSn']; //商品货号
                    let goodsStock = list[i]['goodsStock']; //商品存货
                    let goodsUnit = list[i]['goodsUnit']; //单位
                    let saleNum = list[i]['saleNum']; //销量
                    let shopPrice = list[i]['shopPrice']; //商品价格
                    let marketPrice = list[i]['marketPrice']; //原价
                    let isSpec = list[i]['isSpec']; //是否规格
                    let goodsImg = YNZ+list[i]['goodsImg']; //商品图片
                    let appraiseNum = list[i]['appraiseNum']; //评价数
                    let visitNum = list[i]['visitNum']; //访问数
                    let shopId = list[i]['shopId']; //店铺id
                    let shopName = list[i]['shopName']; //店铺名
                    let shopAddress = list[i]['shopAddress']; //店铺地址

                    let template = "<a href='../../List/Detail/Detail.html?id="+goodsId+"'><li class='aui-list-item'><div class='aui-media-list-item-inner'><div class='aui-list-item-media'><img src="+goodsImg+" class='img'></div><div class='aui-list-item-inner'><div class='aui-list-item-text'><div class='aui-list-item-title'>"+goodsName+"</div></div><div class='aui-list-item-text'><p class='payment'>"+shopPrice+"</p><span class='off'>线上成交"+saleNum+"单</span></div><div class='aui-list-item-text'><span>"+shopAddress+"</span><span>"+shopName+"</span></div></div></div></li></a>";
                    $(".content").append(template)
                }

            }
        }
    });
});

