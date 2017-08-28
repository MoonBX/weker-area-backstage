/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('homeApi', [])
  .factory('homeSrv', homeSrv);

homeSrv.$inject = ['$q', '$http', 'httpSrv'];
function homeSrv($q, $http, httpSrv) {

  var server = httpSrv.getHttpRoot();

  var homeList = {
    getAreaDevice: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/area/device',
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getAreaPartitionDevice: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/area/partition/device/list',
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
  }

  return homeList;

}