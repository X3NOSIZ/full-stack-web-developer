(function () {
    'use strict';

    angular
        .module('app', [
            'ngAnimate',
            'ngMessages',
            'ngMaterial',
            'ngFileUpload',
            'ngMdIcons',

            'ui.router',
            'angularMoment',
            'firebase',

            'app.core',
            'app.components'
        ]);
})();
