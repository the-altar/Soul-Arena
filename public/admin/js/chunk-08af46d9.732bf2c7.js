(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-08af46d9"],{"0840":function(e,t,n){"use strict";var r=n("cb45"),a=n.n(r);a.a},"09b1":function(e,t,n){"use strict";var r=n("acd9"),a=n.n(r);a.a},"14c3":function(e,t,n){var r=n("c6b6"),a=n("9263");e.exports=function(e,t){var n=e.exec;if("function"===typeof n){var s=n.call(e,t);if("object"!==typeof s)throw TypeError("RegExp exec method returned something other than an Object or null");return s}if("RegExp"!==r(e))throw TypeError("RegExp#exec called on incompatible receiver");return a.call(e,t)}},2086:function(e,t,n){"use strict";var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"types"},[n("FormulateInput",{attrs:{name:"type",options:e.characterTypes,type:"checkbox",label:"Select a type",validation:"required"}})],1)},a=[],s=(n("fb6a"),n("b64b"),{computed:{characterTypes:function(){var e={},t=this.$store.getters["enums/getEnum"]("characterTypings");for(var n in Object.keys(t).slice(0,18))e[n]=t[n];return e}}}),i=s,c=(n("09b1"),n("2877")),o=Object(c["a"])(i,r,a,!1,null,"1daf6ab8",null);t["a"]=o.exports},5319:function(e,t,n){"use strict";var r=n("d784"),a=n("825a"),s=n("7b0b"),i=n("50c4"),c=n("a691"),o=n("1d80"),u=n("8aa5"),l=n("14c3"),f=Math.max,p=Math.min,d=Math.floor,h=/\$([$&'`]|\d\d?|<[^>]*>)/g,v=/\$([$&'`]|\d\d?)/g,g=function(e){return void 0===e?e:String(e)};r("replace",2,(function(e,t,n,r){var E=r.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,m=r.REPLACE_KEEPS_$0,x=E?"$":"$0";return[function(n,r){var a=o(this),s=void 0==n?void 0:n[e];return void 0!==s?s.call(n,a,r):t.call(String(a),n,r)},function(e,r){if(!E&&m||"string"===typeof r&&-1===r.indexOf(x)){var s=n(t,e,this,r);if(s.done)return s.value}var o=a(e),d=String(this),h="function"===typeof r;h||(r=String(r));var v=o.global;if(v){var b=o.unicode;o.lastIndex=0}var k=[];while(1){var w=l(o,d);if(null===w)break;if(k.push(w),!v)break;var I=String(w[0]);""===I&&(o.lastIndex=u(d,i(o.lastIndex),b))}for(var T="",_=0,R=0;R<k.length;R++){w=k[R];for(var $=String(w[0]),O=f(p(c(w.index),d.length),0),C=[],S=1;S<w.length;S++)C.push(g(w[S]));var N=w.groups;if(h){var A=[$].concat(C,O,d);void 0!==N&&A.push(N);var U=String(r.apply(void 0,A))}else U=y($,d,O,C,N,r);O>=_&&(T+=d.slice(_,O)+U,_=O+$.length)}return T+d.slice(_)}];function y(e,n,r,a,i,c){var o=r+e.length,u=a.length,l=v;return void 0!==i&&(i=s(i),l=h),t.call(c,l,(function(t,s){var c;switch(s.charAt(0)){case"$":return"$";case"&":return e;case"`":return n.slice(0,r);case"'":return n.slice(o);case"<":c=i[s.slice(1,-1)];break;default:var l=+s;if(0===l)return t;if(l>u){var f=d(l/10);return 0===f?t:f<=u?void 0===a[f-1]?s.charAt(1):a[f-1]+s.charAt(1):t}c=a[l-1]}return void 0===c?"":c}))}}))},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,n){var r=n("1d80"),a=n("5899"),s="["+a+"]",i=RegExp("^"+s+s+"*"),c=RegExp(s+s+"*$"),o=function(e){return function(t){var n=String(r(t));return 1&e&&(n=n.replace(i,"")),2&e&&(n=n.replace(c,"")),n}};e.exports={start:o(1),end:o(2),trim:o(3)}},"64ff":function(e,t,n){"use strict";var r=n("9080"),a=n.n(r);a.a},7156:function(e,t,n){var r=n("861d"),a=n("d2bb");e.exports=function(e,t,n){var s,i;return a&&"function"==typeof(s=t.constructor)&&s!==n&&r(i=s.prototype)&&i!==n.prototype&&a(e,i),e}},"8aa5":function(e,t,n){"use strict";var r=n("6547").charAt;e.exports=function(e,t,n){return t+(n?r(e,t).length:1)}},9080:function(e,t,n){},9263:function(e,t,n){"use strict";var r=n("ad6d"),a=n("9f7f"),s=RegExp.prototype.exec,i=String.prototype.replace,c=s,o=function(){var e=/a/,t=/b*/g;return s.call(e,"a"),s.call(t,"a"),0!==e.lastIndex||0!==t.lastIndex}(),u=a.UNSUPPORTED_Y||a.BROKEN_CARET,l=void 0!==/()??/.exec("")[1],f=o||l||u;f&&(c=function(e){var t,n,a,c,f=this,p=u&&f.sticky,d=r.call(f),h=f.source,v=0,g=e;return p&&(d=d.replace("y",""),-1===d.indexOf("g")&&(d+="g"),g=String(e).slice(f.lastIndex),f.lastIndex>0&&(!f.multiline||f.multiline&&"\n"!==e[f.lastIndex-1])&&(h="(?: "+h+")",g=" "+g,v++),n=new RegExp("^(?:"+h+")",d)),l&&(n=new RegExp("^"+h+"$(?!\\s)",d)),o&&(t=f.lastIndex),a=s.call(p?n:f,g),p?a?(a.input=a.input.slice(v),a[0]=a[0].slice(v),a.index=f.lastIndex,f.lastIndex+=a[0].length):f.lastIndex=0:o&&a&&(f.lastIndex=f.global?a.index+a[0].length:t),l&&a&&a.length>1&&i.call(a[0],n,(function(){for(c=1;c<arguments.length-2;c++)void 0===arguments[c]&&(a[c]=void 0)})),a}),e.exports=c},"9f7f":function(e,t,n){"use strict";var r=n("d039");function a(e,t){return RegExp(e,t)}t.UNSUPPORTED_Y=r((function(){var e=a("a","y");return e.lastIndex=2,null!=e.exec("abcd")})),t.BROKEN_CARET=r((function(){var e=a("^r","gy");return e.lastIndex=2,null!=e.exec("str")}))},a434:function(e,t,n){"use strict";var r=n("23e7"),a=n("23cb"),s=n("a691"),i=n("50c4"),c=n("7b0b"),o=n("65f0"),u=n("8418"),l=n("1dde"),f=n("ae40"),p=l("splice"),d=f("splice",{ACCESSORS:!0,0:0,1:2}),h=Math.max,v=Math.min,g=9007199254740991,E="Maximum allowed length exceeded";r({target:"Array",proto:!0,forced:!p||!d},{splice:function(e,t){var n,r,l,f,p,d,m=c(this),x=i(m.length),y=a(e,x),b=arguments.length;if(0===b?n=r=0:1===b?(n=0,r=x-y):(n=b-2,r=v(h(s(t),0),x-y)),x+n-r>g)throw TypeError(E);for(l=o(m,r),f=0;f<r;f++)p=y+f,p in m&&u(l,f,m[p]);if(l.length=r,n<r){for(f=y;f<x-r;f++)p=f+r,d=f+n,p in m?m[d]=m[p]:delete m[d];for(f=x;f>x-r+n;f--)delete m[f-1]}else if(n>r)for(f=x-r;f>y;f--)p=f+r-1,d=f+n-1,p in m?m[d]=m[p]:delete m[d];for(f=0;f<n;f++)m[f+y]=arguments[f+2];return m.length=x-r+n,l}})},a9e3:function(e,t,n){"use strict";var r=n("83ab"),a=n("da84"),s=n("94ca"),i=n("6eeb"),c=n("5135"),o=n("c6b6"),u=n("7156"),l=n("c04e"),f=n("d039"),p=n("7c73"),d=n("241c").f,h=n("06cf").f,v=n("9bf2").f,g=n("58a8").trim,E="Number",m=a[E],x=m.prototype,y=o(p(x))==E,b=function(e){var t,n,r,a,s,i,c,o,u=l(e,!1);if("string"==typeof u&&u.length>2)if(u=g(u),t=u.charCodeAt(0),43===t||45===t){if(n=u.charCodeAt(2),88===n||120===n)return NaN}else if(48===t){switch(u.charCodeAt(1)){case 66:case 98:r=2,a=49;break;case 79:case 111:r=8,a=55;break;default:return+u}for(s=u.slice(2),i=s.length,c=0;c<i;c++)if(o=s.charCodeAt(c),o<48||o>a)return NaN;return parseInt(s,r)}return+u};if(s(E,!m(" 0o1")||!m("0b1")||m("+0x1"))){for(var k,w=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof w&&(y?f((function(){x.valueOf.call(n)})):o(n)!=E)?u(new m(b(t)),n,w):b(t)},I=r?d(m):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),T=0;I.length>T;T++)c(m,k=I[T])&&!c(w,k)&&v(w,k,h(m,k));w.prototype=x,x.constructor=w,i(a,E,w)}},ac1f:function(e,t,n){"use strict";var r=n("23e7"),a=n("9263");r({target:"RegExp",proto:!0,forced:/./.exec!==a},{exec:a})},acd9:function(e,t,n){},b16b:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.skill?n("div",{staticClass:"skill-container"},[n("h1",[e._v(e._s(e.skill.name)+", "+e._s(e.$route.params.id))]),n("FormulateForm",{staticClass:"skill",on:{submit:e.submitHandler}},[n("Body",{attrs:{data:e.skill,assignedEntity:e.assignedEntity,priority:e.priority,charIds:e.charIds,asComponent:e.asComponent},on:{"update-ae":e.setAssignedEntity,"update-prio":e.setPriority}}),n("button",{staticClass:"btn",on:{click:e.displayEffects}},[e._v("Effects")]),n("FormulateInput",{staticClass:"btn",attrs:{type:"submit",label:"Save changes"}})],1),e.effectDisplay&&!e.asComponent?n("Effect",{attrs:{skillId:e.skillId},on:{close:function(t){e.effectDisplay=!1}}}):e._e()],1):e._e()},a=[],s=(n("d3b7"),n("ac1f"),n("25f0"),n("5319"),n("96cf"),n("1da1")),i=n("2086"),c=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.effects?n("div",{staticClass:"effect",on:{click:function(t){return t.target!==t.currentTarget?null:e.close(t)}}},[n("div",{staticClass:"effect-container"},[n("div",{staticClass:"effect-container-top"},e._l(e.effects,(function(t,r){return n("div",{key:r,staticClass:"flex"},[n("button",{staticClass:"effect-btn",on:{click:function(n){e.$router.push("/skills/"+e.effectTypesEnums[t.type].toLowerCase()+"/"+t.id)}}},[n("p",[e._v(e._s(e.effectTypesEnums[t.type]))]),n("p",[e._v("id: "+e._s(t.id)+", priority: "+e._s(t.priority))])]),n("button",{staticClass:"remove",on:{click:function(n){return e.deleteEffect(t.id,r)}}},[e._v("x")])])})),0),n("div",{staticClass:"effect-container-bottom"},[n("select",{directives:[{name:"model",rawName:"v-model.number",value:e.newEffect,expression:"newEffect",modifiers:{number:!0}}],on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(t){var n="_value"in t?t._value:t.value;return e._n(n)}));e.newEffect=t.target.multiple?n:n[0]}}},e._l(e.effectTypesEnums,(function(t,r){return n("option",{key:r,domProps:{value:r}},[e._v(" "+e._s(t)+" ")])})),0),n("button",{on:{click:function(t){return e.createNewEffect()}}},[e._v("Create new effect")])])])]):e._e()},o=[],u=(n("a434"),n("a9e3"),n("5530")),l=n("b85c"),f=n("bc3a"),p=n.n(f),d={data:function(){return{effects:null,newEffect:null}},props:["skillId"],methods:{close:function(){this.$emit("close")},createNewEffect:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,p.a.post("/effect/new",[{type:e.newEffect},e.skillId]);case 3:e.getEffects(),t.next=9;break;case 6:t.prev=6,t.t0=t["catch"](0),alert(t.t0);case 9:case"end":return t.stop()}}),t,null,[[0,6]])})))()},deleteEffect:function(e,t){var n=this;return Object(s["a"])(regeneratorRuntime.mark((function r(){return regeneratorRuntime.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,p.a.delete("/effect/".concat(e));case 3:n.effects.splice(t,1),r.next=9;break;case 6:r.prev=6,r.t0=r["catch"](0),alert(r.t0);case 9:case"end":return r.stop()}}),r,null,[[0,6]])})))()},getEffects:function(){var e=this;p.a.post("/effect",[Number(this.skillId)]).then((function(t){var n,r=[],a=Object(l["a"])(t.data);try{for(a.s();!(n=a.n()).done;){var s=n.value;r.push(Object(u["a"])({},s.data,{id:s.id,priority:s.priority}))}}catch(i){a.e(i)}finally{a.f()}e.effects=r})).catch((function(e){alert(e)}))}},computed:{effectTypesEnums:function(){return this.$store.getters["enums/getEnum"]("effectTypings")}},created:function(){this.getEffects()}},h=d,v=(n("64ff"),n("2877")),g=Object(v["a"])(h,c,o,!1,null,"50bdf9dc",null),E=g.exports,m=n("6c35"),x=n("cfa7"),y=n("e435"),b={Types:i["a"],Effect:E,Body:m["a"],RequiresSkillIdOnTarget:x["a"],CannotBeUsedOnTargetOf:y["a"]},k=(n("b0c0"),function(){return this.$store.getters["enums/getEnum"]("costTypings")}),w=function(){return!!this.char&&this.char.skills[this.skillIndex].cost},I=function(){return this.$store.getters["enums/getEnum"]("reiatsuTypings")},T=function(){return this.$store.getters["enums/getEnum"]("skillClassTypings")},_=function(){return this.$store.getters["enums/getEnum"]("controlTypings")},R=function(){return this.$store.getters["enums/getEnum"]("targetModeTypings")},$=function(){return this.$store.getters["enums/getEnum"]("pokemonTypings")},O=function(){return this.$store.getters["enums/getEnum"]("effectTypings")},C=function(){return this.$store.getters["enums/getEnum"]("effectTypings")},S=function(){var e,t={},n=Object(l["a"])(this.charIds);try{for(n.s();!(e=n.n()).done;){var r=e.value;t[r.id]=r.name}}catch(a){n.e(a)}finally{n.f()}return t},N=function(){return this.skill.effects},A={effectTypesEnums:C,targetClasses:R,pokemonTypes:$,reiatsuCost:I,controlClasses:_,skillEffects:N,effectTypes:O,skillCost:w,costTypes:k,entities:S,classes:T},U=function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t="new"===this.$route.params.id,e.prev=1,!t){e.next=7;break}return e.next=5,this.$axios.post("/skill/new",[this.skill]);case 5:e.next=9;break;case 7:return e.next=9,this.$axios.post("/skill/update",[this.skill,this.skillId,this.assignedEntity,this.priority]);case 9:alert("Uploaded"),e.next=15;break;case 12:e.prev=12,e.t0=e["catch"](1),alert(e.t0);case 15:case"end":return e.stop()}}),e,this,[[1,12]])})));return function(){return e.apply(this,arguments)}}(),P=function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.skill.effects.push(this.newEffect),e.prev=1,e.next=4,this.$axios.post("/character/update",this.char);case 4:e.next=9;break;case 6:e.prev=6,e.t0=e["catch"](1),alert(e.t0);case 9:case"end":return e.stop()}}),e,this,[[1,6]])})));return function(){return e.apply(this,arguments)}}(),j=function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.skill.effects.splice(t,1),e.prev=1,e.next=4,this.$axios.post("/character/update",this.char);case 4:e.next=9;break;case 6:e.prev=6,e.t0=e["catch"](1),alert(e.t0);case 9:case"end":return e.stop()}}),e,this,[[1,6]])})));return function(t){return e.apply(this,arguments)}}(),B=function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t.preventDefault(),this.effectDisplay=!0;case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}(),F=function(){null!==this.newEffect&&this.skill.effects.push({type:this.newEffect})},M=function(e){this.assignedEntity=e},D=function(e){this.priority=e},L={createNewEffect:F,displayEffects:B,submitHandler:U,saveNewEffect:P,deleteEffect:j,setAssignedEntity:M,setPriority:D},q={},G={props:["asComponent"],data:function(){return{skill:!1,skillId:!1,assignedEntity:0,charIds:null,effectDisplay:!1,newEffect:null,priority:0}},components:b,computed:A,methods:L,watchers:q,created:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var n,r,a,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!e.asComponent){t.next=4;break}e.skill={cost:[0,0,0,0,0],requiresSkillOnTarget:[],cannotBeUsedOnTargetOf:[]},t.next=40;break;case 4:if("new"===e.$route.params.id){t.next=27;break}return t.prev=5,n=e.$route.params.id,t.next=9,e.$axios.get("/skill/".concat(n));case 9:return r=t.sent,t.next=12,e.$axios.get("/character/ids");case 12:a=t.sent,e.charIds=a.data,e.skill=r.data.data,e.skill.requiresSkillOnTarget||e.$set(e.skill,"cannotBeUsedOnTargetOf",[]),e.skill.cannotBeUsedOnTargetOf||e.$set(e.skill,"cannotBeUsedOnTargetOf",[]),e.skillId=r.data.id,e.priority=r.data.priority,e.assignedEntity=r.data.entity_id,t.next=25;break;case 22:t.prev=22,t.t0=t["catch"](5),alert(t.t0);case 25:t.next=40;break;case 27:return t.prev=27,t.next=30,e.$axios.get("/character/ids");case 30:s=t.sent,e.charIds=s.data,e.skillId=null,e.assignedEntity=null,e.skill={cost:[0,0,0,0,0],effects:[],requiresSkillOnTarget:[],cannotBeUsedOnTargetOf:[],skillpic:K(),banner:K()},t.next=40;break;case 37:t.prev=37,t.t1=t["catch"](27),alert(t.t1);case 40:case"end":return t.stop()}}),t,null,[[5,22],[27,37]])})))()}};function K(){return Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,5)}var V=G,X=(n("0840"),Object(v["a"])(V,r,a,!1,null,null,null));t["default"]=X.exports},cb45:function(e,t,n){},d784:function(e,t,n){"use strict";n("ac1f");var r=n("6eeb"),a=n("d039"),s=n("b622"),i=n("9263"),c=n("9112"),o=s("species"),u=!a((function(){var e=/./;return e.exec=function(){var e=[];return e.groups={a:"7"},e},"7"!=="".replace(e,"$<a>")})),l=function(){return"$0"==="a".replace(/./,"$0")}(),f=s("replace"),p=function(){return!!/./[f]&&""===/./[f]("a","$0")}(),d=!a((function(){var e=/(?:)/,t=e.exec;e.exec=function(){return t.apply(this,arguments)};var n="ab".split(e);return 2!==n.length||"a"!==n[0]||"b"!==n[1]}));e.exports=function(e,t,n,f){var h=s(e),v=!a((function(){var t={};return t[h]=function(){return 7},7!=""[e](t)})),g=v&&!a((function(){var t=!1,n=/a/;return"split"===e&&(n={},n.constructor={},n.constructor[o]=function(){return n},n.flags="",n[h]=/./[h]),n.exec=function(){return t=!0,null},n[h](""),!t}));if(!v||!g||"replace"===e&&(!u||!l||p)||"split"===e&&!d){var E=/./[h],m=n(h,""[e],(function(e,t,n,r,a){return t.exec===i?v&&!a?{done:!0,value:E.call(t,n,r)}:{done:!0,value:e.call(n,t,r)}:{done:!1}}),{REPLACE_KEEPS_$0:l,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:p}),x=m[0],y=m[1];r(String.prototype,e,x),r(RegExp.prototype,h,2==t?function(e,t){return y.call(e,this,t)}:function(e){return y.call(e,this)})}f&&c(RegExp.prototype[h],"sham",!0)}}}]);
//# sourceMappingURL=chunk-08af46d9.732bf2c7.js.map