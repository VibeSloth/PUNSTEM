import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const c=vm.createContext({window:{},localStorage:{getItem:()=>null,setItem(){},removeItem(){}}});
for(const f of ['hard-functions','source-questions','chem-unit3','chem-unit4','more-source-questions','source-expansion','piecewise-graphs','chem-answers','study-core'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),c);
const S=c.window.PunstemStudy,{math,chem}=c.window.PunstemSources;
for(const q of math)assert(S.grade(q,q.fields.map(f=>f.answer),q.points||[]),q.id+' canonical answer');
for(const q of chem)assert(S.grade(q,[q.answer.type==='number'?String(q.answer.value):q.answer.display]),q.id+' canonical chem answer');
for(const subject of ['math','chemistry']){const pool=S.pool(subject),round=S.select(pool,30);assert.equal(new Set(round.map(S.fingerprint)).size,round.length);for(const level of ['easy','standard','hard'])assert(S.pool(subject,[],level).every(q=>S.level(q)===({easy:1,standard:2,hard:3})[level]));}
const q=math[0],other=math.find(x=>x.id!==q.id),day=86400000,now=Date.now(),event={questionId:q.id,at:now,correct:false,independent:false};
assert.equal(S.review([q],[event],now)[0].due,now+day);
assert.equal(S.review([q],[{...event,correct:true,independent:true}],now)[0].due,now+3*day);
assert.equal(S.review([q],[event,{...event,at:now+1,correct:true,independent:false}],now)[0].streak,0);
assert.equal(S.review([q],[{...event,correct:true,independent:true},{...event,at:now+3*day,correct:true,independent:true}],now)[0].due,now+10*day);
assert.equal(S.coverage([q],[event])[0].solved,0);assert.equal(S.coverage([q],[{...event,correct:true,independent:true}])[0].solved,1);
assert.equal(S.select([q,other],1,[event],()=>.5)[0].id,other.id);
assert(S.grade(chem.find(x=>x.answer.type==='number'),[String(chem.find(x=>x.answer.type==='number').answer.value)]));
assert(!S.grade(math.find(x=>x.fields.length&&x.type!=='Graph Lab'),['nonsense']));
for(const f of ['study.js','study-visuals.js'])new vm.Script(fs.readFileSync('public/'+f,'utf8'));
const js=fs.readFileSync('public/study.js','utf8');assert(js.includes("round.mode==='test'")&&js.includes('submitTest'));assert(js.includes('Date.now()')&&js.includes('visibilitychange'));assert(!js.includes('/api/gemini'));
console.log('Study checks passed: all 954 canonical answers, deduplication, exact levels, unused-first selection, independent-solve coverage, spaced scheduling, and no automatic AI calls.');
