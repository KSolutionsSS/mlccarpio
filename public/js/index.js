/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/03/14, at 13:34.
 */

var SERVICES_GOOGLE_SPREADSHEET_KEY = '167G-zhvVs6y1cZ09Q478G81zZDfGB3Z7EpvljaWY4ew';
var SERVICES_GOOGLE_SPREADSHEET_URL = 'https://spreadsheets.google.com/feeds/cells/' + SERVICES_GOOGLE_SPREADSHEET_KEY + '/0/public/basic?alt=json';
var EMPTY_CELL_INDICATOR = '-';

var views = {};
views.home = (function () {

    var $viewContainer = $('#home');

    var initSlider = function () {

        /**
         * You can remove responsive code if you don't want the slider scales while window resizes
         * @param $sliderContainer
         */
        var makeItResponsive = function ($sliderContainer) {
            function ScaleSlider() {
                var parentWidth = $sliderContainer.parent().width();
                if (parentWidth) {
                    slider.$SetScaleWidth(parentWidth);
                } else {
                    window.setTimeout(ScaleSlider, 30);
                }
            }

            //  Scale slider after document ready
            ScaleSlider();
            if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
                //  Capture window resize event
                $(window).bind('resize', ScaleSlider);
            }
        };

        var options = {
            $AutoPlay: true,                        //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
            $AutoPlayInterval: 3000,                //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000

            $SlideDuration: 800,                    //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500

            $NavigatorOptions: {                                //[Optional] Options to specify and enable navigator or not
                $Class: $JssorNavigator$,                       //[Required] Class to create navigator instance
                $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                $Lanes: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
                $SpacingX: 2,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
                $SpacingY: 10                                    //[Optional] Vertical space between each item in pixel, default value is 0
            },

            $DirectionNavigatorOptions: {           //[Optional] Options to specify and enable direction navigator or not
                $Class: $JssorDirectionNavigator$,  //[Requried] Class to create direction navigator instance
                $ChanceToShow: 2,                   //[Required] 0 Never, 1 Mouse Over, 2 Always
                $AutoCenter: 2,                     //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                $Steps: 1                           //[Optional] Steps to go for each navigation request, default value is 1
            }
        };

        var $sliderContainer = $('#sliderContainer');
        var slider = new $JssorSlider$($sliderContainer.attr('id'), options);
        makeItResponsive($sliderContainer);

        /**
         * Fix styles that the framework is not taking into account in the STYLE attribute in markup.
         */
        (function () {
            $viewContainer.find('span[u="arrowleft"]').css('top', '183px');
            $viewContainer.find('span[u="arrowright"]').css('top', '183px');
        }());
    };

    return {
        init: function () {
            initSlider();
        }
    };
}());

views.services = (function () {

    var loadServices = function () {
        var parseColumnsFromRows = function (services) {
            var columns = {};

            for (var eachAttribute in services[0]) {
                if (services[0].hasOwnProperty(eachAttribute)) {
                    columns[eachAttribute] = [services[0][eachAttribute]];
                }
            }

            for (var i = 1; i < services.length; i++) {
                var eachService = services[i];

                for (eachAttribute in eachService) {
                    if (eachService.hasOwnProperty(eachAttribute)) {
                        if (eachService[eachAttribute] !== EMPTY_CELL_INDICATOR) {
                            columns[eachAttribute].push(eachService[eachAttribute]);
                        }
                    }
                }
            }

            return columns;
        };

        var renderServices = function ($container, services) {
            $container.empty();

            var columns = [];
            for (var eachColumn in services) {
                if (services.hasOwnProperty(eachColumn)) {
                    columns.push({
                                     label: eachColumn,
                                     services: (function () {
                                         var arr = [];
                                         for (var i = 0; i < services[eachColumn].length; i++) {
                                             arr.push({value: services[eachColumn][i]});
                                         }
                                         return arr;
                                     }())

                                 });
                }
            }

            $container.append($.render.servicesTab({columns: columns}));
        };

        googleDocsSimpleParser.parseSpreadsheetCellsUrl({
                                                            url: SERVICES_GOOGLE_SPREADSHEET_URL,
                                                            done: function (services) {
                                                                renderServices($('#services').find('.my-content'), parseColumnsFromRows(services));
                                                            },
                                                            fail: function (jqXHR, textStatus, errorThrown) {
                                                                console.log('An error occurred while getting services from Google Spreadsheet:'
                                                                                + textStatus);
                                                            }
                                                        });
    };

    return {
        init: function () {
            loadServices();
        }
    };
}());

$(document).ready(function () {
    var setUpJSRenderTemplates = function () {
        $.templates({
                        servicesTab: {
                            markup: '#servicesTabTemplate'
                        },
                        serviceColumnTemplate: {
                            markup: '#serviceColumnTemplate'
                        }
                    });
    };

    console.log('JQuery configured successfully.');

    setUpJSRenderTemplates();
    console.log('JSRender templates configured successfully.');

    views.home.init();
    views.services.init();
});