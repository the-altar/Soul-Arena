(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-efe37112"],{"1ec0":function(t,e,s){"use strict";s.r(e);var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"missions"},[n("div",{staticClass:"missions-menu"},[n("button",{on:{click:function(e){return t.$router.push({name:"home"})}}},[n("img",{attrs:{src:s("e0ed")}})])]),n("div",{staticClass:"missions-list"},t._l(t.missions,(function(e){return n("div",{key:e.id,staticClass:"mission"},[n("div",{staticClass:"mission-info"},[n("div",{staticClass:"mission-name"},[n("h1",{on:{click:function(s){return t.openGoalsModal(e)}}},[t._v(" "+t._s(e.name)+" ")]),n("span",{class:"mission-track mission-track-"+t.status(e)})]),e.completed?n("div",{staticClass:"mission-completed mission-tag"},[t._v(" completed ")]):t.hasRequiredLevel(e.level_requirement)?e.completed||e.tracking?e.tracking?n("div",{staticClass:"mission-tracking mission-tag"},[t._v(" tracking ")]):t._e():n("div",{staticClass:"mission-available mission-tag"},[t._v(" Available ")]):n("div",{staticClass:"mission-tag mission-unavailable"},[t._v(" Hasn't reached required level yet ")])])])})),0),n("goals",{attrs:{mission:t.selectedMission,goals:t.selectedMissionGoals,tracked:t.tracked}})],1)},i=[],a=(s("96cf"),s("1da1")),r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"goal"},[s("div",{staticClass:"goal-pic"},[s("img",{attrs:{src:"/uploads/"+t.mission.banner+".jpg"}})]),s("div",{staticClass:"goal-section"},[s("h1",{staticClass:"goal-title"},[t._v(t._s(t.mission.name))]),s("p",{staticClass:"goal-description"},[t._v(t._s(t.mission.description))]),s("div",{staticClass:"goal-goals"},[t._m(0),t._l(t.mission.goals,(function(e,n){return s("li",{key:n},[t._v(" "+t._s(e.description)+" ( "),t.goals[n]?s("span",[t._v(t._s(t.goals[n].battlesWon))]):s("span",[t._v("0")]),t._v(" / "+t._s(e.battlesWon)+" ) ")])}))],2)]),s("div",{staticClass:"goal-character"},[s("p",[t._v(" character unlocked: "),s("b",[t._v(t._s(t.entity(t.mission.unlocked_entity).name))])]),t.mission.completed||t.mission.tracking||!this.hasRequiredLevel(this.mission.level_requirement)?t._e():s("button",{staticClass:"goal-btn goal-btn--track",on:{click:function(e){return t.trackMission()}}},[t._v(" Track ")]),!t.mission.completed&&t.mission.tracking?s("button",{staticClass:"goal-btn goal-btn--stop",on:{click:function(e){return t.stopTracking()}}},[t._v(" Stop tracking ")]):t._e()])])},o=[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("li",[s("b",[t._v("Goals")])])}],c=(s("d81d"),{props:["mission","goals","tracked"],computed:{user:function(){return this.$store.getters["user/getUserData"]}},methods:{entity:function(t){var e=this.$store.getters["Roster/getRoster"];for(var s in e)if(e[s].id===t)return e[s];return{}},hasRequiredLevel:function(t){return this.user.season.seasonLevel>=t},trackMission:function(){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function e(){var s,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.hasRequiredLevel(t.mission.level_requirement)){e.next=2;break}return e.abrupt("return");case 2:if(s=t.mission.id,n=JSON.parse(JSON.stringify(t.mission.goals)).map((function(t){return t.battlesWon=0,t})),e.prev=4,!(t.tracked>=3)){e.next=8;break}return alert("You can't track more than 3 missions at once!"),e.abrupt("return");case 8:return e.next=10,t.$http.post("/track",[s,JSON.stringify(n)]);case 10:t.mission.tracking=!0,e.next=16;break;case 13:e.prev=13,e.t0=e["catch"](4),alert(e.t0);case 16:case"end":return e.stop()}}),e,null,[[4,13]])})))()},stopTracking:function(){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function e(){var s,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,s=t.mission.id,e.next=4,t.$http.delete("/mission/".concat(s));case 4:n=e.sent,n.data.success&&(t.mission.tracking=!1,t.goals=[]),e.next=11;break;case 8:e.prev=8,e.t0=e["catch"](0),alert(e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))()}}}),l=c,u=(s("c76d"),s("2877")),m=Object(u["a"])(l,r,o,!1,null,"3f2b62e4",null),d=m.exports,v={components:{goals:d},data:function(){return{missions:[],selectedMission:{},selectedMissionGoals:[]}},methods:{openGoalsModal:function(t){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function s(){var n;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return e.selectedMissionGoals=[],e.selectedMission=t,s.next=4,e.$http.get("/mission/".concat(e.selectedMission.id));case 4:n=s.sent,n.data.success&&n.data.goals.length>0&&(e.selectedMissionGoals=n.data.goals[0].goals);case 6:case"end":return s.stop()}}),s)})))()},hasRequiredLevel:function(t){return this.user.season.seasonLevel>=t},statusMethod:function(t){return this.hasRequiredLevel(t.level_requirement)?t.completed||t.tracking?t.completed?"completed":t.tracking?"tracking":"":"available":"unavailable"}},created:function(){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function e(){var s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$http.get("/mission");case 2:s=e.sent,t.missions=s.data,t.openGoalsModal(t.missions[0]);case 5:case"end":return e.stop()}}),e)})))()},computed:{user:function(){return this.$store.getters["user/getUserData"]},tracked:function(){var t=0;for(var e in this.missions)if(this.missions[e].tracking&&t++,t>=3)return t;return t},status:function(){return this.statusMethod}}},g=v,p=(s("c053"),Object(u["a"])(g,n,i,!1,null,null,null));e["default"]=p.exports},"61df":function(t,e,s){},"82c4":function(t,e,s){},c053:function(t,e,s){"use strict";var n=s("82c4"),i=s.n(n);i.a},c76d:function(t,e,s){"use strict";var n=s("61df"),i=s.n(n);i.a},e0ed:function(t,e,s){t.exports=s.p+"img/goback.592f4b5a.svg"}}]);
//# sourceMappingURL=chunk-efe37112.b7a1bdcf.js.map