"use strict";
(() => {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name=polyuno]').attr('content')
        }
    });
    // header responsive js
    let headerHeight = $('#headerArea').outerHeight();
    // $('#mainContent').css({ 'min-height': 'calc(100vh - ' + headerHeight + 'px)', 'margin-top': headerHeight + 'px' });
    // scrolling animation for header
    $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll < 50) {
            $(".header-area").removeClass("sticky");
        } else {
            $(".header-area").addClass("sticky");
        }
    });
    // dropdown js
    $('.header-profile-info').on('click', function () {
        $('.pro-dropdown-potion').slideToggle(200);
    });

    tippy('.show-tooltip', {
        followCursor: 'horizontal',
    });

    tippy('.bottomToolTip', {
        theme: 'outreachbin',
        followCursor: 'horizontal',
        placement: 'bottom',
        interactive: true
    });
    tippy('.TopToolTip', {
        theme: 'primary',
        followCursor: 'horizontal',
        placement: 'top',
        interactive: true
    });
    tippy('.rightToolTip', {
        theme: 'Warning',
        followCursor: 'vertical',
        placement: 'right',
        interactive: true
    });
    tippy('.leftToolTip', {
        theme: 'Warning',
        followCursor: 'vertical',
        placement: 'left',
        interactive: true
    });
})();

function cl(v) {
    console.log(v);
}
function canvasLoader(status = true, loadingText = '') {
    if (status) {
        $('.canvas-loading-text').text(loadingText);
        $('.canvas-loading-page').fadeIn(100);
    } else {
        $('.canvas-loading-page').fadeOut(100);
    }
}
function loader(e = !0, a = "Loading...") {
    let i, o, tt = 0;
    if (e) {
        let o = randomNumber(1, 9), d = 0;

        function g() {
            tt = 0;
            if (o <= randomNumber(85, 90)) {
                $(".loading-page div .loading-page-title").text(a);
                $(".loading-page div .loading-page-count").html(o + "%");
                $(".loading-page div .progress .progress-bar").css("width", o + "%");
                tt = setTimeout(g, d);
                d = randomNumber(250, 500);
                o += randomNumber(1, 10);
            }
        }

        g(), $(".custom-loader").fadeIn(100);
    } else {
        let l = 90;
        let ff = 0;

        function gg() {
            if (l <= 100) {
                    $(".loading-page div .loading-page-count").html(l + "%"),
                    $(".loading-page div .progress .progress-bar").css("width", l + "%");
                ff = setTimeout(gg, randomNumber(10, 100)),
                    l++
            } else {
                clearTimeout(ff);
                $(".custom-loader").fadeOut(100)
            }
        }

        setTimeout(gg, 500);
    }
}

/**************************************DROPDOWN**********************************************/
/********************************************************************************************/
$(document).on("click", ".theme-select-nonvalue", function (e) {
    let t = $(this);
    $(".theme-select-nonvalue").not(this).parent().removeClass("show");
    t.parent().toggleClass("show");
});

$(document).on("click", ".theme-select-inline-table", function (e) {
    let t = $(this);
    // console.log($("body div.theme-select-inline-table").not(this));
    // $("body div.theme-select-inline-table").not(this).parent().parent().removeClass("show"),
    t.parent().parent().removeClass("show"),
    // t.parent().parent().toggleClass("show"),
    t.parent().parent().find('div.dropdown-menu span').each((e, n) => {
        t.text().trim() === $(n).text().trim() ? $(n).addClass("active") : $(n).removeClass("active")
    })
}),
$(document).mouseup(function (e) {
    $("div.theme-select-inline-table").parent().parent().removeClass("show")
}),

//------------------------------------

$(document).on("click", ".theme-select-value", function (e) {
    let t = $(this);
    $(".theme-select-value").not(this).parent().removeClass("show"), t.parent().toggleClass("show"), t.parent().find(".dropdown-menu span").each((e, n) => {
        t.text().trim() === $(n).text().trim() ? $(n).addClass("active") : $(n).removeClass("active")
    })
}), $(document).on("click", ".dropdown-menu span", function () {
    let e = $(this), t = e.text();
    e.parent().parent().find(".theme-select-value").text(t), e.parent().parent().removeClass("show")
}), $(document).mouseup(function (e) {
    $(this);
    let t = $("div.theme-select-box");
    t.is(e.target) || 0 !== t.has(e.target).length || t.removeClass("show")
}), $(".dropdown-menu span.active").each(function (e) {
    let t = $(this);
    t.parent().parent().find(".theme-select-value").text(t.text())
});

$(document).on("input propertychange paste change", '.theme-select-search', function (e) {
    let value = $(this).val().toLowerCase();
    let $ul = $('.select-2-value');
    //get all lis but not the one having search input
    let $li = $ul.find('span');
    //hide all lis
    $li.addClass('d-none');
    $li.filter(function () {
        let text = $(this).text().toLowerCase();
        // console.log(text);
        return text.indexOf(value) >= 0;
    }).removeClass('d-none');
});
$(document).on("input propertychange paste change", '.theme-select-search-label', function (e) {
    let value = $(this).val().toLowerCase();
    let $ul = $('.select-2-value');
    //get all lis but not the one having search input
    let $li = $ul.find('label');
    //hide all lis
    $li.addClass('d-none');
    $li.filter(function () {
        let text = $(this).text().toLowerCase();
        // console.log(text);
        return text.indexOf(value) >= 0;
    }).removeClass('d-none');
});

