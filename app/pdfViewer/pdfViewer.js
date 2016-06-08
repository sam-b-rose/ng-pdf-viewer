(function() {
    'use strict';

    var pdfViewer = {
        templateUrl: 'tpl/pdfViewer.tpl.html',
        controller: pdfViewerCtrl,
        bindings: {
            file: '<',
            fullscreen: '<',
            highlight: '<',
            search: '<',
            next: '<',
            previous: '<',
            onUpdate: '&'
        }
    };

    pdfViewerCtrl.$inject = ['$log', '$ocLazyLoad', '$q', 'pdfViewerService'];

    function pdfViewerCtrl($log, $ocLazyLoad, $q, pdfViewerService) {
        var $ctrl = this;
        window.pdfViewerFileUrl = $ctrl.file || '';

        /****************************************
         *      Controller Attributes           *
         ****************************************/
        $ctrl.ready = false;

        /****************************************
         *      Controller API                  *
         ****************************************/
         var api = {
             find: find,
             nextMatch: nextMatch,
             previousMatch: previousMatch,
             highlightAll: highlightAll,
             enterFullscreen: enterFullscreen
         };

        angular.extend($ctrl, api);

        /****************************************
         *      Lifecycle Hooks                 *
         ****************************************/
        $ctrl.$onInit = init;

        function init() {
            console.log('👊 activating component');
            pdfViewerService.load().then(function(msg) {
                getDomElements();
                $ctrl.ready = true;
            });

        }

        $ctrl.$onChanges = function(changesObj) {

            if (changesObj.file) {
                window.pdfViewerFileUrl = $ctrl.file;
                if (window.PDFViewerApplication) {
                    PDFViewerApplication.openFileViaURL($ctrl.file);
                }
            }

            if ($ctrl.ready) {
                if (typeof changesObj.search !== 'undefined') {
                    $ctrl.find($ctrl.search);
                }

                if (typeof changesObj.highlight !== 'undefined') {
                    $ctrl.highlightAll($ctrl.highlight);
                }

                if (typeof changesObj.fullscreen !== 'undefined') {
                    $ctrl.enterFullscreen();
                }

                if (typeof changesObj.next !== 'undefined') {
                    $ctrl.nextMatch();
                }

                if (typeof changesObj.previous !== 'undefined') {
                    $ctrl.previousMatch();
                }

                $ctrl.onUpdate();
            }
        };

        /****************************************
         *      API Functions                   *
         ****************************************/
        function find(query) {
            this.findInput.value = query;
            PDFViewerApplication.findBar.dispatchEvent('');
        }

        function nextMatch() {
            PDFViewerApplication.findBar.dispatchEvent('again', false);
        }

        function previousMatch() {
            PDFViewerApplication.findBar.dispatchEvent('again', true);
        }

        function highlightAll(highlight) {
            this.findHighlightAll.checked = highlight;
            PDFViewerApplication.findBar.dispatchEvent('highlightallchange');
        }

        function enterFullscreen() {
            $ctrl.presentationMode.click();
        }

        /****************************************
         *      Private Functions               *
         ****************************************/
        function getDomElements() {
            var elements = {
                'findInput': null,
                'findHighlightAll': null,
                'presentationMode': null
            };

            Object.keys(elements).forEach(function(key) {
                elements[key] = document.getElementById(key);
            });

            angular.extend($ctrl, elements);
        }

    }

    module.exports = pdfViewer;
}());
