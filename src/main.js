function renderPagination(container, totalPages, curPage) {
    const rightBtn = container.find(".solutions__page__btn-switch-right")

    // Remove old page buttons (keep only left/right arrows)
    container.find(".solutions__page__btn")
        .not(".solutions__page__btn-switch")
        .remove()
    container.find(".solutions__page__dots").remove()

    const dotsPage = $(window).width() <= 1140 ? 3 : 4;
    const lastPages = $(window).width() <= 1140 ? 1 : 2;
    for (let i = Math.max(Math.min(curPage, totalPages - 5), 1); i <= totalPages; i++) {
        if (i <= curPage + dotsPage - 1 || i > totalPages - lastPages) {
            // Create button
            const btn = $(`<button type="button" class="solutions__page__btn${curPage === i ? " solutions__page__btn--active" : ""}">${i}</button>`)
            btn.insertBefore(rightBtn)
        } else if (i === curPage + dotsPage) {
            // Insert dots once
            $('<span class="solutions__page__dots">...</span>').insertBefore(rightBtn)
        }
    }
}

function setQueryParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url); // updates URL without reload
}

function filter(params, filters) {
    const { filterSubtypeBtns, items} = params
    filterSubtypeBtns.each(function() {
        const type = $(this).attr("data-type")
        if(type === filters.type || filters.type === "all" || type === "all") {
            $(this).show()
        } else {
            $(this).hide()
        }
    })


    let take = 0
    let skip = filters.page.limit * (filters.page.cur - 1)
    items.each(function() {
        const type = $(this).attr("data-type")
        const subtype = $(this).attr("data-subtype")
        if((take < filters.page.limit) && (filters.type === type || filters.type === "all") && (filters.subtype === subtype || filters.subtype === "all")) {
            if(skip > 0) {
                $(this).hide()
                skip--;
            } else {
                $(this).show()
                take++;
            }
        } else {
            $(this).hide()
        }
    })
    const count = items.filter(function() {
        return $(this).attr("data-subtype") === filters.subtype || filters.subtype === "all"
    }).length

    const pagesContainer = $(".solutions__page")
    // console.log("render pages:", Math.ceil(count / filters.page.limit))
    renderPagination(pagesContainer, Math.ceil(count / filters.page.limit), filters.page.cur)

    const pageBtns = $(".solutions__page__btn")
        .not(".solutions__page__btn-switch")

    pageBtns.on("click", function() {
        filters.page.cur = parseInt($(this).text()) ?? 1
        filter(params, filters)
    })

    setQueryParam("type", filters.type)
    setQueryParam("subtype", filters.subtype)
    setQueryParam("page", filters.page.cur)
}

$(document).ready(function(){
    const query = new URLSearchParams(window.location.search);

    const type = query.get("type")
    const subtype = query.get("subtype")
    const page = parseInt(query.get("page"))

    const filters = {
        type: type ?? 'all',
        subtype: subtype ?? 'all',
        page: {
            cur: !isNaN(page) ? page : 1,
            max: 3,
            limit: 3,
        },
        // type: params.get("type") ==
        // subtype: "all",
    }
    // Initializing all the items and filter buttons
    const filterSelect = new Choices(".solutions__catalog__filter-select", {
        searchEnabled: false,
        loadingText: '',
        noResultsText: '',
        noChoicesText: '',
        itemSelectText: '',
        classNames: {
            containerOuter: ['choices', "filter-choices__outer"],
            containerInner: ['filter-choices__inner'],
            item: ['filter-choices__item'],
            listDropdown: ["filter-choices__dropdown"],
            itemChoice: ['choices__item--choice', "filter-choices__item--choice"],
            highlightedState: ['is-highlighted'],
            // highlightedState: [],
            // list: ["filter-choices__list"],
        },
    })



    // Should be in this order
    const items = $(".catalog__list__item")
    filters.page.max = items.length

    const filterTypeBtns = $(".solutions__filter__type .filter__btn")
    const filterSubtypeBtns = $(".solutions__filter__subtype .filter__btn")
    const params = {
        items,
        filterTypeBtns,
        filterSubtypeBtns,
    }

    console.log("filters from query:", filters)

    filter(params, filters)
    filterTypeBtns.removeClass("filter__btn--big--active")
    filterSubtypeBtns.removeClass("filter__btn--active")
    const foundType = filterTypeBtns.filter(function() {
        return $(this).attr("data-type") === filters.type || filters.type === "all"
    })
    $(foundType.get(0)).addClass("filter__btn--big--active")
        // [0].addClass("filter__btn--big--active")
    const foundSubtype = filterSubtypeBtns.filter(function() {
        return $(this).attr("data-subtype") === filters.subtype || filters.type === "all"
    })
    $(foundSubtype.get(0)).addClass("filter__btn--active")
        // [0].addClass("filter__btn--active")

    filterTypeBtns.on('click', function() {
        const type = $(this).attr("data-type")
        filterTypeBtns.removeClass("filter__btn--big--active")
        $(this).addClass("filter__btn--big--active")
        filters.type = type
        filters.subtype = "all"
        filters.page.cur = 1

        filter(params, filters)
    })

    filterSubtypeBtns.on("click", function () {
        filterSubtypeBtns.removeClass("filter__btn--active")
        $(this).addClass("filter__btn--active")

        const subtype = $(this).attr("data-subtype")
        filters.subtype = subtype
        filters.page.cur = 1
        filter(params, filters)
    })

    const filterSwitchLeft = $(".solutions__page__btn-switch-left")
    filterSwitchLeft.on("click", function() {
        filters.page.cur--;
        if(filters.page.cur < 1) {
            filters.page.cur = 1
            return
        }
        filter(params, filters)
    })
    const filterSwitchRight = $(".solutions__page__btn-switch-right")
    filterSwitchRight.on("click", function() {
        filters.page.cur++;
        const itemsLen = items.filter(function() {
            return $(this).attr("data-subtype") === filters.subtype || filters.subtype === "all"
        }).length

        const curMax = Math.ceil(itemsLen / filters.page.limit)
        console.log("curMax:", curMax)
        if(filters.page.cur > curMax) {
            filters.page.cur = curMax
            return
        }
        filter(params, filters)
    })


    const sliderTabs = $(".instruction__tab__btn")
    const cards = $(".instruction__card")

    sliderTabs.on("click", function () {

        const index = parseInt($(this).attr("data-tab-index"))
        $('.instruction__slider').slick('slickGoTo', index);

        sliderTabs.removeClass("instruction__tab__btn--active")
        $(this).addClass("instruction__tab__btn--active")
    })

    $('.accordion__header').each(function ()  {
        $(this).on('click', function ()  {
            const item = $(this).parent()
            const accordion = item.parent()

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

    $('.advantages__list:last-child').slick({
        dots: false,
        autoplay: true,
        autoplaySpeed: 5000,
    })

    $('.instruction__slider').on('afterChange', function(_, __, slideIdx){

        // console.log("slide idx:", slideIdx)
        sliderTabs.removeClass("instruction__tab__btn--active")
        $(`.instruction__tab__btn[data-tab-index="${slideIdx}"]`).addClass("instruction__tab__btn--active");
        // do something with currentSlide index (0-based)
    });
});
