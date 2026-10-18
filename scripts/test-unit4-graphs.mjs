import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const c=vm.createContext({window:{},localStorage:{getItem:()=>null,setItem(){},removeItem(){}}});
for(const name of ['source-questions','more-source-questions','source-expansion','piecewise-graphs','chem-unit3','chem-unit4','super-speed-bank'])vm.runInContext(fs.readFileSync('public/'+name+'.js','utf8'),c);
const {chem,math}=c.window.PunstemSources,G=c.window.PunstemGraph,u4=chem.filter(q=>q.id.startsWith('c-u4-'));
assert.equal(u4.length,54);for(const q of u4){assert(['4.1','4.3','4.4'].includes(q.section));assert.equal(q.sourceRef.pdfPage,({'4.1':70,'4.3':72,'4.4':73})[q.section]);assert(q.answer.display);if(q.options){assert(q.options.includes(q.answer.display));assert.equal(new Set(q.options).size,q.options.length);assert(q.options.length>=2)}}
for(const item of ['#1a','#1b','#2','#3'])assert(u4.some(q=>q.section==='4.1'&&q.sourceRef.item===item));
for(const letter of 'abcdef')assert.equal(u4.filter(q=>q.sourceRef.item.startsWith('#6'+letter)).length,3);
for(const item of ['#7a valence','#7a core','#7b outer shell','#7b inner electrons','#8a','#8b'])assert(u4.some(q=>q.sourceRef.item===item));
const wave=u4.find(q=>q.sourceRef.item==='#3');assert(Math.abs(wave.answer.value-.00472125984)<1e-10);assert.equal(c.window.PunstemSpeedBank.chem().filter(q=>q.id.startsWith('speed-c-u4-')).length,u4.length);
const q=math.find(q=>q.id==='gr49');assert(q);const example=[{x:-2,y:2,closed:true},{x:-4,y:4,closed:true},{x:0,y:4,closed:true}];assert(G.correct(q,example));assert(G.correct(q,[...example,{x:2,y:6}]));assert(G.correct(q,example.map(p=>({...p,x:p.x+.25,y:p.y-.25}))));assert(!G.correct(q,example.map(p=>({...p,y:p.y+1}))));assert(!G.correct(q,[{x:-2,y:2},{x:-2,y:2},{x:-2,y:2}]));assert(!G.correct(q,[{x:-4,y:4},{x:-3,y:3},{x:-5,y:5}]));
for(const q of math.filter(q=>q.type==='Graph Lab'&&!q.piecewise&&q.points))assert(G.correct(q,q.points),q.id+' canonical graph');
console.log('Unit 4 and graph checks passed: 54 sourced drills, 4.1/4.3/4.4 only; sample graph, extra points, ±0.25 slips accepted; wrong curves and duplicate points rejected.');
