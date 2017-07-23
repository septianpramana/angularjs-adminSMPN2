'use strict';

app
  .run(['$rootScope', '$state', '$stateParams', '$location', '$cookies', function($rootScope, $state, $stateParams, $location, $cookies) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeSuccess', function(event, toState, current, next) {

      event.targetScope.$watch('$viewContentLoaded', function () {

        angular.element('html, body, #content').animate({ scrollTop: 0 }, 200);

        setTimeout(function () {
          angular.element('#wrap').css('visibility','visible');

          if (!angular.element('.dropdown').hasClass('open')) {
            angular.element('.dropdown').find('>ul').slideUp();
          }
        }, 200);

      });
      $rootScope.containerClass = toState.containerClass;
    });
  }])

  .config(['uiSelectConfig', function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  }])

  //angular-language
  .config(['$translateProvider', function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'languages/',
      suffix: '.json'
    });
    $translateProvider.useLocalStorage();
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy(null);
  }])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider

    //login
    .state('login', {
      url: '/login',
      templateUrl: 'views/login/login.html',
    })
    
    .state('app', {
      abstract: true,
      url: '/app',
      templateUrl: 'views/tmpl/app.html'
    })
    //dashboard
    .state('app.dashboard', {
      url: '/dashboard',
      controller: 'DashboardCtrl',
      templateUrl: 'views/dashboard/dashboard.html',
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            'scripts/vendor/datatables/datatables.bootstrap.min.css',
            'scripts/vendor/datatables/datatables.bootstrap.min.css'
          ]);
        }]
      },
      authRequired: true
    })

    //berita
    .state('app.berita', {
      abstract: true,
      url: '/berita',
      template: '<div ui-view></div>',
      authRequired: true

    })
    //berita/list
    .state('app.berita.list', {
      url: '/list',
      templateUrl: 'views/berita/list.html',
      authRequired: true
    })
    //berita/new
    .state('app.berita.new', {
      url: '/new',
      templateUrl: 'views/berita/new.html',
      authRequired: true,
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
          ]);
        }]
      }
    })
    //berita/edit
    .state('app.berita.edit', {
      url: '/edit/:id',
      templateUrl: 'views/berita/edit.html',
      authRequired: true,
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
          ]);
        }]
      }
    })
    //berita/show
    .state('app.berita.show', {
      url: '/show/:id',
      templateUrl: 'views/berita/show.html',
      authRequired: true
    })

    //pengumuman
    .state('app.pengumuman', {
      abstract: true,
      url: '/pengumuman',
      template: '<div ui-view></div>',
      authRequired: true
    })
    //pengumuman/list
    .state('app.pengumuman.list', {
      url: '/list',
      templateUrl: 'views/pengumuman/list.html',
      authRequired: true
    })
    //pengumuman/new
    .state('app.pengumuman.new', {
      url: '/new',
      templateUrl: 'views/pengumuman/new.html',
      authRequired: true
    })
    //pengumuman/edit
    .state('app.pengumuman.edit', {
      url: '/edit/:id',
      templateUrl: 'views/pengumuman/edit.html',
      authRequired: true
    })
    //pengumuman/show
    .state('app.pengumuman.show', {
      url: '/show/:id',
      templateUrl: 'views/pengumuman/show.html',
      authRequired: true
    })

    //gallery
    .state('app.gallery', {
      abstract: true,
      url: '/gallery',
      template: '<div ui-view></div>',
      authRequired: true
    })
    //gallery/list
    .state('app.gallery.list', {
      url: '/list',
      templateUrl: 'views/gallery/list.html',
      authRequired: true,
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            'scripts/vendor/mixitup/jquery.mixitup.js',
            'scripts/vendor/magnific/magnific-popup.css',
            'scripts/vendor/magnific/jquery.magnific-popup.min.js'
          ]);
        }]
      }
    })
    //gallery/new
    .state('app.gallery.new', {
      url: '/new',
      templateUrl: 'views/gallery/new.html',
      authRequired: true,
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
          ]);
        }]
      }
    })
    //gallery/edit
    .state('app.gallery.edit', {
      url: '/edit/:id',
      templateUrl: 'views/gallery/edit.html',
      authRequired: true,
      resolve: {
        plugins: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([
            'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
          ]);
        }]
      }
    })

    //pengaturan
    .state('app.pengaturan', {
      abstract: true,
      url: '/pengaturan',
      template: '<div ui-view></div>',
      authRequired: true
    })
    //pengaturan/list
    .state('app.pengaturan.list', {
      url: '/list',
      templateUrl: 'views/pengaturan/list.html',
      authRequired: true
    })
    //pengaturan/new
    .state('app.pengaturan.new', {
      url: '/new',
      templateUrl: 'views/pengaturan/new.html',
      authRequired: true
    })
    //pengaturan/edit
    .state('app.pengaturan.edit', {
      url: '/edit/:id',
      templateUrl: 'views/pengaturan/edit.html',
      authRequired: true
    })
    //pengaturan/show
    .state('app.pengaturan.show', {
      url: '/show/:id',
      templateUrl: 'views/pengaturan/show.html',
      authRequired: true
    })

  }]);