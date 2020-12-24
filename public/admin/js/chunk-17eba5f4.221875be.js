(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-17eba5f4"],{"227a":function(e,a,t){"use strict";var r=t("d1dc"),c=t.n(r);c.a},3853:function(e,a,t){"use strict";t.r(a);var r=function(){var e=this,a=e.$createElement,t=e._self._c||a;return e.character?t("div",{staticClass:"profile"},[t("p",[e.newChar?e._e():t("img",{attrs:{src:"https://game.soul-arena.app/uploads/"+e.character.facepic+".jpg"}}),t("router-link",{attrs:{to:"/character"}},[e._v("Go Back")])],1),t("FormulateForm",{staticClass:"form",on:{submit:e.submitHandler},model:{value:e.mock,callback:function(a){e.mock=a},expression:"mock"}},[t("div",{staticClass:"form-col"},[t("div",{staticClass:"form-energyGain"},[t("FormulateInput",{attrs:{type:"number",label:"National pokedex number",validation:"required"},model:{value:e.character.dexNumber,callback:function(a){e.$set(e.character,"dexNumber",e._n(a))},expression:"character.dexNumber"}}),t("FormulateInput",{attrs:{type:"checkbox",options:e.reiatsuTypes,label:"Can generate this type of energy",validation:"required"},model:{value:e.character.energyGain,callback:function(a){e.$set(e.character,"energyGain",a)},expression:"character.energyGain"}}),t("FormulateInput",{attrs:{type:"checkbox",name:"isFree",label:"Is a starter character"}})],1),t("Profile",{staticClass:"form-profile",attrs:{character:e.character}}),t("Types")],1),t("FormulateInput",{staticClass:"btn",attrs:{type:"submit",label:"Save"}})],1)],1):e._e()},c=[],n=(t("d3b7"),t("ac1f"),t("25f0"),t("5319"),t("b85c")),s=t("5530"),i=(t("96cf"),t("1da1")),l=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",[t("FormulateInput",{attrs:{type:"text",name:"name",label:"Character name",validation:"required"}}),t("FormulateInput",{attrs:{type:"textarea",name:"description",label:"Character profile description",validation:"required"}}),t("FormulateInput",{attrs:{type:"checkbox",label:"Character is released"},model:{value:e.character.released,callback:function(a){e.$set(e.character,"released",a)},expression:"character.released"}}),t("Uploader",{attrs:{filename:e.character.facepic,label:"Select an avatar (75 x 75)"}}),t("Uploader",{attrs:{filename:e.character.banner,label:"Select a display banner (200 x 200)"}})],1)},o=[],u=t("8f45"),p={props:["character"],components:{Uploader:u["a"]}},d=p,h=t("2877"),m=Object(h["a"])(d,l,o,!1,null,null,null),b=m.exports,f=t("2086"),v={Profile:b,Types:f["a"]},k=(t("fb6a"),t("b64b"),function(){var e={},a=this.$store.getters["enums/getEnum"]("reiatsuTypings");for(var t in Object.keys(a).slice(0,5))e[t]=a[t];return e}),x=function(){return"new"===this.$route.params.id},y={newChar:x,reiatsuTypes:k},g=(t("a4d3"),t("e01a"),t("d81d"),t("b0c0"),function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(a){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(this.character.description=a.description,this.character.name=a.name,this.character.type=a.type.map((function(e){return parseInt(e,10)})),this.character.energyGain=this.character.energyGain.map((function(e){return parseInt(e,10)})),t=Object(s["a"])({},this.character),delete t.id,delete t.released,delete t.isFree,e.prev=8,!this.newChar){e.next=14;break}return e.next=12,this.$axios.post("/character/new",[this.character.released,t,a.isFree]);case 12:e.next=16;break;case 14:return e.next=16,this.$axios.post("/character/update",[this.character.id,this.character.released,t,a.isFree]);case 16:e.next=21;break;case 18:e.prev=18,e.t0=e["catch"](8),alert(e.t0);case 21:case"end":return e.stop()}}),e,this,[[8,18]])})));return function(a){return e.apply(this,arguments)}}()),w={submitHandler:g},C={},F={data:function(){return{character:null,mock:{}}},components:v,computed:y,methods:w,watchers:C,created:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var t,r;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(e.newChar){a.next=15;break}return a.prev=1,t=e.$route.params.id,a.next=5,e.$axios.get("/character/".concat(t));case 5:r=a.sent,e.character=Object.assign({},e.character,Object(s["a"])({},r.data.data,{id:r.data.id,released:r.data.released||!1,isFree:r.data.isfree||!1})),e.mock=Object(s["a"])({},e.character),a.next=13;break;case 10:a.prev=10,a.t0=a["catch"](1),alert(a.t0);case 13:a.next=17;break;case 15:e.character=Object(s["a"])({},_({}),{released:!1}),e.mock=Object(s["a"])({},e.character);case 17:case"end":return a.stop()}}),a,null,[[1,10]])})))()}};function _(e){void 0===e.facepic&&(e.facepic=j("f__")),void 0===e.banner&&(e.banner=j("b__")),void 0===e.skills&&(e.skills=[]);var a,t=Object(n["a"])(e.skills);try{for(t.s();!(a=t.n()).done;){var r=a.value;void 0===r.skillpic&&(r.skillpic=j("s__"))}}catch(c){t.e(c)}finally{t.f()}return e}function j(e){return e+Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,5)}var O=F,$=(t("227a"),Object(h["a"])(O,r,c,!1,null,null,null));a["default"]=$.exports},d1dc:function(e,a,t){},d81d:function(e,a,t){"use strict";var r=t("23e7"),c=t("b727").map,n=t("1dde"),s=t("ae40"),i=n("map"),l=s("map");r({target:"Array",proto:!0,forced:!i||!l},{map:function(e){return c(this,e,arguments.length>1?arguments[1]:void 0)}})}}]);
//# sourceMappingURL=chunk-17eba5f4.221875be.js.map