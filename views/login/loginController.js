'use strict';

app
	.controller('LoginCtrl', function($scope, $http, $state, $cookies, toastr, $location, $mdDialog){

		$scope.user = {};

        $scope.currentUser = null;

        try {
            $scope.currentUser = JSON.parse($cookies.get('currentUser'));
        } catch(e){}

        $scope.login = function() {
            if($scope.user.email != null || $scope.user.pass != null){
                $http.post('/file/v1/api/Login.php', $scope.user)
                    .then(function (response){
                        if(response.data.CODE === 100){
                            var configAPI = angular.copy(response.data.RESULT).map(function (item){
                                return{
                                    id: item.ID,
                                    email: item.EMAIL,
                                    nama: item.NAMA,
                                    alamat: item.ALAMAT
                                }
                            });

                            $cookies.put('currentUser', JSON.stringify(configAPI[0]));

                            toastr.success(response.data.DESC, 'Success', 5000);

                            $location.path('/app/dashboard');

                        } else {
                        	console.log(JSON.stringify(response.data));
                            toastr.error(response.data.DESC, 'Error!', 5000);
                        }

                    })
                    .catch(function(error){
                        alert(error);
                    })
            } else {
                alert('Tidak boleh kosong!');
            }
        }

        $scope.logout = function(){
            var confirm = $mdDialog.confirm()
                .title('Anda yakin untuk keluar?')
                .ariaLabel('Lucky day')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(function() {  
                $cookies.remove('currentUser');
                $state.go('login');
            })
        }
	})