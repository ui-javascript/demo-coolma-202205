(function(e){function t(t){for(var r,c,s=t[0],o=t[1],l=t[2],v=0,h=[];v<s.length;v++)c=s[v],Object.prototype.hasOwnProperty.call(n,c)&&n[c]&&h.push(n[c][0]),n[c]=0;for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(e[r]=o[r]);u&&u(t);while(h.length)h.shift()();return a.push.apply(a,l||[]),i()}function i(){for(var e,t=0;t<a.length;t++){for(var i=a[t],r=!0,s=1;s<i.length;s++){var o=i[s];0!==n[o]&&(r=!1)}r&&(a.splice(t--,1),e=c(c.s=i[0]))}return e}var r={},n={index:0},a=[];function c(t){if(r[t])return r[t].exports;var i=r[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,c),i.l=!0,i.exports}c.m=e,c.c=r,c.d=function(e,t,i){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(c.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)c.d(i,r,function(t){return e[t]}.bind(null,r));return i},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],o=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var u=o;a.push([0,"chunk-vendors"]),i()})({0:function(e,t,i){e.exports=i("7120")},"576e":function(e,t,i){},"5e8a":function(e,t,i){"use strict";i.d(t,"a",(function(){return h})),i.d(t,"b",(function(){return f}));var r=i("5530"),n=(i("b0c0"),i("a15b"),i("ac1f"),i("00b4"),i("1276"),i("38cf"),i("2d37")),a=i("e862"),c=i("bb3a"),s=i("bb38"),o=i("afc9"),l=i("e53b"),u={}.hasOwnProperty,v=/^\(^\t\n\r "#'.<=>`}]+$/;C.peek=L;var h={canContainEols:["textDirective"],enter:{directiveContainer:d,directiveContainerAttributes:y,directiveContainerArgs:x,directiveLeaf:g,directiveLeafAttributes:y,directiveText:b,directiveTextAttributes:y,directiveTextNamespace:P,directiveTextArgs:M},exit:{directiveContainer:T,directiveContainerAttributeClassValue:D,directiveContainerAttributeIdValue:j,directiveContainerAttributeName:k,directiveContainerAttributeValue:O,directiveContainerAttributes:w,directiveContainerArgValueData:m,directiveContainerArgs:V,directiveContainerName:A,directiveContainerNamespace:z,directiveLeaf:T,directiveLeafAttributeClassValue:D,directiveLeafAttributeIdValue:j,directiveLeafAttributeName:k,directiveLeafAttributeValue:O,directiveLeafAttributes:w,directiveLeafArgValueData:m,directiveLeafArgs:V,directiveLeafName:A,directiveLeafNamespace:z,directiveText:T,directiveTextAttributeClassValue:D,directiveTextAttributeIdValue:j,directiveTextAttributeName:k,directiveTextAttributeValue:O,directiveTextAttributes:w,directiveTextArgValueData:m,directiveTextArgs:V,directiveTextName:A,directiveTextNamespace:z}},f={unsafe:[{character:"\r",inConstruct:["leafDirectiveArgs","containerDirectiveArgs"]},{character:"\n",inConstruct:["leafDirectiveArgs","containerDirectiveArgs"]},{before:"[^@]",character:"@",after:"[A-Za-z]",inConstruct:["phrasing"]},{atBreak:!0,character:"@",after:"@"}],handlers:{containerDirective:C,leafDirective:C,textDirective:C}};function d(e){p.call(this,"containerDirective",e)}function g(e){p.call(this,"leafDirective",e)}function b(e){p.call(this,"textDirective",e)}function p(e,t){this.enter({type:e,name:"",namespace:"",attributes:{},args:[],children:[]},t)}function m(e){var t=this.getData("directiveArgs");console.log("==="),console.log(e),t.push(this.sliceSerialize(e))}function A(e){var t=this.stack[this.stack.length-1];t.name=this.sliceSerialize(e)}function x(e){console.log(e),this.enter({type:"paragraph",data:{directiveArgs:!0},children:[]},e)}function y(){this.setData("directiveAttributes",[]),this.buffer()}function j(e){var t=this.getData("directiveAttributes");t.push(["id",Object(n["a"])(this.sliceSerialize(e))])}function D(e){var t=this.getData("directiveAttributes");t.push(["class",Object(n["a"])(this.sliceSerialize(e))])}function O(e){var t=this.getData("directiveAttributes");t[t.length-1][1]=Object(n["a"])(this.sliceSerialize(e))}function k(e){var t=this.getData("directiveAttributes");t.push([this.sliceSerialize(e),""])}function w(){var e=this.getData("directiveAttributes"),t={},i=-1;while(++i<e.length){var r=e[i];"class"===r[0]&&t.class?t.class+=" "+r[1]:t[r[0]]=r[1]}this.setData("directiveAttributes"),this.resume();var n=this.stack[this.stack.length-1];n.attributes=t}function T(e){this.exit(e)}function C(e,t,i,n){var a=Object(l["a"])(n),c=H(e),o=i.enter(e.type),u=a.move(c+(e.name||"")),v=e;if("containerDirective"===e.type){var h=(e.children||[])[0];v=S(h)?h:void 0}if(v&&v.args&&v.args.length>0){var f=i.enter("args"),d=i.enter(e.type+"Args");console.log("进入"),u+=a.move("("),"textDirective"===e.type?u+=a.move("'"+v.args.join("','")+"'"):u+=a.move(Object(s["a"])(v,i,Object(r["a"])(Object(r["a"])({},a.current()),{},{before:u,after:")"}))),u+=a.move(")"),d(),f()}return u+=a.move(N(e,i)),o(),console.log("处理Arg"),console.log(u),u}function L(){return"@"}function N(e,t){var i,r,n,c,s=Object(o["a"])(t),l="textDirective"===e.type?[s]:[s,"\n","\r"],h=e.attributes||{},f=[];for(c in h)if(u.call(h,c)&&void 0!==h[c]&&null!==h[c]){var d=String(h[c]);if("id"===c)n=v.test(d)?"#"+d:A("id",d);else if("class"===c){var g=d.split(/[\t\n\r ]+/g),b=[],p=[],m=-1;while(++m<g.length)(v.test(g[m])?p:b).push(g[m]);i=b.length>0?A("class",b.join(" ")):"",r=p.length>0?"."+p.join("."):""}else f.push(A(c,d))}return i&&f.unshift(i),r&&f.unshift(r),n&&f.unshift(n),f.length>0?"{"+f.join(" ")+"}":"";function A(e,t){return e+(t?"="+s+Object(a["b"])(t,{subset:l})+s:"")}}function S(e){return console.log("参数指令"),console.log(e),Boolean(e&&"paragraph"===e.type&&e.data&&e.data.directiveArgs)}function M(){this.buffer(),this.setData("directiveArgs",[])}function V(){var e,t=this.getData("directiveArgs"),i=[],r=-1;console.log("==>"),console.log(t);while(++r<t.length)e=t[r],i.push(e);this.resume(),this.setData("directiveArgs"),this.stack[this.stack.length-1].args=i}function P(){this.buffer()}function z(){var e=this.resume();console.log(this.stack[this.stack.length-1]),this.stack[this.stack.length-1].namespace=e}function H(e){var t=0;return"containerDirective"===e.type?(Object(c["c"])(e,"containerDirective",i),t+=3):t="leafDirective"===e.type?2:1,"@".repeat(t);function i(e,i){var r=i.length,n=0;while(r--)"containerDirective"===i[r].type&&n++;n>t&&(t=n)}}},7120:function(e,t,i){"use strict";i.r(t);var r=i("1da1"),n=(i("e260"),i("e6cf"),i("cca6"),i("a79d"),i("96cf"),i("a026")),a=i("ed09"),c=i("1808"),s=i("bb3a"),o=i("7d45"),l=i("2cfd"),u=i("1fb9"),v=i("d2b0"),h=i("5997"),f=i("5e8a");function d(){var e=this.data();function t(t,i){var r=e[t]?e[t]:e[t]=[];r.push(i)}t("micromarkExtensions",Object(h["a"])()),t("fromMarkdownExtensions",f["a"]),t("toMarkdownExtensions",f["b"])}var g=i("66c7"),b=i.n(g),p=(i("b0c0"),i("f9c0"));function m(e){var t=e.data||(e.data={});t.hName=Object(p["a"])("span",{}).tagName}function A(e,t){if("nice"==e.name){console.log("父节点"),console.log(t);var i=t[t.length-1];if(i.children&&0!==i.children.length)for(var r in i.children){var n=i.children[r];if(r=parseInt(r),"textDirective"===n.type&&"nice"===n.name){var a=r,c=r,s=null,o=null;while(++a<i.children.length){var l=i.children[a];if(l&&"text"===l.type&&b()(l.value)){s=l;break}}if(!s)while(--c>-1){var u=i.children[c];if(u&&"text"===u.type&&b()(u.value)){o=u;break}}if(s){console.log("修改后节点"),console.log(s);var v=s.data||(s.data={}),h=Object(p["a"])("mark",s.value);v.hName=h.tagName,v.hProperties=h.properties,v.hChildren=h.children}else if(o){console.log("修改前节点"),console.log(o);var f=o.data||(o.data={}),d=Object(p["a"])("mark",o.value);f.hName=d.tagName,f.hProperties=d.properties,f.hChildren=d.children}m(e);break}}}}function x(e){if("abbr"==e.name){var t=e.data||(e.data={});!("title"in e.attributes)&&e.args&&e.args.length>1&&(e.attributes.title=e.args[1]);var i=Object(p["a"])(e.name,e.attributes,[e.args&&e.args.length>0?e.args[0]:""]);t.hName=i.tagName,t.hProperties=i.properties,e.children=i.children}}function y(e,t){"fetch"===e.name&&(console.log(),e.args&&0!==e.args.length?(console.log("天气接口"),console.log(e.args[0])):m(e))}i("576e");function j(){return function(e){Object(s["c"])(e,"textDirective",(function(e,t){x(e),t&&0!==t.length&&(A(e,t),y(e,t))}))}}var D={template:'\n    <div>\n\n    <p>演示注解:  @abbr + @nice + @fetch</p>\n  \n    <textarea style="width:100%;height: 300px;" v-model="before"></textarea>\n\n    <div v-html="after"></div>\n   \n    </div>\n    \n  ',setup:function(){var e=Object(a["c"])('# A lovely language know as @abbr[namespace](HTML, "HTML的全称"){.red.blue #id} @nice\n\n@abbr(HTML, "HTML的全称"){.bg-blue}\n\nhello @nice\n  \n@nice hello\n\nhello hi @nice @nice\n\nhello hi *em* @abbr(HTML, "HTML的全称"){.bg-blue} @nice @nice\n\nhello @nice @nice hi\n\n@fecth("https://v0.yiketianqi.com/api?unescape=1&version=v91&appid=43656176&appsecret=I42og6Lm&ext=&cityid=&city=")\n\n'),t=Object(a["c"])("");return Object(a["d"])(Object(r["a"])(regeneratorRuntime.mark((function i(){var r;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return i.next=2,Object(c["a"])().use(o["a"]).use(d).use(j).use(l["a"]).use(u["a"]).use(v["a"]).process(e.value);case 2:r=i.sent,console.log(String(r)),t.value=String(r);case 5:case"end":return i.stop()}}),i)})))),{before:e,after:t}}};n["default"].use(a["b"]),n["default"].config.productionTip=!1,new n["default"]({el:"#app",render:function(e){return e(D)}})}});