/**
 * Created by a123 on 17/2/27.
 */
require("../common/api.js");
const commom = require("../common/common.js");

const YNZapi = commom.YNZapi;
const YNZ = commom.YNZ;

$(document).ready(function () {
   $.ajax({
       type:'GET',
       url:YNZapi+'/Famou',
       data:{
           'pagesize':10,
           'page':1
       },
       dataType:'json',
       success:function (data) {
            if(data.code == 0){
                let result = data.result;
                console.log(result);

                for (let i in result){
                    let famouId = result[i]['famouId'];
                    let famouTitle = result[i]['famouTitle'];
                    let famouImg = YNZ+result[i]['famouImg'];
                    let famouDosc = result[i]['famouDosc'];
                    
                    let template = "<a href='specialtyDetail/specialtyDetail.html?id="+famouId+"'><div class='aui-card-list'><div class='aui-card-list-content'><img src='"+famouImg+"' /></div><div class='aui-card-list-header'><div><div>"+famouTitle+"</div><div class='famouDosc'></div></div></div></div></a>";
                    $(".content").append(template);
                    $(".famouDosc:last").html(famouDosc);
                }
            }
        }
   })
});