/********************************************************************************************/
/********************************************************************************************/

/****************************************Ajax************************************************/

/********************************************************************************************/
function makeAjax(url, buttonLoaderClassName = 'btn-loading', dataType = 'json') {
    let button_load = [];
    if (typeof buttonLoaderClassName != "undefined" && buttonLoaderClassName !== null) {
        let elements = document.querySelectorAll('.' + buttonLoaderClassName);
        elements.forEach((el, i) => {
            button_load[i] = Ladda.create(el);
        });
    }
    return $.ajax({
        url: url,
        type: 'get',
        dataType: dataType,
        cache: false,
        beforeSend: function () {
            if (button_load.length > 0) {
                button_load.forEach((el, i) => {
                    button_load[i].start();
                })
            }
        }
    }).always(function () {
        if (button_load.length > 0) {
            button_load.forEach((el, i) => {
                button_load[i].stop();
            })
        }
    }).fail(function (res) {
        if (res.responseJSON !== undefined && res.responseJSON.message !== undefined) {
            swalError(res.responseJSON.message);
        }
        if (button_load.length > 0) {
            button_load.forEach((el, i) => {
                button_load[i].stop();
            })
        }
    });
}

function makeAjaxWithData(data, url, buttonLoaderClassName = 'btn-loading') {
    let button_load = [];
    if (typeof buttonLoaderClassName != "undefined" && buttonLoaderClassName !== null) {
        let elements = document.querySelectorAll('.' + buttonLoaderClassName);
        elements.forEach((el, i) => {
            button_load[i] = Ladda.create(el);
        });
    }
    return $.ajax({
        url: url,
        type: 'get',
        data: data,
        cache: false,
        beforeSend: function () {
            if (button_load.length > 0) {
                button_load.forEach((el, i) => {
                    button_load[i].start();
                })
            }
        }
    }).always(function () {
        if (button_load.length > 0) {
            button_load.forEach((el, i) => {
                button_load[i].stop();
            })
        }
    }).fail(function (res) {
        swalError(res.responseJSON.message);
        if (button_load.length > 0) {
            button_load.forEach((el, i) => {
                button_load[i].stop();
            })
        }
    });
}

function makeAjaxPostFile(data, url, buttonLoaderClassName = 'btn-loading') {
    let button_load = [];
    if (typeof buttonLoaderClassName != "undefined" && buttonLoaderClassName !== null) {
        let elements = document.querySelectorAll('.' + buttonLoaderClassName);
        elements.forEach((el, i) => {
            button_load[i] = Ladda.create(el);
        });
    }
    return $.ajax({
        url: url,
        type: 'post',
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function () {
            if (button_load.length > 0) {
                button_load.forEach((el, i) => {
                    button_load[i].start();
                })
            }
        }
    }).always(function () {

        if (button_load.length > 0) {
            button_load.forEach((el, i) => {
                button_load[i].stop();
            })
        }
    }).fail(function (res) {
        swalError(res.responseJSON.message);

        if (button_load.length > 0) {
            button_load.forEach((el, i) => {
                button_load[i].stop();
            })
        }
    });
}

function makeAjaxPost(data, url, buttonLoaderClassName = 'btn-loading') {
    let button_load = [];
    if (typeof buttonLoaderClassName != "undefined" && buttonLoaderClassName !== null) {
        let elements = document.querySelectorAll('.' + buttonLoaderClassName);
        elements.forEach((el, i) => {
            button_load[i] = Ladda.create(el);
        });
    }
    return $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
        cache: false,
        beforeSend: function () {
            if (button_load.length > 0) {
                button_load.forEach((el, i) => {
                    button_load[i].start();
                })
            }
        }
    }).always(function () {
        if (button_load.length > 0) {
            button_load.forEach((el, i) => {
                button_load[i].stop();
            })
        }
    }).fail(function (res) {
        loader(false);
        if (res.responseJSON.message !== undefined) {
            if(res.responseJSON.message === 'Unauthenticated'){
                swalError('Opps! Your are logged out. Please login & try again.','Session Timeout');
            }else{
                swalError(res.responseJSON.message);
            }
        }
        if (button_load.length > 0) {
            button_load.forEach((el, i) => {
                button_load[i].stop();
            })
        }
    });
}

/********************************************************************************************/
/********************************************************************************************/

/***********************************Sweet alerts (swal)**************************************/

