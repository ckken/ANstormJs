/* Directives */
angular.module('Nstorm.directives', []).
    directive('genParseMarkdown', ['MdParse', 'sanitize', function (MdParse, sanitize) {
        // <div gen-parse-markdown="document"></div>
        // document是Markdown格式或一般文档字符串，解析成DOM后插入<div>
        return function (scope, element, attr) {
            element.addClass('ng-binding parse-markdown').data('$binding', attr.genParseMarkdown);
            scope.$watch(attr.genParseMarkdown, function genParseMarkdownWatchAction(value) {
                value = value || '';
                value = MdParse(value);
                value = sanitize(value);
                element.html(value);
                element.find('pre').addClass('prettyprint'); // linenums have bug!
                element.find('a').attr('target', function () {
                    if (this.host !== location.host) {
                        return '_blank';
                    }
                });
                prettyPrint();
            });
        };
    }])/*.
 directive('genTiming', ['$timeout', function ($timeout) {
 return {
 transclude: true,
 scope: true,
 template: '<i>{{timing}}</i>',
 link: function (scope, element, attr) {
 element.addClass('ng-binding').data('$binding', attr.genTiming);
 var eventName = attr.genTiming;
 scope.$watch(attr.genTiming, function genTimingWatchAction(value) {
 var time = +value || 0;
 if (time <= 0) {
 return;
 }
 (function timing() {
 scope.timing = time;
 time -= 1;
 if (time >= 0) {
 $timeout(timing, 1000);
 } else {
 scope.$emit(eventName);
 }
 })();
 });
 }
 };
 }])*/;