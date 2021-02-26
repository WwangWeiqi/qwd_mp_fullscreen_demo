'use strict';

angular.
module('cityParkingApp').
config(['$routeProvider',
        function config($routeProvider) {
            $routeProvider.
            when('/', {
                template: '<login></login>'
            }).
            when('/business_monitor', {
                template: '<medicare></medicare>'
            });

        }
    ])
    // .controller("HomeController", function ($scope, $location) {
    //   $scope.ToFullscreen = function () {
    //     $location.path("/fullscreen");
    //   }
    // })
;