/********************************************************************************************/
// function swalError(message = "your action has been failed due to an unexpected reason", title = 'SalesMix Warning!') {
//     if (message === 'permission denied') {
//         swalError('Sorry! you don\'t have permission to access that page. Please contact your team owner for access it.', 'Permission Denied!');
//     } else {
//         let svg = `<svg width="45" height="45" viewBox="0 0 140 141" fill="none"><rect opacity="0.11" y="0.00341797" width="140" height="140" rx="70" fill="#EA4335"/><rect opacity="0.21" x="16" y="16" width="108" height="108" rx="54" fill="#EA4335"/><path d="M70 108C49.0381 108 32 90.9619 32 70C32 49.0381 49.0381 32 70 32C90.9619 32 108 49.0381 108 70C108 90.9619 90.9619 108 70 108ZM70 37.3023C51.9721 37.3023 37.3023 51.9721 37.3023 70C37.3023 88.0279 51.9721 102.698 70 102.698C88.0279 102.698 102.698 88.0279 102.698 70C102.698 51.9721 88.0279 37.3023 70 37.3023Z" fill="#EA4335"/><path d="M70 76.186C68.5507 76.186 67.3488 74.9842 67.3488 73.5349V55.8605C67.3488 54.4112 68.5507 53.2093 70 53.2093C71.4493 53.2093 72.6512 54.4112 72.6512 55.8605V73.5349C72.6512 74.9842 71.4493 76.186 70 76.186Z" fill="#EA4335"/><path d="M70 87.674C69.5405 87.674 69.0809 87.568 68.6567 87.3912C68.2326 87.2145 67.8437 86.967 67.4902 86.6489C67.1721 86.2954 66.9247 85.9419 66.7479 85.4824C66.5712 85.0582 66.4651 84.5987 66.4651 84.1391C66.4651 83.6796 66.5712 83.2201 66.7479 82.7959C66.9247 82.3717 67.1721 81.9828 67.4902 81.6294C67.8437 81.3112 68.2326 81.0638 68.6567 80.887C69.5051 80.5335 70.4949 80.5335 71.3433 80.887C71.7674 81.0638 72.1563 81.3112 72.5098 81.6294C72.8279 81.9828 73.0753 82.3717 73.2521 82.7959C73.4288 83.2201 73.5349 83.6796 73.5349 84.1391C73.5349 84.5987 73.4288 85.0582 73.2521 85.4824C73.0753 85.9419 72.8279 86.2954 72.5098 86.6489C72.1563 86.967 71.7674 87.2145 71.3433 87.3912C70.9191 87.568 70.4595 87.674 70 87.674Z" fill="#EA4335"/></svg>`;
//         let html = `
//             <div class="d-flex text-start p-1">
//                 <div class="">${svg}</div>
//                 <div class="ms-3">
//                     <h6 class="title-sm mb-1">${title}</h6>
//                     <p class="description-sm text-secondary">${message}</p>
//                 </div>
//             </div>`;
//         Swal.fire({
//             html: html,
//             showConfirmButton: false,
//             position: 'top-end',
//             timer: 5000,
//             showCloseButton: true,
//             toast: true,
//         });
//     }
// }

function swalError(message = "your action has been failed due to an unexpected reason", title = 'SalesMix Warning!') {
    if (message === 'permission denied') {
        swalError('You do not have the necessary permissions to access this resource', 'Access Denied!');
    }else if (message === 'Server Error') {
        swalError('System is currently unable to process your request.<br> Please try again after some time');
    } else {
        let html = `
        <div class="text-center">
        <svg width="80" height="80" viewBox="0 0 140 141" fill="none">
        <rect opacity="0.11" y="0.00341797" width="140" height="140" rx="70" fill="#EA4335"/>
        <rect opacity="0.21" x="16" y="16" width="108" height="108" rx="54" fill="#EA4335"/>
        <path d="M70 108C49.0381 108 32 90.9619 32 70C32 49.0381 49.0381 32 70 32C90.9619 32 108 49.0381 108 70C108 90.9619 90.9619 108 70 108ZM70 37.3023C51.9721 37.3023 37.3023 51.9721 37.3023 70C37.3023 88.0279 51.9721 102.698 70 102.698C88.0279 102.698 102.698 88.0279 102.698 70C102.698 51.9721 88.0279 37.3023 70 37.3023Z" fill="#EA4335"/>
        <path d="M70 76.186C68.5507 76.186 67.3488 74.9842 67.3488 73.5349V55.8605C67.3488 54.4112 68.5507 53.2093 70 53.2093C71.4493 53.2093 72.6512 54.4112 72.6512 55.8605V73.5349C72.6512 74.9842 71.4493 76.186 70 76.186Z" fill="#EA4335"/>
        <path d="M70 87.674C69.5405 87.674 69.0809 87.568 68.6567 87.3912C68.2326 87.2145 67.8437 86.967 67.4902 86.6489C67.1721 86.2954 66.9247 85.9419 66.7479 85.4824C66.5712 85.0582 66.4651 84.5987 66.4651 84.1391C66.4651 83.6796 66.5712 83.2201 66.7479 82.7959C66.9247 82.3717 67.1721 81.9828 67.4902 81.6294C67.8437 81.3112 68.2326 81.0638 68.6567 80.887C69.5051 80.5335 70.4949 80.5335 71.3433 80.887C71.7674 81.0638 72.1563 81.3112 72.5098 81.6294C72.8279 81.9828 73.0753 82.3717 73.2521 82.7959C73.4288 83.2201 73.5349 83.6796 73.5349 84.1391C73.5349 84.5987 73.4288 85.0582 73.2521 85.4824C73.0753 85.9419 72.8279 86.2954 72.5098 86.6489C72.1563 86.967 71.7674 87.2145 71.3433 87.3912C70.9191 87.568 70.4595 87.674 70 87.674Z" fill="#EA4335"/>
        </svg>
            <div class="pt-4">
                <h6 class="popup-title">${title}</h6>
                <p class="description text-body">${message}</p>
            </div>
        </div>
        `;
        Swal.fire({
            html: html,
            showConfirmButton: false,
            showCloseButton: true,
            //timer: 2500
        });
    }
}

