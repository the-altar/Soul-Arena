(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9e3190f8"],{"16c0":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("main",{staticClass:"home"},[r("div",{staticClass:"home-chars"},e._l(e.chars,(function(t,n){return r("div",{key:n,staticClass:"home-char"},[r("img",{attrs:{src:"https://game.soul-arena.app/uploads/"+t.data.facepic+".jpg",alt:t.data.name}}),r("p",{staticClass:"home-char-order"},[e._v(" Order: "+e._s(t.data.dexNumber)+", id:"+e._s(t.id)+" ")]),r("router-link",{attrs:{to:"/profile/"+t.id}},[e._v("Edit")]),r("button",{on:{click:function(r){return e.deleteChar(t.id)}}},[e._v("Delete")])],1)})),0),r("div",[r("button",{on:{click:function(t){return e.$router.push("/profile/new")}}},[e._v("Create new character")])])])},a=[],c=(r("96cf"),r("1da1")),s={},u={},i=r("bc3a"),o=r.n(i),l=function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return console.log(t),e.next=3,o.a.put("/upload",t);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),p=function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(t){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.$axios.post("/character/delete",t);case 3:r=e.sent,r&&this.$router.go(),e.next=10;break;case 7:e.prev=7,e.t0=e["catch"](0),alert(e.t0);case 10:case"end":return e.stop()}}),e,this,[[0,7]])})));return function(t){return e.apply(this,arguments)}}(),h={sendData:l,deleteChar:p},d={},f={data:function(){return{chars:[]}},components:s,computed:u,methods:h,watchers:d,created:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o.a.get("/character");case 3:r=t.sent,e.chars=r.data,t.next=10;break;case 7:t.prev=7,t.t0=t["catch"](0),alert(t.t0);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})))()}},m=f,v=(r("95c4"),r("2877")),w=Object(v["a"])(m,n,a,!1,null,null,null);t["default"]=w.exports},"95c4":function(e,t,r){"use strict";var n=r("d26b"),a=r.n(n);a.a},d26b:function(e,t,r){}}]);
//# sourceMappingURL=chunk-9e3190f8.21d0eba3.js.map