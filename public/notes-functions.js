// Scope verified against Chapter 2 All Notes (1).pdf, including its review.
(()=>{
const pick=a=>a[Math.floor(Math.random()*a.length)],int=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),term=n=>n<0?' - '+(-n):n>0?' + '+n:'';
const num=(label,value)=>({label,placeholder:'Number or fraction',answer:String(value),kind:'number',groups:[]});
const expr=(label,value)=>({label,placeholder:'Expression in x',answer:value,kind:'expression',groups:[]});
const exact=(label,value)=>({label,placeholder:'Your answer',answer:value,kind:'exact',groups:[[value]]});
const pages={21:'5–7',22:'2–8',26:'10–23',27:'26–32, 43',28:'33–42'};
const allowed={21:['evalFormula','evalPiecewise','symbolicInput','domain21','relationFunction'],22:['graph','pointValue','graphRead','verticalLine','equationFunction','piecewiseGraph'],26:['graph','symmetry'],27:['arithmetic','formulaComp','tableComp','graphComp','ruleComp','domain','tripleComp','decompose'],28:['oneToOne','inverseValue','inverseTable','inverseRule','inversePoint','verifyInverse','restrictDomain']};
const question=(unit,type,equation,prompt,fields,explain,extra={})=>({section:'2.'+String(unit).slice(1),type,equation,prompt,fields,explain,...extra});
function special(unit,kind,difficulty){
 const hard=difficulty==='hard',a=pick(hard?[-4,-3,2,3,4]:[-2,-1,1,2]),b=int(-5,5),c=int(1,5);
 if(unit==='27'&&['tableComp','graphComp'].includes(kind)){
  const table=kind==='tableComp',xs=table?[1,2,3,4,5,6]:[-3,-2,-1,0,1,2,3],shuffle=()=>{const v=[...xs];for(let i=v.length-1;i>0;i--){const j=int(0,i);[v[i],v[j]]=[v[j],v[i]]}return v},f=shuffle(),g=shuffle(),x=pick(xs),inside=g[xs.indexOf(x)],answer=f[xs.indexOf(inside)];
  return question(unit,table?'Composition from a table':'Composition from a graph',`(f ∘ g)(${x})`,hard?`Find f(g(${x})) and g(f(${x})).`:'Evaluate the composition.',[num('f(g('+x+'))',answer),...(hard?[num('g(f('+x+'))',g[xs.indexOf(f[xs.indexOf(x)])])]:[])],'Read the inner output, then use it as the outer input.',{visual:table?{type:'table',f,g}:{type:'sourceGraph',xs,f,g}});
 }
 if(unit==='21'&&kind==='evalFormula'){
  const x=pick(hard?[-3,-2,-.5,.5,2,3]:[-2,-1,.5,2]);
  return question(unit,'Evaluate a formula',`f(x) = ${a}x²${term(b)}`,`Find f(${x})${hard?' and solve f(x) = '+(a*c*c+b)+'.':'.'}`,[num('Function value',a*x*x+b),...(hard?[{label:'Solutions',placeholder:'Separate with commas',answer:[-c,c].join(','),kind:'set',groups:[]}]:[])], 'Substitute into every x; keep signs and powers in order.');
 }
 if(unit==='21'&&kind==='symbolicInput'){
  return question(unit,'Symbolic input',`f(x) = ${a}x²${term(b)}`,`Simplify f(x - ${c}).`,[expr('f(x - '+c+')',`${a}*(x-${c})^2+${b}`)], 'Replace the entire input before squaring. No difference quotient is required.');
 }
 if(unit==='22'&&kind==='graphRead'){
  const xs=[-3,-2,-1,0,1,2,3],values=xs.map(()=>int(-4,4)),i=int(0,2),j=int(4,6);
  return question(unit,'Read a graph','Use the graph of f.',`Find f(${xs[i]}) and f(${xs[j]})${hard?', then the maximum output.':'.'}`,[num('f('+xs[i]+')',values[i]),num('f('+xs[j]+')',values[j]),...(hard?[num('Maximum',Math.max(...values))]:[])],'Read outputs directly from the graph.',{visual:{type:'singleGraph',xs,values}});
 }
 if(unit==='27'&&kind==='decompose'){
  return question(unit,'Decompose a function',`H(x) = ${a}/(x²${term(c)})`,'Write H = f ∘ g. Use g(x) = x² + '+c+'.',[expr('f(x)',`${a}/x`),expr('g(x)',`x^2+${c}`)],'Use a quadratic as the inner function and a reciprocal as the outer function.');
 }
 if(unit==='28'&&kind==='oneToOne'){
  const yes=Math.random()<.5;
  return question(unit,'One-to-one?',`f(x) = (x${term(b)})${yes?'³':'²'}${term(c)}`,'Is this one-to-one on all real numbers?',[exact('Answer',yes?'yes':'no')],yes?'A translated cubic is strictly increasing.':'A quadratic repeats its output on either side of its vertex.');
 }
 return null;
}
function make(unit,kind,difficulty){
 if(!allowed[unit]?.includes(kind))throw Error('Question type is not in the notes packet');
 let result=special(unit,kind,difficulty)||window.PunstemHard.make(unit,kind);
 // Standard: substantial note-level work without all the hard follow-up fields.
 if(difficulty==='standard'&&result.fields.length>1&& !['evalPiecewise','relationFunction','pointValue','inversePoint','decompose','graphRead'].includes(kind)){result.fields=result.fields.slice(0,1);result.prompt='Find '+result.fields[0].label+'.';}
 result.section=result.section.replace(' · HARD','');
 result.source='Adapted from Chapter 2 class notes, pp. '+pages[unit]+' (numbers varied)';
 return result;
}
window.PunstemNotes={allowed,make,pages};
})();
