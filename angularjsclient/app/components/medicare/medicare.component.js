'use strict';
var clickState = null;

//TODO: 右端：医保端加上 查看详情

// Register `medicare` component, along with its associated controller and template
angular.
    module('medicare', ['api.Service', 'plugin.Service']).
    component('medicare', {
        templateUrl: 'components/medicare/medicare.template.html',
        controller: ['$scope', '$location', '$timeout', 'apiService',
            function MedicareController ($scope, $location, $timeout, apiService) {
                $scope.businessInfo = {
                    app_name: "",
                    business_flow_name: "",
                    createdAt: "",
                    updatedAt: "",
                    createdby_user: ""
                };


                $scope.txInfo_list = [];
                $scope.blockList = [];
                $scope.dchainInfo_list = [];
                $scope.user_profile = JSON.parse(localStorage.getItem("user_profile"))

                let token = localStorage.getItem("token");


                var refresh_BusinessUchainData = function (result) {
                    $scope.businessInfo.app_name = result.app_info.app_name;
                    $scope.businessInfo.business_flow_name = result.business_flow_name;
                    $scope.businessInfo.createdAt = result.createdAt;
                    $scope.businessInfo.updatedAt = result.updatedAt;
                    $scope.businessInfo.createdby_user = result.createdby_user.username
                }

                var refresh_TXInfo = function (result) {
                    let ret_list = [];

                    // console.log('UchainData====>>>', result.tx_info_list);


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
                                unit_type: unit_type,
                                createdAt: result.tx_info_list[i].txhash_list[j].createdAt,
                                unit_name: result.tx_info_list[i].txhash_list[j].unit_name
                            }
                            ret_list.push(txInfo)
                        }

                    }
                    return ret_list;
                }

                var getBusinessUchainData = function () {
                    apiService.get_business_flow_uchain_data(token).then(data => {
                        let result = data.data.data;
                        refresh_BusinessUchainData(result)
                        $scope.txInfo_list = refresh_TXInfo(result)
                    }).catch(err => {
                        console.log(err)
                    })
                }

                var refresh_UserDchainData = function (result) {
                    let ret_list = [];

                    // console.log('DchainData====>>>', result.business_unit_info);

                    for (let i in result.business_unit_info) {
                        const unit_info = result.business_unit_info[i]
                        if (unit_info.info.unit_type === 2) {
                            for (let p in unit_info.content) {
                                for (let m in unit_info.content[p].data) {
                                    const data = unit_info.content[p].data[m].data

                                    for (let b in data) {

                                        switch (data[b].unit_type) {
                                            case 1:
                                                data[b].unit_type = "加密数据"
                                                break;
                                            case 3:
                                                data[b].unit_type = "存证数据"
                                                break;
                                            default:
                                                data[b].unit_type = data[b].unit_type
                                        }

                                        data[b].blockchain_symbol = unit_info.info.blockchain_symbol
                                        data[b].unit_name = unit_info.info.unit_name
                                        ret_list.push(data[b])
                                    }
                                }
                            }
                        }

                    }
                    return ret_list
                }
                var refresh_TraceIdData = function (result) {
                    let trace_id_map = {};
                    let trace_id_list = [];

                    for (let i in result.business_unit_info) {
                        const unit_info = result.business_unit_info[i]
                        if (unit_info.info.unit_type === 2) {
                            for (let p in unit_info.content) {
                                for (let m in unit_info.content[p].data) {
                                    const data = unit_info.content[p].data[m].data
                                    for (let b in data) {
                                        const trace_id = JSON.parse(data[b].data).trace_id
                                        trace_id_map[trace_id] = trace_id
                                    }
                                }
                            }
                        }
                    }

                    for (let i in trace_id_map) {
                        trace_id_list.push(trace_id_map[i])
                    }
                    return trace_id_list
                }
                var getBusinessDchainData = function () {
                    let trace_id = $('#SraceId').val();
                    apiService.get_business_flow_dchain_data(trace_id, token).then(data => {
                        let result = data.data.data;
                        $scope.dchainInfo_list = refresh_UserDchainData(result)
                        if (trace_id === '') {
                            $scope.trace_id_list = refresh_TraceIdData(result)
                        }
                        //console.log($scope.trace_id_list)
                    }).catch(err => {
                        console.log(err)
                    })
                }
                // moheng
                var getMohengBlocklist = function () {
                    apiService.get_moheng_blocknumber().then(data => {

                        let latest = data.data.data;
                        apiService.get_moheng_blocklist({ start: latest - 10, end: latest }).then(result => {
                            for (let i = 0; i < result.data.data.blockList.length; i++) {
                                result.data.data.blockList[i].number = parseInt(result.data.data.blockList[i].number, 16)
                                result.data.data.blockList[i].timestamp = parseInt(result.data.data.blockList[i].timestamp, 16) * 1000
                            }
                            $scope.blockList = result.data.data.blockList.reverse();
                        })

                    }).catch(err => {
                        console.log(err)
                    })
                }
                // moac
                var getMoacBlocklist = function () {
                    apiService.get_moac_blocknumber().then(data => {
                        let latest = data.data.data;
                        apiService.get_moac_blocklist({ start: latest - 10, end: latest }).then(result => {
                            //console.log('MoacBlocklist====>>>', result.data.data);
                            for (let i = 0; i < result.data.data.length; i++) {
                                result.data.data[i].timestamp = result.data.data[i].timestamp * 1000
                            }
                            $scope.blockList = result.data.data.reverse();
                        })
                    }).catch(err => {
                        console.log(err)
                    })
                }

                getBusinessUchainData()
                //getMohengBlocklist()
                getMoacBlocklist()
                getBusinessDchainData()

                // 监听trace_id Input
                $scope.$watch('selectedSraceId', function (newValue, oldValue) {
                    apiService.get_business_flow_dchain_data(newValue, token).then(data => {
                        let result = data.data.data;
                        $scope.dchainInfo_list = refresh_UserDchainData(result)
                    }).catch(err => {
                        console.log(err)
                    })
                })

                var refresh_interval = setInterval(() => {
                    getBusinessUchainData()
                    //getMohengBlocklist()
                    getMoacBlocklist()
                    getBusinessDchainData()
                }, 10000);


                function formatDate (date) {
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
                function tranNumber (num, point) {
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

                $scope.$on("$destroy", function () {
                    console.log('fullscreen destroy, clear interval')
                    clearInterval(refresh_interval);
                });

                /********** 窗口大小改变时，重置报表大小 ********************/
                window.onresize = function () {
                    if (cityChart && cityChart.resize) {
                        cityChart.resize();
                    }
                };

            }
        ]
    });