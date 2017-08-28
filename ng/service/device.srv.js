/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('deviceApi', [])
  .factory('deviceSrv', deviceSrv);

deviceSrv.$inject = ['$q', '$http', 'httpSrv'];
function deviceSrv($q, $http, httpSrv) {
  var server = httpSrv.getHttpRoot();
  var deviceList = {
    getDevice: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/list/'+pageNo+'/'+limit,
        params: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    },
    unbindDevice: function(sn){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/'+sn+'/unbind',
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    }
  }
  return deviceList;
}