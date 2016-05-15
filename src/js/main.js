// Application Scripts:

// покажем - спрячем форму поиска
// подключим мобильное меню
// подключим модальные окна
// подключим стилизованные select
// подключим тултипы
// вкладки
// меняем стиль хидера на главной
// хиро слайдер
// слайдер просмотров
// видео в модальном окне
// callback-block - покажем скрытый select когда снимаем галочку с чекбокса
// оформление ОСАГО - по клику на линк покажем дополнительные поля формы

jQuery(document).ready(function ($) {
    //
    // покажем - спрячем форму поиска
    //---------------------------------------------------------------------------------------
    (function () {
        var $search__btn = $('[data-searchform]'),
            $form = $('.b-search'),
            method = {};

        method.show = function (e) {
            e.preventDefault();
            $form.fadeIn();
        };

        method.hide = function () {
            $form.hide();
        };

        $('.b-header').on('click', '[data-searchform]', method.show);
        $form.on('click', '.b-search__close', method.hide);
    })();

    //
    // подключим мобильное меню
    //---------------------------------------------------------------------------------------
    $(".button-collapse").sideNav();
    //
    // подключим модальные окна
    //---------------------------------------------------------------------------------------
    $('.modal-trigger').leanModal();
    //
    // подключим стилизованные select
    //---------------------------------------------------------------------------------------
    $('select').material_select();
    //
    // подключим тултипы
    //---------------------------------------------------------------------------------------
    $('.tooltipped').tooltip({ delay: 50 });

    //
    // вкладки
    //---------------------------------------------------------------------------------------
    function initTabs() {
        var $list = $('.js-tabs'),
            $content =$('.js-tabs-content > div'),
            method = {};

        method.init = (function () {//спрячем "лишние" вкладки
            $content.hide()
            $list.each(function () {
                var current = $(this).find('li.current');
                if (current.length <1 ) { $(this).find('li:first').addClass('current'); }
                current = $(this).find('li.current a').attr('href');
                $(current).show();
            });
        })();

        method.show = function (el) {//обработка клика по вкладке
            var $tabs = el.parents('ul').find('li');
            var tab_next = el.attr('href');
            var tab_current = $tabs.filter('.current').find('a').attr('href');
            $(tab_current).hide();
            $tabs.removeClass('current');
            el.parent().addClass('current');
            $(tab_next).fadeIn();
            history.pushState(null, null, window.location.search + el.attr('href'));
        };

        
        $list.on('click', 'a[href^="#"]', function (e) {//клик по вкладке
            e.preventDefault();
            method.show($(this));
        });

        method.parsing = (function () {//парсим линк и открываем нужную вкладку при загрузке
            var hash = window.location.hash;
            if (hash) {
                var selectedTab = $list.find('a[href="' + hash + '"]');
                selectedTab.trigger('click', true);
            };
        })();
    };
    if ($('.js-tabs').length) { initTabs(); }

    //
    // меняем стиль хидера на главной
    //---------------------------------------------------------------------------------------
    function changeHeader() {
        var $header = $('.js-header'),
            $window = $(window),
            className = 'b-header--hero',
            method = {};

        method.checkScroll = function () {
            var fromTop = $window.scrollTop();

            if (fromTop > 100) {
                $header.removeClass(className);
            } else {
                $header.addClass(className);
            };
        };

        method.checkScroll();

        $window.bind('scroll', method.checkScroll);
    };
    if ($('.js-header').length) {
        changeHeader();
    }


    //
    // хиро слайдер
    //---------------------------------------------------------------------------------------
    function initHero() {
        var $slider = $('.js-hero');
        $slider.bxSlider({
            controls: false,
            pagerCustom: '.js-hero-nav',
            auto: true,
            pause: 8000,
            autoHover:true,
            mode: 'fade',
            onSliderLoad: function (currentIndex) {
                $slider.children('li').eq(currentIndex).find('.js-hero-caption').addClass('active');
            },
            onSlideBefore: function($slideElement) {
                $slideElement.find('.js-hero-caption').removeClass('active');
            },
            onSlideAfter: function ($slideElement) {
                $slideElement.find('.js-hero-caption').addClass('active');
            }
        });

        $('.js-hero-nav').hover(function () {
            $slider.stopAuto();
        }, function () {
            $slider.startAuto();
        });
    };
    if ($('.js-hero').length) { initHero();}

    //
    // слайдер просмотров
    //---------------------------------------------------------------------------------------
    function initHistorySlider() {
        var $slider = $('.js-history'),
            rtime, //переменные для пересчета ресайза окна с задержкой delta
            timeout = false,
            delta = 200,
            method = {};

        method.getSliderSettings = function () {
            var setting,
                    settings1 = {
                        maxSlides: 1,
                        minSlides: 1,
                        slideWidth: 302,
                    },
                    settings2 = {
                        maxSlides: 1,
                        minSlides: 1,
                        slideWidth: 372,
                    },
                    settings3 = {
                        maxSlides: 2,
                        minSlides: 2,
                        slideWidth: 372,
                    },
                    settings4 = {
                        maxSlides: 3,
                        minSlides: 3,
                        slideWidth: 372,
                    },
                    common = {
                        slideMargin: 10,
                        moveSlides: 1,
                        auto: false,
                        pager: false,
                        mode: 'horizontal',
                        infiniteLoop: false,
                        hideControlOnEnd: true,
                        useCSS: false,
                        nextSelector: '.js-history-next',
                        prevSelector: '.js-history-prev',
                        nextText: '<i class="icon-right"></i>',
                        prevText: '<i class="icon-left"></i>',
                    },
                    winW = $(window).width();
            if (winW < 400) {
                setting = $.extend(settings1, common);
            }
            if (winW >= 400 && winW < 800) {
                setting = $.extend(settings2, common);
            }
            if (winW >= 800 && winW < 1200) {
                setting = $.extend(settings3, common);
            }
            if (winW >= 1200) {
                setting = $.extend(settings4, common);
            }
            return setting;
        };

        method.reloadSliderSettings = function () {
            $slider.reloadSlider(method.getSliderSettings());
        };

        method.endResize = function () {
            if (new Date() - rtime < delta) {
                setTimeout(method.endResize, delta);
            } else {
                timeout = false;
                //ресайз окончен - пересчитываем
                method.reloadSliderSettings();
            }
        };

        method.startResize = function () {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(method.endResize, delta);
            }
        };

        $slider.bxSlider(method.getSliderSettings());//запускаем слайдер

        $(window).bind('resize', method.startResize);//пересчитываем кол-во видимых элементов при ресайзе окна с задержкой .2с

        $('.js-history').on('click', '.js-del', function () {//удаляем элементы
            var $el = $(this).parents('li');
            $el.remove();
            method.reloadSliderSettings();
            var count = $slider.getSlideCount();
            if (count === 0) {//если удалили все - скрыли блок
                $('.b-history').hide();
            }
        });
    };

    if ($('.js-history').length) {
        initHistorySlider();
    };

    //
    // видео в модальном окне
    //---------------------------------------------------------------------------------------
    $('.js-videolink').on('click', function (e) {
        e.preventDefault();
        var link = $(this).attr('href'),
            id = getYoutubeID(link);

        if (id) {
            $('#videomodal').find('iframe').attr('src', 'https://www.youtube.com/embed/' + id + '?rel=0&amp;showinfo=0;autoplay=1');
            $('#videomodal').openModal({
                complete: function () {
                    $('#videomodal').find('iframe').attr('src', '');
                }
            });
        }

        function getYoutubeID(url) {//парсим youtube-ссылку, возвращаем id видео
            var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp),
                urllink;
            if (match && match[1].length == 11) {
                urllink = match[1];
            } else {
                urllink = false;
            }
            return urllink;
        }
    });

    //
    // маска для телефонного номера
    //---------------------------------------------------------------------------------------
    $('.js-input-phone').mask('+38 (099) 999-99-99');

    //
    // callback-block - покажем скрытый select когда снимаем галочку с чекбокса
    //---------------------------------------------------------------------------------------
    function showcallbackBlock() {
        $('.js-callback-check').one('change', function () {
            if (!$(this).is(':checked')) {
                $(this).parent('p').addClass('hide');
                $('.js-callback-check-target').removeClass('hide');
            }
        });
    };
    if ($('.js-callback-check').length) {
        showcallbackBlock();
    };

    //
    // оформление ОСАГО - по клику на линк покажем дополнительные поля формы
    //---------------------------------------------------------------------------------------
    function showFormBlock() {
        $('.js-form-links').one('click', 'a', function (e) {
            e.preventDefault();
            var target = $(this).attr('href'),
                $target = $(target);
            if ($target.length) {
                $('.js-form-links').hide();
                $target.removeClass('hide');
                $('html, body').animate({ scrollTop: $target.offset().top - 50 }, 800);
            }
        });
    };
    if ($('.js-form-links').length) {
        showFormBlock();
    };

});