function swalWarning(message = "We are not able to do this action!", title = 'SalesMix says!') {
    if (message === 'permission denied') {
        swalError('You do not have the necessary permissions to access this resource', 'Access Denied!');
    }else if (message === 'Server Error') {
        swalError('System is currently unable to process your request.<br> Please try again after some time');
    }  else {
        let svg = `<svg width="45" height="45" viewBox="0 0 140 141" fill="none"><rect opacity="0.11" y="0.00341797" width="140" height="140" rx="70" fill="#EEB221"/><rect opacity="0.21" x="16" y="16" width="108" height="108" rx="54" fill="#EEB221"/><path d="M70 108C49.0381 108 32 90.9619 32 70C32 49.0381 49.0381 32 70 32C90.9619 32 108 49.0381 108 70C108 90.9619 90.9619 108 70 108ZM70 37.3023C51.9721 37.3023 37.3023 51.9721 37.3023 70C37.3023 88.0279 51.9721 102.698 70 102.698C88.0279 102.698 102.698 88.0279 102.698 70C102.698 51.9721 88.0279 37.3023 70 37.3023Z" fill="#EEB221"/><path d="M70 76.186C68.5507 76.186 67.3488 74.9842 67.3488 73.5349V55.8605C67.3488 54.4112 68.5507 53.2093 70 53.2093C71.4493 53.2093 72.6512 54.4112 72.6512 55.8605V73.5349C72.6512 74.9842 71.4493 76.186 70 76.186Z" fill="#EEB221"/><path d="M70 87.674C69.5405 87.674 69.0809 87.568 68.6567 87.3912C68.2326 87.2145 67.8437 86.967 67.4902 86.6489C67.1721 86.2954 66.9247 85.9419 66.7479 85.4824C66.5712 85.0582 66.4651 84.5987 66.4651 84.1391C66.4651 83.6796 66.5712 83.2201 66.7479 82.7959C66.9247 82.3717 67.1721 81.9828 67.4902 81.6294C67.8437 81.3112 68.2326 81.0638 68.6567 80.887C69.5051 80.5335 70.4949 80.5335 71.3433 80.887C71.7674 81.0638 72.1563 81.3112 72.5098 81.6294C72.8279 81.9828 73.0753 82.3717 73.2521 82.7959C73.4288 83.2201 73.5349 83.6796 73.5349 84.1391C73.5349 84.5987 73.4288 85.0582 73.2521 85.4824C73.0753 85.9419 72.8279 86.2954 72.5098 86.6489C72.1563 86.967 71.7674 87.2145 71.3433 87.3912C70.9191 87.568 70.4595 87.674 70 87.674Z" fill="#EEB221"/></svg>`;
        let html = `
            <div class="d-flex text-start p-1">
                <div class="">${svg}</div>
                <div class="ms-3">
                    <h6 class="title-sm mb-1">${title}</h6>
                    <p class="description-sm text-secondary">${message}</p>
                </div>
            </div>`;
        Swal.fire({
            html: html,
            showConfirmButton: false,
            position: 'top-end',
            // timer: 5000,
            showCloseButton: true,
            toast: true,
        });
    }
}

function swalSuccess(message = 'Action has been Applied Successfully', title = 'Successfully Applied!') {
    let svg = `<svg width="45" height="45" viewBox="0 0 140 141" fill="none"><rect opacity="0.11" y="0.00341797" width="140" height="140" rx="70" fill="#34A853"/><rect opacity="0.21" x="16" y="16" width="108" height="108" rx="54" fill="#34A853"/><path d="M70 108C49.0381 108 32 90.9619 32 70C32 49.0381 49.0381 32 70 32C90.9619 32 108 49.0381 108 70C108 90.9619 90.9619 108 70 108ZM70 37.3023C51.9721 37.3023 37.3023 51.9721 37.3023 70C37.3023 88.0279 51.9721 102.698 70 102.698C88.0279 102.698 102.698 88.0279 102.698 70C102.698 51.9721 88.0279 37.3023 70 37.3023Z" fill="#34A853"/><path d="M65.0298 82.2581C64.3297 82.2581 63.6647 81.9707 63.1747 81.4679L53.2692 71.304C52.2542 70.2625 52.2542 68.5386 53.2692 67.4971C54.2843 66.4556 55.9643 66.4556 56.9794 67.4971L65.0298 75.7575L83.0206 57.2973C84.0357 56.2557 85.7157 56.2557 86.7308 57.2973C87.7458 58.3388 87.7458 60.0627 86.7308 61.1042L66.8849 81.4679C66.3948 81.9707 65.7298 82.2581 65.0298 82.2581Z" fill="#34A853"/></svg>`;
    let html = `
    <div class="d-flex text-start p-1">
        <div class="">${svg}</div>
        <div class="ms-3">
            <h6 class="title-sm mb-1">${title}</h6>
            <p class="description-sm text-secondary">${message}</p>
        </div>
    </div>`;
    Swal.fire({
        html: html,
        showConfirmButton: false,
        position: 'top-end',
        timer: 5000,
        showCloseButton: true,
        toast: true,
    });
}

