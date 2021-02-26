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
                $("#loader").hide()
                if (!fork) {
                    if (err.status == -1) {
                        pluginService.toaster("error", `服务器连接失败，请检查网络状态`)
                    } else {
                        pluginService.toaster("error", `未知错误,请稍后重试${JSON.stringify(err)}`)
                    }
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