/*!
 * 维护一个bwp的cookie，每进入一个页面，bwp加一，关闭页面bwp减一
 * 当关闭窗口bwp为0时触发bwpIsZero动作
 * 当进入页面bwp不为0时触发bwpIsNotZero动作
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var config = $.$cookie$ = function (options) {
        options = $.extend({}, config.defaults, options);

        setTimeout(function () {
            window.onbeforeunload = (function () {
                var bwp = parseInt($.isNumeric($.cookie(options.bwpKey)) ? $.cookie(options.bwpKey) : 0);
                $.cookie(options.bwpKey, bwp - 1, {path: "/"});
                if (bwp <= 1) {
                    $.removeCookie(options.bwpKey, {path: "/"});
                    options.bwpIsZero();
                }
            });
            var auth = {};
            auth.onload = function () {
                var bwp = parseInt($.isNumeric($.cookie(options.bwpKey)) ? $.cookie(options.bwpKey) : 0);
                $.cookie(options.bwpKey, bwp + 1, {path: "/"});
                options.bwpIsNotZero();
            };
            auth.onload();
        }, 500);
    };

    config.defaults = {
        bwpKey: '_bwp',
        bwpIsZero: function () {},
        bwpIsNotZero: function () {}
    };

}));
