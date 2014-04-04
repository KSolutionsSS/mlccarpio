/**
 * Created by Nahuel Barrios <barrios.nahuel@gmail.com>.
 * Created on 12/03/14, at 13:34.
 */

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

$(document).ready(function () {
    console.log('JQuery configured successfully.');

    views.home.init();
});