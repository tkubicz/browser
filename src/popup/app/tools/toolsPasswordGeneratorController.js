﻿angular
    .module('bit.tools')

    .controller('toolsPasswordGeneratorController', function ($scope, $state, $stateParams, passwordGenerationService,
        toastr, $q, utilsService, $analytics, i18nService) {
        $scope.i18n = i18nService;
        var addState = $stateParams.addState,
            editState = $stateParams.editState;

        $scope.showSelect = $stateParams.addState || $stateParams.editState;

        utilsService.initListSectionItemListeners($(document), angular);
        $scope.password = '-';

        $q.when(passwordGenerationService.getOptions()).then(function (options) {
            $scope.options = options;
            $scope.regenerate(false);
            $analytics.eventTrack('Generated Password');
        });

        $scope.sliderMoved = function () {
            $scope.regenerate(false);
        };

        $('#length').change(function (e) {
            e.preventDefault();
            $analytics.eventTrack('Generated Password');
            $scope.saveOptions($scope.options);
        });

        $scope.regenerate = function (trackRegenerateEvent) {
            if (trackRegenerateEvent) {
                $analytics.eventTrack('Regenerated Password');
            }

            $scope.password = passwordGenerationService.generatePassword($scope.options);
        };

        $scope.saveOptions = function (options) {
            if (!options.uppercase && !options.lowercase && !options.number && !options.special) {
                options.lowercase = $scope.options.lowercase = true;
            }
            if (!options.minNumber) {
                options.minNumber = $scope.options.minNumber = 0;
            }
            if (!options.minSpecial) {
                options.minSpecial = $scope.options.minSpecial = 0;
            }

            passwordGenerationService.saveOptions(options);
            $scope.regenerate(false);
            return true;
        };

        $scope.clipboardError = function (e, password) {
            toastr.info(i18n.browserNotSupportClipboard);
        };

        $scope.clipboardSuccess = function (e) {
            $analytics.eventTrack('Copied Generated Password');
            e.clearSelection();
            toastr.info(i18nService.passwordCopied);
        };

        $scope.close = function () {
            dismiss();
        };

        $scope.select = function () {
            $analytics.eventTrack('Selected Generated Password');

            if (addState) {
                addState.login.password = $scope.password;
            }
            else if (editState) {
                editState.login.password = $scope.password;
            }

            dismiss();
        };

        function dismiss() {
            if (addState) {
                $state.go('addLogin', {
                    animation: 'out-slide-down',
                    from: addState.from,
                    login: addState.login
                });
            }
            else if (editState) {
                $state.go('editLogin', {
                    animation: 'out-slide-down',
                    login: editState.login,
                    fromView: editState.fromView,
                    loginId: editState.loginId,
                    from: editState.from
                });
            }
            else {
                $state.go('tabs.tools', {
                    animation: 'out-slide-down'
                });
            }
        }
    });
