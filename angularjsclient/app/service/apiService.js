'use strict'

angular.module("api.Service", ["plugin.Service"])
    .factory('apiService', function($http, pluginService) {
        var jwttoken_third_part = "";
        var http_request = function(method, http_url, body) {
            var data = method == "GET" ? "params" : "data";
            return $http({
                method: method,
                url: http_url,
                [data]: body,
                withCredentials: true,
                headers: { 'jwttoken_third_part': jwttoken_third_part }
            }).catch(err => {
                if (err.status == -1) {
                    pluginService.toaster("error", JSON.stringify(err))
                } else if (err.status == 404) {
                    pluginService.toaster("error", "请检查URI")
                } else {
                    pluginService.toaster("error", `未知错误,请稍后重试${JSON.stringify(err)}`)
                }
            })
        }

        return {
            set_header_token: function(token) {
                jwttoken_third_part = token
            },
            /**
             * 获取业务流程产生的数据
             * @returns 
             */
            get_business_flow_data: function(http_url) {
                return http_request("GET", http_url);
            }
        }
    });