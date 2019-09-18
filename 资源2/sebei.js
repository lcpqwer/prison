$(function () {
    var h1 = $('#sbChoose .tree_box');
    var tree_one = $('#sbChoose .tree_one')
    h1.each(function (i) {
        $(this).click(function () {
                tree_one.eq(i).slideToggle();
                tree_one.eq(i).parent().siblings().find(".tree_one").slideUp();
            })
    })
})