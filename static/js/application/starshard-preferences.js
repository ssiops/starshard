angular.module('app', ['angularFileUpload', 'ui.bootstrap']).
  factory('$alertService', ['$rootScope', function ($rootScope) {
    return alertService($rootScope);
  }]);

function preferenceCtrl ($scope, $http, $window, $alertService, $fileUploader) {
  $scope.changePassword = function () {
    if ($scope.password.password.length < 6 || $scope.password.password.length > 20)
      return;
    if ($scope.password.password != $scope.password_r)
      return $alertService.send('Your passwords don\'t match.');
    $http.put('/preferences/password', $scope.password).success(function (data, status) {
      if (data.err)
        if (data.msg)
          $alertService.send({msg: data.msg, style: 'danger'});
        else
          $alertService.send({msg: 'An error ocurred. Please try again later.', style: 'danger'});
      else
        $alertService.send({msg: data.msg, style: 'success'});
    });
  }
  $scope.checkEmail = function () {
    $scope.enableDelete = $scope.email.search(/[a-zA-z0-9]+@[a-zA-z0-9]+\.[a-zA-z]+/) >= 0;
  }
  $scope.deleteAccount = function () {
    $http.delete('/preferences/account', {params: {email: $scope.email}}).success(function (data, status) {
      if (data.err)
        if (data.msg)
          $alertService.send({msg: data.msg, style: 'danger'});
        else
          $alertService.send({msg: 'An error ocurred. Please try again later.', style: 'danger'});
      else {
        $alertService.send({msg: data.msg, style: 'success'});
        setTimeout(function () { window.location.href = '/'; }, 3000);
      }
    });
  }
  $scope.uploader = $fileUploader.create({
    scope: $scope,
    url: '/usercontent/profile',
    autoUpload: true
  });

  $scope.uploader.progress = 0;

  $scope.uploader.bind('success', function (event, xhr, item, response) {
    $alertService.send({msg: 'Your profile image has been updated.', style: 'success'});
  });
}
