/**
 * Created by zhongyuqiang on 2017/7/26.
 */
angular.module('suggestMdl', [])
  .controller('suggestCtl', suggestCtl)
  .controller('detailCtl', detailCtl);

function suggestCtl($modal){
  var vm = this;
  vm.openModal = openModal;

  function openModal(template, controller) {
    $modal.open({
      templateUrl: './views/suggest/' + template + '.html',
      controller: controller,
      size: 'sm'
    })
  }
}

function detailCtl(){

}