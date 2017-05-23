/**
 * Created by a123 on 17/2/13.
 */
require("../../../common/api.js");
const commom = require("../../../common/common.js");

const YNZapi = commom.YNZapi;
const YNZ = commom.YNZ;
var openid = commom.getCookie('openid');
$(document).ready(function () {
    /*地址联动*/
    $.ajax({
        headers:{'session': openid},
        type:'GET',
        url:YNZapi+"/Areas/0",
        dataType:'json',
        success:function (data) {
            if(data.code == 0){
                var result =data.result;
                console.log(result);
                for(var i in result){
                    var areaId = result[i]['areaId']; //ID
                    var areaName = result[i]['areaName']; //地区名
                    var parentId = result[i]['parentId']; //父级ID

                    var template = `<option value="${areaId}">- ${areaName} -</option>`;
                    $(".province").append(template);
                }
            }
        }
    });
    /*省份改变*/
    $(".province").change(function () {
        var areaId =$(".province").val();
        changeCity(areaId);
    });


    /*改变城市*/
    function changeCity(areaId) {
        $(".city").empty();
        $.ajax({
            headers:{'session': openid},
            type:'GET',
            url:YNZapi+"/Areas/"+areaId,
            dataType:'json',
            success:function (data) {
                if(data.code == 0){
                    var result =data.result;
                    console.log(result);
                    for(var i in result){
                        var areaId = result[i]['areaId']; //ID
                        var areaName = result[i]['areaName']; //地区名
                        var parentId = result[i]['parentId']; //父级ID

                        var template = `<option value="${areaId}">- ${areaName} -</option>`;
                        $(".city").append(template);
                        changeDistrict(areaId);
                    }
                }
            }
        });
    }

    /*城市改变*/
    $(".city").change(function () {
        var areaId =$(".city").val();
        changeDistrict(areaId);
    });

    /*改变地区*/
    function changeDistrict(areaId) {
        $(".district").empty();
        $.ajax({
            headers:{'session': openid},
            type:'GET',
            url:YNZapi+"/Areas/"+areaId,
            dataType:'json',
            success:function (data) {
                if(data.code == 0){
                    var result =data.result;
                    console.log(result);
                    for(var i in result){
                        var areaId = result[i]['areaId']; //ID
                        var areaName = result[i]['areaName']; //地区名
                        var parentId = result[i]['parentId']; //父级ID

                        var template = `<option value="${areaId}">- ${areaName} -</option>`;
                        $(".district").append(template);
                    }
                }
            }
        });
    }

    /*点击确认添加按钮*/
    $("#footer").on('click',function (e) {
        e.preventDefault();
        var name = $(".name").val();/*名字*/
        var phone = $(".phone").val();/*电话号码*/
        var address = $(".address").val();/*地址*/
        var areaId = $(".district").val();/*地区编码*/
        if ($(".defaultBtn").is(":checked")){   /*默认按钮*/
            var defaultBtn = 1 ;
        }else {var defaultBtn = 0;}

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

        /*添加地址*/
        var data={};
        data['userName'] = name ;
        data['userPhone'] = phone ;
        data['userAddress'] = address ;
        data['isDefault'] = defaultBtn ;
        data['areaId'] = areaId;

        $.ajax({
            headers:{'session': openid},
            type:'POST',
            url:YNZapi+'/address',
            dataType:'json',
            data:data,
            success:function (data) {
                if (data.code == 0){
                    alert("添加成功");
                    history.back();
                }
            }
        })
    })
});