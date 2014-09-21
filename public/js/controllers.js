'use strict';

/* Controllers */

angular.module('nobotApp.controllers', []).
  controller('NewCtrl', function ($scope, $resource, $analytics) {
    $scope.submit = function (isValid) {
      if (!isValid) return;

      //hiding alerts
      $("#success").fadeOut('fast');
      $("#error").fadeOut('fast');

      //creating the json data
      var data = { email : $scope.email, name: $scope.name };
      NProgress.start();
      $resource("/api/email/").save(data, function(data) {
        NProgress.done();

        //clearing form
        $scope.email = "";
        $scope.name = "";

        //display success
        $scope.success = data;
        $("#success").fadeIn();

        $analytics.eventTrack('Created Nobot Email');
      },
      function (err){
        NProgress.done();
        $scope.error = err.data.error;
        $("#error").fadeIn();
      });
    };
  }).
  controller('EmailCtrl', function ($scope, $routeParams, $resource, vcRecaptchaService, $analytics) {
    $scope.model = {
                key: '6Lfhn_oSAAAAANZLfZphEe1MLoJs-1BXLB5eIoYm'
            };

    $scope.submit = function () {
      var data  = vcRecaptchaService.data();
      data.id = $routeParams.id;
      data.name = $routeParams.name;

      $("#error").fadeOut('fast');

      NProgress.start();
      $scope.blockUi = true;

      $resource("/api/captcha/").save(data, function(data) {
        $scope.blockUi = false;
        NProgress.done();

          $scope.nobot = data;

          //hide form
          $('#captcha-form').fadeOut('fast', function(){

            //show nobot details
            $('#nobot-view').fadeIn();

            $analytics.eventTrack('Passed Captcha', {  label: data.email });
          });
      },
      function(err){
        NProgress.done();
        vcRecaptchaService.reload();
        $scope.error = err.data.error;
        $("#error").fadeIn();
      });
    };
  });
