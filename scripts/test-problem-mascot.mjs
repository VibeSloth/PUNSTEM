import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const listeners=new Map(),nodes=[];let calls=0,paused=0,resumed=0,payload;
function node(tag){return {tag,dataset:{},children:[],members:new Map(),textContent:'',value:'',events:{},setAttribute(){},append(...xs){this.children.push(...xs)},focus(){},querySelector(s){if(!this.members.has(s))this.members.set(s,node(s));return this.members.get(s)},addEventListener(k,fn){this.events[k]=fn},showModal(){this.open=true},close(){this.open=false;this.events.close?.()}};}
const doc={readyState:'complete',querySelector:s=>s==='#quizScreen'?node('screen'):s==='#answerInput'?{value:'12'}:null,querySelectorAll:()=>[],head:{append(){}},body:{append(n){nodes.push(n)}},createElement:node,addEventListener:(k,fn)=>listeners.set(k,fn)};
const window={PunstemTutorChat:{create:(host,options)=>({async ask(){calls++;payload=options.context();options.onSuccess();return true},stop(){},reset(){},setScope(){}})},PunstemAuth:{require:()=>true},PunstemCurrentUser:{userId:'u'},PunstemPracticePause:()=>{paused++;return()=>resumed++}};
const ctx=vm.createContext({window,document:doc,AbortController,Array,fetch:async(_,opts)=>{calls++;payload=JSON.parse(opts.body);return{ok:true,json:async()=>({explanation:'Reverse the equation; flip the ΔH sign.'})}}});vm.runInContext(fs.readFileSync('public/problem-mascot.js','utf8'),ctx);
const button=nodes.find(n=>n.tag==='button'),dialog=nodes.find(n=>n.tag==='dialog');assert(button&&dialog);assert.equal(calls,0);
listeners.get('punstem-problem-context')({detail:{equation:'Find ΔH for A → 2C + E.',data:'A → 2B: −80 kJ',prompt:'Find the setup.'}});button.onclick();assert(dialog.open);assert.equal(paused,1);assert.equal(calls,0);assert(dialog.querySelector('.mascot-question').textContent.includes('A →'));
await dialog.querySelector('.mascot-ask').onclick();assert.equal(calls,1);assert.equal(payload.studentAnswer,'12');assert.equal(Object.keys(payload).length,6);assert.equal(payload.source,'');assert.equal(payload.questionId,'');dialog.close();assert.equal(resumed,1);
button.onclick();window.PunstemCurrentUser=null;listeners.get('punstem-auth-ready')();assert.equal(resumed,1,'Logout must not restart the old timer');assert(!dialog.open);
assert.equal(fs.readFileSync('public/mascot-blue.png')[25],6,'Mascot PNG must preserve alpha');
for(const p of ['math','trainer','super-speed'])assert(fs.readFileSync('public/'+p+'.html','utf8').includes('/problem-mascot.js'));
assert(fs.readFileSync('public/feedback.js','utf8').includes('punstem-problem-context'));
console.log('Mascot checks passed: question context, click-only Gemini, timer pause/resume, logout isolation, alpha asset and all three practice screens. No real Gemini calls.');
