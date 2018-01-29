'use strict';

(function (window, angular) {

    // Data structure to hold the widths and scopes which are used in the broadcast.
    function BreakpointsCollection() {

        // Store the breakpoints and the scope on which to broadcast the event as the following data structure:
        // {
        //    <scope.$id>: {
        //      points: [breakpoint1, breakpoint2, ...],
        //      scope: <$scope>
        //    },
        //    ...
        // }
        var scopes = {};

        /**
         * Function used to sort numbers
         * @param a
         * @param b
         * @returns {number}
         */
        function sortNumber(a,b) {
            return a - b;
        }

        /*
         * Sorts an array of numbers and removes duplicates
         * @param arr
         * @returns {Array}
         */
        function sortUnique(arr) {

            var uniquesMap = {};
            var result = [];

            arr = arr.sort(sortNumber);

            for (var i = 0; i < arr.length; ++i) {
                if (!uniquesMap.hasOwnProperty(arr[i])) {
                    uniquesMap[arr[i]] = true;
                    result.push(arr[i]);
                }
            }

            return result;
        }

        /**
         * Adds breakpoints and scope to the data structure
         * @param points
         * @param scope
         */
        this.add = function(points, scope) {

            if (!angular.isArray(points)) {
                points = [points];
            }

            if (scope.$id in scopes) {
                sortUnique(scopes[scope.$id]["points"].concat(points))
            }
            else {
                scopes[scope.$id] = {
                    scope: scope,
                    points: sortUnique(points)
                }
            }
        };

        /**
         * Given two widths, find the width and scopes of the breakpoint event
         * @param currentWidth
         * @param previousWidth
         * @returns []
         */
        this.findBreakpoint = function(currentWidth, previousWidth) {

            var result = [];
            var i = 0;
            var scopeId;
            var points;

            if (currentWidth > previousWidth) { // increasing width

                for (scopeId in scopes) {
                    points = scopes[scopeId].points;

                    for (i = points.length-1; i >= 0; --i) {
                        if (previousWidth < points[i] && currentWidth >= points[i]) {
                            result.push([(points[i+1] || Infinity), scopes[scopeId].scope]);
                        }
                    }
                }
            }
            else if (currentWidth < previousWidth) { // decreasing width

                for (scopeId in scopes) {
                    points = scopes[scopeId].points;

                    for (i = 0; i < points.length; ++i) {
                        if (previousWidth >= points[i] && currentWidth < points[i]) {
                            result.push([points[i], scopes[scopeId].scope]);
                        }
                    }
                }
            }
            // else {} // currentWidth === previousWidth

            return result;
        };
    }

    /**
     * The breakpoint service object
     * @param $rootScope
     * @param $window
     * @param $interval
     * @returns {breakpointServiceObject}
     */
    function breakpointServiceObject($rootScope, $window, $interval) {

        var self = this;
        var bound = false;
        var timer = 0;
        var resized = false;
        var $w = angular.element($window);
        var breakpoints = new BreakpointsCollection();
        var previousWidth = $window.innerWidth;

        /**
         * Initializations
         */
        function init() {
            // Add breakpoints from configuration.
            if (self.initBreakpoints.length > 0) {
                self.addBreakpoints(self.initBreakpoints);
            }

            // If configured to do so, bind the resize event to $rootScope immediately
            if (self.initBind) {
                self.bindEvent();
            }
        }

        /**
         * Triggers a breakpoint event on a scope
         * @param scope The scope linked to the breakpoint
         * @param point The width of the breakpoint
         */
        function trigger (scope, point) {

            scope.$broadcast('breakpoint', {
                point: point
            });
        }

        /**
         * Add newly registered breakpoints to the list/map
         * @param points
         * @param scope
         */
        this.addBreakpoints = function(points, scope) {

            scope = scope || $rootScope;
            breakpoints.add(points, scope);
        };

        /**
         * Bind the resize event and start sending breakpoint events
         * @param points
         * @param scope The scope that the event is broadcast from
         */
        this.bindEvent = function (points, scope) {

            if (bound) {
                return;
            }

            scope = scope || $rootScope;
            previousWidth = $window.innerWidth;

            $w.on('resize', function (event) {

                if (!resized) {

                    timer = $interval(function () {

                        if (resized) {

                            resized = false;
                            $interval.cancel(timer);

                            var currentWidth = $window.innerWidth;
                            var bp = breakpoints.findBreakpoint(currentWidth, previousWidth);

                            console.log(previousWidth + " " + currentWidth);

                            for (var i = 0; i < bp.length; ++i) {
                                trigger(bp[i][1], bp[i][0]);
                            }

                            previousWidth = currentWidth;
                        }
                    }, self.debounce);
                }

                resized = true;
            });

            bound = true;
            $w.triggerHandler('resize');
        };

        /**
         * Unbind the window resize event
         */
        this.unbindEvent = function () {

            if (bound) {
                $w.off('resize');
                bound = false;
            }
        };

        //
        // Mutators and accessors
        //

        /**
         *
         * Get the debounce time
         * @returns int Debounce time in milliseconds
         */
        this.getDebounce = function () {

            return self.debounce;
        };

        /**
         * Set the debounce time, or minimum interval at which
         * consecutive resize events should be broadcast
         * @param time
         */
        this.setDebounce = function (time) {

            self.debounce = time
        };

        init();

        return this;
    }

    /**
     * The breakpoint provider
     */
    function breakpointProvider() {

        // Defaults
        this.debounce = 32;
        this.initBind = false;
        this.initBreakpoints = [];

        this.$get = ['$rootScope', '$window', '$interval', breakpointServiceObject];
    }

    angular.module('breaker', []).provider('breakpoint', breakpointProvider);

})(window, window.angular);
