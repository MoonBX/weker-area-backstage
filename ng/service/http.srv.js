/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('httpApi', [])
  .factory('httpSrv', httpSrv);

httpSrv.$inject = ['$q', '$http'];
function httpSrv() {
  //var server = "http://114.55.143.170:8085";
  var server = "http://192.168.23.241:8085";
  //var server = "http://116.62.39.38:8085";
  var list = {
    getHttpRoot: function(){
      return server;
    }
  };
  return list;
}