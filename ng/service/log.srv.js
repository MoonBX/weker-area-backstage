/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('logApi', [])
  .factory('logSrv', logSrv);

logSrv.$inject = ['$q', '$http', 'httpSrv'];
function logSrv($q, $http, httpSrv) {
  var server = httpSrv.getHttpRoot();
  var logList = {
    getUnlock: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/log/unlock/'+pageNo+'/'+limit,
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
    getAlarm: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/alarm/log/'+pageNo+'/'+limit,
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
    }
  };
  return logList;
}