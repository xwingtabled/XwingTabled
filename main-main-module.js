(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-main-module"],{

/***/ "./node_modules/angular-progress-bar/fesm5/angular-progress-bar.js":
/*!*************************************************************************!*\
  !*** ./node_modules/angular-progress-bar/fesm5/angular-progress-bar.js ***!
  \*************************************************************************/
/*! exports provided: ProgressBarComponent, ProgressBarModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBarComponent", function() { return ProgressBarComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBarModule", function() { return ProgressBarModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");




/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ProgressBarComponent = /** @class */ (function () {
    function ProgressBarComponent() {
        // Default color
        this.color = "#488aff";
    }
    /**
     * Returns a color for a certain percent
     * @param percent The current progress
     */
    /**
     * Returns a color for a certain percent
     * @param {?} percent The current progress
     * @return {?}
     */
    ProgressBarComponent.prototype.whichColor = /**
     * Returns a color for a certain percent
     * @param {?} percent The current progress
     * @return {?}
     */
    function (percent) {
        var e_1, _a;
        // Get all entries index as an array
        /** @type {?} */
        var k = Object.keys(this.degraded);
        // Convert string to number
        k.forEach(function (e, i) { return k[i] = +e; });
        // Sort them by value
        k = k.sort(function (a, b) { return a - b; });
        // Percent as number
        /** @type {?} */
        var p = +percent
        // Set last by default as the first occurrence
        ;
        // Set last by default as the first occurrence
        /** @type {?} */
        var last = k[0];
        try {
            // Foreach keys 
            for (var k_1 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__values"])(k), k_1_1 = k_1.next(); !k_1_1.done; k_1_1 = k_1.next()) {
                var val = k_1_1.value;
                // if current val is < than percent
                if (val < p) {
                    last = val;
                }
                // if val >= percent then the val that we could show has been reached
                else if (val >= p - 1) {
                    return this.degraded[last];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (k_1_1 && !k_1_1.done && (_a = k_1.return)) _a.call(k_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // if its the last one return the last
        return this.degraded[last];
    };
    /**
     * @param {?} progress
     * @return {?}
     */
    ProgressBarComponent.prototype.whichProgress = /**
     * @param {?} progress
     * @return {?}
     */
    function (progress) {
        try {
            return Math.round(+progress * 100) / 100;
        }
        catch (_a) {
            return progress;
        }
    };
    ProgressBarComponent.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"], args: [{
                    selector: 'progress-bar',
                    template: "\n  <div class=\"progress-outer\">\n    <div class=\"progress-inner\" [style.width]=\"whichProgress(progress) + '%'\" [style.background-color]=\"degraded == null ? color : whichColor(progress)\">\n      {{whichProgress(progress)}}%\n    </div>\n  </div>\n  ",
                    styles: ["\n        .progress-outer {\n          width: 96%;\n          margin: 10px 2%;\n          padding: 3px;\n          background-color: #f4f4f4;\n          border: 1px solid #dcdcdc;\n          color: #fff;\n          border-radius: 20px;\n          text-align: center;\n        }\n        .progress-inner {\n          min-width: 15%;\n          white-space: nowrap;\n          overflow: hidden;\n          padding: 0px;\n          border-radius: 20px;\n  "]
                }] }
    ];
    /** @nocollapse */
    ProgressBarComponent.ctorParameters = function () { return []; };
    ProgressBarComponent.propDecorators = {
        progress: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"], args: ['progress',] }],
        color: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"], args: ['color',] }],
        degraded: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"], args: ['color-degraded',] }]
    };
    return ProgressBarComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var ProgressBarModule = /** @class */ (function () {
    function ProgressBarModule() {
    }
    ProgressBarModule.decorators = [
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"], args: [{
                    imports: [
                        _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
                    ],
                    declarations: [ProgressBarComponent],
                    exports: [ProgressBarComponent],
                    schemas: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["CUSTOM_ELEMENTS_SCHEMA"]]
                },] }
    ];
    return ProgressBarModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */



//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1wcm9ncmVzcy1iYXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL2FuZ3VsYXItcHJvZ3Jlc3MtYmFyL2xpYi9hbmd1bGFyLXByb2dyZXNzLWJhci5jb21wb25lbnQudHMiLCJuZzovL2FuZ3VsYXItcHJvZ3Jlc3MtYmFyL2xpYi9hbmd1bGFyLXByb2dyZXNzLWJhci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6XHJcbiAgICAgICdwcm9ncmVzcy1iYXInLFxyXG4gIHN0eWxlczogW2BcclxuICAgICAgICAucHJvZ3Jlc3Mtb3V0ZXIge1xyXG4gICAgICAgICAgd2lkdGg6IDk2JTtcclxuICAgICAgICAgIG1hcmdpbjogMTBweCAyJTtcclxuICAgICAgICAgIHBhZGRpbmc6IDNweDtcclxuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmNGY0ZjQ7XHJcbiAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZGNkY2RjO1xyXG4gICAgICAgICAgY29sb3I6ICNmZmY7XHJcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xyXG4gICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICAucHJvZ3Jlc3MtaW5uZXIge1xyXG4gICAgICAgICAgbWluLXdpZHRoOiAxNSU7XHJcbiAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xyXG4gICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgICAgICAgIHBhZGRpbmc6IDBweDtcclxuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcbiAgYF0sXHJcbiAgdGVtcGxhdGU6XHJcbiAgYFxyXG4gIDxkaXYgY2xhc3M9XFxcInByb2dyZXNzLW91dGVyXFxcIj5cclxuICAgIDxkaXYgY2xhc3M9XFxcInByb2dyZXNzLWlubmVyXFxcIiBbc3R5bGUud2lkdGhdPVxcXCJ3aGljaFByb2dyZXNzKHByb2dyZXNzKSArICclJ1xcXCIgW3N0eWxlLmJhY2tncm91bmQtY29sb3JdPVxcXCJkZWdyYWRlZCA9PSBudWxsID8gY29sb3IgOiB3aGljaENvbG9yKHByb2dyZXNzKVxcXCI+XHJcbiAgICAgIHt7d2hpY2hQcm9ncmVzcyhwcm9ncmVzcyl9fSVcclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIGBcclxufSlcclxuZXhwb3J0IGNsYXNzIFByb2dyZXNzQmFyQ29tcG9uZW50IHtcclxuXHJcbi8qKiBJbnB1dHMgKiovXHJcbiAgQElucHV0KCdwcm9ncmVzcycpIHByb2dyZXNzOiBzdHJpbmc7XHJcbiAgQElucHV0KCdjb2xvcicpIGNvbG9yOiBzdHJpbmc7XHJcbiAgQElucHV0KCdjb2xvci1kZWdyYWRlZCcpIGRlZ3JhZGVkOiBhbnk7XHJcblxyXG5cclxuY29uc3RydWN0b3IoKSB7XHJcbiAgLy8gRGVmYXVsdCBjb2xvclxyXG4gIHRoaXMuY29sb3IgPSBcIiM0ODhhZmZcIjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgYSBjb2xvciBmb3IgYSBjZXJ0YWluIHBlcmNlbnRcclxuICogQHBhcmFtIHBlcmNlbnQgVGhlIGN1cnJlbnQgcHJvZ3Jlc3NcclxuICovXHJcbndoaWNoQ29sb3IocGVyY2VudDogc3RyaW5nKXtcclxuICAvLyBHZXQgYWxsIGVudHJpZXMgaW5kZXggYXMgYW4gYXJyYXlcclxuICBsZXQgazogQXJyYXk8YW55PiA9IE9iamVjdC5rZXlzKHRoaXMuZGVncmFkZWQpO1xyXG4gIC8vIENvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxyXG4gIGsuZm9yRWFjaCgoZSwgaSkgPT4ga1tpXSA9ICtlKTtcclxuICAvLyBTb3J0IHRoZW0gYnkgdmFsdWVcclxuICBrID0gay5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcbiAgLy8gUGVyY2VudCBhcyBudW1iZXJcclxuICBsZXQgcCA9ICtwZXJjZW50XHJcbiAgLy8gU2V0IGxhc3QgYnkgZGVmYXVsdCBhcyB0aGUgZmlyc3Qgb2NjdXJyZW5jZVxyXG4gIGxldCBsYXN0ID0ga1swXTtcclxuICAvLyBGb3JlYWNoIGtleXMgXHJcbiAgZm9yKGxldCB2YWwgb2Ygayl7XHJcbiAgICAvLyBpZiBjdXJyZW50IHZhbCBpcyA8IHRoYW4gcGVyY2VudFxyXG4gICAgaWYodmFsIDwgcCl7XHJcbiAgICAgIGxhc3QgPSB2YWw7XHJcbiAgICB9XHJcbiAgICAvLyBpZiB2YWwgPj0gcGVyY2VudCB0aGVuIHRoZSB2YWwgdGhhdCB3ZSBjb3VsZCBzaG93IGhhcyBiZWVuIHJlYWNoZWRcclxuICAgIGVsc2UgaWYodmFsID49IHAgLTEpe1xyXG4gICAgICByZXR1cm4gdGhpcy5kZWdyYWRlZFtsYXN0XTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gaWYgaXRzIHRoZSBsYXN0IG9uZSByZXR1cm4gdGhlIGxhc3RcclxuICByZXR1cm4gdGhpcy5kZWdyYWRlZFtsYXN0XTtcclxufVxyXG5cclxud2hpY2hQcm9ncmVzcyhwcm9ncmVzczogc3RyaW5nKXtcclxuICB0cnl7XHJcbiAgICByZXR1cm4gTWF0aC5yb3VuZCgrcHJvZ3Jlc3MgKiAxMDApIC8gMTAwO1xyXG4gIH1cclxuICBjYXRjaHtcclxuICAgIHJldHVybiBwcm9ncmVzcztcclxuICB9XHJcbn1cclxufSIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByb2dyZXNzQmFyQ29tcG9uZW50IH0gZnJvbSAnLi9hbmd1bGFyLXByb2dyZXNzLWJhci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtQcm9ncmVzc0JhckNvbXBvbmVudF0sXHJcbiAgZXhwb3J0czogW1Byb2dyZXNzQmFyQ29tcG9uZW50XSxcclxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cclxufSlcclxuZXhwb3J0IGNsYXNzIFByb2dyZXNzQmFyTW9kdWxlIHsgfSJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fdmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7SUF3Q0E7O1FBRUUsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7S0FDeEI7Ozs7Ozs7Ozs7SUFNRCx5Q0FBVTs7Ozs7SUFBVixVQUFXLE9BQWU7Ozs7WUFFcEIsQ0FBQyxHQUFlLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7UUFFOUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUEsQ0FBQyxDQUFDOztRQUUvQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEdBQUcsQ0FBQyxHQUFBLENBQUMsQ0FBQzs7O1lBRXhCLENBQUMsR0FBRyxDQUFDLE9BQU87Ozs7O1lBRVosSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7OztZQUVmLEtBQWUsSUFBQSxNQUFBQSxTQUFBLENBQUMsQ0FBQSxvQkFBQSxtQ0FBQztnQkFBYixJQUFJLEdBQUcsY0FBQTs7Z0JBRVQsSUFBRyxHQUFHLEdBQUcsQ0FBQyxFQUFDO29CQUNULElBQUksR0FBRyxHQUFHLENBQUM7aUJBQ1o7O3FCQUVJLElBQUcsR0FBRyxJQUFJLENBQUMsR0FBRSxDQUFDLEVBQUM7b0JBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDNUI7YUFDRjs7Ozs7Ozs7OztRQUVELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM1Qjs7Ozs7SUFFRCw0Q0FBYTs7OztJQUFiLFVBQWMsUUFBZ0I7UUFDNUIsSUFBRztZQUNELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7U0FDMUM7UUFDRCxXQUFLO1lBQ0gsT0FBTyxRQUFRLENBQUM7U0FDakI7S0FDRjs7Z0JBaEZBLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQ0osY0FBYztvQkFtQmxCLFFBQVEsRUFDUixtUUFNQzs2QkF6QlEsdWNBaUJSO2lCQVNGOzs7OzsyQkFJRSxLQUFLLFNBQUMsVUFBVTt3QkFDaEIsS0FBSyxTQUFDLE9BQU87MkJBQ2IsS0FBSyxTQUFDLGdCQUFnQjs7SUE4Q3pCLDJCQUFDO0NBakZEOzs7Ozs7QUNGQTtJQUtBO0tBUWtDOztnQkFSakMsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3FCQUNiO29CQUNELFlBQVksRUFBRSxDQUFDLG9CQUFvQixDQUFDO29CQUNwQyxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDL0IsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ2xDOztJQUNnQyx3QkFBQztDQVJsQzs7Ozs7Ozs7Ozs7Ozs7In0=

/***/ }),

