angular.module('Nstorm.controllers', []).

    controller('indexCtrl', ['$scope', '$routeParams', '$http',
        function ($scope, $routeParams, $http) {
            $scope.global.subTitle = 'Home';
            //bysort
            $scope.actionShow = 0;
            var bysort = ('undefined' !== typeof $routeParams.bysort) ? $routeParams.bysort : 'latest';
            $scope.action = function (action) {
                if (action == bysort || 'undefined' === bysort)return 'active';
                else return '';
            }

            Nstorm.rootScope.global.loading = true;
            var pr = Nstorm.perpage;
            var page = ('undefined' !== typeof $routeParams.p) ? '?pr=' + Nstorm.perpage + '&p=' + $routeParams.p : '?pr=' + Nstorm.perpage;
            $http.get('/api/blog/index/bysort/' + bysort + page).success(function (data) {
                $scope.data = data;
                $scope.page = function () {
                    return data.page
                };
                Nstorm.rootScope.global.loading = false;
            });

            $http.get('/api/blog/userList/load').success(function (user) {
                $scope.userlist = user;
            });


        }])

    .controller('tagCtrl', ['$scope', '$routeParams', '$http',
        function ($scope, $routeParams, $http) {

            $scope.actionShow = 1;
            Nstorm.rootScope.global.loading = true;
            var pr = Nstorm.perpage;
            var page = ('undefined' !== typeof $routeParams.p) ? '?pr=' + pr + '&p=' + $routeParams.p : '?pr=' + pr;
            $scope.tags = $routeParams.tag;
            $http.get('/api/blog/index/s/' + $routeParams.tag + page).success(function (data) {
                $scope.data = data;
                $scope.tag = $routeParams.tag;
                $scope.global.subTitle = $scope.tag;
                $scope.page = function () {
                    return data.page
                };
                Nstorm.rootScope.global.loading = false;
            });


            $http.get('/api/blog/userList/load').success(function (user) {
                $scope.userlist = user;
            });


        }])


    .controller('contentCtrl', ['$scope', '$routeParams', '$http',
        function ($scope, $routeParams, $http) {
            Nstorm.rootScope.global.loading = true;
            $http.get('/api/blog/content/id/' + $routeParams.id).success(function (data) {
                if (data.code) {
                    $scope.msg(1, data.tips, 'danger');
                }
                else {
                    $scope.msg(0);
                    $scope.vo = data.blogs;
                    $scope.global.subTitle = $scope.vo.title;
                }
                Nstorm.rootScope.global.loading = false;
            });


        }]).

    controller('editCtrl', ['$scope', '$routeParams', '$http',
        function ($scope, $routeParams, $http) {

            $scope.msg(0);
            if (!Nstorm.rootScope.global.isLogin) $scope.msg(1, '请登陆后再发布文章');

            var MdEditor = Nstorm.MdEditor();
            MdEditor.run();

            //title
            $scope.$watch('title', function (title) {
                if (typeof title !== 'string') {
                    $scope.titleBytes = 0;
                    title = '';
                }
                $scope.titleBytes = Nstorm.filter('length')(title);
                while ($scope.titleBytes > $scope.global.TitleMaxLen) {
                    title = title.slice(0, -1);
                    $scope.titleBytes = Nstorm.filter('length')(title);
                }
                $scope.title = title;
                if ($scope.titleBytes >= $scope.global.TitleMinLen && $scope.titleBytes <= $scope.global.TitleMaxLen && $scope.contentBytes >= $scope.global.ContentMinLen && $scope.contentBytes <= $scope.global.ContentMaxLen) {
                    $scope.editSave = true;
                } else {
                    $scope.editSave = false;
                }
            });

            //content
            $scope.$watch('content', function (content) {
                if (typeof content !== 'string') {
                    $scope.contentBytes = 0;
                    content = '';
                }
                $scope.contentBytes = Nstorm.filter('length')(content);
                if ($scope.titleBytes >= $scope.global.TitleMinLen && $scope.titleBytes <= $scope.global.TitleMaxLen && $scope.contentBytes >= $scope.global.ContentMinLen && $scope.contentBytes <= $scope.global.ContentMaxLen) {
                    $scope.editSave = true;
                } else {
                    $scope.editSave = false;
                }
                $scope.content = content;
            });
            $scope.$watch('tagsList', function (tagsList) {
                if (tagsList.length > $scope.global.ArticleTagsMax) {
                    $scope.tagsList = tagsList.slice(0, $scope.global.ArticleTagsMax);
                }
            });

            //tags
            function initTags(tagsList) {
                tagsArray = [];
                angular.forEach(tagsList, function (value, key) {
                    tagsArray[key] = value.tag;
                });
                $scope.tagsList = Nstorm.union(tagsArray);
            };
            initTags();
            $scope.$watch('tagsList', function () {
                if ($scope.tagsList.length > $scope.global.UserTagsMax) {
                    $scope.tagsList = $scope.tagsList.slice(0, $scope.global.UserTagsMax);
                }
            });
            $scope.getTag = function (t) {
                var tag = t.tag;
                if ($scope.tagsList.indexOf(tag) === -1 && $scope.tagsList.length < $scope.global.UserTagsMax) {
                    $scope.tagsList = $scope.tagsList.concat(tag); // 此处push方法不会更新tagsList视图
                }
            };
            //submit
            var blog = {};
            var crud_action = '';
            if ($routeParams.id > 0) {
                blog._id = $routeParams.id;
                crud_action = 'update';
            }
            else {
                crud_action = 'insert';
            }

            $scope.submit = function () {
                Nstorm.rootScope.global.loading = true;
                blog.title = $scope.title;
                blog.content = $scope.content;
                blog.refer = $scope.refer;
                blog.tags = $scope.tagsList;

                $http.post('/api/ublog/' + crud_action + '/', blog).success(function (cb) {
                    if (cb.code) {
                        $scope.msg(1, cb.tips, 'danger');
                    }
                    else {
                        Nstorm.rootScope.global.loading = false;
                        Nstorm.location.path('/content/' + cb.data._id);
                    }
                });
            }

        }]).


    controller('deleteCtrl', ['$scope', '$routeParams', '$http',
        function ($scope, $routeParams, $http) {
            var del = 0;
            if ('undefined' !== typeof $routeParams.id && del == 0) {

                $http.post('/api/ublog/delete/id/' + $routeParams.id).success(function (cb) {
                    //Nstorm.location.path('/');
                    history.go(-1);


                });
            }

        }]).


    controller('userLoginCtrl', ['$scope', '$routeParams', '$http',
        function ($scope, $routeParams, $http) {
            $scope.msg(0);
            $scope.submit = function (user) {

                $http.post('/api/member/login/', user).success(function (cb) {
                    if (cb.code) {
                        $scope.msg(1, cb.tips, 'danger');
                    }
                    else {

                        $scope.global.user = Nstorm.union(cb.data);
                        $scope.checkUser();
                        Nstorm.location.path('/');
                    }


                });
            }

        }]).


    controller('userRegisterCtrl', ['$scope', '$routeParams', '$http',
        function ($scope, $routeParams, $http) {

            $scope.status = function (obj, check) {
                if ('undefined' === typeof obj)txt = '';
                else if (check)txt = 'has-error';
                else txt = 'has-success';
                return txt;
            }

            $scope.msg(0);
            $scope.submit = function (user) {

                $http.post('/api/member/register/', user).success(function (cb) {
                    if (cb.code) {
                        $scope.msg(1, cb.tips, 'danger');
                    }
                    else {

                        $scope.global.user = Nstorm.union(cb.data);
                        $scope.checkUser();
                        Nstorm.location.path('/');
                    }


                });
            }


        }]).

    controller('userForgetCtrl', ['$scope', '$routeParams', '$http',
        function ($scope, $routeParams, $http) {
        }]).

    controller('homeCtrl', ['$scope', '$routeParams', '$http',
        function ($scope, $routeParams, $http) {

            $scope.msg(0);
            $scope.changeUserPassword = function (user) {

                user.name = $scope.global.user.name;
                $http.post('/api/member/changePassword/', user).success(function (cb) {
                    if (cb.code) {
                        $scope.msg(1, cb.tips, 'danger');
                    }
                    else {

                        $scope.global.user = Nstorm.union(cb.data);
                        $scope.checkUser();
                        $scope.msg(1, cb.tips, 'success');

                        //Nstorm.location.path('/');
                    }


                });
            }


        }]).

    controller('adminCtrl', ['$scope', '$routeParams',
        function ($scope, $routeParams) {
        }]);
	
	