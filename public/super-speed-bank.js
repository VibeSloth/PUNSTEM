/* Recognition adaptations of the existing source exercises. No calculation
   answers are requested. Dependencies accept any valid order of independent steps. */
(()=>{
 const step=(id,label,requires=[])=>({id,label,requires});
 function plan(q){
  if(q.speedSteps)return q.speedSteps;
  if(q.options)return [step('answer',q.answer.display)];
  const units=step('units','J → kJ'),moles=step('moles','n = m / M'),ratio=step('ratio','Moles ÷ coefficient',['moles']);
  switch(q.kind){
   case 'specific':
    if(q.id==='c-hw4')return [step('balance','Heat lost = heat gained'),step('weighted','Tf = (m₁T₁ + m₂T₂) / (m₁ + m₂)',['balance'])];
    if(/metal.*specific heat|cmetal|Find c\./i.test(q.q))return /heats.*water/i.test(q.q)?[step('water','qwater = mcΔT'),step('metal','qmetal = −qwater',['water']),step('solve','cmetal = qmetal / (mΔT)',['metal'])]:[step('delta','ΔT = Tf − Ti'),step('c','c = q / (mΔT)',['delta'])];
    return [step('delta','ΔT = Tf − Ti'),step('heat','q = mcΔT',['delta'])];
   case 'phase':return q.answer.unit==='mol'?[units,step('latent','n = q / ΔHᵥₐₚ',['units'])]:[moles,step('latent','q = nΔHfus',['moles'])];
   case 'combined':
    if(q.id==='c-s2-8')return [step('condense','−nΔHᵥₐₚ (condense)'),step('cool','mcΔT (cool)',['condense']),step('freeze','−nΔHfus (freeze)',['cool']),step('sum','Add all heats (in kJ)',['freeze'])];
    return [step('heat','mcΔT (heat)'),step('vaporize','nΔHᵥₐₚ (vaporize)',['heat']),step('sum','Add both heats (in kJ)',['vaporize'])];
   case 'hess':return [step('orient','Reverse → flip ΔH sign'),step('scale','Scale equation + ΔH'),step('cancel','Add equations; cancel species',['orient','scale']),step('sum','Add ΔH values',['cancel'])];
   case 'stoich':
    if(q.id==='c-s4-3')return [step('reverse','Flip ΔH sign')];
    if(/mol of/i.test(q.q))return [step('ratio','Moles ÷ coefficient'),step('heat','Multiply by ΔH',['ratio'])];
    return [moles,ratio,step('heat','Multiply by ΔH',['ratio'])];
   case 'bde':return [step('count','Count bonds × coefficients'),step('broken','Add broken-bond energies',['count']),step('formed','Add formed-bond energies',['count']),step('subtract','ΔH = broken − formed',['broken','formed'])];
   case 'cal':return [step('water','qsurroundings = mcΔT'),step('sign','qreaction = −qsurroundings',['water']),step('moles','n = reacted mass / M'),step('molar','q (in kJ) ÷ n',['sign','moles'])];
   case 'formation':
    if(q.id==='c-p2a')return [moles,step('molar','Signed q ÷ n',['moles'])];
    if(q.id==='c-p2b')return [step('molar','ΔHcombustion = signed q / n'),step('weighted','ΔHf° × coefficients'),step('unknown','Products − reactants; solve ΔHf°',['molar','weighted'])];
    return [step('weighted','ΔHf° × coefficients'),step('subtract','Σproducts − Σreactants',['weighted'])];
   case 'entropy':
    if(q.answer.type==='text')return [step('phases','Check phases + gas moles'),step('sign','More disorder: ΔS +; less: ΔS −',['phases'])];
    return [step('weighted','S° × coefficients'),step('subtract','Σproducts − Σreactants',['weighted']),...(q.id==='c-hw12'?[step('unknown','Solve for missing S°',['subtract'])]:[])];
   case 'gibbs':
    if(q.id==='c-p8')return [step('weighted','ΔGf° × coefficients'),step('subtract','Σproducts − Σreactants',['weighted'])];
    if(q.id==='c-p9'||q.id==='c-couple')return [step('orient','Reverse / scale equations + ΔG'),step('cancel','Add equations; cancel species',['orient']),step('sum','Add ΔG values',['cancel'])];
    if(q.thermo?.mode==='equilibrium')return [units,step('zero','ΔG = 0'),step('temperature','T = ΔH / ΔS',['units','zero'])];
    return [...(q.id==='c-p10'?[step('entropy','ΔS = Σproducts − Σreactants')]:[]),step('kelvin','T in K (not °C)'),step('units','ΔS: J/K → kJ/K',q.id==='c-p10'?['entropy']:[]),step('gibbs','ΔG = ΔH − TΔS',['kelvin','units'])];
  }return [];
 }
 const distractors=['ΔT = Ti − Tf','q = mΔH (grams, not moles)','ΔG = ΔH + TΔS','Reactants − products','Reverse; keep ΔH sign','Use °C in ΔG','ΔH = formed − broken','Skip the coefficient'];
 function chem(){return window.PunstemSources.chem.map(q=>{const steps=plan(q),wrong=q.options?q.options.filter(x=>x!==q.answer.display):q.kind==='combined'?['mcΔT only','nΔH only','Subtract the heats']:distractors;return {...q,id:'speed-'+q.id,subject:'chemistry',tags:q.tags?.map(t=>'speed-'+t),kind:'speed-'+q.kind,type:q.options?'Concept recognition':'Method order',topic:'Super Speed · '+q.topic,section:'Super Speed',level:2,prompt:q.options?'Tap your answer.':'Tap the steps in order.',steps,choices:[...steps,...wrong.filter(label=>!steps.some(s=>s.label===label)).slice(0,3).map((label,i)=>step('wrong-'+i,label))],source:q.source+' · method-recognition adaptation'};}).filter(q=>q.steps.length);}
 const graphs=[
  ['linear','2.2',57,'3x − 5y = 7',x=>(3*x-7)/5,'line',true,true,'neither'],
  ['square','2.2',58,'3x² − y = 5',x=>3*x*x-5,'curve',true,false,'even'],
  ['sideways','2.2',59,'x = y²',null,'sideways',false,false,null],
  ['circle','2.2',60,'x² + (y − 1)² = 4',null,'circle',false,false,null],
  ['cube','2.2',67,'x = y³',x=>Math.cbrt(x),'curve',true,true,'odd'],
  ['fourth','2.6',83,'x⁴',x=>x**4,'curve',true,false,'even'],
  ['cubic','2.6',84,'x³',x=>x**3,'curve',true,true,'odd'],
  ['mixed','2.6',85,'x² + x',x=>x*x+x,'curve',true,false,'neither'],
  ['quartic','2.6',86,'x⁴ − 4x²',x=>x**4-4*x*x,'curve',true,false,'even'],
  ['cubic-turns','2.6',87,'x³ − x',x=>x**3-x,'curve',true,false,'odd'],
  ['mixed-cubic','2.6',88,'3x³ + 2x² + 1',x=>3*x**3+2*x*x+1,'curve',true,false,'neither'],
  ['shifted-root','2.6',89,'1 − cbrt(x)',x=>1-Math.cbrt(x),'curve',true,true,'neither'],
  ['reciprocal','2.6',90,'x + 1/x',x=>x+1/x,'curve',true,false,'odd'],
  ['absolute','2.8',16,'|x|',x=>Math.abs(x),'curve',true,false,'even'],
  ['shifted-square','2.8',17,'x² − 2x',x=>x*x-2*x,'curve',true,false,'neither'],
  ['shifted-cube','2.8',18,'x³ + 8',x=>x**3+8,'curve',true,true,'neither']
 ];
 function math(){return graphs.flatMap(([id,section,n,equation,fn,shape,isFunction,one,parity])=>{const base={subject:'math',section:'Super Speed',level:2,source:`Textbook · §${section} homework, #${n} · graph-recognition adaptation`,graph:{fn,shape},sourceEquation:equation};const out=[{...base,id:'speed-function-'+id,kind:'speed-function',type:'Function?',equation:'Does this graph represent y as a function of x?',answers:['Yes','No'],key:isFunction?'Yes':'No',explain:isFunction?'Every vertical line meets this graph at most once.':'A vertical line can hit this graph twice: one x has more than one y.'}];if(isFunction){out.push({...base,id:'speed-parity-'+id,kind:'speed-parity',type:'Even / odd',equation:'Even, odd, or neither?',answers:['Even','Odd','Neither'],key:parity[0].toUpperCase()+parity.slice(1),explain:parity==='even'?'Reflection across the y-axis leaves the graph unchanged.':parity==='odd'?'A half-turn around the origin leaves the graph unchanged.':'It has neither y-axis nor origin symmetry.'},{...base,id:'speed-symmetry-'+id,kind:'speed-symmetry',type:'Symmetry',equation:'Which symmetry does the graph have?',answers:['y-axis','Origin','Neither'],key:parity==='even'?'y-axis':parity==='odd'?'Origin':'Neither',explain:parity==='even'?'The left and right sides reflect across the y-axis.':parity==='odd'?'Every point (x, y) has a matching point (−x, −y).':'Neither reflection in the y-axis nor a half-turn about the origin matches.'},{...base,id:'speed-one-to-one-'+id,kind:'speed-one-to-one',type:'One-to-one?',equation:'Is this function one-to-one?',answers:['Yes','No'],key:one?'Yes':'No',explain:one?'Every horizontal line meets the graph at most once.':'Some horizontal lines meet the graph more than once.'});}return out;});}
 const shuffle=a=>{const v=[...a];for(let i=v.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[v[i],v[j]]=[v[j],v[i]];}return v;};
 function choose(q,id,picked){if(picked.includes(id))return {ok:false,reason:'That step was already chosen.'};const s=q.steps?.find(s=>s.id===id);if(!s)return {ok:false,reason:'That method does not belong to this problem.'};const missing=s.requires.filter(id=>!picked.includes(id));return {ok:!missing.length,reason:missing.length?'First: '+missing.map(id=>q.steps.find(s=>s.id===id).label).join('; ')+'.':'',complete:!missing.length&&picked.length+1===q.steps.length};}
 window.PunstemSpeedBank={chem,math,shuffle,choose};
})();