function swalRedirect(url, msg, mode, confirmButton = "Thank you", title = 'Successfully Applied!') {
    let message = typeof (msg) != "undefined" && msg !== null ? msg : "Action has been Applied Successfully";
    let html = `
        <div class="text-center">
            <svg width="45" height="45" viewBox="0 0 140 141" fill="none"><rect opacity="0.11" y="0.00341797" width="140" height="140" rx="70" fill="#34A853"/><rect opacity="0.21" x="16" y="16" width="108" height="108" rx="54" fill="#34A853"/><path d="M70 108C49.0381 108 32 90.9619 32 70C32 49.0381 49.0381 32 70 32C90.9619 32 108 49.0381 108 70C108 90.9619 90.9619 108 70 108ZM70 37.3023C51.9721 37.3023 37.3023 51.9721 37.3023 70C37.3023 88.0279 51.9721 102.698 70 102.698C88.0279 102.698 102.698 88.0279 102.698 70C102.698 51.9721 88.0279 37.3023 70 37.3023Z" fill="#34A853"/><path d="M65.0298 82.2581C64.3297 82.2581 63.6647 81.9707 63.1747 81.4679L53.2692 71.304C52.2542 70.2625 52.2542 68.5386 53.2692 67.4971C54.2843 66.4556 55.9643 66.4556 56.9794 67.4971L65.0298 75.7575L83.0206 57.2973C84.0357 56.2557 85.7157 56.2557 86.7308 57.2973C87.7458 58.3388 87.7458 60.0627 86.7308 61.1042L66.8849 81.4679C66.3948 81.9707 65.7298 82.2581 65.0298 82.2581Z" fill="#34A853"/></svg>
            <div class="pt-4">
                <h6 class="popup-title">${title}</h6>
                <p class="description text-body">${message}</p>
            </div>
        </div>
    `;
    let button = 'btn btn-success';
    if (typeof (mode) != "undefined" && mode !== null) {
        if (mode === 'danger') {
            html = `
                <div class="text-center">
                    <svg width="80" height="80" viewBox="0 0 140 141" fill="none"><rect opacity="0.11" y="0.00341797" width="140" height="140" rx="70" fill="#EA4335"/><rect opacity="0.21" x="16" y="16" width="108" height="108" rx="54" fill="#EA4335"/><path d="M70 108C49.0381 108 32 90.9619 32 70C32 49.0381 49.0381 32 70 32C90.9619 32 108 49.0381 108 70C108 90.9619 90.9619 108 70 108ZM70 37.3023C51.9721 37.3023 37.3023 51.9721 37.3023 70C37.3023 88.0279 51.9721 102.698 70 102.698C88.0279 102.698 102.698 88.0279 102.698 70C102.698 51.9721 88.0279 37.3023 70 37.3023Z" fill="#EA4335"/><path d="M70 76.186C68.5507 76.186 67.3488 74.9842 67.3488 73.5349V55.8605C67.3488 54.4112 68.5507 53.2093 70 53.2093C71.4493 53.2093 72.6512 54.4112 72.6512 55.8605V73.5349C72.6512 74.9842 71.4493 76.186 70 76.186Z" fill="#EA4335"/><path d="M70 87.674C69.5405 87.674 69.0809 87.568 68.6567 87.3912C68.2326 87.2145 67.8437 86.967 67.4902 86.6489C67.1721 86.2954 66.9247 85.9419 66.7479 85.4824C66.5712 85.0582 66.4651 84.5987 66.4651 84.1391C66.4651 83.6796 66.5712 83.2201 66.7479 82.7959C66.9247 82.3717 67.1721 81.9828 67.4902 81.6294C67.8437 81.3112 68.2326 81.0638 68.6567 80.887C69.5051 80.5335 70.4949 80.5335 71.3433 80.887C71.7674 81.0638 72.1563 81.3112 72.5098 81.6294C72.8279 81.9828 73.0753 82.3717 73.2521 82.7959C73.4288 83.2201 73.5349 83.6796 73.5349 84.1391C73.5349 84.5987 73.4288 85.0582 73.2521 85.4824C73.0753 85.9419 72.8279 86.2954 72.5098 86.6489C72.1563 86.967 71.7674 87.2145 71.3433 87.3912C70.9191 87.568 70.4595 87.674 70 87.674Z" fill="#EA4335"/></svg>
                    <div class="pt-4">
                        <h6 class="popup-title">${title}</h6>
                        <p class="description text-body">${message}</p>
                    </div>
                </div>
            `;
            button = `btn btn-danger`;
        } else if (mode === 'warning') {
            html = `
                <div class="text-center">
                    <svg width="45" height="45" viewBox="0 0 140 141" fill="none"><rect opacity="0.11" y="0.00341797" width="140" height="140" rx="70" fill="#EEB221"/><rect opacity="0.21" x="16" y="16" width="108" height="108" rx="54" fill="#EEB221"/><path d="M70 108C49.0381 108 32 90.9619 32 70C32 49.0381 49.0381 32 70 32C90.9619 32 108 49.0381 108 70C108 90.9619 90.9619 108 70 108ZM70 37.3023C51.9721 37.3023 37.3023 51.9721 37.3023 70C37.3023 88.0279 51.9721 102.698 70 102.698C88.0279 102.698 102.698 88.0279 102.698 70C102.698 51.9721 88.0279 37.3023 70 37.3023Z" fill="#EEB221"/><path d="M70 76.186C68.5507 76.186 67.3488 74.9842 67.3488 73.5349V55.8605C67.3488 54.4112 68.5507 53.2093 70 53.2093C71.4493 53.2093 72.6512 54.4112 72.6512 55.8605V73.5349C72.6512 74.9842 71.4493 76.186 70 76.186Z" fill="#EEB221"/><path d="M70 87.674C69.5405 87.674 69.0809 87.568 68.6567 87.3912C68.2326 87.2145 67.8437 86.967 67.4902 86.6489C67.1721 86.2954 66.9247 85.9419 66.7479 85.4824C66.5712 85.0582 66.4651 84.5987 66.4651 84.1391C66.4651 83.6796 66.5712 83.2201 66.7479 82.7959C66.9247 82.3717 67.1721 81.9828 67.4902 81.6294C67.8437 81.3112 68.2326 81.0638 68.6567 80.887C69.5051 80.5335 70.4949 80.5335 71.3433 80.887C71.7674 81.0638 72.1563 81.3112 72.5098 81.6294C72.8279 81.9828 73.0753 82.3717 73.2521 82.7959C73.4288 83.2201 73.5349 83.6796 73.5349 84.1391C73.5349 84.5987 73.4288 85.0582 73.2521 85.4824C73.0753 85.9419 72.8279 86.2954 72.5098 86.6489C72.1563 86.967 71.7674 87.2145 71.3433 87.3912C70.9191 87.568 70.4595 87.674 70 87.674Z" fill="#EEB221"/></svg>
                    <div class="pt-4">
                        <h6 class="popup-title">${title}</h6>
                        <p class="description text-body">${message}</p>
                    </div>
                </div>
            `;
            button = `btn btn-warning`;
        }
    }

    return Swal.fire({
        html: html,
        showCloseButton: true,
        showCancelButton: false,
        buttonsStyling: false,
        customClass: {
            cancelButton: 'btn btn-secondary w-100 me-2',
            confirmButton: button + ' w-100 ms-2',
        },
        focusConfirm: false,
        confirmButtonText: confirmButton,
        allowOutsideClick: false
    }).then(function (s) {
        if (s.isConfirmed) {
            if (typeof (url) != "undefined" && url !== null) {
                window.location.href = url;
            } else {
                location.reload();
            }
        }
    });
}

