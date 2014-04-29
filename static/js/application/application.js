var alertService = function ($rootScope) {
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
  }
}

angular.module('app', ['ui.bootstrap']).
  factory('$alertService', ['$rootScope', function ($rootScope) {
    return alertService($rootScope);
  }]);

function floatMsgCtrl ($scope) {
  $scope.show = false;
  $scope.style = 'warning';
  $scope.$on('alertEvent', function (e, opt) {
    for (var prop in opt)
      $scope[prop] = opt[prop];
  });
}

function NavCollapseCtrl($scope) {
  $scope.isCollapsed = true;
}