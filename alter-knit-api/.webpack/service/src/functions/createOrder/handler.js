/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/functions/createOrder/handler.ts":
/*!**********************************************!*\
  !*** ./src/functions/createOrder/handler.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"handler\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! source-map-support/register */ \"source-map-support/register\");\n/* harmony import */ var source_map_support_register__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(source_map_support_register__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst sgMail = __webpack_require__(/*! @sendgrid/mail */ \"@sendgrid/mail\");\nconst handler = async (event) => {\n    console.log('Event', event);\n    const partialOrder = JSON.parse(event.body);\n    const id = uuid__WEBPACK_IMPORTED_MODULE_2__.v4();\n    const order = {\n        id: id,\n        ...partialOrder\n    };\n    console.log('order', order);\n    const docClient = createDynamoDBClient();\n    await docClient.put({\n        TableName: process.env.ALTERKNIT_TABLE,\n        Item: order\n    }).promise();\n    await sendEmail();\n    return {\n        statusCode: 201,\n        body: JSON.stringify({\n            item: order\n        })\n    };\n};\nfunction createDynamoDBClient() {\n    if (process.env.IS_OFFLINE) {\n        return new aws_sdk__WEBPACK_IMPORTED_MODULE_1__.DynamoDB.DocumentClient({\n            region: 'localhost',\n            endpoint: 'http://localhost:8000'\n        });\n    }\n    return new aws_sdk__WEBPACK_IMPORTED_MODULE_1__.DynamoDB.DocumentClient();\n}\nasync function sendEmail() {\n    sgMail.setApiKey(process.env.SENDGRID_API_KEY);\n    const msg = {\n        to: 'saiayyappa1996@gmail.com',\n        from: 'saiayyappaor@gmail.com',\n        subject: 'Sending with SendGrid is Fun',\n        text: 'and easy to do anywhere, even with Node.js',\n        html: '<strong>and easy to do anywhere, even with Node.js</strong>',\n    };\n    console.log(msg);\n    await sgMail\n        .send(msg)\n        .then((response) => {\n        console.log('Email sent', response);\n    })\n        .catch((error) => {\n        console.error(error);\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvZnVuY3Rpb25zL2NyZWF0ZU9yZGVyL2hhbmRsZXIudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBRUE7QUFDQTtBQUtBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2FsdGVyLWtuaXQtYXBpLy4vc3JjL2Z1bmN0aW9ucy9jcmVhdGVPcmRlci9oYW5kbGVyLnRzPzZjMzAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInXG5cbmltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrJ1xuaW1wb3J0ICogYXMgdXVpZCBmcm9tICd1dWlkJ1xuXG5pbXBvcnQgeyBBUElHYXRld2F5UHJveHlSZXN1bHQgfSBmcm9tICdhd3MtbGFtYmRhJ1xuaW1wb3J0IHsgT3JkZXIgfSBmcm9tICdzcmMvbW9kZWxzJ1xuXG5jb25zdCBzZ01haWwgPSByZXF1aXJlKCdAc2VuZGdyaWQvbWFpbCcpXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGV2ZW50KTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHQ+ID0+IHtcbiAgY29uc29sZS5sb2coJ0V2ZW50JywgZXZlbnQpO1xuICBjb25zdCBwYXJ0aWFsT3JkZXI6IE9yZGVyID0gSlNPTi5wYXJzZShldmVudC5ib2R5KSBhcyBPcmRlcjtcbiAgY29uc3QgaWQgPSB1dWlkLnY0KCk7XG4gIGNvbnN0IG9yZGVyOiBPcmRlciA9IHtcbiAgICBpZDogaWQsXG4gICAgLi4ucGFydGlhbE9yZGVyXG4gIH07XG4gIGNvbnNvbGUubG9nKCdvcmRlcicsIG9yZGVyKTtcbiAgY29uc3QgZG9jQ2xpZW50ID0gY3JlYXRlRHluYW1vREJDbGllbnQoKTtcbiAgYXdhaXQgZG9jQ2xpZW50LnB1dCh7XG4gICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5BTFRFUktOSVRfVEFCTEUsXG4gICAgSXRlbTogb3JkZXJcbiAgfSkucHJvbWlzZSgpO1xuICBhd2FpdCBzZW5kRW1haWwoKTtcbiAgcmV0dXJuIHtcbiAgICBzdGF0dXNDb2RlOiAyMDEsXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgaXRlbTogb3JkZXJcbiAgICB9KVxuICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlRHluYW1vREJDbGllbnQoKSB7XG4gIGlmIChwcm9jZXNzLmVudi5JU19PRkZMSU5FKSB7XG4gICAgcmV0dXJuIG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoe1xuICAgICAgcmVnaW9uOiAnbG9jYWxob3N0JyxcbiAgICAgIGVuZHBvaW50OiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwJ1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBuZXcgQVdTLkR5bmFtb0RCLkRvY3VtZW50Q2xpZW50KCk7XG59XG5hc3luYyBmdW5jdGlvbiBzZW5kRW1haWwoKSB7XG4gIHNnTWFpbC5zZXRBcGlLZXkocHJvY2Vzcy5lbnYuU0VOREdSSURfQVBJX0tFWSlcbiAgY29uc3QgbXNnID0ge1xuICAgIHRvOiAnc2FpYXl5YXBwYTE5OTZAZ21haWwuY29tJywgLy8gQ2hhbmdlIHRvIHlvdXIgcmVjaXBpZW50XG4gICAgZnJvbTogJ3NhaWF5eWFwcGFvckBnbWFpbC5jb20nLCAvLyBDaGFuZ2UgdG8geW91ciB2ZXJpZmllZCBzZW5kZXJcbiAgICBzdWJqZWN0OiAnU2VuZGluZyB3aXRoIFNlbmRHcmlkIGlzIEZ1bicsXG4gICAgdGV4dDogJ2FuZCBlYXN5IHRvIGRvIGFueXdoZXJlLCBldmVuIHdpdGggTm9kZS5qcycsXG4gICAgaHRtbDogJzxzdHJvbmc+YW5kIGVhc3kgdG8gZG8gYW55d2hlcmUsIGV2ZW4gd2l0aCBOb2RlLmpzPC9zdHJvbmc+JyxcbiAgfTtcbiAgY29uc29sZS5sb2cobXNnKTtcbiAgYXdhaXQgc2dNYWlsXG4gICAgLnNlbmQobXNnKVxuICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ0VtYWlsIHNlbnQnLCByZXNwb25zZSlcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgfSlcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/functions/createOrder/handler.ts\n");

/***/ }),

/***/ "@sendgrid/mail":
/*!*********************************!*\
  !*** external "@sendgrid/mail" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@sendgrid/mail");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("aws-sdk");

/***/ }),

/***/ "source-map-support/register":
/*!**********************************************!*\
  !*** external "source-map-support/register" ***!
  \**********************************************/
/***/ ((module) => {

module.exports = require("source-map-support/register");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/functions/createOrder/handler.ts");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;