// alert(new libphonenumber.AsYouType('US').input('213-373-4253'))
// var phoneUtil = new libphonenumber();
// //
// function validatePhoneNumber(phoneNumber) {
//     try {
//         var parsedPhoneNumber = phoneUtil.parse(phoneNumber);
//         return phoneUtil.isValidNumber(parsedPhoneNumber);
//     } catch (e) {
//         return false;
//     }
// }


/*
swalConfirm('ok?').then(s => {
    if(s.isConfirmed){
        console.log('isConfirmed');
    }else if (s.isDenied){
        console.log('isDenied');
    }else if(s.isDismissed){
        console.log('isDismissed');
    }
})
*/
function swalConfirm(
    msg,
    title = 'Are you sure want do this action?',
    confirm_text = 'Yes',
    cancel_text = 'No',
    is_delete = false,
    confirm_width_class = 'w-100',
    cancel_width_class = 'w-100',
    icon = `
        <svg width="80" height="80" viewBox="0 0 140 141" fill="none">
            <rect opacity="0.11" y="0.00341797" width="140" height="140" rx="70" fill="#EEB221"/>
            <rect opacity="0.21" x="16" y="16" width="108" height="108" rx="54" fill="#EEB221"/>
            <path d="M70 108C49.0381 108 32 90.9619 32 70C32 49.0381 49.0381 32 70 32C90.9619 32 108 49.0381 108 70C108 90.9619 90.9619 108 70 108ZM70 37.3023C51.9721 37.3023 37.3023 51.9721 37.3023 70C37.3023 88.0279 51.9721 102.698 70 102.698C88.0279 102.698 102.698 88.0279 102.698 70C102.698 51.9721 88.0279 37.3023 70 37.3023Z" fill="#EEB221"/>
            <path d="M70 76.186C68.5507 76.186 67.3488 74.9842 67.3488 73.5349V55.8605C67.3488 54.4112 68.5507 53.2093 70 53.2093C71.4493 53.2093 72.6512 54.4112 72.6512 55.8605V73.5349C72.6512 74.9842 71.4493 76.186 70 76.186Z" fill="#EEB221"/>
            <path d="M70 87.674C69.5405 87.674 69.0809 87.568 68.6567 87.3912C68.2326 87.2145 67.8437 86.967 67.4902 86.6489C67.1721 86.2954 66.9247 85.9419 66.7479 85.4824C66.5712 85.0582 66.4651 84.5987 66.4651 84.1391C66.4651 83.6796 66.5712 83.2201 66.7479 82.7959C66.9247 82.3717 67.1721 81.9828 67.4902 81.6294C67.8437 81.3112 68.2326 81.0638 68.6567 80.887C69.5051 80.5335 70.4949 80.5335 71.3433 80.887C71.7674 81.0638 72.1563 81.3112 72.5098 81.6294C72.8279 81.9828 73.0753 82.3717 73.2521 82.7959C73.4288 83.2201 73.5349 83.6796 73.5349 84.1391C73.5349 84.5987 73.4288 85.0582 73.2521 85.4824C73.0753 85.9419 72.8279 86.2954 72.5098 86.6489C72.1563 86.967 71.7674 87.2145 71.3433 87.3912C70.9191 87.568 70.4595 87.674 70 87.674Z" fill="#EEB221"/>
        </svg>
    `
) {
    let message = typeof (msg) != "undefined" && msg !== null ? msg : "You won't be able to revert this!";
    let html = `
        <div class="text-center">
            ${icon}
            <div class="pt-4">
                <h6 class="popup-title">${title}</h6>
                <p class="description text-body">${message}</p>
            </div>
        </div>`
    return Swal.fire({
        html: html,
        reverseButtons: true,
        // showCancelButton: true,
        showDenyButton: true,
        //     showCancelButton: true,
        buttonsStyling: false,
        customClass: {
            denyButton: 'btn btn-link text-body btn-popup me-2 ',
            // cancelButton: 'btn btn-link text-body btn-popup me-2 ',
            confirmButton: 'btn btn-warning ms-2 btn-popup ',
        },
        confirmButtonText: confirm_text,
        // cancelButtonText: cancel_text,
        denyButtonText: cancel_text,
        showCloseButton: true
    });
}

