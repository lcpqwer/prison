$(function () {
    $('.title_a').click(function () {
        $('.title_b').removeClass('active')
        $(this).addClass('active')
        $('#main_a').css('display', 'block')
        $('#main_b').css('display', 'none')
    })
    $('.title_b').click(function () {
        $('.title_a').removeClass('active')
        $(this).addClass('active')
        $('#main_b').css('display', 'block')
        $('#main_a').css('display', 'none')
    })


})
$(function () {
        var h3 = $(".tree_box").find("h3");
        var tree_one = $(".tree_box").find(".tree_one");
        var h4 = $(".tree_one").find("h4");
        var tree_two = $(".tree_one").find(".tree_two");
        var h5 = $('.tree_two').find('h5')
        var tree_three = $('.tree_two').find('.tree_three')
        h3.each(function (i) {
            $(this).click(function () {
                tree_one.eq(i).slideToggle();
                tree_one.eq(i).parent().siblings().find(".tree_one").slideUp();
            })
          	
        })
        h4.each(function (i) {
            $(this).click(function () {
                tree_two.eq(i).slideToggle();
                tree_two.eq(i).parent().siblings().find(".tree_two").slideUp();
            })
        })
        h5.each(function (i) { 
            $(this).click(function () {
                tree_three.eq(i).slideToggle();
                tree_three.eq(i).parent().siblings().find(".tree_three").slideUp();
            })
        })
    })