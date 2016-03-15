(function () {
    'use strict';

    angular
        .module('app')
        .constant('_', _)
        .constant('$', jQuery)
        .constant('moment', moment)
        .constant('firebase', Firebase)
        .constant('firebaseUrl', 'https://catalog-app.firebaseio.com/');
})();