/********************************************************************************************/
/********************************************************************************************/

/*******************************custom validation function***********************************/

/********************************************************************************************/
/**
 *
 * @param value
 * @param $rule
 * @param field
 * @returns {string|*|string|((...values: number[]) => number)|number|string|boolean|Intl.RelativeTimeFormatNumeric}
 *
 * eg. validation(field_value,
 *     ['required|custom msg',
 *     'required',
 *     'min:2|custom msg',
 *     'max:5',
 *     'numeric'],
 *     field name // optional
 *    );
 */
function validation(value, $rule = ['required'], field = 'This field') {
    if (value === undefined) {
        return field + ' is undefined';
    }
    let x = '';
    let min = 1;
    let minValue = 0;
    let maxValue = 10000;
    let max = 10;
    let strong = 50;
    let $msg = [];
    for (x in $rule) {
        let $filter = [];
        let msgFilter = $rule[x].split("|");
        if (msgFilter[1] !== undefined) {
            $filter = msgFilter[0].split(":");
            $msg[$filter[0]] = msgFilter[1];
        } else {
            $filter = $rule[x].split(":");
        }
        if ($filter[0] === 'min') {
            min = parseInt($filter[1]);
        }
        if ($filter[0] === 'max') {
            max = parseInt($filter[1]);
        }
        if ($filter[0] === 'minValue') {
            minValue = parseInt($filter[1]);
        }
        if ($filter[0] === 'maxValue') {
            maxValue = parseInt($filter[1]);
        }
        if ($filter[0] === 'strong') {
            strong = parseInt($filter[1]);
        }
        $rule[x] = $filter[0];
    }

    if ($rule.includes('required')) {
        if (value.length === 0) {
            if ($msg.required !== undefined) {
                return $msg.required;
            }
            return field + ' is required';
        }
    }
    if ($rule.includes('minValue')) {
        if (value < minValue) {
            if ($msg.min !== undefined) {
                return $msg.min;
            }
            return field + ' must be greater than ' + minValue;
        }
    }

    if ($rule.includes('maxValue')) {
        if (value > maxValue) {
            if ($msg.max !== undefined) {
                return $msg.max;
            }
            return field + ' must be less than ' + maxValue;
        }
    }

    if ($rule.includes('min')) {
        if (value.length < min) {
            if ($msg.min !== undefined) {
                return $msg.min;
            }
            return 'At least ' + min + ' character required';
        }
    }

    if ($rule.includes('max')) {
        if (value.length > max) {
            if ($msg.max !== undefined) {
                return $msg.max;
            }
            return 'Maximum ' + max + ' character allowed';
        }
    }

    if ($rule.includes('strong')) {
        if (strong >= scorePassword(value)) {
            if ($msg.strong !== undefined) {
                return $msg.strong;
            }
            return 'At least 1 special character and both uppercase & lowercase are required';
        }
    }

    if ($rule.includes('email')) {
        if (!ValidateEmail(value)) {
            if ($msg.email !== undefined) {
                return $msg.email;
            }
            return 'Valid email address is required';
        }
    }
    if ($rule.includes('numeric')) {
        if (!isNumeric(value)) {
            if ($msg.numeric !== undefined) {
                return $msg.numeric;
            }
            return field + ' is required alpha numeric character';
        }
    }
    if ($rule.includes('domain')) {
        if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(value)) {
            return "Please enter a valid domain name";
        }
    }
    if ($rule.includes('phone')) {
        if (!/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d+)\)?)[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/.test(value)) {
            return "Please enter a valid phone number";
        }
    }
    return '';
}

