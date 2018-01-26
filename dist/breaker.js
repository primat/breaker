'use strict';

(function (window, angular) {

    /**
     * The breakpoint service object
     * @param $rootScope
     * @param $window
     * @param $interval
     * @returns {breakpointServiceObject}
     */
    function breakpointServiceObject($rootScope, $window, $interval) {

        var breaker = this;
        var bound = false;
        var timer = 0;
        var resized = false;
        var $w = angular.element($window);

        /**
         *
         * @param time
         */
        this.setThrottle = function (time) {
            breaker.throttle = time
        };

        /**
         *
         * @returns {*}
         */
        this.getThrottle = function () {
            return breaker.throttle;
        };

        /**
         *
         * @param $scope
         */
        this.trigger = function ($scope) {
            $scope = $scope || $rootScope;

            $scope.$broadcast('breakpoint', {
                width: $window.innerWidth,
                height: $window.innerHeight
            });
        };

        /**
         *
         */
        this.bind = function () {

            if (!bound) {

                $w.on('resize', function (event) {

                    if (!resized) {
                        timer = $interval(function () {
                            if (resized) {
                                resized = false;
                                $interval.cancel(timer);
                                breaker.trigger();
                            }
                        }, breaker.throttle);
                    }

                    resized = true;

                });

                bound = true;

                $w.triggerHandler('resize');

            }

        };

        // Unbind window resize event
        this.unbind = function () {
            if (bound) {
                $w.off('resize');
                bound = false;
            }
        };

        // bind to window resize event when service created
        if (breaker.initBind) {
            breaker.bind();
        }

        return this;
    }

    /**
     * The breakpoint provider
     */
    function breakpointProvider() {

        // Defaults
        this.throttle = 32;
        this.initBind = 1;

        this.$get = ['$rootScope', '$window', '$interval', breakpointServiceObject];

    }

    angular.module('breaker', [])
        .provider('breakpoint', breakpointProvider);

})(window, window.angular);
