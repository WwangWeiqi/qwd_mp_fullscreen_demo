'use strict';
var clickState = null;

//TODO: 右端：医保端加上 查看详情

// Register `medicare` component, along with its associated controller and template
angular.
module('medicare', ['api.Service', 'plugin.Service']).
component('medicare', {
    templateUrl: 'components/medicare/medicare.template.html',
    controller: ['$scope', '$location', '$timeout', 'apiService',
        function MedicareController($scope, $location, $timeout, apiService) {
            $scope.businessInfo = {
                app_name: "",
                business_flow_name: "",
                createdAt: "",
                updatedAt: "",
                createdby_user: ""
            };


            $scope.txInfo_list = [];
            $scope.user_profile = JSON.parse(localStorage.getItem("user_profile"))

            let uchain_url = localStorage.getItem("uchain_url");
            let dchain_url = localStorage.getItem("dchain_url");
            let token = localStorage.getItem("token");


            var refresh_BusinessInfo = function(result) {
                $scope.businessInfo.app_name = result.app_info.app_name;
                $scope.businessInfo.business_flow_name = result.business_flow_name;
                $scope.businessInfo.createdAt = result.createdAt;
                $scope.businessInfo.updatedAt = result.updatedAt;
                $scope.businessInfo.createdby_user = result.createdby_user.username
            }

            var refresh_TXInfo = function(result) {
                let ret_list = [];
                for (let i = 0; i < result.tx_info_list.length; i++) {
                    for (let j = 0; j < result.tx_info_list[i].txhash_list.length; j++) {
                        let unit_type = 0;

                        switch (result.tx_info_list[i].txhash_list[j].unit_type) {
                            case 1:
                                unit_type = "加密数据"
                                break;
                            case 3:
                                unit_type = "存证数据"
                                break;
                            default:
                                unit_type = result.tx_info_list[i].txhash_list[j].unit_type
                        }
                        let txInfo = {
                            blockchain_symbol: result.tx_info_list[i].blockchaininfo.blockchain_symbol,
                            from_user: result.tx_info_list[i].from_user.username,
                            to_user: result.tx_info_list[i].to_user.username,
                            txhash: result.tx_info_list[i].txhash_list[j].txhash,
                            unit_type: unit_type
                        }
                        ret_list.push(txInfo)
                    }

                }
                return ret_list;
            }

            var getBusinessUchainData = function() {
                apiService.get_business_flow_uchain_data(uchain_url, token).then(data => {
                    let result = data.data.data;
                    console.log(result)
                    refresh_BusinessInfo(result)
                    $scope.txInfo_list = refresh_TXInfo(result).reverse()
                    console.log("txinfo", $scope.txInfo_list)

                    setTimeout(() => {
                        getBusinessUchainData()
                    }, 10000);
                }).catch(err => {
                    setTimeout(() => {
                        getBusinessUchainData()
                    }, 10000);
                })
            }
            getBusinessUchainData()

            // var getBusinessDchainData = function() {
            //     apiService.get_business_flow_dchain_data(dchain_url).then(data => {
            //         console.log(data)
            //         setTimeout(() => {
            //             getBusinessDchainData()
            //         }, 10000);
            //     }).catch(err => {
            //         setTimeout(() => {
            //             getBusinessDchainData()
            //         }, 10000);
            //     })
            // }

            var map = L.map('cityChart');
            var baseLayers = {
                "高德地图": L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
                    subdomains: "1234"
                }),
                '高德影像': L.layerGroup([L.tileLayer('http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
                    subdomains: "1234"
                }), L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}', {
                    subdomains: "1234"
                })]),
                "立体地图": L.tileLayer('https://a.tiles.mapbox.com/v3/examples.c7d2024a/{z}/{x}/{y}.png', {
                    attribution: 'Map &copy; Pacific Rim Coordination Center (PRCC).  Certain data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    key: 'BC9A493B41014CAABB98F0471D759707',
                    styleId: 22677
                }),
                "Foursquare": L.tileLayer('https://a.tiles.mapbox.com/v3/foursquare.map-0y1jh28j/{z}/{x}/{y}.png', {
                    attribution: 'Map &copy; Pacific Rim Coordination Center (PRCC).  Certain data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                    key: 'BC9A493B41014CAABB98F0471D759707',
                    styleId: 22677
                }),
                'GeoQ灰色底图': L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}').addTo(map)
            };
            L.tileLayer('https://a.tiles.mapbox.com/v3/foursquare.map-0y1jh28j/{z}/{x}/{y}.png', {
                attribution: 'Map &copy; Pacific Rim Coordination Center (PRCC).  Certain data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                key: 'BC9A493B41014CAABB98F0471D759707',
                styleId: 22677
            });

            var layercontrol = L.control.layers(baseLayers, {}, {
                position: "topleft"
            }).addTo(map);

            map.setView(L.latLng(32.4354, 105.8434), 5);
            var overlay = new L.echartsLayer3(map, echarts);
            var chartsContainer = overlay.getEchartsContainer();
            var myChart = overlay.initECharts(chartsContainer);

            function formatDate(date) {
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                // var ampm = hours >= 12 ? 'pm' : 'am';
                // hours = hours % 12;
                // hours = hours ? hours : 12; // the hour '0' should be '12'
                // minutes = minutes < 10 ? '0'+minutes : minutes;
                var strTime = hours + '时' + minutes + '分' + seconds + '秒';
                return date.getFullYear() + '年' + (date.getMonth() + 1) + "月" + date.getDate() + "日 " + strTime;
            }
            //大金额(千位符)格式化处理
            function tranNumber(num, point) {
                //return num
                //将数字转换为字符串
                let numStr = num.toString()
                if (numStr.length < 7) { // 判断数字有多长,如果小于6,,表示10万以内的数字,让其直接显示
                    return '¥' + numStr + '.00';
                } else if (numStr.length >= 7 && numStr.length <= 8) { // 如果数字大于6位,小于8位,让其数字后面加单位万
                    let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
                        // 由千位,百位组成的一个数字
                    return '¥' + parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
                } else if (numStr.length > 8) { // 如果数字大于8位,让其数字后面加单位亿
                    let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
                    return '¥' + parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
                }
            }


            $scope.$on("$destroy", function() {
                console.log('fullscreen destroy, clear interval')
                clearInterval(retrieveInterval);
                apiService.fork_request(false);
            });

            /********** 窗口大小改变时，重置报表大小 ********************/
            window.onresize = function() {
                if (cityChart && cityChart.resize) {
                    cityChart.resize();
                }
            };

        }
    ]
});