/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('doorApi', [])
  .factory('doorSrv', doorSrv);

doorSrv.$inject = ['$q', '$http', 'httpSrv'];
function doorSrv($q, $http, httpSrv) {
  var server = httpSrv.getHttpRoot();

  var doorList = {
    getResident: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/resident/list/'+pageNo+'/'+limit,
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
    getPublicCard: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/public/card/list/'+pageNo+'/'+limit,
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
    getPublicCardDetail: function(id, communityId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/public/card/'+id+'/detail/'+communityId,
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

  return doorList;

}