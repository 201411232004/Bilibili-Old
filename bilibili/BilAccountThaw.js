!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var o in n)("object"==typeof exports?exports:e)[o]=n[o]}}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([,function(e,t,n){"use strict";function o(e){this.init_(e),window.onmessage=function(e){switch((e=e||window.event).data){case"closeThawPlugin":document.body.removeChild(document.getElementById("BilAccountThaw"))}}}Object.defineProperty(t,"__esModule",{value:!0}),t.BilAccountThaw=o,o.prototype.init_=function(e){var t=document.createElement("iframe"),n=this.getUrl(e);t.src=n,t.setAttribute("id","BilAccountThaw"),document.body.appendChild(t);var o=document.getElementById("BilAccountThaw");o.style.position="fixed",o.style.top="0",o.style.left="0",o.style.width="100%",o.style.height="100%",o.style.backgroundColor="transparent",o.style.zIndex="999999999"},o.prototype.getUrl=function(e){var t="https://big.bilibili.com/pc/thawPligin";return t+=(t.indexOf("?")<0?"?":"&")+this.param(e)},o.prototype.param=function(e){var t="";for(var n in e){var o=void 0!==e[n]?e[n]:"";t+="&"+n+"="+encodeURIComponent(o)}return t?t.substring(1):""}}])});