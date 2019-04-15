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
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
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

module.exports = "<div *ngIf=\"layout.getClass().includes('phone')\" class=\"squadron-toolbar\">\n  <div class='active' *ngIf=\"state.squadrons[squadronNum]\">\n    <xwing-icon [name]=\"state.squadrons[squadronNum].faction\"></xwing-icon>\n    {{ state.squadrons[squadronNum].name }} \n    ({{ state.getSquadronPointsDestroyed(squadronNum) }} / \n    {{ state.getSquadronPointTotal(squadronNum) }})\n    <i class=\"fa fa-times\" (click)=\"askClose()\"></i> \n  </div>\n  <div \n    *ngIf=\"state.squadrons.length > 1\" \n    [class]=\"state.squadrons[squadronNum + 1] ? 'active hover squad-control' : 'squad-control'\"\n    (click)=\"goToSquadron(squadronNum + 1)\"\n    style=\"float: right;\">\n    <i class=\"fa fa-caret-right\"></i>\n  </div>\n  <div \n    *ngIf=\"state.squadrons.length > 1\" \n    [class]=\"state.squadrons[squadronNum - 1] ? 'active hover squad-control' : 'squad-control'\"\n    (click)=\"goToSquadron(squadronNum - 1)\"\n    style=\"float: right;\">\n    <i class=\"fa fa-caret-left\"></i>\n  </div>\n</div>\n<div *ngIf=\"!layout.getClass().includes('phone')\" class=\"squadron-toolbar\">\n  <div *ngFor=\"let squadron of state.squadrons\" \n    (click)=\"goToSquadron(squadron.squadronNum)\"\n    [class]=\"squadron.squadronNum == squadronNum ? 'active' : ''\">\n    <xwing-icon [name]=\"squadron.faction\"></xwing-icon>{{ squadron.name }} \n    ({{ state.getSquadronPointsDestroyed(squadron.squadronNum) }} / \n    {{ state.getSquadronPointTotal(squadron.squadronNum) }})\n    <i *ngIf=\"squadron.squadronNum == squadronNum\" class=\"fa fa-times\" (click)=\"askClose()\"></i>\n  </div>\n  <div (click)=\"xwsAddButton()\" class=\"active hover squad-control\">\n    <i class=\"fa fa-plus\"></i>\n  </div>\n  <div \n    *ngIf=\"state.squadrons.length > 1\" \n    [class]=\"state.squadrons[squadronNum + 1] ? 'active hover squad-control' : 'squad-control'\"\n    (click)=\"goToSquadron(squadronNum + 1)\"\n    style=\"float: right;\">\n    <i class=\"fa fa-caret-right\"></i>\n  </div>\n  <div \n    *ngIf=\"state.squadrons.length > 1\" \n    [class]=\"state.squadrons[squadronNum - 1] ? 'active hover squad-control' : 'squad-control'\"\n    (click)=\"goToSquadron(squadronNum - 1)\"\n    style=\"float: right;\">\n    <i class=\"fa fa-caret-left\"></i>\n  </div>\n</div>\n<div *ngIf=\"!state.squadrons[squadronNum]\" [class]=\"'card-container' + layout.getClass()\">\n  <div class=\"card\">\n    <img src=\"assets/img/splash.png\">\n    <div class=\"card-content\">\n      <div *ngIf=\"dataService.initialized\">\n        <span class=\"card-title\">X-Wing Tabled</span><br /><br />\n        <div *ngIf=\"state.squadrons.length == 0\">This app is a card and token \n          manager for X-Wing Miniatures Second Edition.<br /><br /> To begin, you may \n          <a href=\"#\" (click)=\"xwsAddButton()\">import a squadron</a>.\n        </div>\n        <div *ngIf=\"state.squadrons.length > 0\" class=\"squadron-list-header\">\n          Saved squadrons\n        </div>\n        <div *ngFor=\"let squadron of state.squadrons\" \n          (click)=\"goToSquadron(squadron.squadronNum)\"\n          class=\"squadron-link\">\n          <xwing-icon [name]=\"squadron.faction\"></xwing-icon>\n          <span>{{ squadron.name }}</span>\n        </div>\n      </div>\n      <div *ngIf=\"!dataService.initialized\">\n        <div class=\"progress-bar-container\">\n          <progress-bar \n            [progress]=\"data_progress\" \n            [color]=\"'#488aff'\">\n          </progress-bar>\n        </div>\n        {{ data_message }}\n        <div class=\"ion-text-right\">\n          <ion-button *ngIf=\"retry_button\" [disabled]=\"retry_button_disabled\" (click)=\"retryManifest()\">Retry Download</ion-button>\n          <ion-button *ngIf=\"data_button\" [disabled]=\"data_button_disabled\" (click)=\"downloadData()\">Download Data</ion-button>\n          <ion-button *ngIf=\"image_button\" [disabled]=\"image_button_disabled\" (click)=\"downloadArtwork()\">Download Artwork</ion-button> \n          <ion-button *ngIf=\"continue_button\" (click)=\"continueAnyway()\">Continue</ion-button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<ion-content padding>\n  <squadron *ngIf=\"state.squadrons[squadronNum]\" [squadron]=\"state.squadrons[squadronNum]\" [squadronNum]=\"squadronNum\"></squadron>\n  <ion-fab *ngIf=\"dataService.initialized\" vertical=\"bottom\" horizontal=\"end\" slot=\"fixed\" class=\"labels2\">\n    <ion-fab-button>\n      <ion-icon name=\"more\"></ion-icon>\n    </ion-fab-button>\n    <ion-fab-list side=\"top\" class=\"labels\">\n      <ion-fab-button (click)=\"resetData()\" data-desc=\"Nuke local data\">\n        <ion-icon name=\"nuclear\"></ion-icon>\n      </ion-fab-button>\n      <ion-fab-button (click)=\"xwsAddButton()\" data-desc=\"Import squadron\">\n          <ion-icon name=\"add\"></ion-icon>\n      </ion-fab-button>\n      <ion-fab-button *ngIf=\"squadron\" (click)=\"askReset()\" data-desc=\"Reset squadron\">\n        <i class=\"fa fa-power-off\"></i>\n      </ion-fab-button>\n      <ion-fab-button *ngIf=\"state.snapshots.length > 1\" (click)=\"askUndo()\" data-desc=\"Undo\">\n        <ion-icon name=\"undo\"></ion-icon>\n      </ion-fab-button>\n      <ion-fab-button *ngIf=\"squadron\" \n        (click)=\"damageDeck()\" \n        data-desc=\"Damage deck\">\n        <xwing-icon [name]=\"'hit'\"></xwing-icon>\n      </ion-fab-button>\n      <ion-fab-button *ngIf=\"squadron\" (click)=\"askRecharge()\" data-desc=\"Recurring charges\">\n        <xwing-icon [name]=\"'charge'\"></xwing-icon>\n      </ion-fab-button>\n    </ion-fab-list>\n  </ion-fab>\n</ion-content>\n"

