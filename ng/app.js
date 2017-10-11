/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('app', [
  'ui.router',
  'ui.select2',
  'ui.bootstrap',
  'mgcrea.ngStrap.datepicker',
  'mgcrea.ngStrap.dropdown',
  'ngAnimate',
  'angular-loading-bar',
  'angularBootstrapNavTree',
  'toastr',
  'angularFileUpload',
  // 'ng-sweet-alert',
  'ngSanitize',
  'app.router',
  'mainMdl',
  'mainApi',
  'directive.pagination',
  'directive.cascade',
  'directive.filterButton',
  'directive.select',
  'homeMdl',
  'villageMdl',
  'entranceMdl',
  'deviceMdl',
  'logMdl',
  'suggestMdl',
  'villageApi',
  'homeApi',
  'doorApi',
  'deviceApi',
  'logApi',
  'httpApi'
]);

angular.module('app')
  .run(initConfig)
  .animation('.fad',fad)
  .config(config);

function initConfig(uiSelect2Config){
   uiSelect2Config.minimumResultsForSearch = -1;
  uiSelect2Config.placeholder = "Placeholder text";
}

function config(toastrConfig){
  angular.extend(toastrConfig, {
    iconClasses: {
      error: 'toast-error',
      info: 'toast-dark',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    timeOut: 500
  });
}

function fad() {
  return {
    enter: function(element, done) {
      element.css({
        opacity: 0
      });
      element.animate({
        opacity: 1
      }, 0, done);
    },
    leave: function (element, done) {
      element.css({
        opacity: 1
      });
      element.animate({
        opacity: 0
      }, 1, done);
    }
  };
}