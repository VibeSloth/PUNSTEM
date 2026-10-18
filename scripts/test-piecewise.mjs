import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const memory=new Map(),c=vm.createContext({window:{},localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)}});
for(const f of ['source-questions','more-source-questions','piecewise-graphs','graph-canvas'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),c);
const {math,mathRound}=c.window.PunstemSources,G=c.window.PunstemGraph;
const functions=new Map(math.filter(q=>q.piecewise).map(q=>[JSON.stringify(q.pieces.map(p=>[p.rule,p.from,p.to,p.left,p.right])),q]));
assert(functions.size>=29);
for(let n=33;n<=50;n++)assert(math.some(q=>q.piecewise&&q.source.includes('§2.2 homework, #'+n)));
for(const q of functions.values()){
 assert(G.correct(q,q.points),q.id+' canonical solution');
 assert(!G.correct(q,q.points.filter(p=>!p.endpoint)),q.id+' missing endpoints');
 const open=q.points.find(p=>p.closed===false);if(open){const wrong=q.points.map(p=>({...p}));wrong.find(p=>p.x===open.x&&p.y===open.y).closed=true;assert(!G.correct(q,wrong),q.id+' open/closed must matter');}
 const p=q.pieces[0],x=Number.isFinite(p.from)?(p.from+(Number.isFinite(p.to)?p.to:p.from+2))/2:p.to-2,extra={x,y:p.fn(x),closed:true};assert(G.correct(q,[...q.points,extra]),q.id+' extra correct point');
 const canvas={width:700,height:560},m=c.window.PunstemGraphCanvas.scale(canvas,q);for(const p of q.points)assert(p.x>=m.xmin&&p.x<=m.xmax&&p.y>=m.ymin&&p.y<=m.ymax,q.id+' visible points');
}
const options={units:['22'],pools:{22:['piecewiseGraph']},families:[],difficulty:'standard',count:100,allPiecewise:true},round=mathRound(options);
for(let n=33;n<=48;n++)assert(round.some(q=>q.source.includes('§2.2 homework, #'+n)), 'Standard complete set missing #'+n);
assert.equal(mathRound(options).length,0,'No silent repeats');
console.log(`Piecewise checks passed: ${functions.size} distinct source functions, all #33–50, open/closed endpoints, extra marks, dynamic axes, and complete-set rotation.`);
