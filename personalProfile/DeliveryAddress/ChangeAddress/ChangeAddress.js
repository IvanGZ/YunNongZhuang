/**
 * Created by a123 on 17/3/17.
 */
require("../../../common/api.js");
const commom = require("../../../common/common.js");

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
    var id = GetQueryString("id"); //订单ID
    //alert(id);

    /*获取地址信息*/
    $.ajax({
        type:'GET',
        url:YNZapi+'/address/'+id,
        dataType:'json',
        success:function (data) {
            if(data.code==0){
                var result = data.result;
                //console.log(result);
                var userName = result['userName']; //收件人姓名
                var userPhone = result['userPhone']; //电话
                var userAddress = result['userAddress']; //详细地址

                $(".name").attr('value',userName);
                $(".phone").attr('value',userPhone);
                $(".address").text(userAddress);
            }
        }
    });

    /*点击确认修改按钮*/
    $("#footer").on('click',function (e) {
        e.preventDefault();

        var name = $(".name").val();/*名字*/
        var phone = $(".phone").val();/*电话号码*/
        var address = $(".address").val();/*地址*/

        /*判断手机号码是否正确*/
        if(!(/^[1][3-8]+\d{9}$/.test(phone))){
            alert("请填写正确的手机号码");
            $("#phone").focus();
            return false;
        }
        if(!name){
            alert("请填写姓名");
            return false;
        }
        if(!address){
            alert("请填写详细地址");
            return false;
        }

        /*修改地址*/
        var data={};
        data['userName'] = name ;
        data['userPhone'] = phone ;
        data['userAddress'] = address ;

        $.ajax({
            type:'PUT',
            url:YNZapi+'/address/'+id,
            dataType:'json',
            data:data,
            success:function (data) {
                if (data.code == 0){
                    alert("修改成功");
                    history.back(-1);
                }
            }
        })
    });

});

