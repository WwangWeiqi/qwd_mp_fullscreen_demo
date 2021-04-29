'use strict';

angular
    .module('home', ['api.Service', 'plugin.Service'])
    .component('home', {
        templateUrl: 'components/home/home.template.html', 
        controller: ['$scope', '$location',  'apiService', 'pluginService', function ($scope, $location) {

            $scope.go = function() {
                // 跳转到大屏页面
                $location.path('/business_monitor')
            }
        }]
    });
