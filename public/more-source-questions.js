/* Visual audit: Stewart/Redlin/Watson 4e, printed pp.192–204,242–245,
   252–253,262–263,267–272. No randomized coefficients. Graph requests are
   adapted to plotting representative points; citations identify adaptations. */
(()=>{
 const bank=window.PunstemSources.math;
 const number=(label,v)=>({label,answer:String(v),kind:'number',placeholder:'Number or fraction',groups:[]});
 const expression=(label,v)=>({label,answer:v,kind:'expression',placeholder:'Expression in x',groups:[]});
 const exact=(label,v)=>({label,answer:v,kind:'exact',placeholder:'Your answer',groups:[[v]]});
 const book=(s,n)=>`Textbook · §2.${s} homework, #${n}`,review=n=>`Textbook · Chapter 2 review, #${n}`,test=n=>`Textbook · Chapter 2 test, #${n}`;
 function add(unit,kind,id,source,equation,prompt,fields,level=2,extra={}){bank.push({unit,kind,id:'expanded-'+id,source,section:'2.'+unit.slice(1),equation,prompt,fields,level,type:['graph','piecewiseGraph'].includes(kind)?'Graph Lab':({evalFormula:'Function values',symbolicInput:'Symbolic input',domain21:'Domains',inverseRule:'Find an inverse',ruleComp:'Composition rules',symmetry:'Even, odd, or neither'})[kind]||prompt,explain:'Answer: '+fields.map(f=>f.label+' = '+f.answer).join('; '),...extra});}
 function values(unit,id,source,eq,fn,xs,level=2){for(const x of xs)add(unit,'evalFormula',id+'-'+x,source,`f(x) = ${eq}`,`Find f(${x}).`,[number('Function value',fn(x))],level);}
 function graph(unit,id,source,eq,fn,xs,level=2,family){add(unit,unit==='22'?'piecewiseGraph':'graph',id,source+' · point-plotting adaptation',eq,`Plot three points at x = ${xs.join(', ')}.`,[],level,{fn,points:xs.map(x=>({x,y:fn(x)})),...(family?{family}:{}),explain:'Correct points: '+xs.map(x=>`(${x}, ${fn(x)})`).join(', ')});}
 // Remaining §2.1 numeric inputs and tables from the printed exercise prompts.
 for(const [id,eq,fn,xs,level]of [
 ['17','2(x − 1)²',x=>2*(x-1)**2,[-1,0,1,2,3],1],['18','|2x + 3|',x=>Math.abs(2*x+3),[-3,-2,0,1,3],1],
 ['21','(1 − 2x)/3',x=>(1-2*x)/3,[2,-2,.5],2],['22','(x² + 4)/5',x=>(x*x+4)/5,[2,-2],2],
 ['26','(x + 2)/(x − 2)',x=>(x+2)/(x-2),[-2,0],3],['27','−x² − 2x + 3',x=>-x*x-2*x+3,[0,2,-2,Math.sqrt(2)],3],
 ['30','|x|/x',x=>Math.abs(x)/x,[-2,-1,5],2]])values('21','hw21-'+id,book(1,id),eq,fn,xs,level);
 for(const [id,eq,input,ans]of [
 ['21','(1 − 2x)/3','x − 1','(1-2*(x-1))/3'],['22','(x² + 4)/5','−x','(x^2+4)/5'],['22','(x² + 4)/5','x − 2','((x-2)^2+4)/5'],['22','(x² + 4)/5','sqrt(x)','(x+4)/5'],
 ['23','x² + 2x','−x','x^2-2*x'],['23','x² + 2x','1/x','1/x^2+2/x'],['24','x + 1/x','x − 1','x-1+1/(x-1)'],['24','x + 1/x','1/x','1/x+x'],
 ['25','(1 − x)/(1 + x)','x − 1','(2-x)/x'],['25','(1 − x)/(1 + x)','x² − 1','(2-x^2)/x^2'],['26','(x + 2)/(x − 2)','x² − 2','x^2/(x^2-4)'],['26','(x + 2)/(x − 2)','x + 1','(x+3)/(x-1)'],
 ['27','−x² − 2x + 3','x + 2','-(x+2)^2-2*(x+2)+3'],['27','−x² − 2x + 3','−x','-x^2+2*x+3'],['27','−x² − 2x + 3','x²','-x^4-2*x^2+3'],
 ['28','2x³ − 3x²','−x','-2*x^3-3*x^2'],['28','2x³ − 3x²','x³','2*x^9-3*x^6'],['29','2|x − 1|','x + 1','2*abs(x)'],['29','2|x − 1|','x² + 2','2*abs(x^2+1)'],['30','|x|/x','x²','1'],['30','|x|/x','1/x','abs(1/x)/(1/x)']])add('21','symbolicInput','hw21-'+id+'-'+input,book(1,id),'f(x) = '+eq,`Simplify f(${input}) on its domain.`,[expression('Result',ans)],3);
 // Parameter prompts use x as the parameter in this short-answer adaptation.
 for(const [id,eq,inputs]of [
 ['19','x^2-6',['x','-x','x+1']],['20','x^3+2*x',['x','-x','x+1']],['21','(1-2*x)/3',['x','-x']],['22','(x^2+4)/5',['x']],['23','x^2+2*x',['x']],['25','(1-x)/(1+x)',['x']],['26','(x+2)/(x-2)',['x']]])for(const input of inputs)add('21','symbolicInput','param-'+id+'-'+input,book(1,id)+' · parameter notation adapted',`f(t) = ${eq.replace(/x/g,'t')}`,`Write f(${input}).`,[expression('Result',eq.replace(/x/g,'('+input+')'))],2);
 for(const [id,eq,ans]of [['59','sqrt(x + 1)','[-1,inf)'],['60','sqrt(x² + 9)','(-inf,inf)'],['66','sqrt(x)/(2x² + x − 1)','[0,1/2) U (1/2,inf)'],['67','(2 − 6x)^(1/4)','(-inf,1/3]']])add('21','domain21','domain-'+id,book(1,id),'f(x) = '+eq,'Find the domain.',[exact('Domain',ans)],id==='66'?3:2);
 // All §2.2 #33–48: one graph request for every formerly missing exercise.
 const pieces=[
 ['33','0, x < 2\n1, x ≥ 2',x=>x<2?0:1,[1,2,3]],['34','1, x ≤ 1\nx + 1, x > 1',x=>x<=1?1:x+1,[0,1,2]],
 ['36','1 − x, x < −2\n5, x ≥ −2',x=>x<-2?1-x:5,[-3,-2,-1]],['37','x, x ≤ 0\nx + 1, x > 0',x=>x<=0?x:x+1,[-1,0,1]],
 ['39','−1, x < −1\n1, −1 ≤ x ≤ 1\n−1, x > 1',x=>x<-1?-1:x<=1?1:-1,[-2,-1,2]],
 ['40','−1, x < −1\nx, −1 ≤ x ≤ 1\n1, x > 1',x=>x<-1?-1:x<=1?x:1,[-2,0,2]],
 ['43','0, |x| ≤ 2\n3, |x| > 2',x=>Math.abs(x)<=2?0:3,[-3,-2,3]],['44','x², |x| ≤ 1\n1, |x| > 1',x=>Math.abs(x)<=1?x*x:1,[-2,0,2]],
 ['45','4, x < −2\nx², −2 ≤ x ≤ 2\n−x + 6, x > 2',x=>x<-2?4:x<=2?x*x:-x+6,[-3,0,3]],
 ['47','x + 2, x ≤ −1\nx², x > −1',x=>x<=-1?x+2:x*x,[-2,-1,2]],['48','2x − x², x > 1\n(x − 1)³, x ≤ 1',x=>x>1?2*x-x*x:(x-1)**3,[0,1,2]]];
 for(const [id,eq,fn,xs]of pieces)graph('22','pw-'+id,book(2,id),'f(x) = {\n'+eq+'\n}',fn,xs,3);
 // New boundary-focused point sets on the five exercises already imported.
 for(const [id,eq,fn,xs]of [
 ['35','3, x < 2\nx − 1, x ≥ 2',x=>x<2?3:x-1,[-1,0,2]],['38','2x + 3, x < −1\n3 − x, x ≥ −1',x=>x<-1?2*x+3:3-x,[-3,-1,2]],
 ['41','2, x ≤ −1\nx², x > −1',x=>x<=-1?2:x*x,[-1,1,2]],['42','1 − x², x ≤ 2\nx, x > 2',x=>x<=2?1-x*x:x,[0,2,4]],['46','−x, x ≤ 0\n9 − x², 0 < x ≤ 3\nx − 3, x > 3',x=>x<=0?-x:x<=3?9-x*x:x-3,[-1,2,3]]])graph('22','pw-boundary-'+id,book(2,id),'f(x) = {\n'+eq+'\n}',fn,xs,3);
 // §2.2 table-of-values graph requests and corresponding source inputs.
 for(const [id,eq,fn,xs,l]of [
 ['5','x + 2',x=>x+2,[-2,0,2],1],['6','4 − 2x',x=>4-2*x,[-1,0,1],1],['7','−x + 3, −3 ≤ x ≤ 3',x=>-x+3,[-1,1,3],1],['8','(x − 3)/2, 0 ≤ x ≤ 5',x=>(x-3)/2,[1,3,5],2],
 ['13','3x⁴',x=>3*x**4,[-1,0,1],3],['14','1 − x⁴',x=>1-x**4,[-1,0,1],3],['15','x³ − 8',x=>x**3-8,[1,1.5,2],3],['17','cbrt(−x)',x=>Math.cbrt(-x),[-1,0,1],2],['18','−cbrt(x)',x=>-Math.cbrt(x),[-8,0,8],2],['19','1 + sqrt(x)',x=>1+Math.sqrt(x),[0,1,4],2],['20','sqrt(x − 2)',x=>Math.sqrt(x-2),[2,3,6],2],['21','1/x²',x=>1/(x*x),[-2,1,2],3],['22','1/(x + 1)',x=>1/(x+1),[-3,0,1],3],['23','|2x|',x=>Math.abs(2*x),[-2,0,2],2],['24','|x + 1|',x=>Math.abs(x+1),[-2,-1,0],2],['25','|x| + x',x=>Math.abs(x)+x,[-2,0,2],3],['26','|x| − x',x=>Math.abs(x)-x,[-2,0,2],3],['27','|2x − 2|',x=>Math.abs(2*x-2),[0,1,2],2],['28','x/|x|',x=>x/Math.abs(x),[-2,-1,2],3]])graph('22','plot22-'+id,book(2,id),'f(x) = '+eq,fn,xs,l);
 // §2.6 remaining source transformations; no fourth-root family outside notes.
 for(const [id,eq,fn,xs,family,l]of [
 ['23a','x² + 1',x=>x*x+1,[-1,0,1],'quad',1],['23b','(x − 1)²',x=>(x-1)**2,[0,1,2],'quad',1],['23c','−x²',x=>-x*x,[-1,0,1],'quad',1],['23d','(x − 1)² + 3',x=>(x-1)**2+3,[0,1,2],'quad',2],
 ['24a','sqrt(x − 2)',x=>Math.sqrt(x-2),[2,3,6],'sqrt',2],['24b','sqrt(x) + 1',x=>Math.sqrt(x)+1,[0,1,4],'sqrt',1],['24c','sqrt(x + 2) + 2',x=>Math.sqrt(x+2)+2,[-2,-1,2],'sqrt',2],['24d','−sqrt(x) + 1',x=>-Math.sqrt(x)+1,[0,1,4],'sqrt',2],
 ['53','x² − 3',x=>x*x-3,[-1,0,1],'quad',1],['54','x³ + 5',x=>x**3+5,[-1,0,1],'cubic',2],['55','sqrt(x + 2)',x=>Math.sqrt(x+2),[-2,-1,2],'sqrt',2],['56','cbrt(x − 1)',x=>Math.cbrt(x-1),[0,1,2],'cbrt',2],['57','|x + 2| − 5',x=>Math.abs(x+2)-5,[-3,-2,-1],'abs',2]])graph('26','transform-'+id,book(6,id),'y = '+eq,fn,xs,l,family);
 for(const [id,eq,ans]of [['91','x/(x² + 1)','odd'],['92','x²/(x⁴ + 1)','even']])add('26','symmetry','sym-'+id,book(6,id),'f(x) = '+eq,'Even, odd, or neither?',[exact('Answer',ans)],3);
 // §2.7 omitted pairs, all four original compositions, and triple compositions.
 function pair(source,id,fs,gs,fe,ge,l=3,arithmetic=true,composition=true){for(const op of arithmetic?['+','−','×','/']:[])add('27','arithmetic',id+'-'+op,source,`f(x) = ${fs}\ng(x) = ${gs}`,`Find (f ${op} g)(x).`,[expression('Result',`(${fe})${op==='−'?'-':op==='×'?'*':op}(${ge})`)],l);if(composition)for(const [o,i]of [['f','g'],['g','f'],['f','f'],['g','g']]){const rules={f:fe,g:ge};add('27','ruleComp',id+'-'+o+i,source,`f(x) = ${fs}\ng(x) = ${gs}`,`Find (${o} ∘ ${i})(x).`,[expression('Composite rule',rules[o].replace(/x/g,'('+rules[i]+')'))],l);}}
 for(const [id,fs,gs,fe,ge]of [['8','x','sqrt(x)','x','sqrt(x)'],['13','sqrt(25 − x²)','sqrt(x + 3)','sqrt(25-x^2)','sqrt(x+3)'],['14','sqrt(16 − x²)','sqrt(x² − 1)','sqrt(16-x^2)','sqrt(x^2-1)'],['15','2/x','4/(x + 4)','2/x','4/(x+4)'],['16','2/(x + 1)','x/(x + 1)','2/(x+1)','x/(x+1)']])pair(book(7,id),'pair-'+id,fs,gs,fe,ge,id==='8'?2:3,true,false);
 for(const [id,fs,gs,fe,ge]of [['50','x³ + 2','cbrt(x)','x^3+2','cbrt(x)'],['52','x²','sqrt(x − 3)','x^2','sqrt(x-3)'],['53','|x|','2x + 3','abs(x)','2*x+3'],['54','x − 4','|x + 4|','x-4','abs(x+4)'],['56','1/sqrt(x)','x² − 4x','1/sqrt(x)','x^2-4*x']])pair(book(7,id),'comp-'+id,fs,gs,fe,ge,3,false,true);
 for(const [id,fs,gs,hs,ans]of [['59','x² − 1','sqrt(x)','x − 1','x-2'],['60','1/x','x³','x² + 2','1/(x^2+2)^3'],['61','x⁴ + 1','x − 5','sqrt(x)','(sqrt(x)-5)^4+1'],['62','sqrt(x)','x/(x − 1)','cbrt(x)','sqrt(cbrt(x)/(cbrt(x)-1))']])add('27','tripleComp','triple-'+id,book(7,id),`f(x) = ${fs}\ng(x) = ${gs}\nh(x) = ${hs}`,'Find (f ∘ g ∘ h)(x).',[expression('Composite rule',ans)],3);
 add('27','ruleComp','comp31f',book(7,'31a'),'f(x) = 2x − 3\ng(x) = 4 − x²','Find (f ∘ g)(x).',[expression('Composite rule','5-2*x^2')],2);
 add('27','ruleComp','comp31g',book(7,'31b'),'f(x) = 2x − 3\ng(x) = 4 − x²','Find (g ∘ f)(x).',[expression('Composite rule','4-(2*x-3)^2')],2);
 add('27','ruleComp','comp32f',book(7,'32a'),'f(x) = 2x − 3\ng(x) = 4 − x²','Find (f ∘ f)(x).',[expression('Composite rule','4*x-9')],2);
 add('27','ruleComp','comp32g',book(7,'32b'),'f(x) = 2x − 3\ng(x) = 4 − x²','Find (g ∘ g)(x).',[expression('Composite rule','4-(4-x^2)^2')],2);
 add('27','decompose','dec68',book(7,68),'H(x) = sqrt(1 + sqrt(x))','Write H = f ∘ g using g(x) = sqrt(x).',[expression('f(x)','sqrt(1+x)')],3);
 // §2.8 omitted inverse rules and both inverse-property checks per exercise.
 for(const [id,eq,ans,dom]of [['63','x⁶, x ≥ 0','x^(1/6)','[0,inf)'],['64','1/x², x > 0','1/sqrt(x)','(0,inf)'],['65','(2 − x³)/5','cbrt(2-5*x)','(-inf,inf)'],['66','(x⁵ − 6)⁷','(x^(1/7)+6)^(1/5)','(-inf,inf)'],['69','2 + cbrt(x)','(x-2)^3','(-inf,inf)'],['71','3x − 6','(x+6)/3','(-inf,inf)'],['72','16 − x², x ≥ 0','sqrt(16-x)','(-inf,16]'],['73','sqrt(x + 1)','x^2-1','[0,inf)'],['74','x³ − 1','cbrt(x+1)','(-inf,inf)'],['81','2 + x','x-2','(-inf,inf)'],['82','2 − x/2','4-2*x','(-inf,inf)'],['83','sqrt(x + 3)','x^2-3','[0,inf)'],['84','x² + 1, x ≥ 0','sqrt(x-1)','[1,inf)']])add('28','inverseRule','inverse-'+id,book(8,id),'f(x) = '+eq,'Find the inverse and its domain.',[expression('Inverse rule',ans),exact('Domain',dom)],3);
 for(const [id,fs,gs]of [['38','3x','x/3'],['41','1/x², x > 0','1/sqrt(x), x > 0'],['42','x⁵','x^(1/5)'],['43','x² − 9, x ≥ 0','sqrt(x + 9), x ≥ −9'],['44','x³ + 1','cbrt(x − 1)'],['45','1/(x − 1)','1/x + 1'],['46','sqrt(4 − x²), 0 ≤ x ≤ 2','sqrt(4 − x²), 0 ≤ x ≤ 2']])add('28','verifyInverse','verify-'+id,book(8,id),`f(x) = ${fs}\ng(x) = ${gs}`,'Simplify both compositions on their valid domains.',[expression('f(g(x))','x'),expression('g(f(x))','x')],3);
 // Chapter review, restricted to question types covered in the notes.
 values('21','rev10',review(10),'4 − sqrt(3x − 6)',x=>4-Math.sqrt(3*x-6),[5,9],3);
 for(const [input,ans]of [['−x','x^2+4*x+6'],['x + 1','(x+1)^2-4*(x+1)+6'],['2x','4*x^2-8*x+6']])add('21','symbolicInput','rev9-'+input,review(9),'f(x) = x² − 4x + 6',`Simplify f(${input}).`,[expression('Result',ans)],2);
 for(const [id,eq,ans]of [['13','sqrt(x + 3)','[-3,inf)'],['15','7x + 15','(-inf,inf)'],['17','sqrt(x + 4)','[-4,inf)'],['21','sqrt(4 − x) + sqrt(x² − 1)','(-inf,-1] U [1,4]'],['22','cbrt(2x + 1)/cbrt(2x + 2)','(-inf,-1) U (-1,inf)']])add('21','domain21','rev-domain-'+id,review(id),'f(x) = '+eq,'Find the domain.',[exact('Domain',ans)],id==='21'||id==='22'?3:2);
 for(const [id,eq,yes]of [['39','x + y² = 14','no'],['40','3x − sqrt(y) = 8','yes'],['41','x³ − y³ = 27','yes'],['42','2x = y⁴ − 16','no']])add('22','equationFunction','rev-function-'+id,review(id),eq,'Does this define y as a function of x?',[exact('Answer',yes)],3);
 for(const [id,eq,fn,xs,family,l]of [['25','3x²',x=>3*x*x,[-1,0,1],'quad',2],['26','−x²/4',x=>-x*x/4,[-2,0,2],'quad',2],['27','2x² − 1',x=>2*x*x-1,[-1,0,1],'quad',2],['29','1 + sqrt(x)',x=>1+Math.sqrt(x),[0,1,4],'sqrt',2],['30','1 − sqrt(x + 2)',x=>1-Math.sqrt(x+2),[-2,-1,2],'sqrt',3],['31','x³/2',x=>x**3/2,[-1,0,1],'cubic',2],['33','−|x|',x=>-Math.abs(x),[-1,0,1],'abs',1],['34','|x + 1|',x=>Math.abs(x+1),[-2,-1,0],'abs',1]])graph('26','rev-plot-'+id,review(id),'y = '+eq,fn,xs,l,family);
 graph('22','rev-pw37',review(37),'f(x) = {\n1 − x, x < 0\n1, x ≥ 0\n}',x=>x<0?1-x:1,[-1,0,1],3);
 graph('22','rev-pw38',review(38),'f(x) = {\n−x, x < 0\nx², 0 ≤ x < 2\n1, x ≥ 2\n}',x=>x<0?-x:x<2?x*x:1,[-1,1,2],3);
 pair(review(83),'rev83','x² − 3x + 2','4 − 3x','x^2-3*x+2','4-3*x',3,true,true);
 pair(review(84),'rev84','1 + x²','sqrt(x − 1)','1+x^2','sqrt(x-1)',3,false,true);
 pair(review(85),'rev85','3x − 1','2x − x²','3*x-1','2*x-x^2',3,false,true);
 pair(review(86),'rev86','sqrt(x)','2/(x − 4)','sqrt(x)','2/(x-4)',3,false,true);
 for(const [id,eq,yes]of [['89','3 + x³','yes'],['90','2 − 2x + x²','no'],['91','1/x⁴','no'],['92','2 + sqrt(x + 3)','yes']])add('28','oneToOne','rev-oto-'+id,review(id),'f(x) = '+eq,'Is this one-to-one on its domain?',[exact('Answer',yes)],3);
 for(const [id,eq,ans]of [['95','3x − 2','(x+2)/3'],['96','(2x + 1)/3','(3*x-1)/2'],['97','(x + 1)³','cbrt(x)-1'],['98','1 + (x − 2)^(1/5)','(x-1)^5+2'],['101c','x² − 4, x ≥ 0','sqrt(x+4)']])add('28','inverseRule','rev-inverse-'+id,review(id),'f(x) = '+eq,'Find f⁻¹(x).',[expression('Inverse rule',ans)],3);
 // Chapter test subparts, with original formulas and numbers.
 values('21','test2',test('2a'),'sqrt(x)/(x + 1)',x=>Math.sqrt(x)/(x+1),[0,2],3);
 add('21','domain21','test2domain',test('2b'),'f(x) = sqrt(x)/(x + 1)','Find the domain.',[exact('Domain','[0,inf)')],3);
 values('21','test3',test('3b'),'(x − 2)³',x=>(x-2)**3,[-1,0,1,2,3,4],2);
 values('21','test5',test('5a'),'−500x² + 3000x',x=>-500*x*x+3000*x,[2,4],3);
 graph('26','test8b',test('8b'),'y = (x − 1)³ − 2',x=>(x-1)**3-2,[0,1,2],3,'cubic');
 for(const x of [-2,1])add('21','evalPiecewise','test10-'+x,test('10a'),'f(x) = {\n1 − x, x ≤ 1\n2x + 1, x > 1\n}',`Find f(${x}).`,[number('Function value',1-x)],3);
 graph('22','test10graph',test('10b'),'f(x) = {\n1 − x, x ≤ 1\n2x + 1, x > 1\n}',x=>x<=1?1-x:2*x+1,[0,1,2],3);
 pair(test(11),'test11','x² + x + 1','x − 3','x^2+x+1','x-3',3,true,true);
 add('27','formulaComp','test11e',test('11e'),'f(x) = x² + x + 1\ng(x) = x − 3','Find f(g(2)).',[number('Answer',1)],3);
 add('27','formulaComp','test11f',test('11f'),'f(x) = x² + x + 1\ng(x) = x − 3','Find g(f(2)).',[number('Answer',4)],3);
 for(const [id,eq,yes]of [['12a','x³ + 1','yes'],['12b','|x + 1|','no']])add('28','oneToOne','test-'+id,test(id),'f(x) = '+eq,'Is this one-to-one?',[exact('Answer',yes)],2);
 add('28','verifyInverse','test13',test(13),'f(x) = 1/(x − 2)\ng(x) = 1/x + 2','Simplify both compositions on their valid domains.',[expression('f(g(x))','x'),expression('g(f(x))','x')],3);
 add('28','inverseRule','test14',test(14),'f(x) = (x − 3)/(2x + 5)','Find the inverse and its domain.',[expression('Inverse rule','(5*x+3)/(1-2*x)'),exact('Domain','(-inf,1/2) U (1/2,inf)')],3);
 add('28','inverseRule','test15',test('15a'),'f(x) = sqrt(3 − x)','Find the inverse and its domain.',[expression('Inverse rule','3-x^2'),exact('Domain','[0,inf)')],3);
 // Original graph images preserve curves and scale rather than approximating them.
 const visual=name=>({type:'sourceImage',src:'/source-graphs/'+name+'.png',alt:'Original textbook graph with coordinate grid'});
 for(const [id,eq,value]of [['33','f(g(2))',4],['34','g(f(0))',3],['35','(g ∘ f)(4)',5],['36','(f ∘ g)(0)',0],['37','(g ∘ g)(−2)',4],['38','(f ∘ f)(4)',-2]])add('27','graphComp','graph27-'+id,book(7,id),eq,'Evaluate using the given graphs.',[number('Answer',value)],2,{visual:visual('composition-27-33')});
 for(const [id,name,points]of [['29','f',[[2,6],[5,2],[6,0]]],['30','g',[[2,4],[5,7],[6,8]]]])for(const [output,input]of points)add('28','inverseTable','graph28-'+id+'-'+output,book(8,id),`${name}⁻¹(${output})`,'Find the inverse value using the graph.',[number('Answer',input)],2,{visual:visual('inverse-28-'+id)});
 for(const [x,value]of [[0,1],[4,3]])add('22','graphRead','test17-'+x,test(17),`Find f(${x}).`,'Read the function value from the graph.',[number('Function value',value)],2,{visual:visual('test-17-20')});
 for(const [output,input]of [[1,0],[3,4]])add('28','inverseTable','test20-'+output,test(20),`Find f⁻¹(${output}).`,'Find the original input producing this output.',[number('Answer',input)],2,{visual:visual('test-17-20')});
})();
