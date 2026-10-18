import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const c=vm.createContext({window:{},console,localStorage:{getItem:()=>null,setItem(){},removeItem(){}}});
for(const f of ['hard-functions','source-questions','more-source-questions','source-expansion','piecewise-graphs'])vm.runInContext(fs.readFileSync('public/'+f+'.js','utf8'),c);
const bank=c.window.PunstemSources.math,E=c.window.PunstemHard.evaluate;
const normalize=s=>s.replace(/[−–]/g,'-').replace(/[²³⁴⁵⁶]/g,x=>'^'+({'²':2,'³':3,'⁴':4,'⁵':5,'⁶':6})[x]).replace(/\|([^|]+)\|/g,'abs($1)').replace(/∛\(/g,'cbrt(').replace(/√\(/g,'sqrt(');
const rule=s=>normalize(s.split('=')[1]?.split(',')[0]?.trim()||'');
const close=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<1e-7*Math.max(1,Math.abs(a),Math.abs(b));
const inverseDomains={ir67:'[0,inf)',ir68:'[2,inf)',ir70:'[0,2]',res85:'(-inf,4]',res86:'[0,inf)',res87:'[0,inf)',res88:'[0,inf)'};
function inside(domain,x){return domain.toLowerCase().split(/\s*u\s*/).some(s=>{const [a,b]=s.slice(1,-1).split(',');const value=t=>t==='-inf'?-Infinity:t==='inf'?Infinity:E(t,0);const left=value(a),right=value(b);return(x>left||(s[0]==='['&&x===left))&&(x<right||(s.at(-1)===']'&&x===right));});}
let checked=0,samples=0;const failures=[];
function compare(q,expected,actual,x){samples++;if(!close(expected,actual))failures.push(`${q.id}: x=${x}, key ${actual}, independent ${expected}`);}
const grid=[-10,-7,-5,-3,-2,-1,-.5,0,.1,.5,1,1.5,2,3,4,5,6,7,8,10,20,50,100];
for(const q of bank){try{
 const lines=q.equation.split('\n'),f=rule(lines[0]),g=rule(lines[1]||''),h=rule(lines[2]||'');let n=0;
 if(q.kind==='evalFormula'&&q.prompt.startsWith('Find ')){const match=q.prompt.match(/\(([^()]+)\)/);if(match){const x=E(normalize(match[1]),0),expected=E(f,x),key=q.fields[0].answer;checked++;if(key==='undefined'){assert(!Number.isFinite(expected),q.id);}else compare(q,expected,Number(key),x);}}
 if(q.kind==='ruleComp'||q.kind==='tripleComp'){let outer,inner;if(q.kind==='tripleComp'){outer=f;inner=x=>E(g,E(h,x));}else{const op=q.prompt.match(/([fg])\s*[∘(]\s*([fg])/);if(!op)continue;const rules={f,g};outer=rules[op[1]];inner=x=>E(rules[op[2]],x);}for(const x of grid){const expected=E(outer,inner(x));if(!Number.isFinite(expected))continue;compare(q,expected,E(q.fields[0].answer,x),x);n++;}if(n)checked++;}
 if(q.kind==='inverseRule'||q.kind==='restrictDomain'){const domain=q.fields.find(f=>f.label==='Domain')?.answer||inverseDomains[q.id];for(const y of grid){if(domain&&!inside(domain,y))continue;const x=E(q.fields[0].answer,y);if(!Number.isFinite(x))continue;const expected=E(f,x);if(!Number.isFinite(expected))continue;compare(q,y,expected,y);n++;}if(n)checked++;}
 if(q.kind==='arithmetic'&&q.fields[0].kind==='expression'){const op=q.prompt.match(/\(f\s*([+−\-×/])\s*g\)/)||q.prompt.match(/Find\s*f([/])g/);if(op){for(const x of grid){const a=E(f,x),b=E(g,x),expected=op[1]==='+'?a+b:['−','-'].includes(op[1])?a-b:op[1]==='×'?a*b:a/b;if(!Number.isFinite(expected))continue;compare(q,expected,E(q.fields[0].answer,x),x);n++;}if(n)checked++;}}
 if(q.points){for(const p of q.points){if(p.endpoint)continue;compare(q,q.fn(p.x),p.y,p.x);}checked++;}
 if((q.kind==='domain21'||q.kind==='domain')&&q.fields[0]?.label==='Domain'){const op=q.prompt.match(/\(([fg]) ∘ ([fg])\)/),rules={f,g};for(const x of [...grid,-6,12,1/3,1/2,7/3]){const middle=op?E(rules[op[2]],x):x,expected=Number.isFinite(middle)&&Number.isFinite(E(op?rules[op[1]]:f,middle));samples++;const actual=inside(q.fields[0].answer,x);if(actual!==expected)failures.push(`${q.id}: domain at ${x}, key ${actual}, independent ${expected}`);}checked++;}
 }catch(e){if(e.code==='ERR_ASSERTION')failures.push(e.message);}}
assert.equal(failures.length,0,failures.join('\n'));
const unique=new Set(bank.map(q=>JSON.stringify([q.equation.replace(/\s/g,''),q.prompt.replace(/\s/g,''),q.visual]))).size;
console.log(`Independent calculations passed for ${checked} math prompts (${samples} sample checks). Bank: ${bank.length} entries, ${unique} distinct prompt/visual combinations before rotation canonicalization.`);
