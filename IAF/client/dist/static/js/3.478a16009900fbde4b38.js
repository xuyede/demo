webpackJsonp([3],{Dzwu:function(t,e){},NrlW:function(t,e,a){t.exports=a.p+"static/img/organization.2b4241b.jpg"},"cq5/":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("UaxH"),i=a("P9l9");a("SldL");var s={name:"OrganizationDetail",data:function(){return{org_name:"",message:"",org_type:"",create_time:"",org_url:"",invest_event:[],investTag:[],option1:{},option2:{}}},components:{CommonSearch:n.a},methods:{handleCommand:function(t){1==+t?this.$router.push({name:"NewsLink"}):2==+t?this.$router.push({name:"CompanyLink"}):3==+t&&this.$router.push({name:"OrganizationLink"})},toDom:function(t){var e=this.$refs[t].offsetTop;document.documentElement.setAttribute("style","scroll-behavior : smooth"),document.documentElement.scrollTo(0,e-58),document.documentElement.removeAttribute("style")},handleInvestDetail:function(t){this.$router.push({name:"InvestDeatilLink",params:{event:t,name:this.org_name}})},getOrgDetail:function(t){var e=this;this.loadingStart(),Object(i.k)({org_name:t}).then(function(t){200===t.data.code&&e.dealOrgDetail(t.data.data)})},loadingStart:function(){this.loading=this.$loading({lock:!0,text:"加载中...",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.3)"})},loadingClose:function(){this.loading.close()},dealOrgDetail:function(t){var e=t.org_name,a=t.org_msg,n=t.org_type,i=t.create_time,s=t.org_url,o=t.invest_event;this.org_name=e,this.message=a,this.org_type=n,this.create_time=i,this.org_url=s,this.invest_event=o||[],this.investTag=t.investTag||[],this.loadingClose()},initChartsOption:function(t){var e,a=this;return(e=regeneratorRuntime.mark(function e(){var n,s,o,r,l,c,v,d,u,m,_,g,p,f;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(i.l)({org_name:t});case 2:if(n=e.sent,s=void 0,o=void 0,200!==n.data.code){e.next=11;break}r=n.data.data,l=r.tagData,c=r.timeData,s=l,o=c,e.next=12;break;case 11:throw Error("OrganizationDetail.vue: initChartsOption function error");case 12:d=(v=s).tagArray,u=v.tagCountArray,m=v.tagSumArray,g=(_=o).timeArray,p=_.timeCountArray,f=_.timeSumArray,a.option1={tooltip:{trigger:"axis",axisPointer:{crossStyle:{color:"#333"}}},toolbox:{feature:{saveAsImage:{show:!0}}},legend:{data:["投资数量","投资金额"]},xAxis:[{type:"category",data:d,axisPointer:{type:"shadow"}}],yAxis:[{type:"value",name:"数量",min:0},{type:"value",name:"金额",min:0,axisLabel:{formatter:"{value} 亿"}}],series:[{name:"投资数量",type:"bar",data:u},{name:"投资金额",type:"line",yAxisIndex:1,data:m}]},a.option2={tooltip:{trigger:"axis",axisPointer:{crossStyle:{color:"#333"}}},toolbox:{feature:{saveAsImage:{show:!0}}},legend:{data:["投资数量","投资金额"]},xAxis:[{type:"category",data:g,axisPointer:{type:"shadow"},boundaryGap:!1}],yAxis:[{type:"value",name:"数量",min:0,interval:36},{type:"value",name:"金额",min:0,interval:5,axisLabel:{formatter:"{value} 亿"}}],series:[{name:"投资金额",type:"line",yAxisIndex:1,areaStyle:{color:"rgb(132, 207, 214)"},lineStyle:{color:"rgb(132, 207, 255)"},data:f},{name:"投资数量",type:"line",areaStyle:{color:"rgb(255, 223, 214)"},lineStyle:{color:"rgb(255, 223, 214)"},data:p}]};case 15:case"end":return e.stop()}},e,a)}),function(){var t=e.apply(this,arguments);return new Promise(function(e,a){return function n(i,s){try{var o=t[i](s),r=o.value}catch(t){return void a(t)}if(!o.done)return Promise.resolve(r).then(function(t){n("next",t)},function(t){n("throw",t)});e(r)}("next")})})()}},created:function(){var t=this;this.loadingStart();var e=this.$route.params.org_name;this.initChartsOption(e),this.getOrgDetail(e),document.documentElement.scrollTo(0,0),this.$nextTick(function(){var e=t.$refs.nav,a=e.offsetTop;window.addEventListener("scroll",function(){document.documentElement.scrollTop>=a?e.children[0].setAttribute("style","top: "+(document.documentElement.scrollTop-a-1)+"px;background: #fff;"):e.children[0].removeAttribute("style")},null)})}},o={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"org-detail-box"}},[n("common-search"),t._v(" "),n("div",{staticClass:"org-detail-title"},[n("router-link",{attrs:{tag:"span",to:{name:"HomeLink"}}},[t._v("首页 > ")]),t._v(" "),n("el-dropdown",{on:{command:t.handleCommand}},[n("span",{staticClass:"el-dropdown-link"},[t._v("\n                机构"),n("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),t._v(" "),n("el-dropdown-menu",{attrs:{slot:"dropdown","show-timeout":"100","hide-timeout":"100"},slot:"dropdown"},[n("el-dropdown-item",{staticClass:"iconfont",attrs:{command:"1"}},[t._t("default",[t._v("")]),t._v(" 新闻\n                    ")],2),t._v(" "),n("el-dropdown-item",{staticClass:"iconfont",attrs:{command:"2"}},[t._t("default",[t._v("")]),t._v(" 公司\n                    ")],2),t._v(" "),n("el-dropdown-item",{staticClass:"iconfont",attrs:{command:"3"}},[t._t("default",[t._v("")]),t._v(" 机构\n                ")],2)],1)],1),t._v(" "),n("span",[t._v(t._s(t.org_name))])],1),t._v(" "),n("div",{staticClass:"org-detail-base-box"},[t._m(0),t._v(" "),n("div",{staticClass:"detail-box"},[t._m(1),t._v(" "),n("div",{staticClass:"detail-name"},[n("p",[t._v(t._s(t.org_name))]),t._v(" "),n("p",[t._v(t._s(t.org_type))]),t._v(" "),n("p",[n("a",{attrs:{href:t.org_url,target:"_blank"}},[t._v(t._s(t.org_url))])])])])]),t._v(" "),n("div",{ref:"nav",staticClass:"org-detail-nav-box"},[n("ul",{staticClass:"org-detail-nav clear"},[n("li",{on:{click:function(e){return t.toDom("generalize")}}},[t._v("概括")]),t._v(" "),n("li",{on:{click:function(e){return t.toDom("investmentRecord")}}},[t._v("投资战绩")]),t._v(" "),n("li",{on:{click:function(e){return t.toDom("iafEvent")}}},[t._v("投资事件")]),t._v(" "),n("li",{on:{click:function(e){return t.toDom("news")}}},[t._v("新闻动态")])])]),t._v(" "),n("div",{ref:"generalize",staticClass:"detail"},[n("p",{staticClass:"detail-title"},[t._v("介绍")]),t._v(" "),n("p",[t._v(t._s(t.message))]),t._v(" "),n("p",{staticClass:"line"}),t._v(" "),n("div",{staticClass:"investArea"},[n("span",[t._v("投资领域")]),t._v(" "),n("ul",{staticClass:"clear"},t._l(t.investTag,function(e,a){return n("li",{key:a},[t._v(t._s(e))])}),0)])]),t._v(" "),n("div",{ref:"investmentRecord",staticClass:"record"},[n("p",{staticClass:"record-title"},[t._v("投资战绩")]),t._v(" "),n("div",{staticClass:"charts-box"},[n("v-chart",{attrs:{options:t.option1}}),t._v(" "),n("v-chart",{attrs:{options:t.option2}})],1)]),t._v(" "),n("div",{ref:"iafEvent",staticClass:"iaf"},[n("p",{staticClass:"iaf-title"},[t._v("投资事件")]),t._v(" "),t.invest_event.length>0?n("ul",t._l(t.invest_event,function(e,i){return n("li",[n("span",[t._v(t._s(e.create_time))]),t._v(" "),n("img",{attrs:{src:a("+GsC"),alt:""}}),t._v(" "),n("span",[t._v(t._s(e.investee))]),t._v(" "),n("span",[t._v(t._s(e.tag||"-"))]),t._v(" "),n("span",[t._v(t._s(e.round))]),t._v(" "),n("span",[t._v(t._s(e.sum||e.invest_money))]),t._v(" "),n("el-button",{attrs:{size:"mini"},on:{click:function(a){return t.handleInvestDetail(e)}}},[t._v("\n                    详情\n                ")])],1)}),0):n("p",{staticClass:"no-iaf"},[t._v("\n            暂未有该公司融资信息\n        ")])]),t._v(" "),n("div",{ref:"news",staticClass:"news"},[n("p",{staticClass:"news-title"},[t._v("新闻动态")]),t._v(" "),n("p",{staticClass:"news-noData"},[t._v("暂未收录新闻动态")])])],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"detail-bg"},[e("img",{attrs:{src:a("NrlW"),alt:""}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"detail-icon"},[e("img",{attrs:{src:a("+GsC"),alt:""}})])}]};var r=a("VU/8")(s,o,!1,function(t){a("Dzwu")},"data-v-1a46a0ac",null);e.default=r.exports}});