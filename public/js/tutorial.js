
    $("." + String(currentPage)).css("display", "block");

    $('.page-forward').click(function () {
        $("." + String(parseInt(this.id))).css("display", "none");
        $("." + String(parseInt(this.id) + 1)).css("display", "block");
    });

    $('.page-backward').click(function () {
        $("." + String(parseInt(this.id))).css("display", "none");
        $("." + String(parseInt(this.id) - 1)).css("display", "block");
    });


    $(".pannel_nav").click(function() {
        $(".tutorials").css("display","none");
        $("." + String(parseInt(this.id))).css("display", "block");
    })