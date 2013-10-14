'use strict';

/* Services */
angular.module('Nstorm.services', ['ngResource']).

    factory('MdParse',function () {
        return function (html) {
            if (typeof html !== 'string') {
                return '';
            } else {
                return marked(html);
            }
        };
    }).
    factory('sanitize',function () {
        var sanitize0 = new Sanitize({});
        var sanitize1 = new Sanitize(Sanitize.Config.RESTRICTED);
        var sanitize2 = new Sanitize(Sanitize.Config.BASIC);
        var sanitize3 = new Sanitize(Sanitize.Config.RELAXED);
        return function (html, level) {
            switch (level) {
                case 0:
                    var san = sanitize0;
                    break;
                case 1:
                    var san = sanitize1;
                    break;
                case 2:
                    var san = sanitize2;
                    break;
                case 3:
                    var san = sanitize3;
                    break;
                default:
                    var san = sanitize3;
            }
            var innerDOM = document.createElement('div');
            var outerDOM = document.createElement('div');
            innerDOM.innerHTML = html;
            outerDOM.appendChild(san.clean_node(innerDOM));
            return filterXSS(outerDOM.innerHTML);
        };
    }).
    factory('MdEditor', ['MdParse', 'sanitize', function (MdParse, sanitize) {
        return function (idPostfix, level) {
            idPostfix = idPostfix || '';
            var editor = new Markdown.Editor({
                makeHtml: function (text) {
                    return sanitize(MdParse(text), level);
                }
            }, idPostfix);
            var element = angular.element(document.getElementById('wmd-preview' + idPostfix));
            editor.hooks.chain('onPreviewRefresh', function () {
                element.find('pre').addClass('prettyprint'); // linenums have bug!
                prettyPrint();
            });
            return editor;
        };
    }]).

    factory('getMarkdown', ['$http', function ($http) {
        return function (callback) {
            $http.get('/static/md/markdown.md', {
                cache: true
            }).success(function (data, status) {
                    var markdown = {};
                    if (!data.err) {
                        markdown.title = 'Markdown简明语法';
                        markdown.content = data;
                    } else {
                        markdown.err = data.err;
                    }
                    return callback(markdown);
                });
        };
    }]);