/***/ }),

/***/ "./src/app/main/main.page.scss":
/*!*************************************!*\
  !*** ./src/app/main/main.page.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".title-bar {\n  display: inline-block;\n  width: 50%; }\n\n.progress-bar-container {\n  display: block;\n  width: 100%; }\n\n.squadron-container {\n  display: block; }\n\n.squadron-item {\n  display: inline-block; }\n\n.squadron-halfwidth {\n  display: inline-block;\n  width: 50%;\n  vertical-align: top; }\n\n.squadron-fullwidth {\n  width: 100%;\n  vertical-align: top; }\n\n.squadron-header {\n  display: block; }\n\n.squadron-name {\n  display: inline-block;\n  padding-left: 0.5vw; }\n\n.squadron-info {\n  display: inline-block; }\n\n.damage-deck-button {\n  vertical-align: center; }\n\n.damage-deck-summary {\n  padding-left: 0.5vw;\n  padding-right: 0.5vw;\n  padding-top: 0.5vh;\n  padding-bottom: 0.5vh;\n  background-color: black;\n  vertical-align: center; }\n\n.damage-deck-summary-text {\n  line-height: 1.5vh;\n  color: white;\n  display: inline-block; }\n\n.damage-deck-icon {\n  display: inline-block;\n  text-align: center;\n  font-size: 2vh;\n  color: red; }\n\n.pilotlist {\n  display: block; }\n\n.pilot {\n  display: inline-block; }\n\n.pilot-fullwidth {\n  display: block;\n  width: 100%; }\n\n.pilot-minwidth {\n  display: inline-block;\n  vertical-align: top; }\n\n.card-container, .card-container-phone-portrait, .card-container-phone-landscape, .card-container-tablet, .card-container-tablet-portrait, .card-container-tablet-landscape {\n  width: 100%;\n  height: 90%;\n  display: flex;\n  align-items: center;\n  justify-content: center; }\n\n.card-container .card, .card-container-phone-portrait .card, .card-container-phone-landscape .card, .card-container-tablet .card, .card-container-tablet-portrait .card, .card-container-tablet-landscape .card {\n    overflow: hidden;\n    border-radius: 0.5em;\n    box-shadow: 0.1em 0.1em 0.25em #888888;\n    width: 33%; }\n\n.card-container .card .card-content, .card-container-phone-portrait .card .card-content, .card-container-phone-landscape .card .card-content, .card-container-tablet .card .card-content, .card-container-tablet-portrait .card .card-content, .card-container-tablet-landscape .card .card-content {\n      padding: 0.5em 1em 1em 1em; }\n\n.card-container .card .card-title, .card-container-phone-portrait .card .card-title, .card-container-phone-landscape .card .card-title, .card-container-tablet .card .card-title, .card-container-tablet-portrait .card .card-title, .card-container-tablet-landscape .card .card-title {\n      font-size: 1.25em;\n      font-weight: bolder; }\n\n.card-container-phone-portrait .card, .card-container-phone-landscape .card {\n  border-radius: 0em;\n  width: 100%;\n  height: 100%; }\n\n.card-container-phone-landscape .card {\n  width: 50%; }\n\n.card-container-phone-landscape .card img {\n    display: none; }\n\n.card-container-tablet .card, .card-container-tablet-portrait .card {\n  width: 50%; }\n\n.card-container-tablet-landscape .card {\n  width: 33%; }\n\nion-fab-button[data-desc] {\n  position: relative; }\n\nion-fab-button[data-desc]::after {\n  position: absolute;\n  content: attr(data-desc);\n  z-index: 1;\n  right: 55px;\n  bottom: 4px;\n  background-color: var(--ion-color-light);\n  padding: 9px;\n  border-radius: 5px;\n  color: var(--ion-color-dark);\n  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12); }\n\n.squadron-toolbar {\n  overflow-y: hidden;\n  position: relative;\n  height: 2.5em;\n  padding-left: 0.1em;\n  padding-right: 0.25em;\n  padding-top: 0.25em;\n  background-color: #1f1f1f; }\n\n.squadron-toolbar xwing-icon {\n    margin-right: 0.25em;\n    line-height: 1em;\n    vertical-align: baseline;\n    position: relative;\n    top: -0.08em; }\n\n.squadron-toolbar div {\n    position: relative;\n    background-color: #444444;\n    color: #aaaaaa;\n    height: 200%;\n    display: inline-block;\n    border-radius: 0.5em;\n    padding-top: 0.5em;\n    padding-left: 1em;\n    padding-right: 1em;\n    line-height: 1em;\n    vertical-align: text-bottom;\n    margin-right: 0.1em; }\n\n.squadron-toolbar div:hover:not(.active) {\n    cursor: pointer;\n    text-decoration: underline; }\n\n.squadron-toolbar div.active {\n    background-color: white;\n    color: #1f1f1f; }\n\n.squadron-toolbar div.hover {\n    cursor: pointer;\n    text-decoration: underline; }\n\n.squadron-toolbar i.fa-times {\n    margin-left: 0.25em; }\n\n.squadron-toolbar i.fa-times:hover {\n    cursor: pointer;\n    text-decoration: underline; }\n\n.squadron-toolbar .squad-control {\n    float: right;\n    margin-right: 0em;\n    border-radius: 0em; }\n\n.squadron-link {\n  text-decoration: none;\n  color: #1f1f1f;\n  cursor: pointer;\n  margin-bottom: 0.25em; }\n\n.squadron-link xwing-icon {\n    position: relative;\n    top: -0.05em;\n    display: inline-block;\n    width: 1.5em; }\n\n.squadron-link:hover span {\n  text-decoration: underline; }\n\n.squadron-list-header {\n  font-style: italic;\n  margin-bottom: 0.5em; }\n"

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
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _modals_xws_modal_xws_modal_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modals/xws-modal/xws-modal.page */ "./src/app/modals/xws-modal/xws-modal.page.ts");
/* harmony import */ var _services_xwing_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/xwing-data.service */ "./src/app/services/xwing-data.service.ts");
/* harmony import */ var _popovers_damage_deck_actions_damage_deck_actions_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../popovers/damage-deck-actions/damage-deck-actions.component */ "./src/app/popovers/damage-deck-actions/damage-deck-actions.component.ts");
/* harmony import */ var _ionic_storage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/storage */ "./node_modules/@ionic/storage/fesm5/ionic-storage.js");
/* harmony import */ var _providers_http_provider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../providers/http.provider */ "./src/app/providers/http.provider.ts");
/* harmony import */ var _services_xwing_state_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/xwing-state.service */ "./src/app/services/xwing-state.service.ts");
/* harmony import */ var _services_xwing_import_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../services/xwing-import.service */ "./src/app/services/xwing-import.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_layout_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../services/layout.service */ "./src/app/services/layout.service.ts");
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
    function MainPage(modalController, dataService, router, platform, popoverController, events, alertController, ngZone, toastController, storage, http, loadingCtrl, state, importService, route, layout) {
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
        this.state = state;
        this.importService = importService;
        this.route = route;
        this.layout = layout;
        this.data_progress = 0;
        this.data_message = "X-Wing Tabled";
        this.retry_button = false;
        this.retry_button_disabled = false;
        this.data_button = false;
        this.data_button_disabled = false;
        this.image_button = false;
        this.image_button_disabled = false;
        this.continue_button = false;
        this.squadronNum = -1;
        this.squadron = null;
    }
    MainPage.prototype.ngOnInit = function () {
        var _this = this;
        var squadronNumParam = this.route.snapshot.paramMap.get("squadronNum");
        if (squadronNumParam) {
            this.squadronNum = parseInt(squadronNumParam);
            this.squadron = this.state.squadrons[this.squadronNum];
        }
        this.events.subscribe(this.dataService.topic, function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.data_event_handler(event)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    MainPage.prototype.ionViewDidEnter = function () {
        this.state.snapshotCheck();
    };
    MainPage.prototype.getPointsDestroyed = function (squadron) {
        var _this = this;
        var points = 0;
        squadron.pilots.forEach(function (pilot) {
            points += _this.dataService.getPointsDestroyed(pilot);
        });
        return points;
    };
    MainPage.prototype.getPointTotal = function (squadron) {
        var _this = this;
        var points = 0;
        squadron.pilots.forEach(function (pilot) {
            points += _this.dataService.getPilotPoints(pilot);
        });
    };
    MainPage.prototype.squadronRoute = function (index) {
        return "/squadron/" + index;
    };
    MainPage.prototype.goToSquadron = function (index) {
        if (index == this.squadronNum || !this.state.squadrons[index]) {
            return;
        }
        this.router.navigateByUrl(this.squadronRoute(index));
        return;
    };
    MainPage.prototype.closeSquadron = function (index) {
        this.state.squadrons.splice(index, 1);
        for (var i = 0; i < this.state.squadrons.length; i++) {
            this.state.squadrons[i].squadronNum = i;
        }
        this.state.snapshot();
        if (this.state.squadrons.length == 0) {
            this.router.navigateByUrl("/");
            return;
        }
        var destination = this.squadronNum;
        if (this.squadronNum >= this.state.squadrons.length) {
            destination = this.state.squadrons.length - 1;
            this.router.navigateByUrl(this.squadronRoute(destination));
            return;
        }
        else {
            this.squadron = this.state.squadrons[this.squadronNum];
        }
    };
    MainPage.prototype.getPoints = function () {
        var _this = this;
        if (!this.state.squadrons[this.squadronNum].pilots) {
            return "";
        }
        var pointsDestroyed = 0;
        var totalPoints = 0;
        this.state.squadrons[this.squadronNum].pilots.forEach(function (pilot) {
            pointsDestroyed += _this.dataService.getPointsDestroyed(pilot);
            totalPoints += _this.dataService.getPilotPoints(pilot);
        });
        return "( " + pointsDestroyed + " / " + totalPoints + " )";
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
                        if (!(event.status == "images_complete")) return [3 /*break*/, 12];
                        this.image_button = false;
                        return [4 /*yield*/, this.loadState()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        if (event.status == "image_download_incomplete") {
                            this.image_button = false;
                            this.image_button_disabled = false;
                            this.continue_button = true;
                        }
                        if (!(event.status == "image_download_complete")) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.loadState()];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.continueAnyway = function () {
        this.dataService.initialized = true;
    };
    MainPage.prototype.loadState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Restoring...");
                        return [4 /*yield*/, this.state.restoreFromDisk()];
                    case 1:
                        _a.sent();
                        console.log("Restored!");
                        if (this.state.snapshots && this.state.snapshots.length) {
                            this.toastUndo(this.state.getLastSnapshotTime());
                        }
                        this.squadron = this.state.squadrons[this.squadronNum];
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
        this.dataService.download_missing_images();
    };
    MainPage.prototype.damageDeck = function () {
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popoverController.create({
                            component: _popovers_damage_deck_actions_damage_deck_actions_component__WEBPACK_IMPORTED_MODULE_4__["DamageDeckActionsComponent"],
                            componentProps: {
                                squadronNum: this.squadronNum
                            },
                        })];
                    case 1:
                        popover = _a.sent();
                        return [4 /*yield*/, popover.present()];
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
                                            _this.data_progress = 0;
                                            _this.data_message = "X-Wing Tabled";
                                            _this.data_button = false;
                                            _this.data_button_disabled = false;
                                            _this.image_button = false;
                                            _this.image_button_disabled = false;
                                            _this.state.reset();
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
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.askRecharge = function () {
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
                                            _this.state.rechargeAllRecurring(_this.squadronNum);
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
                            message: 'This will rewind time to ' + this.state.snapshots[this.state.snapshots.length - 2].time,
                            buttons: [
                                { text: 'OK',
                                    handler: function () {
                                        _this.ngZone.run(function () {
                                            var time = _this.state.undo();
                                            _this.toastUndo(time);
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
    MainPage.prototype.askClose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Close squadron?',
                            message: 'This will close the current squadron',
                            buttons: [
                                { text: 'OK',
                                    handler: function () {
                                        _this.ngZone.run(function () {
                                            _this.closeSquadron(_this.squadronNum);
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
                                        _this.ngZone.run(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var toast;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        this.state.resetSquadron(this.squadronNum);
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
                                        }); });
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
    MainPage.prototype.xwsAddButton = function () {
        this.presentXwsModal();
    };
    MainPage.prototype.presentXwsModal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var modal, data, url_1, squadron, newSquadronNum, url, e_1, toast;
            var _this = this;
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
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 5, , 7]);
                        if (data.ffg) {
                            url_1 = "https://squadbuilder.fantasyflightgames.com/api/squads/" + data.ffg + "/";
                            this.http.get(url_1).subscribe(function (data) {
                                _this.state.addSquadron(_this.importService.processFFG(data));
                            }, function (error) { return __awaiter(_this, void 0, void 0, function () {
                                var toast;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log("Unable to get FFG SquadBuilder data", error);
                                            return [4 /*yield*/, this.toastController.create({
                                                    message: "ERROR: Unable to load FFG Squad",
                                                    duration: 5000,
                                                    position: 'bottom'
                                                })];
                                        case 1:
                                            toast = _a.sent();
                                            toast.present();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            this.state.addSquadron(this.importService.processFFG(data.ffg));
                        }
                        if (data.yasb) {
                            this.state.addSquadron(this.importService.processYasb(data.yasb));
                        }
                        if (data.xws) {
                            squadron = data.xws;
                            this.state.addSquadron(this.importService.processXws(squadron));
                        }
                        newSquadronNum = this.state.squadrons.length - 1;
                        url = '/squadron/' + newSquadronNum;
                        this.router.navigateByUrl(url);
                        return [3 /*break*/, 7];
                    case 5:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [4 /*yield*/, this.toastController.create({
                                message: e_1,
                                duration: 2000,
                                position: 'bottom'
                            })];
                    case 6:
                        toast = _a.sent();
                        toast.present();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MainPage = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-main',
            template: __webpack_require__(/*! ./main.page.html */ "./src/app/main/main.page.html"),
            styles: [__webpack_require__(/*! ./main.page.scss */ "./src/app/main/main.page.scss")]
        }),
        __metadata("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_1__["ModalController"],
            _services_xwing_data_service__WEBPACK_IMPORTED_MODULE_3__["XwingDataService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["Router"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["Platform"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["PopoverController"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["Events"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["AlertController"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["ToastController"],
            _ionic_storage__WEBPACK_IMPORTED_MODULE_5__["Storage"],
            _providers_http_provider__WEBPACK_IMPORTED_MODULE_6__["HttpProvider"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_1__["LoadingController"],
            _services_xwing_state_service__WEBPACK_IMPORTED_MODULE_7__["XwingStateService"],
            _services_xwing_import_service__WEBPACK_IMPORTED_MODULE_8__["XwingImportService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_9__["ActivatedRoute"],
            _services_layout_service__WEBPACK_IMPORTED_MODULE_10__["LayoutService"]])
    ], MainPage);
    return MainPage;
}());



/***/ })

}]);