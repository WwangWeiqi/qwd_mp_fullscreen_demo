'use strict'
var uchain_value
var dchain_value

angular.module('login', ['api.Service', 'plugin.Service'])
    .component('login', {
        templateUrl: 'components/login/login.template.html',
        controller: ['$scope', '$location', 'apiService', 'pluginService',
            function LoginController($scope, $location, apiService, pluginService) {

                $scope.uchainChange = function(value) {
                    uchain_value = value
                }

                $scope.dchainChange = function(value) {
                    dchain_value = value
                }

                $scope.login = function() {

                    // let uchain_url = $("input[name='uchain_url']").val();
                    // let dchain_url = $("input[name='dchain_url']").val();
                    let token = $("input[name='token']").val();
                    localStorage.setItem("uchain_url", uchain_value)
                    localStorage.setItem("dchain_url", dchain_value)
                    localStorage.setItem("token", token)

                    Promise.all([apiService.login(token),
                        apiService.get_business_flow_uchain_data(uchain_value, token),
                        apiService.get_business_flow_dchain_data(dchain_value, token)
                    ]).then(data => {
                        console.log(data)
                        if (data[0].data.statusCode == 200 && data[1].data.statusCode == 200 && data[2].data.statusCode == 200) {
                            localStorage.setItem("user_profile", JSON.stringify(data[0].data.data))
                            $location.path('/business_monitor');
                        } else {
                            pluginService.toaster("error", "err")
                        }
                    })
                }
            }
        ]
    })

//http://127.0.0.1:5052/api/v0.1.0/auth/data/accessData/business_flow_tx_data
//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMzYyMjUwZTYtMDAzYi00YmZlLTk3ZDAtNmY2NGE2MWRmM2M4IiwiYnVzaW5lc3NfZmxvd19pZCI6ImYyODNhM2UwLTJmMWMtNGY4NC04MTFmLTcwOTYxMmRjYjhlMCIsInNpZ25lZEJ5IjoiMzYyMjUwZTYtMDAzYi00YmZlLTk3ZDAtNmY2NGE2MWRmM2M4IiwiaWF0IjoxNjE0MzE1NzcxODgyLCJleHAiOjE2NDU4NTE3NzE4ODB9.IqWUx-AFHnZ36-8yahrdxb_kpUIDHVz0sY2oFUyAI1g