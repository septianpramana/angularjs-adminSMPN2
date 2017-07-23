'use strict';

app
	.controller('BeritaCtrl', function($scope, $http, $filter, $cookies, toastr, ngTableParams, $mdDialog){

		var init;

		$scope.data = [];
		$scope.searchKeywords = '';
        $scope.filteredData = [];
        $scope.row = '';
        $scope.no = 1

        $scope.add = function(){
        	$scope.data = undefined;
        	console.log(JSON.stringify($scope.data));
        }

		$scope.formLoad = function(){
			$http.get('/file/v1/api/GetBerita.php')
			.then(function (response){
				$scope.select = select;
                $scope.onFilterChange = onFilterChange;
                $scope.onNumPerPageChange = onNumPerPageChange;
                $scope.onOrderChange = onOrderChange;
                $scope.search = search;
                $scope.order = order;
                $scope.numPerPageOpt = [3, 5, 10, 20];
                $scope.numPerPage = $scope.numPerPageOpt[2];
                $scope.currentPage = 1;
                $scope.currentPage = [];

                $scope.data = response.data.DATA;

                function select(page) {
                    var end, start;
                    start = (page - 1) * $scope.numPerPage;
                    end = start + $scope.numPerPage;
                    return $scope.currentPageData = $scope.filteredData.slice(start, end);
                };

                function onFilterChange() {
                    $scope.select(1);
                    $scope.currentPage = 1;
                    return $scope.row = '';
                };

                function onNumPerPageChange() {
                    $scope.select(1);
                    return $scope.currentPage = 1;
                };

                function onOrderChange() {
                    $scope.select(1);
                    return $scope.currentPage = 1;
                };

                function search() {
                    $scope.filteredData = $filter('filter')($scope.data, $scope.searchKeywords);
                    return $scope.onFilterChange();
                };

                function order(rowName) {
                    if ($scope.row === rowName) {
                    return;
                    }
                    $scope.row = rowName;
                    $scope.filteredData = $filter('orderBy')($scope.data, rowName);
                    return $scope.onOrderChange();
                };


                init = function() {
                    $scope.search();
                    return $scope.select($scope.currentPage);
                };

                init();

			})
			.catch(function(e){
				toastr.error('aaa', 'Error!', 5000);
			})
		}

		$scope.delete = function(idBerita){

            var confirm = $mdDialog.confirm()
                        .title('Are you sure to delete this data?')
                        .content('Data yang dihapus tidak dapat bisa dikembalikan')
                        .ariaLabel('Lucky day')
                        .targetEvent(idBerita)
                        .ok('Yes')
                        .cancel('No');

            $mdDialog.show(confirm).then(function() {
            
                $http.post('/file/v1/api/HapusBerita.php', {id:idBerita})
                .then(function(response){      
                    $scope.formLoad();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Deleted')
                            .content('Data berhasil dihapus.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Ok')
                    );
                })
                .catch(function(e){
                    $scope.formLoad();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Delete Failed')
                            .content(e)
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Ok')
                    );
                })
            });
        }

		$scope.formLoad();
	})

	.controller('BeritaAddCtrl', function($scope, $http, $cookies, toastr, $stateParams, $state){
        
		$scope.cb = {}
		$scope.data = {
			id : null,
			judulBerita : "",
			isiBerita : "",
			gambar : null,
			tipe : "",
			status : "",
			id_user : ""
        }

		$scope.renderCb = function(){
			$scope.cb.status = ["Published", "Not Published"];

            $scope.cb.tipe = ["Pendidikan", "Politik", "Other"];
		}

		$scope.save = function(){
			$http.post('/file/v1/api/InsertBerita.php', $scope.data)
			.then(function (response){
				if(response.data.CODE == "0"){
					
					toastr.success('Simpan data sukses', response.data.DESC, 5000);
					
					$state.go('app.berita.list');
				} else {
					toastr.error(response.data.DESC, "Error!", 5000);
				}
			})
			.catch(function (e){
				toastr.error(e, 'Error!', 5000);
			})
        }
        
		$scope.renderCb();
	})

	.controller('BeritaEditCtrl', function($scope, $http, $cookies, toastr, $stateParams, $state){
		var stateId = $stateParams.id;
		$scope.data = {}
		$scope.cb = {}

		$scope.formLoad = function(){
			$http.post('/file/v1/api/GetBeritaById.php', {id:stateId})
			.then(function (response){

				var dt = angular.copy(response.data.DATA).map(function (item){ 
                    return {
                        id : item.ID,
                        judulBerita : item.JUDUL,
                        isiBerita : item.BODY,
                        gambar : item.GAMBAR,
                        status : item.STATUS,
                        tipe : item.TIPE,
                        dibuat : item.DIBUAT,
                        diubah : item.UBAH,
                        id_user : item.id_user
                    }
                })

                $scope.data = dt[0];
			})
		}

		$scope.renderCb = function(){
			$scope.cb.status = ["Published", "Not Published"];

            $scope.cb.tipe = ["Pendidikan", "Politik", "Other"];
		}

		$scope.save = function(){

			$http.post('/file/v1/api/InsertBerita.php', $scope.data)
			.then(function (response){
				if(response.data.CODE == "0"){
					
					toastr.success('Update data sukses', response.data.DESC, 5000);
					
					$state.go('app.berita.list');
				} else {
					toastr.error(response.data.DESC, "Error!", 5000);
				}
			})
			.catch(function (e){
				toastr.error(e, 'Error!', 5000);
			})
		}

		$scope.formLoad();
		$scope.renderCb();
	})

    .controller('BeritaShowCtrl', function($scope, $state, $http, $cookies, $stateParams, toastr){
        var stateId = $stateParams.id;
        $scope.data = {}

		$scope.formLoad = function(){
			$http.post('/file/v1/api/GetBeritaById.php', {id:stateId})
			.then(function (response){

				var dt = angular.copy(response.data.DATA).map(function (item){ 
                    return {
                        id : item.ID,
                        judulBerita : item.JUDUL,
                        isiBerita : item.BODY,
                        gambar : item.GAMBAR,
                        status : item.STATUS,
                        tipe : item.TIPE,
                        dibuat : item.DIBUAT,
                        diubah : item.UBAH,
                        id_user : item.id_user
                    }
                })

                $scope.data = dt[0];
			})
		}
    })