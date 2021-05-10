'use strict'


angular.module("api.Service", ["plugin.Service"])
    .factory('apiService', function ($http, pluginService) {
        var http_request = function (method, http_url, token, body) {
            var data = method == "GET" ? "params" : "data";
            return $http({
                method: method,
                url: http_url,
                [data]: body,
                // withCredentials: true, //允许本地接收server发来的cookie
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

        // const host = '127.0.0.0:5052'
        // const remote_host = '39.99.241.232:5052'
        // const moac = 'http://127.0.0.1:3011'
        const moac = "http://47.92.94.8:8080/moac"
        // const host = 'http://127.0.0.1:5052'
        const server = 'http://127.0.0.1:3006'
        const host = 'http://47.98.199.133:5052'


        return {
            /**
             * 获取用户信息
             * @returns 
             */
            login: function (token) {
                return http_request("POST", host + "/api/v0.1.0/auth/data/account/login", token);
            },
            /**
             * 获取业务流程产生的上链数据
             * @returns 
             */
            get_business_flow_uchain_data: function (token) {
                const http_url = host + '/api/v0.1.0/auth/data/accessData/business_flow_tx_data'
                return http_request("GEt", http_url, token);
            },
            /**
             * 获取业务流程对用户产生的下链数据
             * @returns 
             */
            get_business_flow_dchain_data: function (trace_id, token) {
                const query_val = trace_id ? '?trace_id=' + trace_id : ''
                const http_url = host + '/api/v0.1.0/auth/data/business_flow/execute_business_flow' + query_val

                console.log('http_url================>>>', http_url);

                return http_request("POST", http_url, token);
            },
            /**
             * 获取moheng区块链高度
             */
            get_moheng_blocknumber: function () {
                return http_request("GET", "http://47.92.94.8:8080/moheng/mp/getblockNumber");
            },
            /**
             * 获取moheng某一区间内的多个区块信息
             */
            get_moheng_blocklist: function (query) {
                return http_request("GET", "http://47.92.94.8:8080/moheng/mp/getBlockList", "", query);
            },
            /**
             * 获取moac区块链高度
             */
            get_moac_blocknumber: function () {
                return http_request("GET", moac + "/mp/getblockNumber");
            },
            /**
             * 获取moac某一区间内的多个区块信息
             */
            get_moac_blocklist: function (query) {
                return http_request("GET", moac + "/mp/getBlockList", "", query);
            },

            //--------------------------------------------------------------------------------       
            /**
             * 获取server数据
             */
            get_dchain_data: function (query) {
                return http_request("GET", server + "/auth/dchain_data", "", query);
            },
            /**
             * 写入server数据
             */
            post_dchain_data: function (data) {
                return http_request("POST", server + "/auth/dchain_data", "", data);
            },
        }
    });