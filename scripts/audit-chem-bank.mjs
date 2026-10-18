import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const c=vm.createContext({window:{}});vm.runInContext(fs.readFileSync('public/source-questions.js','utf8'),c);
// Independently recomputed from the data printed in each prompt, including
// balanced coefficients, signed heat and J-to-kJ conversion.
const keys={
 'c-s2-1':150*35*4.18,'c-s2-2':150*35*.129,'c-s2-3':75*4.18*(32-20)/(75*(90-32)),
 'c-s2-4':100*4.18*(22.38-22),'c-hw3':133/5/(55.1-25.2),'c-hw4':(30*280+50*330)/(30+50),'c-hw5':150*4.18*(18.3-15)/(150*(75-18.3)),
 'c-s2-5':13600/(40700),'c-s2-6':350*6010/18.015/1000,'c-s2-7':230*(4.18*75+40700/18.015)/1000,'c-s2-8':-500*(40700/18.015+4.18*100+6010/18.015)/1000,
 'c-s3-1':-110.5-283.5,'c-s3-2':-(-84.7)+2*(-393.5)-3*241.8,'c-s3-3':-80+2*25-45,'c-hw7':-4*46+3*484,'c-hw8':-199+.5*427-.5*495,
 'c-s4-1':-1370*(24.8/46.07),'c-s4-2':-1370*(81/18.015)/3,'c-s4-3':1370,'c-hw2a':-1652*4/4,'c-hw2b':-1652*(1/55.85)/4,
 'c-s4-b1':6*391-(941+3*432),'c-s4-b2':4*413+2*239-(4*339+2*432),'c-s5':-(200*4.18*11)/1000/((2.45-1.25)/180),'c-hw6':-100*4.18*(23.4-22.6)/1000/(.05*.1),
 'c-p1':(-393.5+2*(-241.8))-(-74.86),'c-p2a':-64.98*94.11/2,'c-p2b':6*(-393.5)+3*(-241.8)+64.98*94.11/2,'c-p16a':2*(-410)-(2*(-500)+150),
 'c-p6a':2*193-(192+3*131),'c-p6b':2*187-(131+223),'c-hw9':4*211+6*189-(4*193+5*205),'c-hw12':(-358-131+201+4*203)/2,'c-p16b':2*375-(2*200+60),
 'c-p8':2*(-394)+4*(-229)-2*163,'c-p9':6*(-394)+3*(-237)-.5*(-6399),'c-p10':52.3-325*(219.5-2*5.7-2*130.6)/1000,'c-p13':-25/(-50/1000),'c-couple':5+2*(-20),
 'c-p15a':-264-298*(-278/1000),'c-p15b':-264/(-278/1000),'c-p15c':.256/2*(-264),'c-p16c':30-(25+273.15)*290/1000,'c-p16e':30/(290/1000),
 ent5a:'negative',ent5b:'positive',ent5c:'negative',ent10a:'positive',ent10b:'negative'
};
for(const q of c.window.PunstemSources.chem){assert(q.id in keys,q.id+' lacks independent check');if(q.answer.type==='number')assert(Math.abs(keys[q.id]-q.answer.value)<1e-9*Math.max(1,Math.abs(keys[q.id])),q.id);else assert.equal(q.answer.display,keys[q.id]);}
assert.equal(Object.keys(keys).length,c.window.PunstemSources.chem.length);
console.log('All 49 source chemistry keys independently recomputed from their supplied data.');
