import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const storage=new Map(),ctx=vm.createContext({window:{},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}});
for(const f of ['source-questions','chem-unit3','super-speed-bank'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),ctx);
const {chem,chemRound}=ctx.window.PunstemSources,audit=ctx.window.PunstemChemAudit;
assert.equal(audit.pages.length,22);assert.equal(chem.length,162);assert.equal(new Set(chem.map(q=>q.id)).size,chem.length);
const expected={
 50:['Station 2 #1','Station 2 #2','Station 2 #2 comparison','Station 2 #3','Station 2 #4'],
 51:[5,6,7,8].map(n=>'Station 2 #'+n),52:['Station 3 #1','Station 3 #2'],
 53:['Station 3 #3','Al₂O₃ worked example: equation','Al₂O₃ worked example: ΔHf','Formation example: KCl','Formation example: Na₂S₂O₃'],
 54:['Station 4 #1','Station 4 #2','Station 4 #3','Bond-strength discussion'],
 55:['Lewis structures: all species','Unnumbered BDE calculation 1','Unnumbered BDE calculation 2'],
 56:['Calorimeter drawing: combustion','Calorimeter drawing: aqueous','Measurement in both experiments','Calorimetry calculation outline'],
 57:['Glucose lab: main task / #4',...[1,2,3,5,6].map(n=>'Glucose lab #'+n)],
 58:[...[1,2,3,4,5].map(n=>'NaHCO₃ lab #'+n),...['Mass NaHCO₃','Mass water','Initial temperature','Final temperature','Qualitative observations'].map(s=>'NaHCO₃ results: '+s)],
 59:['#1','#2a','#2b'],60:['#4',...['5a','5b','5c','5d','6a','6b'].map(x=>'#'+x)],
 61:['Spontaneous exothermic entropy-decrease example',...['ΔH −, ΔS +','ΔH +, ΔS −','ΔH −, ΔS −','ΔH +, ΔS +'].map(s=>'Spontaneity table: '+s)],
 62:['#7: ΔG','#7: ΔS','#7: ΔH','#8','#9'],63:['#10','#10: formation-equation hint','#11','#12: ΔH','#12: ΔS','#12: Driving force'],
 64:['#13: equilibrium temperature','#13: above/below','#14a','#14b','#14c','#14d','Coupling worked example'],
 65:['a','b','c','d'].map(s=>'#15'+s),66:['a','b','c','d','e','f'].map(s=>'#16'+s),
 67:['1a','1b','2a','2b','3','4','5'].map(s=>'HW #'+s),68:[6,7,8].map(s=>'HW #'+s),69:['9','10a','10b','11a','11b','11c','12'].map(s=>'HW #'+s)
};
for(const p of audit.pages){assert(p.pdf>=48&&p.pdf<=69);assert(p.items.length);for(const label of expected[p.pdf]||[])assert(p.items.some(i=>i.label===label),'Missing PDF '+p.pdf+' '+label);for(const i of p.items)assert(chem.some(q=>q.id===i.questionId),'Dangling '+i.questionId);}
assert.equal(audit.pages.find(p=>p.pdf===60).items.filter(i=>i.label.startsWith('#3:')).length,5);
for(const q of chem){assert(q.sourceRef&&q.source.includes('PDF p.'),q.id);assert(q.originalPrompt&&q.method,q.id);if(q.options){assert(q.options.includes(q.answer.display));assert.equal(new Set(q.options).size,q.options.length);}}
const keys={'Glucose lab #1':200*4.18*(34-23),'Glucose lab #2':-200*4.18*(34-23),'Glucose lab #3':(2.45-1.25)/180,'NaHCO₃ lab #3':10/84.01,'#14c':273.15,'Al₂O₃ worked example: ΔHf':-1676};
for(const [label,value]of Object.entries(keys)){const q=chem.find(q=>q.sourceRef.item===label);assert(q&&Math.abs(q.answer.value-value)<1e-10,label);}
const numeric=chem.filter(q=>q.answer.type==='number');assert.equal(numeric.length,50);assert.equal(chem.filter(q=>q.sourceMode==='concept').length,44);
// All original 44 numeric keys are checked separately by audit-chem-bank.mjs.
// Every new numerical key is independently checked above, including lab intermediates.
const speed=ctx.window.PunstemSpeedBank.chem();assert.equal(speed.length,chem.length);
assert.equal(speed.find(q=>q.id==='speed-c-s3-1').steps.length,2);assert(!speed.find(q=>q.id==='speed-c-s3-1').steps.some(s=>s.label.includes('Reverse')));
for(const kind of new Set(chem.map(q=>q.kind))){const seen=new Set();for(let i=0;i<50;i++){const round=chemRound([kind],10);if(!round.length)break;for(const q of round){assert(!seen.has(q.id),'Repeated '+q.id);seen.add(q.id);}}assert.equal(chemRound([kind],10).length,0);}
assert(!fs.readFileSync('public/trainer.html','utf8').includes('source pool exhausted'),'No silent generated fallback');
assert(fs.readFileSync('public/trainer.html','utf8').includes('renderChemChoices(q)'));
console.log(`Section 3 audit passed: ${chem.length} records, 22 pages, every numbered subpart/example/drawing/lab prompt mapped; independent added numeric keys, provenance and exhaustion checked.`);
