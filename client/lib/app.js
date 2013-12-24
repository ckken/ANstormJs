'use strict';

window.Nstorm = Nstorm || {};

angular.module('Nstorm', ['ngRoute','Nstorm.controllers', 'Nstorm.directives', 'Nstorm.services', 'Nstorm.tools', 'Nstorm.filters']).
    provider('newVersion',function () {
        var get = function (url) {
            return url + '?v=' + (Nstorm.version || '');
        };
        this.$get = function () {
            return get;
        };
        this.get = get;
    }).
    config(['$routeProvider', '$locationProvider', 'newVersionProvider',

        function ($routeProvider, $locationProvider, newVersionProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/blog/home.html'),
                    controller: 'indexCtrl'
                }).

                when('/blog/sort/:bysort', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/blog/home.html'),
                    controller: 'indexCtrl'
                }).

                when('/blog/tags/:tag', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/blog/home.html'),
                    controller: 'tagCtrl'
                }).


                when('/content/:id', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/blog/content.html'),
                    controller: 'contentCtrl'
                }).


                when('/blog/add', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/blog/edit.html'),
                    controller: 'editCtrl'
                }).

                when('/blog/:id/edit', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/blog/edit.html'),
                    controller: 'editCtrl'
                }).

                when('/blog/:id/delete', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/blog/home.html'),
                    controller: 'deleteCtrl'
                }).


                when('/login', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/member/login.html'),
                    controller: 'userLoginCtrl'
                }).
                when('/register', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/member/register.html'),
                    controller: 'userRegisterCtrl'
                }).

                when('/forget', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/member/forget.html'),
                    controller: 'userForgetCtrl'
                }).


                when('/home', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/member/user.html'),
                    controller: 'homeCtrl'
                }).
                when('/admin', {
                    templateUrl: newVersionProvider.get(Nstorm.view + '/admin.html'),
                    controller: 'adminCtrl'
                }).

                otherwise({
                    redirectTo: '/'
                });
            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('!');
        }]).
    run(['$rootScope', '$location', '$http', 'sanitize', 'MdParse', 'MdEditor', 'getMarkdown', 'tools', '$filter', function ($rootScope, $location, $http, sanitize, MdParse, MdEditor, getMarkdown, tools, $filter) {
        Nstorm = tools(Nstorm); //添加jsGen系列工具函数
        Nstorm.sanitize = sanitize;
        Nstorm.MdParse = MdParse;
        Nstorm.MdEditor = MdEditor;
        Nstorm.location = $location;
        Nstorm.rootScope = $rootScope;
        //page
        Nstorm.perpage = 8;
        Nstorm.filter = $filter;
        //global
        $rootScope.global = {
            isAdmin: false,
            isEditor: false,
            isLogin: false,
            loading: false,
        }

        $rootScope.msg = function (show, tips, status) {
            $rootScope.global.msgbox = (show) ? true : false;
            $rootScope.global.msgboxClass = (status) ? 'alert-' + status : 'alert-block';
            $rootScope.global.msgboxTips = tips;
        }

        //menu
        $('.bs-docs-nav ul li').click(function () {
            $('.bs-docs-nav ul li').removeClass('active');
            $(this).addClass('active');
        });

        $rootScope.global.loading = true;
        $http.get('/api/main/config/').success(function (data) {
            angular.extend($rootScope.global, data);
            $rootScope.checkUser();
            $rootScope.global.loading = false;
        });

        $http.get('/api/main/tagsList/').success(function (data) {
            $rootScope.global.tagsList = data;
        });


        $rootScope.global.ArticleTagsMax = 5;
        $rootScope.global.ContentMinLen = 5;
        $rootScope.global.ContentMaxLen = 20000;
        $rootScope.global.UserTagsMax = 4;
        $rootScope.global.TitleMaxLen = 90;
        $rootScope.global.TitleMinLen = 5;

        $rootScope.global.title = "Nstorm - Nodejs MVC FrameWork - NodeJs And AngularJs";


        $rootScope.logout = function () {


            $http.get('/api/member/logout/').success(function (data) {
                delete $rootScope.global.user;
                $rootScope.checkUser();
                Nstorm.location.path('/');
            });


        };


        $rootScope.clearUser = function () {
            delete $rootScope.global.user;
            $rootScope.checkUser();
        };

        $rootScope.checkUser = function () {

            if ($rootScope.global.user) {
                $rootScope.global.isLogin = true;
                if ($rootScope.global.user.admin)$rootScope.global.isAdmin = true;
            }

            else {
                $rootScope.global.isLogin = false;
                $rootScope.global.isAdmin = false;
                $rootScope.global.isEditor = false;
            }
        };

        $rootScope.checkadmin = function (email) {
            if ('undefined' === typeof $rootScope.global.user)return false;
            else return($rootScope.global.user.email == email || $rootScope.global.user.admin == 1) ? true : false;
        }


    }]);