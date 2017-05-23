/**
 * Created by a123 on 17/3/5.
 */
require("../common/aui.1.0/api.js");
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
    var orderId = GetQueryString("orderId");
    //alert(orderId);

    /*商品信息*/
    $.ajax({
        type:'GET',
        url:YNZapi+'/order/'+orderId,
        dataType:'json',
        success:function (data) {
            if(data.code == 0){
                var result = data.result;
                console.log(result);

                var deliverMoney = result['deliverMoney'];//配送费
                var userName = result['userName'];//收件人名称
                var userPhone = result['userPhone'];//收件人电话
                var goodsMoney = result['goodsMoney'];//商品价格(包括数量)
                var expressName = result['expressName'];// 快递公司名字
                var expressNo = result['expressNo'];// 快递物流号
                var realTotalMoney = result['realTotalMoney'];//订单总价格(商品加运费)

                $(".goodsMoney").text("￥"+goodsMoney);
                $(".deliverMoney").text("￥"+deliverMoney);
                $(".realTotalMoney").text("￥"+realTotalMoney);
                $(".userName").text(userName);
                $(".userPhone").text(userPhone);
                $(".expressName").text(expressName+":"+expressNo);
                if(!expressNo){
                    $(".wuliDiv").remove()
                }

                for (var i in result['goods']) {
                    var goodsImg = YNZ + result['goods'][i]['goodsImg'];
                    var goodsName = result['goods'][i]['goodsName'];
                    var goodsPrice = result['goods'][i]['goodsPrice']; //价格
                    var goodsNum = result['goods'][i]['goodsNum']; //购买数量

                    $(".img").attr('src', goodsImg);
                    $(".goodsName").text(goodsName);
                    $(".goodsPrice").text("￥" + goodsPrice);
                    $(".goodsNum").text('x' + goodsNum);
                }
            }
        }
    });

    /*物流信息*/
    $.ajax({
       type:'GET',
        url:YNZapi+'/express',
        data:{
           'id':orderId,
        },
        dataType:'json',
        success:function (data) {
            if(data.code == 0){
                var result = data.result;
                //console.log(result);

                var Success = result['Success']; //状态
                var Reason = result['Reason']; //<traces为空时 或者 Success为false,返回的信息>
                var LogisticCode = result['LogisticCode']; //物流号
                var State = result['State']; //状态
                var Traces = result['Traces']; //信息

                if(result.length == 0) //没有物流信息
                {
                    $('.none').removeClass('aui-hide'); //显示"没有物流信息"
                }
                else if(Success == true) //有物流信息
                {
                    var year = Traces[0]['AcceptTime']; //年
                    year = year.substr(0,4); //获取年
                    var ex = "<li class='aui-time-label'><span class='aui-bg-info year'>"+year+"</span></li>"; //头部 年
                    $(".content").append(ex); //加入头部

                    for(var i in Traces){
                        var AcceptTime = Traces[i]['AcceptTime']; //时间 2017-02-12 21:33:52
                        var AcceptStation = Traces[i]['AcceptStation']; //位置

                        var date = AcceptTime.substr(5,5); //获取日期
                        var time = AcceptTime.substr(11,5); //获取时间

                        if(State == 2){
                            var info = "派送中";
                        }else if(State == 3){
                            var info = "已签收";
                        }

                        var template = "<li><div class='aui-time-label aui-bg-info'>"+date+"</div><div class='aui-timeline-item'><span class='aui-timeline-time'><i class='aui-iconfont aui-icon-time'></i>"+time+"</span><h3 class='aui-timeline-header'>"+info+"</h3><div class='aui-timeline-body'>"+AcceptStation+"</div></div></li>";
                        $(".content").append(template);
                    }
                }

            }
        }
    });

});