/***/ "./src/app/main/main.module.ts":
/*!*************************************!*\
  !*** ./src/app/main/main.module.ts ***!
  \*************************************/
/*! exports provided: MainPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainPageModule", function() { return MainPageModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _components_xwing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/xwing.module */ "./src/app/components/xwing.module.ts");
/* harmony import */ var angular_progress_bar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular-progress-bar */ "./node_modules/angular-progress-bar/fesm5/angular-progress-bar.js");
/* harmony import */ var _main_page__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./main.page */ "./src/app/main/main.page.ts");
/* harmony import */ var _providers_http_provider__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../providers/http.provider */ "./src/app/providers/http.provider.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var routes = [
    {
        path: '',
        component: _main_page__WEBPACK_IMPORTED_MODULE_7__["MainPage"]
    }
];
var MainPageModule = /** @class */ (function () {
    function MainPageModule() {
    }
    MainPageModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes),
                _components_xwing_module__WEBPACK_IMPORTED_MODULE_5__["XwingModule"],
                angular_progress_bar__WEBPACK_IMPORTED_MODULE_6__["ProgressBarModule"],
            ],
            declarations: [_main_page__WEBPACK_IMPORTED_MODULE_7__["MainPage"]],
            providers: [_providers_http_provider__WEBPACK_IMPORTED_MODULE_8__["HttpProvider"]]
        })
    ], MainPageModule);
    return MainPageModule;
}());



