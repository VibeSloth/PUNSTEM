import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const memory=new Map();
const context=vm.createContext({window:{},localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},console});
for(const file of ['public/hard-functions.js','public/source-questions.js','public/chem-unit3.js','public/more-source-questions.js','public/source-expansion.js','public/piecewise-graphs.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const {math,chem,mathRound,chemRound}=context.window.PunstemSources;
assert(math.length>100);assert(chem.length>30);
assert.equal(new Set(math.map(q=>q.id)).size,math.length);
for(const q of math){
 assert(/^(Textbook|Class notes)/.test(q.source),q.id);
 for(const f of q.fields)if(f.kind!=='number')assert.notEqual(context.window.PunstemHard.matches(f.answer,f),false,q.id+' '+f.answer);
 for(const p of q.points||[]){if(!p.endpoint)assert(Math.abs(q.fn(p.x)-p.y)<1e-9,q.id);const b=q.graphBounds||{xmin:-8,xmax:8,ymin:-8,ymax:8};assert(p.x>=b.xmin&&p.x<=b.xmax&&p.y>=b.ymin&&p.y<=b.ymax,q.id+' off canvas');}
}
for(const q of chem)assert(q.source&&q.q,q.id);
const pools={};for(const q of math)(pools[q.unit]??=[]).push(q.kind);
const options={units:Object.keys(pools),pools,families:['quad','cubic','abs','sqrt','cbrt'],difficulty:'standard',count:10};
const fingerprint=q=>JSON.stringify([q.equation,q.prompt,q.visual]);
const first=mathRound(options),second=mathRound(options);
assert.equal(first.length,10);assert.equal(new Set(first.map(fingerprint)).size,10);
assert(!second.some(q=>first.map(fingerprint).includes(fingerprint(q))));
const piecewise=math.filter(q=>q.unit==='22'&&q.kind==='piecewiseGraph');
for(let exercise=33;exercise<=48;exercise++)assert(piecewise.some(q=>q.source.includes('homework, #'+exercise)), 'Missing §2.2 #'+exercise);
const one={units:['21'],pools:{21:['relationFunction']},families:[],difficulty:'easy',count:10};
assert(mathRound(one).length>0);assert.equal(mathRound(one).length,0,'Exhausted pool must not silently repeat');
context.window.PunstemSources.reset('math');assert(mathRound(one).length>0);
assert.equal(context.window.PunstemHard.evaluate('x^(1/5)',-32),-2);
assert(Number.isNaN(context.window.PunstemHard.evaluate('x^(1/2)',-4)));
assert(!fs.readFileSync('public/math.html','utf8').includes("q,$('#fields input').map"),'Second-miss feedback must use the input list');
for(const kind of new Set(chem.map(q=>q.kind))){const round=chemRound([kind],10);assert.equal(new Set(round.map(q=>JSON.stringify([q.q,q.data]))).size,round.length);}
for(const file of ['public/math.html','public/trainer.html'])for(const match of fs.readFileSync(file,'utf8').matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1],{filename:file});
console.log(`Validated ${math.length} source-derived math questions and ${chem.length} chemistry exercises; keys, graph points, unique rotation, and page syntax passed.`);
