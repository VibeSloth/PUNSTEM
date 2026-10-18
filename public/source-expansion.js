/* Additional original homework subparts and class examples. Formula/data stay
   unchanged; graph/domain adaptations are identified in their citations. */
(()=>{
 const bank=window.PunstemSources.math;
 const number=(label,v)=>({label,answer:String(v),kind:'number',placeholder:'Number or fraction',groups:[]});
 const expression=(label,v)=>({label,answer:v,kind:'expression',placeholder:'Expression in x',groups:[]});
 const exact=(label,v)=>({label,answer:v,kind:'exact',placeholder:'Your answer',groups:[[v]]});
 const book=(s,n)=>`Textbook · §2.${s} homework, #${n}`;
 function add(unit,kind,id,source,equation,prompt,fields,level=2,extra={}){const q={id:'audit-'+id,unit,section:'2.'+unit.slice(1),kind,type:kind==='graph'?'Graph Lab':prompt,level,source,equation,prompt,fields,explain:'Answer: '+fields.map(f=>f.label+' = '+f.answer).join('; '),...extra};bank.push(q);return q;}
 // Correct source transcription, not merely the computed key.
 for(const q of bank){
  if(q.id==='expanded-domain-67'){q.equation='f(x) = (x² − 6x)^(1/4)';q.fields[0].answer='(-inf,0] U [6,inf)';q.fields[0].groups=[[q.fields[0].answer]];q.explain='x(x − 6) ≥ 0, so x ≤ 0 or x ≥ 6.';}
  if(q.id==='dom61')q.equation='f(x) = cbrt(x − 1)';
  if(q.id==='dom72')q.equation='f(x) = x/(49 − x²)^(1/4)';
  if(q.id==='expanded-triple-59'){q.equation='f(x) = x − 1\ng(x) = sqrt(x)\nh(x) = x − 1';q.fields[0].answer='sqrt(x-1)-1';q.explain='h(x)=x−1; g(h(x))=√(x−1); subtract 1. Domain: [1, ∞).';}
  if(q.id==='dec64'){q.equation='H(x) = sqrt(x) + 1';q.prompt='Write H = f ∘ g using g(x) = sqrt(x).';q.fields[0].answer='x+1';q.explain='First take the square root, then add 1.';}
 }
 // #91–92 are supplied graphs, not the rational formulas previously attributed.
 for(let i=bank.length-1;i>=0;i--)if(['expanded-sym-91','expanded-sym-92'].includes(bank[i].id))bank.splice(i,1);
 // Other original expressions in §2.1 #35–38, not duplicated f(input) prompts.
 for(const [n,eq,prompt,ans]of [[35,'x² + 1','Simplify f(x) + f(2).','x^2+6'],[36,'3x − 1','Simplify 2f(x).','6*x-2'],[37,'x + 4','Simplify [f(x)]².','(x+4)^2'],[38,'6x − 18','Simplify f(x)/3.','2*x-6']])add('21','symbolicInput','second-'+n,book(1,n),'f(x) = '+eq,prompt,[expression('Result',ans)]);
 for(const [n,eq,input]of [[25,'(1-x)/(1+x)',-1],[26,'(x+2)/(x-2)',2],[30,'abs(x)/x',0]])add('21','evalFormula','undefined-'+n,book(1,n),'f(x) = '+eq,`Find f(${input}).`,[exact('Function value','undefined')]);
 add('21','symbolicInput','half28',book(1,28)+' · a renamed x','f(t) = 2t³ − 3t²','Simplify f(x/2).',[expression('Result','x^3/4-3*x^2/4')],3);
 add('21','symbolicInput','notes5c','Class notes · p. 5, Ex 2c','g(x) = x²/9 − 1','Find g(π).',[expression('Result','pi^2/9-1')]);
 add('21','symbolicInput','notes5d','Class notes · p. 5, Ex 2d · k renamed x','g(t) = t²/9 − 1','Simplify g(x − 1).',[expression('Result','(x-1)^2/9-1')]);
 // All original inputs of §2.1 application tables; evaluation type is in notes.
 for(const [n,eq,fn,xs,label]of [[79,'50(1 − t/20)²',x=>50*(1-x/20)**2,[0,5,10,15,20],'V'],[82,'sqrt((13 + 7x^0.4)/(1 + 4x^0.4))',x=>Math.sqrt((13+7*x**.4)/(1+4*x**.4)),[1,10,100],'R'],[83,'18500(0.25 − r²)',x=>18500*(.25-x*x),[0,.1,.2,.3,.4,.5],'v'],[84,'sqrt(7920h + h²)',x=>Math.sqrt(7920*x+x*x),[.1,.2,1135/5280,7],'D']])for(const x of xs)add('21','evalFormula','app-'+n+'-'+x,book(1,n)+' · numeric evaluation',`${label}(x) = ${eq.replace(/\bt\b|\br\b|\bh\b/g,'x')}`,`Find ${label}(${x===1135/5280?'1135/5280':x}).`,[number('Function value',fn(x))],3);
 for(const [n,eq,fn,xs]of [[85,'0, 0 ≤ x ≤ 10000\n0.08x, 10000 < x ≤ 20000\n1600 + 0.15x, x > 20000',x=>x<=10000?0:x<=20000?.08*x:1600+.15*x,[5000,12000,25000]],[86,'x + 15, x < 100\nx, x ≥ 100',x=>x<100?x+15:x,[75,90,100,105]],[87,'75x, 0 ≤ x ≤ 2\n150 + 50(x − 2), x > 2',x=>x<=2?75*x:150+50*(x-2),[2,3,5]],[88,'15(40 − x), 0 < x < 40\n0, 40 ≤ x ≤ 65\n15(x − 65), x > 65',x=>x<40?15*(40-x):x<=65?0:15*(x-65),[30,50,75]]])for(const x of xs)add('21','evalPiecewise','app-pw-'+n+'-'+x,book(1,n),'f(x) = {\n'+eq+'\n}',`Find f(${x}) in dollars.`,[number('Value',fn(x))],3);
 // §2.7 all original composition domains, which must preserve inner restrictions.
 const domains={47:['R','R','R','R'],48:['R','R','R','R'],49:['R','R','R','R'],50:['R','R','R','R'],51:['(-inf,-2) U (-2,inf)','(-inf,0) U (0,inf)','(-inf,0) U (0,inf)','R'],52:['[3,inf)','(-inf,-sqrt(3)] U [sqrt(3),inf)','R','[12,inf)'],53:['R','R','R','R'],54:['R','R','R','R'],55:['(-inf,0) U (0,inf)','(-inf,-1) U (-1,inf)','(-inf,-1) U (-1,-1/2) U (-1/2,inf)','R'],56:['(-inf,0) U (4,inf)','(0,inf)','(0,inf)','R'],57:['(-inf,-1) U (-1,0) U (0,inf)','(-inf,-1) U (-1,0) U (0,inf)','(-inf,-1) U (-1,-1/2) U (-1/2,inf)','(-inf,0) U (0,inf)'],58:['(-inf,-2) U (-2,0) U (0,inf)','(-inf,-1) U (-1,0) U (0,inf)','(-inf,0) U (0,inf)','(-inf,-2) U (-2,-4/3) U (-4/3,inf)']};
 for(const [n,ds]of Object.entries(domains))for(const [i,op]of ['f ∘ g','g ∘ f','f ∘ f','g ∘ g'].entries()){const template=bank.find(q=>q.kind==='ruleComp'&&q.source===book(7,n));add('27','domain','comp-domain-'+n+'-'+i,book(7,n)+' · domain subpart',template.equation,`Find the domain of (${op})(x), before any cancellation.`,[exact('Domain',ds[i]==='R'?'(-inf,inf)':ds[i])],3);}
 for(const [n,eq,ans]of [[19,'(x − 3)^(-1/4)','(3,inf)']])add('27','domain','domain27-'+n,book(7,n),'h(x) = '+eq,'Find the domain.',[exact('Domain',ans)],3);
 // Original class-note combining-function examples, including quotient domains.
 add('27','arithmetic','notes27-1','Class notes · p. 27, Ex 1','f(x) = x² + 2x − 15\ng(x) = x − 3','Find f/g and its domain.',[expression('Rule','x+5'),exact('Domain','(-inf,3) U (3,inf)')],3);
 for(const [id,prompt,ans]of [['2a','Find (f + g)(−4).','16'],['2b','Find (f − g)(x).','x+1-x^2-3'],['2c','Find (fg)(2).','21'],['2d','Find (g/f)(x).','(x^2+3)/(x+1)']])add('27','arithmetic','notes27-'+id,'Class notes · p. 27, Ex '+id,'f(x) = x + 1\ng(x) = x² + 3',prompt,[id==='2a'||id==='2c'?number('Answer',+ans):expression('Result',ans)],3);
 for(const [id,op,ans]of [['4a','g(f(x))','-1/x'],['4b','f(g(x))','2-1/(x-2)']])add('27','ruleComp','notes29-'+id,'Class notes · p. 29, Ex '+id,'f(x) = 2 − x\ng(x) = 1/(x − 2)',`Find ${op}.`,[expression('Composite rule',ans)],3);
 add('28','verifyInverse','notes40-6','Class notes · p. 40, Ex 6','f(x) = (3 − x)/4\ng(x) = 3 − 4x','Simplify both compositions.',[expression('f(g(x))','x'),expression('g(f(x))','x')],2);
 add('28','inverseValue','notes40-7a','Class notes · p. 40, Ex 7a','f(x) = (2x³ − 7)/x','Evaluate f⁻¹(f(0)).',[exact('Answer','undefined')],3,{explain:'f(0) is undefined because its denominator is zero; inverse cancellation cannot fix an undefined inner input.'});
 for(const [id,eq,ans,dom]of [[91,'1/x','1/x','(-inf,0) U (0,inf)'],[92,'(x + 3)/(x − 1)','(x+3)/(x-1)','(-inf,1) U (1,inf)']])add('28','inverseRule','self-inverse-'+id,book(8,id),'f(x) = '+eq,'Find the inverse and its domain.',[expression('Inverse rule',ans),exact('Domain',dom)],3);
 for(const [id,eq,fn,xs]of [['78b','−|x|',x=>-Math.abs(x),[-2,0,2]],['78c','−3|x|',x=>-3*Math.abs(x),[-2,0,2]],['78d','−3|x − 5|',x=>-3*Math.abs(x-5),[3,5,7]],['79a','x⁶',x=>x**6,[-1,0,1]],['79b','x⁶/3',x=>x**6/3,[-1,0,1]],['79c','−x⁶/3',x=>-(x**6)/3,[-1,0,1]],['79d','−(x − 4)⁶/3',x=>-((x-4)**6)/3,[3,4,5]],['95a','4x − x²',x=>4*x-x*x,[0,2,4]],['95b','|4x − x²|',x=>Math.abs(4*x-x*x),[-1,2,5]],['96b','|x³|',x=>Math.abs(x**3),[-2,0,2]]]){const points=xs.map(x=>({x,y:fn(x)})),q=add('26','graph','transform-'+id,book(6,id)+' · point-plotting adaptation','y = '+eq,`Plot three points at x = ${xs.join(', ')}.`,[],3,{fn,points});q.graphBounds={xmin:Math.min(-8,...xs.map(x=>x-1)),xmax:Math.max(8,...xs.map(x=>x+1)),ymin:Math.min(-8,...points.map(p=>p.y-1)),ymax:Math.max(8,...points.map(p=>p.y+1))};}
})();
