(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-714696f2"],{"0a92":function(t,e,s){},"13b2":function(t,e,s){"use strict";var i=s("8e81"),a=s.n(i);a.a},"13d5":function(t,e,s){"use strict";var i=s("23e7"),a=s("d58f").left,n=s("a640"),r=s("ae40"),c=n("reduce"),o=r("reduce",{1:0});i({target:"Array",proto:!0,forced:!c||!o},{reduce:function(t){return a(this,t,arguments.length,arguments.length>1?arguments[1]:void 0)}})},"14d0":function(t,e,s){"use strict";var i=s("6f15"),a=s.n(i);a.a},"1ca1":function(t,e,s){"use strict";var i=s("d317"),a=s.n(i);a.a},2231:function(t,e,s){},"26d6":function(t,e,s){},2928:function(t,e,s){},"2acd":function(t,e,s){},"3aae":function(t,e,s){},"3ab0":function(t,e,s){},5020:function(t,e,s){},5259:function(t,e,s){"use strict";var i=s("0a92"),a=s.n(i);a.a},"57f7":function(t,e,s){"use strict";var i=s("2231"),a=s.n(i);a.a},"5af9":function(t,e,s){"use strict";var i=s("5020"),a=s.n(i);a.a},"5bd7":function(t,e,s){"use strict";var i=s("26d6"),a=s.n(i);a.a},"617e":function(t,e,s){"use strict";var i=s("7152"),a=s.n(i);a.a},6879:function(t,e,s){t.exports=s.p+"img/winner.e34810e7.jpg"},"6f15":function(t,e,s){},"6f85":function(t,e,s){},7152:function(t,e,s){},"77bb":function(t,e,s){},"7c33":function(t,e,s){"use strict";var i=s("dd56"),a=s.n(i);a.a},"8c75":function(t,e,s){"use strict";var i=s("2928"),a=s.n(i);a.a},"8e81":function(t,e,s){},9122:function(t,e,s){},"971e":function(t,e,s){"use strict";var i=s("6f85"),a=s.n(i);a.a},ab4e:function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"ingame",class:{busy:t.isBusy}},[s("section",{staticClass:"ingame-header"},[s("div",{staticClass:"ingame-player",on:{click:function(e){return t.selectUserView(t.GetMyData)}}},[s("img",{staticClass:"ingame-player-icon",attrs:{src:"/img/avatars/"+t.GetMyData.avatar,alt:""}}),s("p",[t._v(" "+t._s(t.GetMyData.username)+" ")])]),s("div",{staticClass:"ingame-control"},[t.GetMyData.isTurn?s("button",{staticClass:"ingame-control-btn",on:{click:function(e){return t.endTurn()}}},[t._v(" PRESS WHEN READY ")]):t._e(),s("div",{staticClass:"ingame-control-timebar"},[s("div",{staticClass:"ingame-control-timebar-gauge",style:"width: "+t.timer+"%"})]),t.GetMyData.isTurn?s("ul",{staticClass:"ingame-control-energypool"},t._l(t.GetMyData.energyPool.slice(0,4),(function(e,i){return s("li",{key:i,class:t.reiatsuTypes[i]+" "+t.reiatsuTypes[i]+"-glow"},[t._v(" "+t._s(e)+" ")])})),0):t._e(),t.GetMyData.isTurn?s("p",{staticClass:"ingame-control-exchange",on:{click:function(e){t.wantToExchange=!0}}},[t._v(" exchange reiatsu ")]):t._e()]),s("div",{staticClass:"ingame-player ingame-player-2",on:{click:function(e){return t.selectUserView(t.myEnemyData)}}},[s("img",{staticClass:"ingame-player-icon",attrs:{src:"/img/avatars/"+t.myEnemyData.avatar,alt:""}}),s("p",[t._v(" "+t._s(t.myEnemyData.username)+" ")])])]),s("section",{staticClass:"ingame-field"},[s("MyTeam"),s("EnemyTeam")],1),s("section",{staticClass:"ingame-footer"},[s("button",{staticClass:"ingame-btn",on:{click:t.surrender}},[t._v("Surrender")]),s("Viewer")],1),t.endturn&&t.GetMyData.isTurn?s("EnergyCart",{attrs:{queue:t.GetMyData.payupCart},on:{endturn:t.endTurn,close:function(e){t.endturn=!1}}}):t._e(),t.wantToSurrender?s("Confirmation",{on:{close:function(e){t.wantToSurrender=!1}}}):t._e(),t.gameOver?s("EndGame",{attrs:{data:t.endGameData}}):t._e(),t.wantToExchange?s("Exchange",{on:{close:function(e){t.wantToExchange=!1}}}):t._e()],1)},a=[],n=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"myteam"},t._l(t.myTeam,(function(e,i){return s("section",{key:i,class:{none:!1===e}},[!1!==e?s("div",{staticClass:"myteam-char"},[s("CharFace",{attrs:{char:e,index:i}}),s("section",{staticClass:"myteam-gamestatus"},[s("SkillQueue",{attrs:{index:i}}),s("Skills",{attrs:{skills:e.skills,charIndex:i},on:{"selected-skill":t.setSkill}})],1)],1):t._e()])})),0)},r=[],c=s("5530"),o=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"status",on:{click:function(e){return t.interact()}}},[s("charface",{attrs:{facepic:t.char.facepic,ko:t.char.knockedOut,isTarget:t.char.isTarget,index:t.index}}),s("healthbar",{attrs:{hp:t.char.hitPoints,index:t.index}})],1)},l=[],u=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"hp"},[s("div",{staticClass:"hp-value"},[t._v(t._s(t.hp))]),s("div",{staticClass:"hp-gauge",style:"width: "+t.hp+"%"})])},m=[],d={props:["hp","index"],watch:{hp:function(){this.$eventBus.$emit("healthLost-".concat(this.index))}}},g=d,h=(s("d201"),s("2877")),f=Object(h["a"])(g,u,m,!1,null,null,null),p=f.exports,v=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"charface",class:{reversed:t.reversed}},[t.pulsate?s("img",{staticClass:"pulsate-once",attrs:{src:"/img/game/"+t.facepic+".jpg"}}):t._e(),t.isTarget?s("img",{staticClass:"pulsate",attrs:{src:"/img/game/"+t.facepic+".jpg"}}):t._e(),s("img",{class:{fainted:t.ko},attrs:{src:"/img/game/"+t.facepic+".jpg"}})])},y=[],k={props:["facepic","ko","isTarget","reverse","index"],data:function(){return{pulsate:!1}},computed:{reversed:function(){return this.reverse}},created:function(){var t=this;this.$eventBus.$on("healthLost-".concat(this.index),(function(){t.pulsate=!0,setTimeout((function(){t.pulsate=!1}),1e3)}))}},_=k,C=(s("971e"),Object(h["a"])(_,v,y,!1,null,null,null)),$=C.exports,x={components:{healthbar:p,charface:$},props:["char","index"],methods:{selectTarget:function(){this.$eventBus.$emit("set-target",this.index),this.$store.commit("game/setSkillInFocus",{}),this.$store.commit("game/resetTargetables")},displayCharInfo:function(){this.$eventBus.$emit("selected-a-char",this.char)},interact:function(){this.char.isTarget?this.selectTarget():this.displayCharInfo()}}},b=x,T=(s("57f7"),Object(h["a"])(b,o,l,!1,null,null,null)),w=T.exports,S=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"myteam-skillset slide-in-blurred-bl"},t._l(t.skills,(function(e,i){return s("div",{key:i,staticClass:"myteam-skillset-skill",on:{click:function(s){return t.emitSelectedSkill(e,i)}}},[e.cooldown>0?s("p",{staticClass:"myteam-skillset-cd"},[t._v(" "+t._s(e.cooldown)+" ")]):t._e(),t.inFocus===e?s("img",{staticClass:"pulsate myteam-skillset-skill-icon",attrs:{src:"/img/game/"+e.skillpic+".jpg"}}):t._e(),s("img",{staticClass:"myteam-skillset-skill-icon",class:[{fade:e.disabled},{"fade-fwd":!t.myData.isTurn}],attrs:{src:"/img/game/"+e.skillpic+".jpg"}})])})),0)},E=[],B={props:["skills","charIndex"],methods:{emitSelectedSkill:function(t,e){this.$eventBus.$emit("selected-a-skill",t),this.myData.isTurn&&(this.$store.getters["game/isBusy"]||t.disabled||(this.$store.commit("game/setSkillInFocus",t),this.$store.commit("game/setTargetables",t.targetChoices.choice),this.$emit("selected-skill",{skill:e,caster:this.charIndex})))}},computed:{inFocus:function(){return this.$store.state.game.skillInFocus},myData:function(){return this.$store.getters["game/GetMyData"](this.myId)},myId:function(){return this.$store.getters["user/getUserData"].id}}},D=B,I=(s("5af9"),Object(h["a"])(D,S,E,!1,null,null,null)),P=I.exports,j=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"skillqueue",class:{"skillqueue-reversed":t.reversed}},[t._l(t.skillQueue,(function(e){return s("v-popover",{key:e.id,attrs:{trigger:"hover"}},[s("div",{staticClass:"skillqueue-icon"},[e.stack>1?s("p",{staticClass:"skillqueue-stack"},[t._v(" "+t._s(e.stack)+" ")]):t._e(),s("img",{staticClass:"skillqueue-pic puff-in-center",attrs:{src:"/img/game/"+e.skillpic+".jpg"}})]),s("template",{slot:"popover"},[s("ul",{staticClass:"note"},[s("li",{staticClass:"note-skillname"},[t._v(t._s(e.skillName))]),t._l(e.tips,(function(e,i){return s("li",{key:i},[e.message?s("ul",[s("li",[t._v("- "+t._s(e.message))]),s("li",{staticClass:"note-turns"},[t._v(t._s(t.parseDuration(e.duration)))])]):t._e()])})),t._l(e.notifications,(function(e,i){return s("li",{key:i},[s("ul",[s("li",[t._v(t._s(e))])])])}))],2)])],2)})),s("div",t._l(t.tempQueue,(function(e,i){return s("img",{key:i,staticClass:"skillqueue-pic",attrs:{src:"/img/game/"+t.skill(e.caster,e.skill).skillpic+".jpg"},on:{dblclick:function(s){return t.removeFromTempQueue(e)}}})})),0)],2)},U=[],G={props:["index","reversed"],computed:{myId:function(){return this.$store.getters["user/getUserData"].id},skill:function(){return this.$store.getters["game/getSkillByCaster"]},turn:function(){return this.$store.getters["game/GetMyData"](this.myId).isTurn},skillQueue:function(){return this.$store.getters["game/getSkillQueueById"](this.index,this.myId)},tempQueue:function(){return this.$store.getters["game/getTempQueueByCharacter"](this.index)}},methods:{removeFromTempQueue:function(t){if(!this.$store.getters["game/isBusy"]){this.$store.commit("game/setBusyStatus",!0);var e=this.$store.getters["game/getBattleRoom"];e.send("remove-skill-from-queue",t),this.$store.commit("game/setBusyStatus",!0)}},parseDuration:function(t){return t>1?"".concat(t," turns left"):1===t?"".concat(t," turn left"):!0===t?"Infinite":t<=0?"Ends this turn":void 0}},watch:{turn:function(){console.log("FORCED UPDATE"),this.$forceUpdate()}}},M=G,O=(s("d175"),Object(h["a"])(M,j,U,!1,null,null,null)),R=O.exports,Q={CharFace:w,SkillQueue:R,Skills:P},q=function(){return this.$store.getters["game/getMyCharList"](this.myId)},F=function(){return this.$store.getters["game/GetMyData"](this.myId)},L=function(){return this.$store.getters["user/getUserData"].id},N=function(){return this.$store.getters["game/getSkillByCaster"]},Y={myId:L,skill:N,myTeam:q,myData:F},V=function(t){this.selectedSkill=t},A={setSkill:V},H={},J={data:function(){return{selectedSkill:{}}},components:Q,computed:Y,methods:A,watchers:H,created:function(){var t=this;this.$eventBus.$on("set-target",(function(e){var s=t.$store.getters["game/getBattleRoom"];s.send("add-skill-to-queue",Object(c["a"])(Object(c["a"])({},t.selectedSkill),{},{target:e})),t.$store.commit("game/setBusyStatus",!0)}))}},K=J,Z=(s("14d0"),Object(h["a"])(K,n,r,!1,null,null,null)),W=Z.exports,z=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"enemy"},t._l(t.enemyTeam,(function(t,e){return s("CharFace",{key:e,attrs:{char:t,index:e}})})),1)},X=[],tt=function(){var t=this,e=t.$createElement,s=t._self._c||e;return!1!==t.char?s("section",{staticClass:"enemy-char"},[s("div",{staticClass:"status",on:{click:function(e){return t.interact()}}},[s("charface",{attrs:{facepic:t.char.facepic,ko:t.char.knockedOut,isTarget:t.char.isTarget,index:t.index,reverse:!0}}),s("healthbar",{attrs:{hp:t.char.hitPoints,index:t.index}})],1),s("SkillQueue",{attrs:{index:t.index,reversed:!0}})],1):t._e()},et=[],st={components:{healthbar:p,charface:$,SkillQueue:R},props:["char","index"],methods:{selectTarget:function(){this.$eventBus.$emit("set-target",this.index),this.$store.commit("game/setSkillInFocus",{}),this.$store.commit("game/resetTargetables")},removeFromTempQueue:function(t){if(!this.$store.getters["game/isBusy"]){this.$store.commit("game/setBusyStatus",!0);var e=this.$store.getters["game/getBattleRoom"];e.send("remove-skill-from-queue",t)}},displayCharInfo:function(){this.$eventBus.$emit("selected-a-char",this.char)},interact:function(){this.char.isTarget?this.selectTarget():this.displayCharInfo()}},computed:{isTarget:function(){return this.$store.getters["game/getCharacterByIndex"](this.index)},tempQueue:function(){return this.$store.getters["game/getTempQueueByCharacter"]},skill:function(){return this.$store.getters["game/getSkillByCaster"]},skillQueue:function(){return this.$store.getters["game/getSkillQueueById"]},playerId:function(){return this.$store.getters["user/getUserData"].id}}},it=st,at=(s("b9f7"),Object(h["a"])(it,tt,et,!1,null,null,null)),nt=at.exports,rt={CharFace:nt},ct=function(){var t=this.$store.getters["user/getUserData"].id;return this.$store.getters["game/getEnemyCharList"](t)},ot={enemyTeam:ct},lt={},ut={},mt={data:function(){return{}},components:rt,computed:ot,methods:lt,watchers:ut},dt=mt,gt=(s("8c75"),Object(h["a"])(dt,z,X,!1,null,null,null)),ht=gt.exports,ft=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"viewer"},[t.isSkill?s("Skill",{attrs:{data:t.data}}):t._e(),t.isChar?s("Char",{attrs:{char:t.data}}):t._e(),t.isUser?s("User",{attrs:{user:t.data}}):t._e()],1)},pt=[],vt=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("section",{staticClass:"skill"},[s("img",{staticClass:"skill-img",attrs:{src:"/img/game/"+t.data.banner+".jpg"}}),s("div",{staticClass:"skill-info"},[s("div",{staticClass:"skill-info-small"},[s("p",{staticClass:"skill-name"},[t._v(t._s(t.data.name))]),s("p",{staticClass:"skill-cost"},[t._v(" Cost: "),t._l(t.costs,(function(t,e){return s("span",{key:e,class:"viewer-energy "+t})}))],2)]),s("div",{staticClass:"skill-info-large"},[t._v(" "+t._s(t.data.description)+" ")]),s("div",{staticClass:"skill-info-small"},[s("p",{staticClass:"skill-classes"}),s("p",{staticClass:"skill-cooldown"},[t._v("Cooldown: "+t._s(t.data.baseCooldown))])])])])},yt=[],kt={props:["data"],computed:{costs:function(){for(var t=["Hakuda","Kidou","Reiryoku","Zanpakutou","Random"],e=[],s=0;s<t.length;s++)for(var i=0;i<this.data.cost[s];i++)e.push(t[s]);return e},types:function(){return this.$store.getters["enums/getEnum"]("pokemonTypings")},classes:function(){return this.$store.getters["enums/getEnum"]("skillClassTypings")}}},_t=kt,Ct=(s("7c33"),Object(h["a"])(_t,vt,yt,!1,null,"9a09c058",null)),$t=Ct.exports,xt=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"user"},[s("div",{staticClass:"user-avatar"},[s("img",{attrs:{src:"/img/avatars/"+t.user.avatar,alt:t.user.username+" avatar"}})]),s("div",{staticClass:"user-info"},[s("div",{staticClass:"user-info-name"},[t._v(t._s(t.user.username))]),s("div",{staticClass:"user-info-stats"},[s("p",[t._v("Rank: "+t._s(t.user.season.seasonRank))]),s("p",[t._v(" Ratio: "+t._s(t.user.season.wins)+" - "+t._s(t.user.season.losses)+" ("+t._s(t.user.season.streak)+") ")])])]),s("div",{staticClass:"user-charlist"},t._l(t.charList,(function(t,e){return s("img",{key:e,attrs:{src:"/img/game/"+t.facepic+".jpg"}})})),0)])},bt=[],Tt=s("b85c"),wt={props:["user"],computed:{charList:function(){var t,e=[],s=Object(Tt["a"])(this.$store.getters["game/getMyCharList"](this.user.id));try{for(s.s();!(t=s.n()).done;){var i=t.value;i&&e.push(i)}}catch(a){s.e(a)}finally{s.f()}return e}}},St=wt,Et=(s("13b2"),Object(h["a"])(St,xt,bt,!1,null,"3af5a392",null)),Bt=Et.exports,Dt=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"char"},[s("div",{staticClass:"char-avatar"},[s("img",{attrs:{src:"/img/game/"+t.char.banner+".jpg"}})]),s("div",{staticClass:"char-profile"},[s("div",{staticClass:"narrow"},[s("p",{staticClass:"char-name"},[t._v(t._s(t.char.name))]),s("p",{staticClass:"char-gain"},t._l(t.char.energyGain,(function(e,i){return s("span",{key:i,class:"char-cost "+t.energy[e].toLowerCase()})})),0)]),s("div",{staticClass:"wide"},[s("p",[t._v(t._s(t.char.description))])]),s("div",{staticClass:"normal"},t._l(t.char.skills,(function(e,i){return s("div",{key:i,staticClass:"char-skill"},[s("img",{attrs:{src:"/img/game/"+e.skillpic+".jpg"},on:{click:function(s){return t.displaySkill(e)}}})])})),0)])])},It=[],Pt={props:["char"],computed:{energy:function(){return this.$store.getters["enums/getEnum"]("costTypings")}},methods:{displaySkill:function(t){this.$eventBus.$emit("selected-a-skill",t)}}},jt=Pt,Ut=(s("617e"),Object(h["a"])(jt,Dt,It,!1,null,"9f75bf90",null)),Gt=Ut.exports,Mt={User:Bt,Char:Gt,Skill:$t},Ot=s("e50b"),Rt=s.n(Ot),Qt={},qt={},Ft={data:function(){return{isSkill:!1,isChar:!1,isUser:!1,data:{skillpic:"",description:""}}},components:Mt,computed:Rt.a,methods:Qt,watchers:qt,created:function(){var t=this;this.$eventBus.$on("selected-a-skill",(function(e){t.isChar=!1,t.isUser=!1,t.isSkill=!0,t.data=e})),this.$eventBus.$on("selected-an-user",(function(e){t.isChar=!1,t.isSkill=!1,t.isUser=!0,t.data=e})),this.$eventBus.$on("selected-a-char",(function(e){t.isUser=!1,t.isSkill=!1,t.isChar=!0,t.data=e}))}},Lt=Ft,Nt=(s("5259"),Object(h["a"])(Lt,ft,pt,!1,null,null,null)),Yt=Nt.exports,Vt=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"cart",on:{click:function(e){return e.target!==e.currentTarget?null:t.close(e)}}},[s("section",{staticClass:"cart-cart"},[s("p",{staticClass:"cart-head"},[t._v("Pay "+t._s(t.queue[4])+" PP to proceed")]),t._l(t.energyPool.slice(0,4),(function(e,i){return s("div",{key:i,staticClass:"cart-opt"},[s("div",{staticClass:"cart-field"},[s("p",{staticClass:"cart-energy"},[t._v(t._s(t.energyName[i]))]),s("p",[t._v(t._s(e))]),s("button",{on:{click:function(e){return t.pay(i)}}},[t._v("+")])]),s("div",{staticClass:"cart-field"},[s("button",{on:{click:function(e){return t.refund(i)}}},[t._v("-")]),s("p",[t._v(t._s(t.paid[i]))])])])})),s("div",{staticClass:"cart-skills"},t._l(t.tempQueue,(function(e,i){return s("img",{key:i,attrs:{src:"/img/game/"+t.skill(e.caster,e.skill).skillpic+".jpg"}})})),0),s("button",{staticClass:"btn",on:{click:t.endturn}},[t._v("Proceed")])],2)])},At=[],Ht=(s("13d5"),s("a434"),{props:["queue"],data:function(){return{sum:0,paid:[0,0,0,0],energyName:["speed","strength","elemental","wisdom","random"]}},methods:{close:function(){for(var t in this.paid)this.energyPool.splice(t,1,this.energyPool[t]+this.paid[t]);this.$emit("close")},pay:function(t){this.queue[4]!==this.sum&&(this.energyPool[t]<=0||(this.energyPool.splice(t,1,this.energyPool[t]-1),this.paid.splice(t,1,this.paid[t]+1),this.sum++))},refund:function(t){0!==this.queue[4]&&(this.paid[t]<=0||(this.energyPool.splice(t,1,this.energyPool[t]+1),this.paid.splice(t,1,this.paid[t]-1),this.sum--))},endturn:function(){if(!this.$store.getters["game/isBusy"]){var t=this.paid.reduce((function(t,e){return t+e}),0);if(t==this.queue[4]){this.$store.commit("game/setBusyStatus",!0);var e=this.$store.getters["game/getBattleRoom"];e.send("end-game-turn",this.paid)}}}},computed:{tempQueue:function(){return this.$store.getters["game/getTempQueue"]},skill:function(){return this.$store.getters["game/getSkillByCaster"]},energyPool:function(){var t=this.$store.getters["user/getUserData"].id;return this.$store.getters["game/GetMyData"](t).energyPool}}}),Jt=Ht,Kt=(s("5bd7"),Object(h["a"])(Jt,Vt,At,!1,null,"d65fe936",null)),Zt=Kt.exports,Wt=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"modal puff-in-center"},[t.winner?s("div",{staticClass:"content"},[s("img",{attrs:{src:t.winnerPic}}),s("p",{staticClass:"head head-win"},[t._v("You've won!")]),s("div",{staticClass:"results"},[s("p",[t._v("+"+t._s(t.winningRes.exp)+" exp")]),s("p",{staticClass:"middle"},[t._v("+"+t._s(t.winningRes.coins)+" coins")]),s("p",[t._v("+1 streak")])]),s("button",{staticClass:"btn btn-win",on:{click:function(e){return t.$router.push({name:"home"})}}},[t._v(" Continue ")])]):s("div",{staticClass:"content"},[s("img",{attrs:{src:t.loserPic}}),s("p",{staticClass:"head"},[t._v("You've lost...")]),s("div",{staticClass:"results"},[s("p",[t._v("-"+t._s(t.losingRes.exp)+" exp")]),s("p",{staticClass:"middle"},[t._v("+"+t._s(t.losingRes.coins)+" coins")]),s("p",[t._v("-"+t._s(1)+" streak")])]),s("button",{staticClass:"btn",on:{click:function(e){return t.$router.push({name:"home"})}}},[t._v(" Continue ")])])])},zt=[],Xt={props:["data"],data:function(){return{loserPic:s("e0a1"),winnerPic:s("6879")}},computed:{myId:function(){return this.$store.getters["user/getUserData"].id},winner:function(){return this.data.winner.playerData.id===this.myId},winningRes:function(){return this.data.winner.results},losingRes:function(){return this.data.loser.results}}},te=Xt,ee=(s("f5e1"),Object(h["a"])(te,Wt,zt,!1,null,"3ce8d5d8",null)),se=ee.exports,ie=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"modal"},[s("div",{staticClass:"content fade-in-fwd"},[s("h1",{staticClass:"header"},[t._v("Are you sure?")]),s("div",{staticClass:"options"},[s("button",{staticClass:"separator",on:{click:t.confirm}},[t._v("Yes")]),s("button",{on:{click:t.close}},[t._v("No")])])])])},ae=[],ne={methods:{close:function(){this.$emit("close")},confirm:function(){if(!this.$store.getters["game/isBusy"]){this.$store.commit("game/setBusyStatus",!0);var t=this.$store.getters["game/getBattleRoom"];t.send("surrender",this.$store.getters["user/getUserData"].id)}}}},re=ne,ce=(s("df51"),Object(h["a"])(re,ie,ae,!1,null,"c7bcbc40",null)),oe=ce.exports,le=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"modal",on:{click:function(e){return e.target!==e.currentTarget?null:t.close()}}},[s("div",{staticClass:"content fade-in-fwd"},[s("h1",{staticClass:"header"},[t._v("Reiatsu exchange")]),t.isPaid?t._e():s("div",{staticClass:"step"},[s("p",{staticClass:"step__head"},[t._v("Select a new reiatsu")]),s("div",t._l(t.energies,(function(e,i){return s("li",{key:i,class:["step__energy",e,{selected:t.exchangeIndex===i}],on:{click:function(e){return t.askExchange(i)}}})})),0)]),t.debt>0&&!1===t.isPaid?s("div",{staticClass:"step"},[s("p",{staticClass:"step__head step__head--larger"},[t._v(" Now exchange "+t._s(t.debt)+" reiatsu to proceed ")]),s("div",t._l(t.original.slice(0,4),(function(e,i){return s("li",{directives:[{name:"tooltip",rawName:"v-tooltip",value:{content:"You have "+t.original[i]+" "+t.reiatsuTypes[i]+" reiatsu",classes:["small"],placement:"bottom"},expression:"{\n            content: `You have ${original[key]} ${reiatsuTypes[key]} reiatsu`,\n            classes: ['small'],\n            placement: 'bottom',\n          }"}],key:i,class:"step__energy "+t.energies[i],on:{click:function(e){return t.payExchange(i)}}})})),0)]):t._e(),t.isPaid?s("div",{staticClass:"step"},[s("p",{staticClass:"step__header"},[t._v(" You're about to exchange 2 "),s("span",{class:t.energies[t.paidIndex]+"-text"},[t._v(t._s(t.energies[t.paidIndex]))]),t._v(" reiatsu for 1 "),s("span",{class:t.energies[t.exchangeIndex]+"-text"},[t._v(t._s(t.energies[t.exchangeIndex]))]),t._v(" reiatsu. ")]),s("div",[s("button",{on:{click:t.confirmExchange}},[t._v("Confirm")]),s("button",{on:{click:function(e){return t.close()}}},[t._v("Cancel")])])]):t._e()])])},ue=[],me=(s("fb6a"),{data:function(){return{energies:["Hakuda","Kidou","Reiryoku","Zanpakutou"],exchange:[0,0,0,0],original:[],debt:0,paidIndex:0,exchangeIndex:0,isPaid:!1}},methods:{close:function(){this.$emit("close")},askExchange:function(t){this.debt=2,this.exchangeIndex=t,this.isPaid=!1,this.exchange.splice(t,1,this.exchange[t]+1)},payExchange:function(t){this.original[t]<2||(this.paidIndex=t,this.original.splice(t,1,this.original[t]-=2),this.original.splice(this.exchangeIndex,1,this.original[this.exchangeIndex]+1),this.original[4]=this.original.slice(0,4).reduce((function(t,e){return t+e})),this.isPaid=!0)},confirmExchange:function(){if(!this.$store.getters["game/isBusy"]){var t=this.$store.getters["game/getBattleRoom"];t.send("exchange-energypool",this.original),this.$store.commit("game/setBusyStatus",!0),this.close()}}},computed:{energyPool:function(){return this.original},reiatsuTypes:function(){return this.$store.getters["enums/getEnum"]("reiatsuTypings")}},created:function(){var t=this.$store.getters["user/getUserData"].id;this.original=this.$store.getters["game/GetMyData"](t).energyPool.slice()}}),de=me,ge=(s("f020"),Object(h["a"])(de,le,ue,!1,null,"66eda362",null)),he=ge.exports,fe={MyTeam:W,EndGame:se,EnergyCart:Zt,Confirmation:oe,Exchange:he,EnemyTeam:ht,Viewer:Yt},pe=function(){return this.$store.state.game},ve=function(){var t=this.$store.getters["user/getUserData"].id;return this.$store.getters["game/GetMyData"](t)},ye=function(){var t=this.$store.getters["user/getUserData"].id;return this.$store.getters["game/myEnemyData"](t)},ke=function(){var t=this.$store.getters["user/getUserData"].id;return this.$store.getters["game/GetMyData"](t).isTurn},_e=function(){return this.$store.getters["game/getTempQueue"]},Ce=function(){return this.$store.getters["game/isBusy"]},$e=function(){return this.$store.getters["enums/getEnum"]("reiatsuTypings")},xe={Game:pe,isBusy:Ce,isTurn:ke,GetMyData:ve,reiatsuTypes:$e,myEnemyData:ye,tempSkillQueue:_e},be=function(){if(!this.isBusy)if(this.tempSkillQueue.length>0)this.endturn=!0;else{var t=this.$store.getters["game/getBattleRoom"];t.send("end-game-turn"),this.$store.commit("game/setBusyStatus",!0)}},Te=function(){this.isBusy||(this.wantToSurrender=!0)},we=function(t){this.$eventBus.$emit("selected-an-user",t)},Se={endTurn:be,surrender:Te,selectUserView:we},Ee=function(t){t||(this.endturn=!1)},Be={isTurn:Ee},De={data:function(){return{endturn:!1,timer:100,count:60,tick:null,gameOver:!1,wantToSurrender:!1,endGameData:null,wantToExchange:!1}},components:fe,computed:xe,methods:Se,watch:Be,created:function(){var t=this,e=this.$store.getters["game/getBattleRoom"];null!==e&&(e.onMessage("start-new-turn",(function(e){t.$store.commit("game/setBusyStatus",!1),t.$store.dispatch("audio/playTurnSound"),clearInterval(t.tick),t.timer=100,t.count=60,t.tick=setInterval((function(){t.timer=t.timer-1.66,t.count=t.count-1,0===t.timer&&clearInterval(t.tick)}),1e3),t.$store.commit("game/setGameState",e),t.GetMyData.isTurn?t.$store.commit("midori/setUpdate",{value:!0,index:0}):t.$store.commit("midori/setUpdate",{value:!0,index:1})})),e.onMessage("update-temp-queue",(function(e){t.$store.commit("game/setTempQueue",e),t.$store.commit("game/setPlayerEnergyPool",{playerIndex:e.playerIndex,energyPool:e.energyPool}),t.$store.commit("game/setPayupCart",{p:e.playerIndex,pay:e.payupCart}),t.$store.commit("game/setBusyStatus",!1)})),e.onMessage("end-game",(function(e){clearInterval(t.tick),t.endGameData=e,t.endturn=!1,t.gameOver=!0,t.$store.commit("game/setBusyStatus",!1)})),e.onMessage("exchanged-energy",(function(e){t.$store.commit("game/setPlayerEnergyPool",e),t.$store.commit("game/setCharacters",e),t.$store.commit("game/setBusyStatus",!1)}))),this.tick=setInterval((function(){t.timer=t.timer-1.66,t.count=t.count-1,0===t.timer&&clearInterval(t.tick)}),1e3)},mounted:function(){this.GetMyData.isTurn?this.$store.commit("midori/setUpdate",{value:!0,index:0}):this.$store.commit("midori/setUpdate",{value:!0,index:1}),this.selectUserView(this.myEnemyData)},beforeDestroy:function(){this.$store.commit("game/resetState"),this.$eventBus.$off()}},Ie=De,Pe=(s("1ca1"),Object(h["a"])(Ie,i,a,!1,null,null,null));e["default"]=Pe.exports},b9f7:function(t,e,s){"use strict";var i=s("77bb"),a=s.n(i);a.a},c074:function(t,e,s){},d175:function(t,e,s){"use strict";var i=s("3aae"),a=s.n(i);a.a},d201:function(t,e,s){"use strict";var i=s("c074"),a=s.n(i);a.a},d317:function(t,e,s){},d58f:function(t,e,s){var i=s("1c0b"),a=s("7b0b"),n=s("44ad"),r=s("50c4"),c=function(t){return function(e,s,c,o){i(s);var l=a(e),u=n(l),m=r(l.length),d=t?m-1:0,g=t?-1:1;if(c<2)while(1){if(d in u){o=u[d],d+=g;break}if(d+=g,t?d<0:m<=d)throw TypeError("Reduce of empty array with no initial value")}for(;t?d>=0:m>d;d+=g)d in u&&(o=s(o,u[d],d,l));return o}};t.exports={left:c(!1),right:c(!0)}},dd56:function(t,e,s){},df51:function(t,e,s){"use strict";var i=s("9122"),a=s.n(i);a.a},e0a1:function(t,e,s){t.exports=s.p+"img/loser.90629d12.jpg"},e50b:function(t,e){},f020:function(t,e,s){"use strict";var i=s("2acd"),a=s.n(i);a.a},f5e1:function(t,e,s){"use strict";var i=s("3ab0"),a=s.n(i);a.a}}]);
//# sourceMappingURL=chunk-714696f2.1bdd479f.js.map