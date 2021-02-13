(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-280da224"],{"63d6":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("main",{attrs:{id:"app"}},[e.isDisabled?e._e():a("canvas",{ref:"canvas",staticClass:"canvas"}),a("transition",{attrs:{name:"fade"}},[e.imagesReady&&e.loaded?a("router-view",{directives:[{name:"show",rawName:"v-show",value:e.isLoaded||e.isDisabled,expression:"isLoaded || isDisabled"}]}):a("div",{staticClass:"app-loading"},[a("img",{staticClass:"app-loading-gif",attrs:{src:s("c518")}}),a("div",{staticClass:"app-opt"},[a("p",{staticClass:"app-opt-checkbox"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.disableMidori,expression:"disableMidori"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.disableMidori)?e._i(e.disableMidori,null)>-1:e.disableMidori},on:{change:function(t){var s=e.disableMidori,a=t.target,r=!!a.checked;if(Array.isArray(s)){var i=null,n=e._i(s,i);a.checked?n<0&&(e.disableMidori=s.concat([i])):n>-1&&(e.disableMidori=s.slice(0,n).concat(s.slice(n+1)))}else e.disableMidori=r}}}),e._v(" Disable animated background ")]),a("p",{staticClass:"app-opt-help"},[e._v(" This feature uses WebGL and might affect performance. Check here to opt-out of it. ")])]),a("p",{staticClass:"app-loading-text"},[e._v(e._s(e.message))])])],1),a("v-dialog"),e.profileModal?a("playerPanel",{on:{close:function(t){e.$store.getters["user/modalStates"].profile=!1}}}):e._e(),a("transition",{attrs:{"enter-active-class":"slideInUp","leave-active-class":"slideOutDown"}},[e._v("> "),0===e.activeModal?a("notification"):e._e()],1)],1)},r=[],i=(s("96cf"),s("1da1")),n=s("bc3a"),o=s.n(n),c=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"modal fade-in-fwd",on:{click:function(t){return t.target!==t.currentTarget?null:e.$emit("close")}}},[e.user?s("div",{staticClass:"user"},[s("div",{staticClass:"user-header"},[s("img",{attrs:{src:"/img/avatars/"+e.user.avatar}}),s("p",[e._v(" "+e._s(e.user.username)+" "),s("br"),s("span",{staticClass:"user-header-rank"},[e._v(e._s(e.user.season.seasonRank))]),s("br")]),s("button",{staticClass:"user-reset-btn",on:{click:e.resetStats}},[e._v("Reset")])]),s("div",[s("div",{staticClass:"user-stats"},[s("div",{staticClass:"user-stats-detail"},[s("p",[e._v(e._s(e.user.season.wins))]),s("p",{staticClass:"user-stats-label"},[e._v("Wins")])]),s("div",{staticClass:"user-stats-detail"},[s("p",[e._v(e._s(e.user.season.losses))]),s("p",{staticClass:"user-stats-label"},[e._v("Losses")])]),s("div",{staticClass:"user-stats-detail"},[s("p",[e._v(e._s(e.user.season.streak))]),s("p",{staticClass:"user-stats-label"},[e._v("Streak")])])]),s("div",{staticClass:"user-stats"},[s("div",{staticClass:"user-stats-detail"},[s("p",[e._v(e._s(e.user.season.maxStreak))]),s("p",{staticClass:"user-stats-label"},[e._v("max streak")])]),s("div",{staticClass:"user-stats-detail"},[s("p",[e._v(e._s(e.user.season.seasonLevel))]),s("p",{staticClass:"user-stats-label"},[e._v("Level")])]),s("div",{staticClass:"user-stats-detail"},[s("p",[e._v(e._s(e.user.coins))]),s("p",{staticClass:"user-stats-label"},[e._v("coins")])])])]),s("div",{staticClass:"user-options"},[s("p",{staticClass:"user-header-exp"},[s("span",{staticClass:"user-header-exp-value"},[e._v("exp: "+e._s(e.user.season.exp)+"/"+e._s(e.expNeeded))]),s("span",{staticClass:"user-header-exp-bar",style:{width:e.expRatio+"%"}})])])]):e._e()])},u=[],l={computed:{user:function(){return this.$store.getters["user/getUserData"]},expNeeded:function(){var e=this.user.season.seasonLevel;return e*(e+1)/2*150},expRatio:function(){return Math.floor(this.user.season.exp/this.expNeeded*100)}},methods:{resetStats:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.$http.post("/user/stats/reset");case 3:return t.next=5,e.$http.get("/user");case 5:s=t.sent,e.$store.commit("user/SET_USER",s.data),t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](0),e.alertSystem("Something went wrong, yo");case 12:case"end":return t.stop()}}),t,null,[[0,9]])})))()}}},d=l,m=(s("75e7"),s("2877")),p=Object(m["a"])(d,c,u,!1,null,"432c531a",null),v=p.exports,h=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"notification flex",class:"notification-"+e.status},[s("p",{staticClass:"notification-message"},[e._v(e._s(e.message))])])},f=[],b={computed:{message:function(){return this.$store.getters["lobby/GET_NOTIFICATION_MESSAGE"]},status:function(){return this.$store.getters["lobby/GET_NOTIFICATION_STATUS"]}},created:function(){var e=this;setTimeout((function(){e.clearAlert()}),4e3)}},g=b,_=(s("f739"),Object(m["a"])(g,h,f,!1,null,"064129e6",null)),$=_.exports,C={components:{playerPanel:v,notification:$},data:function(){return{imagesReady:!1,loaded:!1,disableMidori:!1,message:"Gaming is loading..."}},methods:{reconnectToGame:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var s,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(s=localStorage.getItem("battle"),s){t.next=4;break}return setTimeout((function(){e.$store.dispatch("audio/playGameStart"),e.loaded=!0,e.$router.push({name:"home"})}),3e3),t.abrupt("return");case 4:return s=JSON.parse(s),e.message="You're currently in a match; attempting to reconnect!",t.prev=6,t.next=9,e.$colyseus.reconnect(s.roomId,s.sessionId);case 9:a=t.sent,e.$store.commit("game/setRoom",a),setTimeout((function(){e.$store.dispatch("audio/playGameStart"),e.loaded=!0,e.$router.push({name:"ingame"})}),3e3),t.next=19;break;case 14:t.prev=14,t.t0=t["catch"](6),localStorage.removeItem("battle"),e.$router.push({name:"home"}),e.loaded=!0;case 19:case"end":return t.stop()}}),t,null,[[6,14]])})))()}},computed:{isLoaded:function(){return this.$store.state.midori.isLoaded},isDisabled:function(){return this.$store.state.midori.disabled},update:function(){return this.$store.state.midori.update},profileModal:function(){return this.$store.getters["user/modalStates"].profile}},mounted:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var s,a,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,e.message="Retrieving user data...",t.next=4,e.$http.get("/user");case 4:return s=t.sent,e.message="Collecting roster...",t.next=8,o.a.get("/character");case 8:return a=t.sent,e.message="Just a few things left...",t.next=12,o.a.get("/game-enums");case 12:r=t.sent,e.$store.commit("SET_THEME",s.data.theme),e.$store.commit("user/SET_USER",s.data),e.$store.commit("audio/setAudio"),e.$store.commit("Roster/setData",a.data),e.$store.commit("enums/setEnums",r.data),e.$colyseus.joinOrCreate("lobby",{auth:s.data.auth,id:s.data.id}).then((function(t){e.$store.commit("lobby/SET_ROOM",t)})).catch((function(){e.$store.commit("lobby/SET_ROOM",null)})),e.reconnectToGame(),e.$store.dispatch("midori/setCanvas",{canvas:e.$refs.canvas,theme:e.theme}).then((function(t){e.imagesReady=t})),t.next=26;break;case 23:t.prev=23,t.t0=t["catch"](0),e.$router.push({name:"login"});case 26:case"end":return t.stop()}}),t,null,[[0,23]])})))()},watch:{update:function(e){e&&(2===this.$store.state.midori.index?this.$store.commit("midori/setHomeBackground"):this.$store.commit("midori/setTurnBackground")),this.$store.state.midori.update=!1},disableMidori:function(e){e?this.$store.commit("midori/disable"):this.$store.commit("midori/enable")}},beforeDestroy:function(){this.$store.commit("midori/cleanUp")}},x=C,w=Object(m["a"])(x,a,r,!1,null,null,null);t["default"]=w.exports},"75e7":function(e,t,s){"use strict";var a=s("cf0a"),r=s.n(a);r.a},ac73:function(e,t,s){},c518:function(e,t,s){e.exports=s.p+"img/wait.cca21584.gif"},cf0a:function(e,t,s){},f739:function(e,t,s){"use strict";var a=s("ac73"),r=s.n(a);r.a}}]);
//# sourceMappingURL=chunk-280da224.45766cfe.js.map