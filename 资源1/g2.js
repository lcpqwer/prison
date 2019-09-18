$(function () {
    $('.title_c').click(function () {
        $('.title_d').removeClass('active')
        $(this).addClass('active')
        $('#main_c').css('display', 'block')
        $('#main_d').css('display', 'none')
    })
    $('.title_d').click(function () {
        $('.title_c').removeClass('active')
        $(this).addClass('active')
        $('#main_d').css('display', 'block')
        $('#main_c').css('display', 'none')
    })


})
$(function () {
        var h3 = $(".tre_box").find("h3");
        var tre_one = $(".tre_box").find(".tre_one");
        var h4 = $(".tre_one").find("h4");
        var tre_two = $(".tre_one").find(".tre_two");
        var h5 = $('.tre_two').find('h5')
        var tre_three = $('.tre_two').find('.tre_three')
        h3.each(function (i) {
            $(this).click(function () {
                tre_one.eq(i).slideToggle();
                tre_one.eq(i).parent().siblings().find(".tre_one").slideUp();
            })
        })
        h4.each(function (i) {
            $(this).click(function () {
                tre_two.eq(i).slideToggle();
                tre_two.eq(i).parent().siblings().find(".tre_two").slideUp();
            })
        })
        h5.each(function (i) {
            $(this).click(function () {
                tre_three.eq(i).slideToggle();
                tre_three.eq(i).parent().siblings().find(".tre_three").slideUp();
            })
        })
  		
    })