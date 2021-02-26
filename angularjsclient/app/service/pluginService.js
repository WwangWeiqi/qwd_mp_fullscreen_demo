'use strict'

angular.module("plugin.Service", ['ngMaterial'])
    .factory('pluginService', function($mdToast) {

        return {
            toaster: function(type, content) {
                $mdToast.show({
                        template: `<md-toast class="md-toast ${type}">${content}</md-toast>`,
                        hideDelay: 3000,
                        position: 'top right'
                    })
                    .then(function() {})
                    .catch(function() {
                        console.log('Toast failed or was forced to close early by another toast.');
                    });
            }


        }
    });