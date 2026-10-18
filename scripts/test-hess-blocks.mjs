import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const c=vm.createContext({window:{}});for(const f of ['source-questions','chem-unit3','hess-blocks'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),c);
const H=c.window.PunstemHessBlocks,questions=H.bank();assert.equal(questions.length,5);assert.equal(new Set(questions.map(q=>q.id)).size,5);for(const q of questions)assert(Array.isArray(q.choices),'Speed loader requires choices array');
for(const q of questions){assert(q.source.includes('PDF p.'));assert(H.check(q,q.hess.factors).ok);for(let i=0;i<q.hess.factors.length;i++){const wrong=[...q.hess.factors];wrong[i]*=-1;const result=H.check(q,wrong);assert(!result.ok);assert.deepEqual(Array.from(result.missed),[i]);}const heat=q.hess.equations.reduce((sum,e,i)=>sum+Number(e.split(':')[1].trim().split(' ')[0])*q.hess.factors[i],0);assert(Math.abs(heat-q.answer.value)<1e-8,q.id+' incorrect signed heat');}
// Independently sum species counts for each source target.
const vectors={
 'speed-hess-blocks-c-s3-1':[{C:-1,O2:-.5,CO:1},{CO:-1,O2:-.5,CO2:1}],
 'speed-hess-blocks-c-s3-2':[{C:-2,H2:-3,C2H6:1},{C:-1,O2:-1,CO2:1},{H2O:-1,H2:1,O2:.5}],
 'speed-hess-blocks-c-s3-3':[{A:-1,B:2},{B:-1,C:1,D:1},{E:-1,D:2}],
 'speed-hess-blocks-c-hw7':[{NH3:-1,N2:.5,H2:1.5},{H2:-2,O2:-1,H2O:2}],
 'speed-hess-blocks-c-hw8':[{O3:-2,O2:3},{O2:-1,O:2},{NO:-1,O3:-1,NO2:1,O2:1}]
},targets={
 'speed-hess-blocks-c-s3-1':{C:-1,O2:-1,CO2:1},'speed-hess-blocks-c-s3-2':{C2H6:-1,O2:-3.5,CO2:2,H2O:3},'speed-hess-blocks-c-s3-3':{A:-1,C:2,E:1},'speed-hess-blocks-c-hw7':{N2:-2,H2O:-6,O2:3,NH3:4},'speed-hess-blocks-c-hw8':{NO:-1,O:-1,NO2:1}};
for(const q of questions){const sum={};vectors[q.id].forEach((row,i)=>Object.entries(row).forEach(([s,n])=>sum[s]=(sum[s]||0)+n*q.hess.factors[i]));for(const s of new Set([...Object.keys(sum),...Object.keys(targets[q.id])]))assert.equal(sum[s]||0,targets[q.id][s]||0,q.id+' '+s);}
assert.equal(H.transformed('2O₃ → 3O₂: -427 kJ',-.5),'3/2 O₂ → O₃ · ΔH = 213.5 kJ');
assert.equal(H.transformed('NH₃ → ½N₂ + 3/2 H₂: +46 kJ',-4),'2 N₂ + 6 H₂ → 4 NH₃ · ΔH = -184 kJ');
assert.equal(H.transformed('C + ½O₂ → CO: -110.5 kJ',2),'2 C + O₂ → 2 CO · ΔH = -221 kJ');
new vm.Script(fs.readFileSync('public/super-speed.js','utf8'));
// Minimal DOM exercises real drag, tap, reset, validation, and lock behavior.
class El{constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.dataset={};this.events={};this.classList={set:new Set(),add:(...x)=>x.forEach(v=>this.classList.set.add(v)),remove:(...x)=>x.forEach(v=>this.classList.set.delete(v)),toggle:(v,on)=>on?this.classList.set.add(v):this.classList.set.delete(v)};}setAttribute(k,v){this.attrs[k]=v;}append(...v){this.children.push(...v);}replaceChildren(...v){this.children=v;}addEventListener(k,fn){this.events[k]=fn;}querySelectorAll(selector){return this.children.flatMap(e=>[...(selector==='button'&&e.tag==='button'?[e]:[]),...e.querySelectorAll(selector)]);}querySelector(selector){return this.children.find(e=>'.'+e.className===selector)||this.children.map(e=>e.querySelector(selector)).find(Boolean);}}
c.document={createElement:tag=>new El(tag)};
const q=questions.find(q=>q.id.endsWith('c-s3-2')),host=new El('div');let submitted,active=true;H.render(q,host,(r,labels)=>{submitted={r,labels};active=false},()=>active);
const wrap=host.children[0],palette=wrap.children[0],rows=wrap.children.filter(e=>e.className==='hess-row'),token=v=>palette.children.find(b=>b.dataset.hessToken===v);
token('F').onclick();rows[0].onclick();token('2').onclick();rows[1].onclick();
rows[2].ondrop({preventDefault(){},dataTransfer:{getData:()=> '3'}});rows[2].ondrop({preventDefault(){},dataTransfer:{getData:()=> 'F'}});
wrap.children.find(e=>e.className==='primary hess-check').onclick();assert(submitted.r.ok);assert(submitted.labels[2].includes('F · ×3'));assert(wrap.querySelectorAll('button').every(b=>b.disabled));
console.log('Hess blocks passed: all 5 source targets, species cancellation, ΔH scaling/flips, incorrect-row detection, tap/drop setup and post-submit locking.');
