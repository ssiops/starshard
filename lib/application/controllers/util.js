function FloatMsgCtrl ($scope) {
  $scope.show = false;
  $scope.style = 'warning';
  $scope.$on('alertEvent', function (e, opt) {
    for (var prop in opt)
      $scope[prop] = opt[prop];
  });
}
floatMsgCtrl.$inject = ['$scope'];

function NavCtrl($scope, $route, $http) {
  $scope.isCollapsed = true;
  $scope.$route = $route;
  $scope.nav = {};
}
NavCtrl.$inject = ['$scope', '$route', '$http'];

function ProgressCtrl($scope, ngProgress) {
  ngProgress.color('#00c2ff');
  $scope.$on('$routeChangeStart', function (e) {
    ngProgress.reset();
    ngProgress.start();
  });
  $scope.$on('$routeChangeSuccess', function (e) {
    ngProgress.complete();
  });
  $scope.$on('$routeChangeError', function (e) {
    ngProgress.reset();
  });
}
ProgressCtrl.$inject = ['$scope', 'ngProgress'];