'use strict'

angular.module("api.Service", ["plugin.Service"])
    .factory('apiService', function($http, pluginService) {
        var http_request = function(method, http_url, token, body) {
            var data = method == "GET" ? "params" : "data";
            return $http({
                method: method,
                url: http_url,
                [data]: body,
                withCredentials: true,
                headers: { 'jwttoken_third_part': token }
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
            /**
             * 获取用户信息
             * @returns 
             */
            login: function(token) {
                return http_request("POST", "http://127.0.0.1:5052/api/v0.1.0/auth/data/account/login", token);
            },
            /**
             * 获取业务流程产生的上链数据
             * @returns 
             */
            get_business_flow_uchain_data: function(http_url, token) {
                return http_request("GET", http_url, token);
            },
            /**
             * 获取业务流程对用户产生的下链数据
             * @returns 
             */
            get_business_flow_dchain_data: function(http_url, token) {
                return http_request("POST", http_url, token);
            }
        }
    });