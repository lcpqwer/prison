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