/***/ }),

/***/ "./src/app/main/main.page.html":
/*!*************************************!*\
  !*** ./src/app/main/main.page.html ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header *ngIf=\"!dataService.initialized\">\n  <ion-toolbar>\n    <ion-buttons slot=\"end\">\n      <ion-button *ngIf=\"retry_button\" [disabled]=\"retry_button_disabled\" (click)=\"retryManifest()\">Retry Download</ion-button>\n      <ion-button *ngIf=\"data_button\" [disabled]=\"data_button_disabled\" (click)=\"downloadData()\">Download Data</ion-button>\n      <ion-button *ngIf=\"image_button\" [disabled]=\"image_button_disabled\" (click)=\"downloadArtwork()\">Download Artwork</ion-button>\n    </ion-buttons>\n    <ion-title class=\"title-bar\">{{ data_message }}</ion-title>\n    <div class=\"progress-bar-container\">\n      <progress-bar \n        [progress]=\"data_progress\" \n        [color]=\"'#488aff'\">\n      </progress-bar>\n    </div>\n  </ion-toolbar>\n</ion-header>\n<ion-content padding>\n  <div class=\"squadron-container\">\n    <div class=\"squadron-header\"></div>\n    <div [class]=\"squadronCss()\" *ngFor=\"let squadron of squadrons\">\n      <div class=\"squadron-header\">\n        <ion-toolbar>\n          <span class=\"squadron-name\">\n            <xwing-icon [name]=\"squadron.faction\"></xwing-icon>&nbsp;\n            {{ squadron.name }} ( {{ squadron.pointsDestroyed }} / {{ squadron.points}} )\n          </span>\n          <ion-buttons slot=\"end\">\n            <ion-button (click)=\"askRechargeRecurring()\">\n              Recover&nbsp;<xwing-icon [name]=\"'charge'\"></xwing-icon><xwing-icon [name]=\"'recurring'\"></xwing-icon>\n            </ion-button>\n            <ion-button (click)=\"presentDamageDeckActionsPopover($event, squadron)\" class=\"damage-deck-button\">\n              <span class=\"damage-deck-summary\">\n                <xwing-icon [name]=\"'hit'\" class=\"damage-deck-icon\"></xwing-icon>\n                <span class=\"damage-deck-summary-text\">{{ squadron.damagedeck.length}}</span>\n              </span>\n            </ion-button>\n            <ion-button (click)=\"removeSquadron(squadron)\">\n              <ion-icon name=\"close\"></ion-icon>\n            </ion-button>\n          </ion-buttons>\n        </ion-toolbar>\n      </div>\n      <xws-pilot \n        *ngFor=\"let pilot of squadron.pilots\" \n        [pilot]=\"pilot\" \n        [faction]=\"squadron.faction\"\n        [squadron]=\"squadron\"\n        [class]=\"pilotCss()\"></xws-pilot>\n    </div>\n  </div>\n  <ion-fab *ngIf=\"dataService.initialized\" vertical=\"bottom\" horizontal=\"end\" slot=\"fixed\">\n    <ion-fab-button>\n      <ion-icon name=\"more\"></ion-icon>\n    </ion-fab-button>\n    <ion-fab-list side=\"top\">\n      <ion-fab-button (click)=\"resetData()\">\n        <ion-icon name=\"nuclear\"></ion-icon>\n      </ion-fab-button>\n      <ion-fab-button *ngIf=\"squadrons.length > 0\" (click)=\"askReset()\">\n        <xwing-icon [name]=\"'reload'\"></xwing-icon>\n      </ion-fab-button>\n      <ion-fab-button *ngIf=\"snapshots.length > 1\" (click)=\"askUndo()\">\n        <ion-icon name=\"undo\"></ion-icon>\n      </ion-fab-button>\n      <ion-fab-button *ngIf=\"squadrons.length < 2\" (click)=\"xwsAddButton()\">\n        <ion-icon name=\"add\"></ion-icon>\n      </ion-fab-button>\n    </ion-fab-list>\n  </ion-fab>\n</ion-content>\n"

/***/ }),

