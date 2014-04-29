function registerCtrl ($scope, $http, $window, $alertService) {
  $scope.submit = function () {
    if ($scope.form.username.length < 2 || $scope.form.username.length > 16 || $scope.form.username.search(/^[a-zA-Z0-9\-\_\.]{2,16}$/) < 0 || $scope.form.password.length < 6 || $scope.form.password.length > 20 || $scope.form.email.length < 1 || $scope.form.email.search(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+/) < 0)
      return;
    if ($scope.form.password != $scope.password_r)
      return $alertService.send('Your passwords don\'t match.');
    $http.put('/register', $scope.form).success(function (data, status) {
      if (status == 201)
        $window.location.href = '/';
      else
        $alertService.send(data.msg);
    });
  }
}
