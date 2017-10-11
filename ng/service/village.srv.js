/**
 * Created by zhongyuqiang on 2017/8/14.
 */
angular.module('villageApi', [])
  .factory('villageSrv', villageSrv);

villageSrv.$inject = ['$q', '$http', 'httpSrv'];
function villageSrv($q, $http, httpSrv){
  var server = httpSrv.getHttpRoot();

  var villageList = {
    getCommunity: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/query/list/'+pageNo+'/'+limit,
        params: obj,
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
    createCommunity: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/add',
        data: obj,
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
    editCommunity: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/edit',
        data: obj,
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
    getPartition: function(id){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/partition/list/'+id,
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
    addPartition: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/partition/add',
        data: obj,
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
    editPartition: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/partition/edit',
        data: obj,
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
    deletePartition: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/partition/delete',
        data: obj,
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
    getBlock: function(partitionId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/block/list/'+partitionId,
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
    addBlock: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/block/add',
        data: obj,
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
    editBlock: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/block/edit',
        data: obj,
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
    deleteBlock: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/block/delete',
        data: obj,
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
    addUnit: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/add',
        data: obj,
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
    editUnit: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/edit',
        data: obj,
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
    deleteUnit: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/delete',
        data: obj,
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
    getUnit: function(blockId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/unit/list/'+blockId,
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
    getRoomNo: function(unitId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/unit/roomNo/list/'+unitId,
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
    addRoomNo: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/roomNo/add',
        data: obj,
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
    addRoomNoMulti: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/roomNo/add/list',
        data: obj,
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
    editRoomNo: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + 'community/unit/roomNo/edit',
        data: obj,
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
    deleteRoomNo: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/roomNo/delete',
        data: obj,
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
    getArea: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/area/partition/list',
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
    getDeviceLocation: function(communityId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/location/partition/'+ communityId,
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
    createTaskMember: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/task/distribution',
        data: obj,
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
    deleteTaskSend: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/task/distribution/delete',
        data: obj,
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
    getTask: function(communityId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/location/task/distribution/query/'+communityId,
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
    getDeviceTask: function(partitionId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/location/list/'+partitionId,
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
    createDeviceTask: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/add',
        data: obj,
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
    editDeviceTask: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + ' /device/location/edit',
        data: obj,
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
    deleteDeviceTask: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/delete',
        data: obj,
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
    deleteMultiDeviceTask: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/delete/list',
        data: obj,
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
    }

  };
  return villageList;
}