/***/ "./src/app/main/main.page.scss":
/*!*************************************!*\
  !*** ./src/app/main/main.page.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".title-bar {\n  display: inline-block;\n  width: 50%; }\n\n.progress-bar-container {\n  display: inline-block;\n  width: 50%; }\n\n.squadron-container {\n  display: block; }\n\n.squadron-item {\n  display: inline-block; }\n\n.squadron-halfwidth {\n  display: inline-block;\n  width: 50%;\n  vertical-align: top; }\n\n.squadron-fullwidth {\n  width: 100%;\n  vertical-align: top; }\n\n.squadron-header {\n  display: block; }\n\n.squadron-name {\n  display: inline-block;\n  padding-left: 0.5vw; }\n\n.squadron-info {\n  display: inline-block; }\n\n.damage-deck-button {\n  vertical-align: center; }\n\n.damage-deck-summary {\n  padding-left: 0.5vw;\n  padding-right: 0.5vw;\n  padding-top: 0.5vh;\n  padding-bottom: 0.5vh;\n  background-color: black;\n  vertical-align: center; }\n\n.damage-deck-summary-text {\n  line-height: 1.5vh;\n  color: white;\n  display: inline-block; }\n\n.damage-deck-icon {\n  display: inline-block;\n  text-align: center;\n  font-size: 2vh;\n  color: red; }\n\n.pilotlist {\n  display: block; }\n\n.pilot {\n  display: inline-block; }\n\n.pilot-fullwidth {\n  display: block;\n  width: 100%; }\n\n.pilot-minwidth {\n  display: inline-block;\n  vertical-align: top; }\n"

/***/ }),

/***/ "./src/app/main/main.page.ts":
/*!***********************************!*\
  !*** ./src/app/main/main.page.ts ***!
  \***********************************/
/*! exports provided: MainPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainPage", function() { return MainPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/index.js");
/* harmony import */ var _modals_xws_modal_xws_modal_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modals/xws-modal/xws-modal.page */ "./src/app/modals/xws-modal/xws-modal.page.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_xwing_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/xwing-data.service */ "./src/app/services/xwing-data.service.ts");
/* harmony import */ var _popovers_damage_deck_actions_damage_deck_actions_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../popovers/damage-deck-actions/damage-deck-actions.component */ "./src/app/popovers/damage-deck-actions/damage-deck-actions.component.ts");
/* harmony import */ var _ionic_storage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/storage */ "./node_modules/@ionic/storage/fesm5/ionic-storage.js");
/* harmony import */ var _providers_http_provider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../providers/http.provider */ "./src/app/providers/http.provider.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};













