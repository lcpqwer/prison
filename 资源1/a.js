$(function(){
  	

    $('#btn>div,#btns>div,#nbtn>div,.nav_right_cont .nav_right .nav_cont>div').click(function () {
        if ($(this).hasClass('nav_show')) {
            $(this).removeClass('nav_show').addClass('nav_hide').siblings().removeClass('nav_hide').addClass('nav_show')
        }
    })
})
function clickTab(obj) {
    $(obj).addClass("choosed").siblings().removeClass('choosed');
    $(obj).siblings(".smaller").removeClass("choosed");
    $(".nav_right_cont .nav_right").hide();
    $(".nav_right_cont .nav_right").eq($(obj).index()).show();
    if ($(obj).hasClass('choosed')) {
        console.log($(".nav_right_cont .nav_right").eq($(obj).index()).siblings().find('.nav_cont').children().eq(1)) 
        var list = $(".nav_right_cont .nav_right").eq($(obj).index()).siblings().find('.nav_cont') 
        $(list).each(function(i, n) {
            $(obj).eq(0).children().eq(0).addClass('nav_show').removeClass('nav_hide') 
            $(obj).eq(0).children().eq(1).addClass('nav_hide').removeClass('nav_show')
        })
    }
}