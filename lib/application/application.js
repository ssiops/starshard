/* jshint -W097 */
'use strict';

var __routeConfig__ = function ($routeProvider, $http) {
  $routeProvider
    .when('/', {
      templateUrl: '/views/index.html',
      controller: 'MainCtrl',
      nav: 'index'
    })
    .otherwise({
      templateUrl: '/views/404.html'
    });
  // TODO: get routes from server
  //
  //
};

__routeConfig__.$inject = ['$routeProvider', '$http'];

angular
  .module('starshard', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ngProgress',
    'angularFileUpload',
    'hc.marked'
  ])
  .config(__routeConfig__)
  .factory('$alertService', ['$rootScope', function ($rootScope) {
    return {
      show: function () {
        return $rootScope.$broadcast('alertEvent', {show: true});
      },
      hide: function () {
        return $rootScope.$broadcast('alertEvent', {show: false});
      },
      send: function (opt) {
        if (typeof opt === 'string')
          return $rootScope.$broadcast('alertEvent', {show: true, msg: opt});
        else {
          var e = {show: true, style: 'warning'};
          if (typeof opt.style !== undefined)
            e.style = opt.style;
          if (typeof opt.msg === 'undefined')
            return;
          e.msg = opt.msg;
          return $rootScope.$broadcast('alertEvent', e);
        }
      }
    };
  }]);
