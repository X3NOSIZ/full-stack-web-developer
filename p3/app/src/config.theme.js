(function () {
    'use strict';

    angular
        .module('app')
        .config(themeConfig);

    themeConfig.$inject = [
        '$mdThemingProvider'
    ];

    function themeConfig($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .warnPalette('red')
            .accentPalette('yellow');
    }
})();