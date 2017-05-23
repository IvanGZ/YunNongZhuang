/**
 * Created by a123 on 17/2/13.
 */
require("../../common/api.js");
const commom = require("../../common/common.js");

const YNZapi = commom.YNZapi;
const YNZ = commom.YNZ;

$(document).ready(function () {
    /*跳转*/
    $("#footer").on('click',function () {
        window.location.href = 'NewAddress/NewAddress.html'
    });

    /*获取地址*/
    var openid = commom.getCookie('openid');
    $.ajax({
        headers:{'session': openid},
        type:'GET',
        url:YNZapi+'/address',
        dataType:'json',
        success:function (data) {
            if (data.code == 0){
                //console.log(data.result);
                var result = data.result;
                for(var i in result){
                    var id = result[i]['addressId']; //id
                    var receiver = result[i]['userName']; //收货人
                    var phone = result[i]['userPhone'];  //联系号码
                    var address = result[i]['userAddress'];  //地址
                    var defaultBtn = result[i]['isDefault'];  //默认

                    var template = "<div class='aui-card-list aui-margin-b-15' id='"+id+"'><div class='aui-card-list-header'><span class='aui-margin-l-15'>收货人：<span>"+receiver+"</span></span><span class='userPhone aui-margin-r-15'>"+phone+"</span></div><div class='aui-card-list-content-padded aui-padded-t-0 aui-padded-b-0 aui-font-size-16'><i class='aui-iconfont aui-icon-location aui-text-warning addressIcon'></i>地址：<span class='address'>"+address+"</span></div><li class='aui-list-item li'><div class='aui-list-item-inner'><label><input class='aui-radio' type='radio' name='radio' > 默认地址</label><i class='aui-iconfont aui-icon-trash aui-font-size-20 aui-pull-right del'><span class='delSpan'>删除</span></i> <i class='aui-iconfont aui-icon-pencil aui-font-size-20 aui-pull-right change'><span class='changeSpan'>修改</span></i></div></li></div>";
                    /*var template = `<div class='aui-card-list aui-margin-b-15' id='"+id+"'>
                                        <div class='aui-card-list-header'>
                                            <span class="aui-margin-l-15">收货人：<span>${receiver}</span></span>
                                            <span class="userPhone aui-margin-r-15">${phone}</span>
                                        </div>
                                        <div class='aui-card-list-content-padded aui-padded-t-0 aui-padded-b-0 aui-font-size-16'>
                                            <i class="aui-iconfont aui-icon-location aui-text-warning aui-margin-l-15 addressIcon"></i>地址：<span class='address'>${address}</span>
                                        </div>
                                        <li class='aui-list-item li'>
                                            <div class='aui-list-item-inner'>
                                                <label><input class='aui-radio' type='radio' name='radio' > 默认地址</label>
                                                <i class='aui-iconfont aui-icon-trash aui-font-size-20 aui-pull-right del'>
                                                    <span class='delSpan'>删除</span>
                                                </i> 
                                                <i class='aui-iconfont aui-icon-pencil aui-font-size-20 aui-pull-right change'>
                                                    <span class='changeSpan'>修改</span>
                                                </i>
                                            </div>
                                        </li>
                                    </div>`;*/

                    $(".content").append(template);
                    if (defaultBtn == 1){
                        $("div[id="+id+"]").find("input").attr("checked","checked");
                    }
                }

                /*删除按钮*/
                $(".del").on('click',function () {
                    var id = $(this).parent().parent().parent().attr('id');
                    var obj = $(this);
                    $.ajax({
                        headers:{'session': openid},
                        type:'DELETE',
                        url:YNZapi+'/address/'+id,
                        dataType:'json',
                        success:function (data) {
                            if (data.code == 0){
                                obj.parent().parent().parent().remove()
                            }
                        }
                    });
                });

                /*修改按钮*/
                $(".change").on('click',function () {
                    var id = $(this).parent().parent().parent().attr('id');
                    window.location.href = 'ChangeAddress/ChangeAddress.html?id='+id;
                });

                /*修改默认*/
                $("input[type=radio]").change(function () {
                    //console.log(this);
                    var id = $(this).parent().parent().parent().parent().attr('id');
                    $.ajax({
                        headers:{'session': openid},
                        type:'PUT',
                        url:YNZapi+'/address/'+id+'/setDefault',
                        dataType:'json',
                        success:function (data) {
                            if(data.code == 0){

                            }
                        }
                    })
                });
            }
        }
    });



});