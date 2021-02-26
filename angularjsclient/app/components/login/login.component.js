'use strict'


angular.module('login', ['api.Service', 'plugin.Service'])
    .component('login', {
        templateUrl: 'components/login/login.template.html',
        controller: ['$scope', '$location', 'apiService', 'pluginService',
            function LoginController($scope, $location, apiService, pluginService) {

                $scope.login = function() {

                    let http_url = $("input[name='http_url']").val();
                    let token = $("input[name='token']").val();
                    localStorage.setItem("http_url", http_url)
                    localStorage.setItem("token", token)
                    apiService.set_header_token(token)

                    apiService.get_business_flow_data(http_url)
                        .then(data => {
                            // $("#loader").hide()
                            console.log(data)
                            if (data.data.statusCode == 200) {
                                $location.path('/business_monitor');
                            } else {
                                pluginService.toaster("error", data.data.message)
                            }
                        })
                }
            }
        ]
    })

//http://127.0.0.1:5052/api/v0.1.0/auth/data/accessData/business_flow_tx_data
//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMzYyMjUwZTYtMDAzYi00YmZlLTk3ZDAtNmY2NGE2MWRmM2M4IiwiYnVzaW5lc3NfZmxvd19pZCI6ImYyODNhM2UwLTJmMWMtNGY4NC04MTFmLTcwOTYxMmRjYjhlMCIsInNpZ25lZEJ5IjoiMzYyMjUwZTYtMDAzYi00YmZlLTk3ZDAtNmY2NGE2MWRmM2M4IiwiaWF0IjoxNjE0MzE1NzcxODgyLCJleHAiOjE2NDU4NTE3NzE4ODB9.IqWUx-AFHnZ36-8yahrdxb_kpUIDHVz0sY2oFUyAI1g