$(document).ready(function(){
    const items = $(".catalog__list__item")
    const filterBtns = $(".filter__btn")
    filterBtns.on("click", function () {
        filterBtns.removeClass("filter__btn--active")
        $(this).addClass("filter__btn--active")
        const type = $(this).attr("data-type")
        if(type === "all") {
            let count = 0;
            items.each(function() {
                if(count >= 3) {
                    return
                }
                count++;
                $(this).show()
            })
            return
        }

        items.each(function() {
            const itemType = $(this).attr("data-type")
            if(type === itemType) {
                $(this).show()
            } else {
                $(this).hide()
            }
        })
    })

    const sliderTabs = $(".instruction__tab__btn")
    const cards = $(".instruction__card")
    sliderTabs.on("click", function () {

        const index = parseInt($(this).attr("data-tab-index"))
        $('.instruction__slider').slick('slickGoTo', index);

        sliderTabs.removeClass("instruction__tab__btn--active")
        $(this).addClass("instruction__tab__btn--active")
        // const instructionTab = "#"+$(this).attr("id")
        // $(this).addClass("instruction__tab__btn--active")
        // cards.each(function() {
        //     $(this).removeClass("instruction__card--active");
        // })
        //
        // const card = $(`.instruction__card[data-instruction-tab="${instructionTab}"]`)
        // card.addClass("instruction__card--active")
    })

    $('.accordion__header').each(function ()  {
        $(this).on('click', function ()  {
            const item = $(this).parent()
            const accordion = item.parent()


            // Optional: close all others first
            $(accordion.children('.accordion__item')).each(function() {
                if(!item.is($(this))) {
                    $(this).removeClass('accordion__item--open');
                }
            });


            item.toggleClass('accordion__item--open');
        });
    });

    $('.instruction__slider').slick({
        dots: false,
        autoplay: true,
        autoplaySpeed: 5000,
    });

    $('.instruction__slider').on('afterChange', function(_, __, slideIdx){

        // console.log("slide idx:", slideIdx)
        sliderTabs.removeClass("instruction__tab__btn--active")
        $(`.instruction__tab__btn[data-tab-index="${slideIdx}"]`).addClass("instruction__tab__btn--active");
        // do something with currentSlide index (0-based)
    });
});
