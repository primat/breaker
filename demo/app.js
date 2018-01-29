var app = angular.module('app', ['breaker']);

app.config(['breakpointProvider', function (breakpointProvider) {

    breakpointProvider.debounce = 100;
    breakpointProvider.initBind = true;
    //breakpointProvider.initBreakpoints = [500, 800, 1000];
}]);


app.directive('breakpointTest', [function () {

    return {
        scope: true,
        controller: ['$scope', 'breakpoint', function ($scope, breakpoint) {

            var self = this;

            // Register the breakpoint event for this scope
            breakpoint.addBreakpoints([500, 800, 1000], $scope);

            // Listen for breakpoint events
            $scope.$on('breakpoint', function (data, $event) {
                $scope.point = $event.point;
            });

        }]
    };
}]);


app.directive('breakpointTest2', [function () {

    return {
        scope: {},
        restrict: 'A',
        controllerAs: 'ctrl',
        bindToController: true,
        template: '<div>\n' +
        '            <div>\n' +
        '                Viewport width: {{ point }}\n' +
        '            </div>\n' +
        '          </div>',
        controller: ['$scope', 'breakpoint', function ($scope, breakpoint) {

            var self = this;

            // Register the breakpoint event for this scope
            breakpoint.addBreakpoints([600, 700, 900], $scope);


            // Listen for breakpoint events
            $scope.$on('breakpoint', function (data, $event) {
                $scope.point = $event.point;
            });

        }]
    };
}]);
