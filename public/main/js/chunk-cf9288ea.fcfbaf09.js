(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cf9288ea"],{"17a3":function(a,s,t){},cc67:function(a,s){a.exports="data:image/gif;base64,R0lGODlhCQAKAJECADU1NVVVVf///wAAACH5BAEAAAIALAAAAAAJAAoAAAIVlI+hG9JolAHpARrtzRM7W0HRxzQFADs="},ecbd:function(a,s,t){"use strict";t.r(s);var e=function(){var a=this,s=a.$createElement,e=a._self._c||s;return e("div",[e("div",{staticClass:"main"},[e("div",{staticClass:"main-body-head"},[e("div",{staticClass:"main-header"},[e("h5",[a._v("Character and Skills — "+a._s(a.char.name))]),e("p",[a._v(" Soul-Arena forces you to select 3 characters when you start a new game. This page gives you an overview of all characters available in the Soul-Arena game. Not only can you view each character's skills, you can also discuss the characters by posting comments. ")])])]),e("div",{staticClass:"main-body-content center"},[e("div",{staticClass:"flex flex-col"},[e("p",{staticClass:"char-name"},[e("img",{attrs:{src:t("cc67")}}),a._v(" "+a._s(a.char.name)+" ")]),e("div",{staticClass:"flex char-profile"},[e("img",{attrs:{src:"http://game.soul-arena.app/uploads/"+a.char.facepic+".jpg",alt:""}}),e("p",[a._v(" "+a._s(a.char.description)+" ")])]),e("p",{staticClass:"char-req"},[a._v("Requirement to unlock:")])]),a._l(a.char.skills.slice(0,4),(function(s,c){return e("div",{key:c,staticClass:"char-skill flex flex-col"},[e("p",{staticClass:"char-name char-skill-name"},[e("img",{attrs:{src:t("cc67")}}),a._v(" "+a._s(s.name)+" ")]),e("div",{staticClass:"flex char-profile"},[e("img",{attrs:{src:"http://game.soul-arena.app/uploads/"+s.skillpic+".jpg",alt:""}}),e("p",[a._v(" "+a._s(s.description)+" ")])]),e("div",{staticClass:"char-skill-footer"},[e("div",{staticClass:"flex char-skill-base"},[e("p",[e("span",{staticClass:"char-skill-decoration"},[a._v("Cooldown:")]),a._v(" "+a._s(s.baseCooldown)+" ")]),e("p",{staticClass:"flex"},[e("span",{staticClass:"char-skill-decoration"},[a._v("Reiatsu required:")]),a._l(a.formatCost(s.cost),(function(s,t){return e("span",{key:t,staticClass:"char-skill-wrap"},[s?e("i",{class:"char-skill-cost "+a.reiatsu[s]}):a._e()])}))],2)]),e("p",{staticClass:"char-skill-classes"},[a._v(" Classes: "+a._s(a.classes[s.class])+", "+a._s(a.persistence[s.persistence])+" ")])])])}))],2),e("div",{staticClass:"main-body-footer"})])])},c=[],r=(t("4160"),t("159b"),t("96cf"),t("1da1")),i={data:function(){return{char:{skills:[]},reiatsu:["Hakuda","Kidou","Reiryoku","Zanpakutou","Random"],classes:["None","Physical","Reiatsu","Strategic","Affliction"],persistence:["Instant","Action","Control"]}},methods:{formatCost:function(a){var s=[];return a.forEach((function(a,t){if(a)for(var e=0;e<a;e++)s.push(t)})),s}},created:function(){var a=this;return Object(r["a"])(regeneratorRuntime.mark((function s(){var t;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,a.$http.get("/character/api/profile/".concat(a.$route.params.characterId));case 2:t=s.sent,a.char=t.data;case 4:case"end":return s.stop()}}),s)})))()}},n=i,l=(t("f989"),t("2877")),o=Object(l["a"])(n,e,c,!1,null,"ff81f09c",null);s["default"]=o.exports},f989:function(a,s,t){"use strict";var e=t("17a3"),c=t.n(e);c.a}}]);
//# sourceMappingURL=chunk-cf9288ea.fcfbaf09.js.map