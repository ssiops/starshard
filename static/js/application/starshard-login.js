function loginCtrl ($scope, $http, $window, $alertService) {
  $scope.submit = function () {
    if ($scope.form.username.length < 1 || $scope.form.password.length < 6) return;
    $http.post('/login', $scope.form).success(function (data, status) {
      if (status == 204)
        return $window.location.href = '/';
      else {
        if (data.err) $alertService.send(data.err);
        if (data.redirect) window.location.href = '/' + data.redirect + '/';
      }
    });
  }
}
