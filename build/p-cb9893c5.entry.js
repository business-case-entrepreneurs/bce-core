import{r as t,h as e,a as i}from"./p-6944ad4b.js";const n={match:{and:"Alle",or:"Een"},matchParagraph:{and:"onderstaande condities zijn waar",or:"van de onderstaande condities is waar"},check:{is:"is","is-before":"is voor","is-after":"is na","is-on-or-before":"is op of voor","is-on-or-after":"is op of na","is-empty":"is leeg","is-not-empty":"is niet leeg",equals:"is gelijk aan","not-equals":"is niet gelijk aan",contains:"bevat","not-contains":"bevat niet","starts-with":"begint met","not-starts-with":"begint niet met","ends-with":"eindigd met","not-ends-with":"eindigd niet met"}},s=class{constructor(e){var i;t(this,e),this.template=[{name:"date",label:"Date",input:"date"}],this.value={match:"and",condition:[{data:(null===(i=this.template[0])||void 0===i?void 0:i.name)||"",property:"",check:"",value:""}]},this.handleAddCondition=()=>{const t=[...this.value.condition,this.createRow()],e=Object.assign(Object.assign({},this.value),{condition:t});this.set(e)},this.handleRemoveCondition=(t,e)=>{const i=this.remove(e,this.value);this.set(i)},this.handleInput=(t,e,i)=>{const n=this.update(e,{[i]:t.target.value||""},this.value);this.set(n)}}createRow(){var t;return{data:(null===(t=this.template[0])||void 0===t?void 0:t.name)||"",property:"",check:"",value:""}}remove(t,e){if(!t.length)return e;const i=t[0],n=e.condition[i],s=[...e.condition];return 1!==t.length&&this.isGroup(n)?s[i]=this.remove(t.slice(1),n):s.splice(i,1),Object.assign(Object.assign({},e),{condition:s})}set(t){this.value=t;const e=new Event("input",{bubbles:!0,composed:!0});this.el.dispatchEvent(e)}update(t,e,i){if(!t.length||!this.isGroup(i))return Object.assign(Object.assign({},i),e);const n=t[0],s=i.condition[n],o=[...i.condition];return o[n]=this.update(t.slice(1),e,s),Object.assign(Object.assign({},i),{condition:o})}isGroup(t){return"condition"in t}renderCheck(t,i,s){let o=[];switch(s){case"date":o=["is","is-before","is-after","is-on-or-before","is-on-or-after","is-empty","is-not-empty"];break;default:o=["equals","not-equals","contains","not-contains","starts-with","not-starts-with","ends-with","not-ends-with","is-empty","is-not-empty"]}return e("bce-select",{color:this.color,key:t.data,type:"dropdown",value:t.check,onInput:t=>this.handleInput(t,i,"check")},o.map((t=>e("bce-option",{value:t},n.check[t]))))}renderInput(t,i,n){if(!n)return;const s="string"==typeof n?n:n.type;return[this.renderCheck(t,i,s),e("bce-input",{color:this.color,type:s,value:t.value,onInput:t=>this.handleInput(t,i,"value")})]}renderProperty(t,i,n){if(!(null==n?void 0:n.length))return;const s=n.find((e=>e.name===t.property));return[e("bce-select",{key:t.data,type:"dropdown",value:t.property,onInput:t=>this.handleInput(t,i,"property")},n.map((t=>e("bce-option",{value:t.name},t.label)))),s&&this.renderInput(t,i,s.input)]}renderRow(t,i,n){const s=this.template.find((e=>e.name===t.data));return e("li",{key:i.join("-")+"-"+t.data},e("bce-select",{color:this.color,type:"dropdown",value:t.data,onInput:t=>this.handleInput(t,i,"data")},this.template.map((t=>e("bce-option",{value:t.name},t.label||t.name)))),this.renderProperty(t,i,null==s?void 0:s.property),this.renderInput(t,i,null==s?void 0:s.input),n&&e("bce-menu",{color:this.color},e("bce-button",{icon:"fas:trash",onClick:t=>this.handleRemoveCondition(t,i)},"Remove")))}renderGroup(t,i){return e("ul",{class:{multiple:t.condition.length>1}},t.condition.length>1&&e("header",null,e("bce-select",{color:this.color,type:"dropdown",value:t.match,onInput:t=>this.handleInput(t,i,"match")},e("bce-option",{value:"and"},n.match.and),e("bce-option",{value:"or"},n.match.or)),e("p",null,n.matchParagraph[t.match])),t.condition.map(((e,n)=>this.isGroup(e)?this.renderGroup(e,[...i,n]):this.renderRow(e,[...i,n],t.condition.length>1))),e("footer",null,e("bce-button",{color:this.color,design:"text",icon:"fas:plus",onClick:this.handleAddCondition},"Conditie Toevoegen")))}render(){return[this.renderGroup(this.value,[])]}get el(){return i(this)}};s.style=":host{position:relative;margin:20px 0}:host ul{margin:0;padding-left:0}:host ul header{display:flex;align-items:center}:host ul header bce-select{width:80px}:host ul header p{margin:0 10px}:host ul ul{padding-left:82px}:host ul li{display:flex;align-items:center}:host ul.multiple li{margin-left:82px}:host ul.multiple footer{margin-left:82px}:host bce-input,:host bce-select{margin:2px}";export{s as bce_condition}