var MainPage = /** @class */ (function () {
    function MainPage(modalController, dataService, router, platform, popoverController, events, alertController, ngZone, toastController, storage, http, loadingCtrl) {
        this.modalController = modalController;
        this.dataService = dataService;
        this.router = router;
        this.platform = platform;
        this.popoverController = popoverController;
        this.events = events;
        this.alertController = alertController;
        this.ngZone = ngZone;
        this.toastController = toastController;
        this.storage = storage;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.snapshots = [];
        this.squadrons = [];
        this.data_progress = 0;
        this.data_message = "X-Wing Tabled";
        this.retry_button = false;
        this.retry_button_disabled = false;
        this.data_button = false;
        this.data_button_disabled = false;
        this.image_button = false;
        this.image_button_disabled = false;
    }
    MainPage.prototype.ngOnInit = function () {
        var _this = this;
        this.events.subscribe(this.dataService.topic, function (event) {
            _this.data_event_handler(event);
        });
        this.events.subscribe("snapshot", function (event) {
            _this.snapshot();
        });
        this.events.subscribe("damagedeck", function (event) {
            _this.shuffleDamageDeck(_this.squadrons[0]);
        });
    };
    MainPage.prototype.restoreFromDisk = function () {
        return __awaiter(this, void 0, void 0, function () {
            var snapshots;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.ready()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.storage.get("snapshots")];
                    case 2:
                        snapshots = _a.sent();
                        this.ngZone.run(function () {
                            if (snapshots) {
                                _this.snapshots = snapshots;
                                var lastSnapshot = JSON.parse(JSON.stringify(_this.snapshots[_this.snapshots.length - 1]));
                                _this.squadrons = lastSnapshot.squadrons;
                                console.log(_this.squadrons);
                                _this.toastUndo(lastSnapshot.time);
                                if (_this.squadrons && _this.squadrons.length == 0) {
                                    _this.presentXwsModal();
                                }
                            }
                            else {
                                _this.presentXwsModal();
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.snapshot = function () {
        if (this.snapshots.length >= 5) {
            this.snapshots.shift();
        }
        this.snapshots.push({ time: new Date().toISOString(), squadrons: JSON.parse(JSON.stringify(this.squadrons)) });
        this.storage.set("snapshots", this.snapshots);
        console.log("snapshot created", this.snapshots);
    };
    MainPage.prototype.data_event_handler = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var alert_1, loading, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.data_message = event.message;
                        this.data_progress = event.progress;
                        if (event.status == "manifest_incomplete") {
                            this.data_button = true;
                            this.data_message = "X-Wing Tabled requires a local data update";
                        }
                        if (event.status == "data_download_errors") {
                            this.data_button = true;
                            this.data_message = "Some X-Wing data could not be downloaded";
                        }
                        if (!(event.status == "no_data_no_connection")) return [3 /*break*/, 3];
                        this.retry_button = true;
                        this.retry_button_disabled = false;
                        return [4 /*yield*/, this.alertController.create({
                                header: 'Internet Connection Required',
                                message: 'An Internet connection is required to update or download necessary data files the first time X-Wing Tabled runs.',
                                buttons: [
                                    { text: 'Retry',
                                        handler: function () {
                                            _this.ngZone.run(function () { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, this.alertController.dismiss()];
                                                        case 1:
                                                            _a.sent();
                                                            this.retryDownload();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                        }
                                    },
                                ]
                            })];
                    case 1:
                        alert_1 = _a.sent();
                        return [4 /*yield*/, alert_1.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        if (!(event.status == "loading_images")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.loadingCtrl.create({
                                message: "Loading artwork"
                            })];
                    case 4:
                        loading = _a.sent();
                        return [4 /*yield*/, loading.present()];
                    case 5:
                        _a.sent();
                        // Once the loading screen is present, signal XwingDataService that
                        // the controller is present. It will begin image loading sequence.
                        this.events.publish("mainpage", { message: "loading_controller_present" });
                        _a.label = 6;
                    case 6:
                        if (!(event.status == "loading_images_complete")) return [3 /*break*/, 10];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.loadingCtrl.dismiss()];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        err_1 = _a.sent();
                        return [3 /*break*/, 10];
                    case 10:
                        if (event.status == "manifest_current" || event.status == "data_download_complete") {
                            this.data_button = false;
                        }
                        if (event.status == "images_missing") {
                            this.data_message = "X-Wing Tabled needs to download some artwork";
                            this.image_button = true;
                        }
                        if (event.status == "images_complete") {
                            this.image_button = false;
                            this.restoreFromDisk();
                        }
                        if (event.status == "image_download_incomplete") {
                            this.image_button = true;
                        }
                        if (event.status == "image_download_complete") {
                            this.restoreFromDisk();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.retryDownload = function () {
        this.retry_button_disabled = true;
        this.retry_button = false;
        this.dataService.check_manifest();
    };
    MainPage.prototype.downloadData = function () {
        this.data_button_disabled = true;
        this.dataService.check_manifest();
    };
    MainPage.prototype.downloadArtwork = function () {
        this.image_button_disabled = true;
        this.dataService.download_missing_images(this.dataService.data);
    };
    MainPage.prototype.presentDamageDeckActionsPopover = function (ev, squadron) {
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverController.create({
                            component: _popovers_damage_deck_actions_damage_deck_actions_component__WEBPACK_IMPORTED_MODULE_5__["DamageDeckActionsComponent"],
                            componentProps: {
                                squadron: squadron
                            },
                            event: ev
                        })];
                    case 1:
                        popover = _a.sent();
                        return [4 /*yield*/, popover.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MainPage.prototype.squadronCss = function () {
        if (this.platform.isPortrait()) {
            return 'squadron-fullwidth';
        }
        if (this.squadrons.length > 1) {
            return 'squadron-halfwidth';
        }
        else {
            return 'squadron-fullwidth';
        }
    };
    MainPage.prototype.pilotCss = function () {
        if (this.platform.isPortrait()) {
            return 'pilot-fullwidth';
        }
        else {
            return 'pilot-minwidth';
        }
    };
    MainPage.prototype.removeSquadron = function (squadron) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Remove squadron?',
                            message: 'You are about to remove ' + squadron.name,
                            buttons: [
                                { text: 'OK',
                                    handler: function () {
                                        _this.ngZone.run(function () {
                                            var index = _this.squadrons.indexOf(squadron);
                                            _this.squadrons.splice(index, 1);
                                            _this.events.publish("snapshot", "create snapshot");
                                        });
                                    }
                                },
                                { text: 'Cancel',
                                    role: 'cancel',
                                    cssClass: 'secondary' }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MainPage.prototype.resetData = function (squadron) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Clear data cache?',
                            message: 'You are about to reset your data cache. You may have to re-download some data.',
                            buttons: [
                                { text: 'OK',
                                    handler: function () {
                                        _this.ngZone.run(function () {
                                            _this.squadrons = [];
                                            _this.snapshots = [];
                                            _this.data_progress = 0;
                                            _this.data_message = "X-Wing Tabled";
                                            _this.data_button = false;
                                            _this.data_button_disabled = false;
                                            _this.image_button = false;
                                            _this.image_button_disabled = false;
                                            _this.dataService.reset();
                                        });
                                    }
                                },
                                { text: 'Cancel',
                                    role: 'cancel',
                                    cssClass: 'secondary' }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MainPage.prototype.askRechargeRecurring = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Recharge Recurring',
                            message: 'Do you wish to recover all recurring ' +
                                '<i class="xwing-miniatures-font xwing-miniatures-font-charge"></i> and ' +
                                '<i class="xwing-miniatures-font xwing-miniatures-font-forcecharge"></i>?',
                            buttons: [
                                { text: 'OK',
                                    handler: function () {
                                        _this.ngZone.run(function () {
                                            _this.rechargeAllRecurring();
                                        });
                                    }
                                },
                                { text: 'Cancel',
                                    role: 'cancel',
                                    cssClass: 'secondary' }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MainPage.prototype.toastUndo = function (timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: 'Table restored to ' + timestamp,
                            duration: 2000,
                            position: 'bottom'
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.askUndo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Rewind Time?',
                            message: 'This will rewind time to ' + this.snapshots[this.snapshots.length - 2].time,
                            buttons: [
                                { text: 'OK',
                                    handler: function () {
                                        _this.ngZone.run(function () {
                                            _this.snapshots.pop();
                                            var snapshot = _this.snapshots.pop();
                                            _this.squadrons = snapshot.squadrons;
                                            _this.events.publish("snapshot", "create snapshot");
                                            _this.toastUndo(snapshot.time);
                                        });
                                    }
                                },
                                { text: 'Cancel',
                                    role: 'cancel',
                                    cssClass: 'secondary' }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MainPage.prototype.resetSquadrons = function () {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.squadrons.forEach(function (squadron) {
                            squadron.pointsDestroyed = 0;
                            squadron.damagediscard = [];
                            squadron.damagedeck = _this.dataService.getDamageDeck();
                            _this.shuffleDamageDeck(squadron);
                            squadron.pilots.forEach(function (pilot) {
                                pilot.damagecards = [];
                                pilot.conditions = [];
                                pilot.pointsDestroyed = 0;
                                pilot.stats.forEach(function (stat) {
                                    stat.remaining = stat.value;
                                });
                                pilot.upgrades.forEach(function (upgrade) {
                                    upgrade.side = 0;
                                    if (upgrade.sides[0].charges) {
                                        upgrade.sides[0].charges.remaining = upgrade.sides[0].charges.value;
                                    }
                                });
                            });
                        });
                        this.events.publish("snapshot", "create snapshot");
                        return [4 /*yield*/, this.toastController.create({
                                message: 'Squadrons reset',
                                duration: 2000,
                                position: 'bottom'
                            })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.askReset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Reset all squadrons?',
                            message: 'All charges, force and shields will be restored, damage cards shuffled and conditions removed.',
                            buttons: [
                                { text: 'OK',
                                    handler: function () {
                                        _this.ngZone.run(function () {
                                            _this.resetSquadrons();
                                        });
                                    }
                                },
                                { text: 'Cancel',
                                    role: 'cancel',
                                    cssClass: 'secondary' }
                            ]
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MainPage.prototype.rechargeAllRecurring = function () {
        var recover = function (stat) {
            stat.remaining += stat.recovers;
            if (stat.remaining > stat.value) {
                stat.remaining = stat.value;
            }
        };
        this.squadrons.forEach(function (squadron) {
            squadron.pilots.forEach(function (pilot) {
                for (var i = 0; i < pilot.stats.length; i++) {
                    var stat = pilot.stats[i];
                    if (stat.recovers) {
                        recover(stat);
                        pilot.stats.splice(i, 1, JSON.parse(JSON.stringify(stat)));
                    }
                }
                pilot.upgrades.forEach(function (upgrade) {
                    var side = upgrade.sides[0];
                    if (side.charges && side.charges.recovers) {
                        recover(side.charges);
                        side.charges = JSON.parse(JSON.stringify(side.charges));
                    }
                });
            });
        });
        this.events.publish("snapshot", "create snapshot");
    };
    MainPage.prototype.toastNotFound = function (xws, xwsType) {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toastController.create({
                            message: "WARNING: The " + xwsType + " " + xws + " could not be found. Try nuking your local data and downloading the latest XWS Data.",
                            duration: 5000,
                            position: 'bottom'
                        })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.injectShipData = function (pilot, faction) {
        // Inject ship data into pilot
        var xwsShip = pilot.ship;
        pilot.ship = this.dataService.getShip(faction, pilot.ship);
        if (pilot.ship != null) {
            // Inject stats array in pilot root
            pilot.stats = [];
            pilot.ship.stats.forEach(function (stat) {
                var statCopy = JSON.parse(JSON.stringify(stat));
                // Future proofing - in case a chassis ever has baked in recurring charge stats
                statCopy.remaining = stat.value;
                if (stat.recovers) {
                    statCopy.numbers = new Array(stat.recovers);
                }
                pilot.stats.push(statCopy);
            });
        }
        else {
            this.toastNotFound(xwsShip, "ship");
        }
    };
    MainPage.prototype.injectPilotData = function (pilot, faction) {
        // Get pilot data and insert it into pilot object
        pilot.pilot = this.dataService.getPilot(faction, pilot.ship.keyname, pilot.id);
        if (pilot.pilot != null) {
            // Creates a stat of { type: statType, remaining: 2, numbers: Array() }
            // for display compatibility
            var pushStat = function (stat, statType) {
                var statCopy = JSON.parse(JSON.stringify(stat));
                statCopy.type = statType;
                statCopy.remaining = stat.value;
                statCopy.numbers = Array(stat.numbers);
                pilot.stats.push(statCopy);
            };
            // If the pilot has charges, insert it as a stat
            if (pilot.pilot.charges) {
                pushStat(pilot.pilot.charges, 'charges');
            }
            // If the pilot has force, insert it as a stat
            if (pilot.pilot.force) {
                pushStat(pilot.pilot.force, 'force');
            }
            pilot.card_text = "";
            if (pilot.pilot.ability) {
                pilot.card_text += pilot.pilot.ability + "<br /><br />";
            }
            if (pilot.pilot.text) {
                pilot.card_text += pilot.pilot.text + "<br /><br />";
            }
            if (pilot.pilot.shipAbility && pilot.pilot.shipAbility.text) {
                pilot.card_text += "<i>" + pilot.pilot.shipAbility.name + "</i>: " +
                    pilot.pilot.shipAbility.text;
            }
            // Add additional game state variables
            pilot.damagecards = [];
            pilot.conditions = [];
            pilot.pointsDestroyed = 0;
        }
        else {
            this.toastNotFound(pilot.id, "pilot");
        }
    };
    MainPage.prototype.mangleUpgradeArray = function (pilot) {
        var _this = this;
        // Take xws upgrade list {'astromech': ['r2d2']} and mangle it to
        // [ { type: 'astromech', name: 'r2d2', etc... } ]
        var mangledUpgrades = [];
        if (pilot.upgrades) {
            Object.entries(pilot.upgrades).forEach(function (_a) {
                var upgradeType = _a[0], upgradeArray = _a[1];
                if (Array.isArray(upgradeArray)) {
                    upgradeArray.forEach(function (upgradeName) {
                        if (upgradeType == "force") {
                            upgradeType = "forcepower";
                        }
                        // Skip hardpoints on T70s for xws exports from raithos.github.io
                        if (upgradeType == "hardpoint") {
                            return;
                        }
                        var upgradeData = _this.dataService.getUpgrade(upgradeType, upgradeName);
                        if (upgradeData != null) {
                            upgradeData['type'] = upgradeType;
                            mangledUpgrades.push(upgradeData);
                        }
                        else {
                            _this.toastNotFound(upgradeName, "upgrade");
                        }
                    });
                }
            });
        }
        pilot.upgrades = mangledUpgrades;
    };
    MainPage.prototype.injectUpgradeData = function (pilot, upgrade) {
        // Set default "side" of upgrade card to side 0
        upgrade.side = 0;
        // Process each side
        upgrade.sides.forEach(function (side) {
            // Mangle charges stats
            if (side.charges) {
                side.charges.type = "charges";
                side.charges.remaining = side.charges.value;
                side.charges.numbers = Array(side.charges.recovers);
            }
            // Mangle force stats
            if (side.force) {
                side.force.numbers = Array(side.force.recovers);
                side.force.type = "force";
            }
            // Mangle attack stats
            if (side.attack) {
                side.attack.type = "attack";
                // Displayed icon should be the attack's icon
                side.attack.icon = side.attack.arc;
            }
            // If side has granted actions that aren't listed as actions, 
            // inject those
            if (!side.actions) {
                side.actions = [];
                if (side.grants) {
                    side.grants.forEach(function (grant) {
                        if (grant['type'] == "action") {
                            side.actions.push(grant.value);
                        }
                    });
                }
            }
        });
    };
    MainPage.prototype.injectShipBonuses = function (pilot) {
        // Search upgrades for any upgrade that has a 'grant'
        pilot.upgrades.forEach(function (upgrade) {
            var side = upgrade.sides[0];
            if (side.grants) {
                // Find shield or hull bonuses
                var grant_1 = side.grants.find(function (grant) { return grant.value == "shields" || grant.value == "hull"; });
                if (grant_1) {
                    // Find the granted bonus stat on the pilot and add it
                    var stat = pilot.stats.find(function (element) { return element.type == grant_1.value; });
                    stat.value += grant_1.amount;
                    stat.remaining = stat.value;
                }
            }
        });
    };
    MainPage.prototype.injectForceBonuses = function (pilot) {
        // Add any force bonuses to the pilot, creating a force stat if necessary
        pilot.upgrades.forEach(function (upgrade) {
            var side = upgrade.sides[0];
            // Find upgrades that have a force bonus
            if (side.force) {
                // Get the pilot's force stat
                var forceStat = pilot.stats.find(function (element) { return element.type == 'force'; });
                // If no force stat exists, create one
                if (!forceStat) {
                    forceStat = { value: 0, recovers: 0, type: 'force', numbers: [] };
                    pilot.stats.push(forceStat);
                }
                // Add force bonuses
                forceStat.value += side.force.value;
                forceStat.recovers += side.force.recovers;
                forceStat.numbers = Array(forceStat.recovers);
                forceStat.remaining = forceStat.value;
            }
        });
    };
    MainPage.prototype.calculatePoints = function (pilot) {
        var pilotCost = pilot.pilot.cost;
        var upgradeCost = 0;
        pilot.upgrades.forEach(function (upgrade) {
            if (upgrade.cost) {
                if ("value" in upgrade.cost) {
                    upgradeCost += upgrade.cost.value;
                }
                if ("variable" in upgrade.cost) {
                    var statValue = "";
                    if (upgrade.cost.variable == "size") {
                        statValue = pilot.ship.size;
                    }
                    else {
                        statValue = pilot.stats.find(function (stat) { return stat.type == upgrade.cost.variable; }).value;
                    }
                    upgradeCost += upgrade.cost.values[statValue];
                }
            }
        });
        pilot.points = pilotCost + upgradeCost;
    };
    MainPage.prototype.shuffleDamageDeck = function (squadron) {
        return __awaiter(this, void 0, void 0, function () {
            var newDeck, index, card, toast;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newDeck = [];
                        while (squadron.damagedeck.length > 0) {
                            index = Math.floor(Math.random() * Math.floor(squadron.damagedeck.length));
                            card = squadron.damagedeck[index];
                            squadron.damagedeck.splice(index, 1);
                            newDeck.push(card);
                        }
                        squadron.damagedeck = newDeck;
                        return [4 /*yield*/, this.toastController.create({
                                message: 'Damage Deck Shuffled',
                                duration: 2000,
                                position: 'top'
                            })];
                    case 1:
                        toast = _a.sent();
                        toast.present();
                        this.events.publish("snapshot", "Shuffled Damage Deck");
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.xwsAddButton = function () {
        this.presentXwsModal();
    };
    MainPage.prototype.processFFG = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            var _this = this;
            return __generator(this, function (_a) {
                url = "https://squadbuilder.fantasyflightgames.com/api/squads/" + uuid + "/";
                this.http.get(url).subscribe(function (data) {
                    var cost = data.cost;
                    var name = data.name;
                    var faction = data.faction.name;
                    var pilots = [];
                    data.deck.forEach(function (pilot) {
                        var xwsPilot = _this.dataService.getXwsFromFFG(pilot.pilot_card.id);
                        xwsPilot.points = pilot.cost;
                        var upgrades = {};
                        pilot.slots.forEach(function (upgrade) {
                            var upgradeData = _this.dataService.getXwsFromFFG(upgrade.id);
                            if (upgrades[upgradeData.type] == undefined) {
                                upgrades[upgradeData.type] = [];
                            }
                            upgrades[upgradeData.type].push(upgradeData.xws);
                        });
                        xwsPilot.upgrades = upgrades;
                        pilots.push(xwsPilot);
                    });
                    var squadron = {
                        description: data.description,
                        faction: data.faction.name.replace(/ /g, '').toLowerCase(),
                        name: data.name,
                        points: data.cost,
                        pilots: pilots
                    };
                    console.log("FFG SquadBuilder response", data);
                    console.log("FFG -> XWS", squadron);
                    _this.processXws(squadron);
                }, function (error) {
                    console.log("Unable to get FFG SquadBuilder data", error);
                });
                return [2 /*return*/];
            });
        });
    };
    MainPage.prototype.processYasb = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var pilots, squadron;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pilots = [];
                        data.pilots.forEach(function (pilot) {
                            var yasbPilot = _this.dataService.getYasbPilot(pilot.id);
                            var xwsPilot = { id: yasbPilot.xws, ship: yasbPilot.ship, upgrades: {} };
                            var upgrades = {};
                            pilot.upgrades.forEach(function (upgrade) {
                                var hardpointRegex = /\d{3}(\:U\.\-?\d+)/g;
                                var hardpoints = upgrade.match(hardpointRegex);
                                var upgradeNum = -1;
                                if (hardpoints && hardpoints[0]) {
                                    upgradeNum = parseInt(hardpoints[0].split('.')[1]);
                                }
                                else {
                                    upgradeNum = parseInt(upgrade);
                                }
                                if (upgradeNum == -1) {
                                    return;
                                }
                                var yasbUpgrade = _this.dataService.getYasbUpgrade(upgradeNum);
                                if (upgrades[yasbUpgrade.slot] == undefined) {
                                    upgrades[yasbUpgrade.slot] = [];
                                }
                                upgrades[yasbUpgrade.slot].push(yasbUpgrade.xws);
                            });
                            xwsPilot.upgrades = upgrades;
                            pilots.push(xwsPilot);
                        });
                        squadron = {
                            name: data.name,
                            faction: data.faction,
                            pilots: pilots
                        };
                        console.log("YASB squadron", squadron);
                        return [4 /*yield*/, this.processXws(squadron)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MainPage.prototype.processXws = function (squadron) {
        return __awaiter(this, void 0, void 0, function () {
            var toast;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.ngZone.run(function () {
                            var squadPoints = 0;
                            squadron.damagediscard = [];
                            squadron.damagedeck = _this.dataService.getDamageDeck();
                            squadron.pilots.forEach(function (pilot) {
                                _this.injectShipData(pilot, squadron.faction);
                                _this.injectPilotData(pilot, squadron.faction);
                                _this.mangleUpgradeArray(pilot);
                                // Process each upgrade card
                                pilot.upgrades.forEach(function (upgrade) {
                                    _this.injectUpgradeData(pilot, upgrade);
                                });
                                _this.calculatePoints(pilot);
                                squadPoints += pilot.points;
                                _this.injectShipBonuses(pilot);
                                _this.injectForceBonuses(pilot);
                            });
                            squadron.points = squadPoints;
                            squadron.pointsDestroyed = 0;
                            _this.shuffleDamageDeck(squadron);
                            console.log("xws loaded and data injected", squadron);
                            _this.squadrons = [squadron];
                            _this.events.publish("snapshot", "Squadron " + squadron.name + " added");
                        });
                        return [4 /*yield*/, this.toastController.create({
                                message: 'Squadron added, Damage Deck shuffled',
                                duration: 2000,
                                position: 'bottom'
                            })];
                    case 1:
                        toast = _a.sent();
                        return [4 /*yield*/, toast.present()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MainPage.prototype.presentXwsModal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modal, data, squadron;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.modalController.create({
                            component: _modals_xws_modal_xws_modal_page__WEBPACK_IMPORTED_MODULE_2__["XwsModalPage"]
                        })];
                    case 1:
                        modal = _a.sent();
                        return [4 /*yield*/, modal.present()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, modal.onWillDismiss()];
                    case 3:
                        data = (_a.sent()).data;
                        if (!data)
                            return [2 /*return*/];
                        if (data.ffg) {
                            return [2 /*return*/, this.processFFG(data.ffg)];
                        }
                        if (data.yasb) {
                            return [2 /*return*/, this.processYasb(data.yasb)];
                        }
                        if (data.xws) {
                            squadron = data.xws;
                            return [2 /*return*/, this.processXws(squadron)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-main',
            template: __webpack_require__(/*! ./main.page.html */ "./src/app/main/main.page.html"),
            styles: [__webpack_require__(/*! ./main.page.scss */ "./src/app/main/main.page.scss")],
        }),
        __metadata("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["ModalController"],
            _services_xwing_data_service__WEBPACK_IMPORTED_MODULE_4__["XwingDataService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["Platform"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["PopoverController"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["Events"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["AlertController"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["ToastController"],
            _ionic_storage__WEBPACK_IMPORTED_MODULE_6__["Storage"],
            _providers_http_provider__WEBPACK_IMPORTED_MODULE_7__["HttpProvider"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["LoadingController"]])
    ], MainPage);
    return MainPage;
}());



/***/ })

}]);
//# sourceMappingURL=main-main-module.js.map