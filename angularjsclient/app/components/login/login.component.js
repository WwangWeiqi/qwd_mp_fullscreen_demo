'use strict'
var uchain_value
var dchain_value

angular.module('login', ['api.Service', 'plugin.Service'])
    .component('login', {
        templateUrl: 'components/login/login.template.html',
        controller: ['$scope', '$location', 'apiService', 'pluginService',
            function LoginController ($scope, $location, apiService, pluginService) {

                $scope.uchainChange = function (value) {
                    uchain_value = value
                }

                $scope.dchainChange = function (value) {
                    dchain_value = value
                }

                $scope.login = function () {
                    let token = $("input[name='token']").val();
                    localStorage.setItem("token", token)

                    Promise.all([apiService.login(token),
                    apiService.get_business_flow_uchain_data(token),
                    apiService.get_business_flow_dchain_data(token)
                    ]).then(data => {
                        console.log("----->>>", data)
                        if (data[0].data.statusCode == 200 && data[1].data.statusCode == 200 && data[2].data.statusCode == 200) {
                            localStorage.setItem("user_profile", JSON.stringify(data[0].data.data))
                            $location.path('/business_monitor');
                            $scope.$apply()
                        } else {
                            pluginService.toaster("error", "err")
                        }
                    })
                }
            }
        ]
    })

