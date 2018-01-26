var app = angular.module('app', ['breaker']);

app.config(['breakpointProvider', function (breakpointProvider) {

    breakpointProvider.throttle = 100;
    breakpointProvider.initBind = true;
}]);


app.directive('breakpointTest', [function () {

    return {
        scope: true,
        controller: ['$scope', 'breakpoint', function ($scope, breakpoint) {

            var self = this;

            // Register the breakpoint event for this scope
            //breakpoint.bind($scope);

            // Listen for breakpoint events
            $scope.$on('breakpoint', function (data, $event) {
                $scope.size = $event;
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
        '                Viewport width: {{ ctrl.size.width }}\n' +
        '            </div>\n' +
        '          </div>',
        controller: ['$scope', 'breakpoint', function ($scope, breakpoint) {

            var self = this;

            // Register the breakpoint event for this scope
            //breakpoint.bind($scope);

            // Listen for breakpoint events
            $scope.$on('breakpoint', function (data, $event) {
                self.size = $event;
            });

        }]
    };
}]);
