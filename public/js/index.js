/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/03/14, at 13:34.
 */

var SERVICES_GOOGLE_SPREADSHEET_KEY = '167G-zhvVs6y1cZ09Q478G81zZDfGB3Z7EpvljaWY4ew';
var SERVICES_GOOGLE_SPREADSHEET_URL = 'https://spreadsheets.google.com/feeds/cells/' + SERVICES_GOOGLE_SPREADSHEET_KEY + '/0/public/basic?alt=json';
var EMPTY_CELL_INDICATOR = '-';

var views = {};
views.home = (function () {

    var initSlider = function () {
        var makeItResponsive = function (sliderContainer) {
            //  Responsive code begin
            //  You can remove responsive code if you don't want the slider scales while window resizes
            function ScaleSlider() {
                var parentWidth = sliderContainer.parent().width();
                if (parentWidth) {
                    slider.$SetScaleWidth(parentWidth);
                } else {
                    window.setTimeout(ScaleSlider, 30);
                }
            }

            //  Scale slider after document ready
            ScaleSlider();
            if (!navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
                //Capture window resize event
                $(window).bind('resize', ScaleSlider);
            }
            //  Responsive code end
        };

        //  Define an array of slideshow transition code
        var _SlideshowTransitions = [
            //  Fade
            {
                $Duration: 500,
                $Opacity: 2
            }
        ];

        //  Setup options for JssorSlider initialization.
        var options = {
            $AutoPlay: true,
            $SlideshowOptions: {
                $Class: $JssorSlideshowRunner$,
                $Transitions: _SlideshowTransitions,
                $TransitionsOrder: 1,
                $ShowLink: true
            },

            $DragOrientation: 1//[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
        };

        var sliderContainerId = 'sliderContainer';
        var slider = new $JssorSlider$(sliderContainerId, options);

        makeItResponsive($('#' + sliderContainerId));
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