function isEmptyOrSpaces(str) {
    return str == null || str.trim() === '';
}

function isNumeric(i) {
    return "string" == typeof i && !isNaN(i) && !isNaN(parseFloat(i))
}

function scorePassword(r) {
    let t = 0;
    if (!r) return t;
    for (let $ = {}, e = 0; e < r.length; e++) $[r[e]] = ($[r[e]] || 0) + 1, t += 5 / $[r[e]];
    let a = {digits: /\d/.test(r), lower: /[a-z]/.test(r)}, n = 0;
    for (let o in a) n += !0 == a[o] ? 1 : 0;
    return parseInt(t += (n - 1) * 10)
}

function ValidateEmail(t) {
    return !!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(t)
}

/********************************************************************************************/

/********************************************************************************************/

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele !== value;
    });
}

function arrayRemoveByKey(arr, key) {
    return arr.splice(key, 1);
    // return arr.filter(function (ele) {
    //     return ele !== value;
    // });
}
function stripTags(input) {
    // return input.replace(/<\/?[^>]+(>|$)/g, "");
    var withoutTags = input.replace(/<\/?[^>]+(>|$)/g, "");

    // Remove HTML entities
    var withoutEntities = withoutTags.replace(/&[^;]+;/g, "");

    return withoutEntities;
}

function slugify(str) {
    //replace all special characters | symbols with a space
    str = str.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase();
    // trim spaces at start and end of string
    str = str.replace(/^\s+|\s+$/gm, '');
    // replace space with dash/hyphen
    str = str.replace(/\s+/g, '_');
    return str;
    //return str;
}

function randomStr(length) {
    for (var s = ''; s.length < length; s += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.random() * 62 | 0)) ;
    return s;
}

function randomNumber(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function shortStr(str, count, insertDots = true) {
    // console.log(str)
    if (str !== undefined) {
        str = `<p>` + str + `</p>`;
        let short_message = $(str).text();
        return short_message.slice(0, count) + (((short_message.length > count) && insertDots) ? "..." : "");
    }
    return 'undefined data';
}


function getSuffixedNumber(num, currency = false) {
    if (typeof num !== "number") {
        return num;
    }
    if (num < 1000) {
        return currency ? '$' + num.toString() : num.toString();
    }
    const suffixes = ["K", "M", "B", "T", "q", "Q", "s", "S", "O", "N", "D"];
    let suffixIndex = -1;
    while (num >= 1000 && suffixIndex < suffixes.length - 1) {
        num /= 1000;
        suffixIndex++;
    }
    const abbreviatedNum = num.toFixed(1);

    if (abbreviatedNum.slice(-2) === ".0") {
        return abbreviatedNum.slice(0, -2) + suffixes[suffixIndex];
    }

    let result = abbreviatedNum + suffixes[suffixIndex];
    if (currency) {
        return '$' + result;
    }
    return result;
}

function formatAmount(x, currency = true, toFix = 0) {
    if (currency) {
        let parts = parseFloat(x).toFixed(toFix).toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return '$' + parts.join(".");
    }
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function formatTime(timestamp, timezone = 'UTC') {
    //Sample: Tue, Jan 3, 2023 11:57 AM
    let date = new Date(timestamp * 1000);
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: "short",
        timeZone: timezone
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
}
function shortFormatTime(timestamp, timezone = 'UTC') {
    //Sample: Jan 3, 11:57 AM
    let date = new Date(timestamp * 1000);
    return moment.tz(date, timezone).format('MMM D, hh:mm a (z)');

    // const options = {
    //     month: "short",
    //     day: "numeric",
    //     hour: "numeric",
    //     minute: "numeric",
    //     timeZoneName: "(short)",
    //     timeZone: timezone
    // };
    // return new Intl.DateTimeFormat('en-US', options).format(date);
    // dateTime.format('DD MMM, hh:mm a z');
}
function copyText(text, cl = 'copy_effect', transform = 1.3) {
    navigator.clipboard.writeText(text).then(() => {
        cl = $('.' + cl);
        cl.css('transform', `scale(${transform})`);
        let c = cl.css("color");
        cl.css('color', 'green');
        setTimeout(() => {
            cl.css('transform', 'scale(1)');
            cl.css('color', c);
        }, 300)
    });
}

function validDomain(domain) {
    if (/^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/.test(domain)) {
        return true;
    }
    return false;
}

function ucFirst(str) {
    if (str !== undefined && str !== '') {
        let st = str.replaceAll('_', ' ');
        let s = st.charAt(0).toUpperCase();
        return s + st.slice(1);
    }
    return str;
}

function ucWords(str) {
    if (str !== undefined && str !== '') {
        str = str.replace(/_/g, " ");
        return str.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
    }
    return str;
}

function scrollToDiv(element) {
    $("#" + element).animate({scrollTop: 0}, "fast");
    // window.scroll({
    //     top: element.offsetTop,
    //     left: 0,
    //     behavior: 'smooth'
    // });
}

document.addEventListener('focusin', (e) => {
    if (e.target.closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root") !== null) {
        // Enable input on popup on TINYMCE
        e.stopImmediatePropagation();
    }
});

