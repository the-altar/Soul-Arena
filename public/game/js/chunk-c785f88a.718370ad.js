(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c785f88a"],{a2d3:function(e,t,a){},d9c9:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("banner",{attrs:{bannerId:1}}),a("div",{staticClass:"main"},[a("div",{staticClass:"main-body-head"},[a("div",{staticClass:"main-header"},[a("h5",[e._v("Log in!")]),a("p",[e._v("Already have an account? Enter your credential below to access it! Oh, you don't have one yet? "),a("router-link",{attrs:{to:"/register"}},[e._v("Then click here to create one!")])],1)])]),a("div",{staticClass:"main-body-content center"},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.username,expression:"username"}],staticClass:"input",attrs:{type:"text",placeholder:"Username"},domProps:{value:e.username},on:{input:function(t){t.target.composing||(e.username=t.target.value)}}}),a("input",{directives:[{name:"model",rawName:"v-model",value:e.password,expression:"password"}],staticClass:"input",attrs:{type:"password",placeholder:"Password"},domProps:{value:e.password},on:{input:function(t){t.target.composing||(e.password=t.target.value)}}}),a("button",{staticClass:"input input-btn",on:{click:function(t){return e.login()}}},[e._v("Sign in")])]),a("div",{staticClass:"main-body-footer"})])],1)},s=[],r=a("b9ad"),o={banner:r["a"]},i={},c=(a("96cf"),a("1da1")),u=function(){var e=Object(c["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.$http.post("/user/login",{username:this.username,password:this.password});case 3:t=e.sent,this.$store.commit("user/setPermissions",t.data.userData),this.$router.push("/"),e.next=11;break;case 8:e.prev=8,e.t0=e["catch"](0),alert(e.t0);case 11:case"end":return e.stop()}}),e,this,[[0,8]])})));return function(){return e.apply(this,arguments)}}(),d={login:u},p={},l={data:function(){return{password:"",username:""}},components:o,computed:i,methods:d,watchers:p},m=l,v=(a("dd25"),a("2877")),h=Object(v["a"])(m,n,s,!1,null,null,null);t["default"]=h.exports},dd25:function(e,t,a){"use strict";var n=a("a2d3"),s=a.n(n);s.a}}]);
//# sourceMappingURL=chunk-c785f88a.718370ad.js.map