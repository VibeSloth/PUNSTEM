/* Piece definitions checked against the supplied textbook HTML and Ch2
   Solution Manual, §2.2 #33–50. Endpoints are limits from each piece. */
(()=>{
 const bank=window.PunstemSources.math,part=(rule,fn,from=-Infinity,to=Infinity,left=false,right=false)=>({rule,fn,from,to,left,right});
 const defs={
 33:[part('0',x=>0,-Infinity,2),part('1',x=>1,2,Infinity,true)],
 34:[part('1',x=>1,-Infinity,1,false,true),part('x + 1',x=>x+1,1)],
 35:[part('3',x=>3,-Infinity,2),part('x − 1',x=>x-1,2,Infinity,true)],
 36:[part('1 − x',x=>1-x,-Infinity,-2),part('5',x=>5,-2,Infinity,true)],
 37:[part('x',x=>x,-Infinity,0,false,true),part('x + 1',x=>x+1,0)],
 38:[part('2x + 3',x=>2*x+3,-Infinity,-1),part('3 − x',x=>3-x,-1,Infinity,true)],
 39:[part('−1',x=>-1,-Infinity,-1),part('1',x=>1,-1,1,true,true),part('−1',x=>-1,1)],
 40:[part('−1',x=>-1,-Infinity,-1),part('x',x=>x,-1,1,true,true),part('1',x=>1,1)],
 41:[part('2',x=>2,-Infinity,-1,false,true),part('x²',x=>x*x,-1)],
 42:[part('1 − x²',x=>1-x*x,-Infinity,2,false,true),part('x',x=>x,2)],
 43:[part('3',x=>3,-Infinity,-2),part('0',x=>0,-2,2,true,true),part('3',x=>3,2)],
 44:[part('1',x=>1,-Infinity,-1),part('x²',x=>x*x,-1,1,true,true),part('1',x=>1,1)],
 45:[part('4',x=>4,-Infinity,-2),part('x²',x=>x*x,-2,2,true,true),part('−x + 6',x=>6-x,2)],
 46:[part('−x',x=>-x,-Infinity,0,false,true),part('9 − x²',x=>9-x*x,0,3,false,true),part('x − 3',x=>x-3,3)],
 47:[part('x + 2',x=>x+2,-Infinity,-1,false,true),part('x²',x=>x*x,-1)],
 48:[part('(x − 1)³',x=>(x-1)**3,-Infinity,1,false,true),part('2x − x²',x=>2*x-x*x,1)],
 49:[part('−2',x=>-2,-Infinity,-2),part('x',x=>x,-2,2,true,true),part('2',x=>2,2)],
 50:[part('1',x=>1,-Infinity,-1,false,true),part('1 − x',x=>1-x,-1,2,false,true),part('−2',x=>-2,2)]
 };
 const includes=(p,x)=> (x>p.from||(p.left&&x===p.from))&&(x<p.to||(p.right&&x===p.to));
 const interval=p=>(p.left?'[':'(')+(Number.isFinite(p.from)?p.from:'−∞')+', '+(Number.isFinite(p.to)?p.to:'∞')+(p.right?']':')');
 function setup(q,pieces){q.piecewise=true;q.pieces=pieces;q.kind='piecewiseGraph';q.type='Graph Lab';q.fn=x=>pieces.find(p=>includes(p,x))?.fn(x)??NaN;const ends=[];for(const p of pieces)for(const [x,closed]of [[p.from,p.left],[p.to,p.right]])if(Number.isFinite(x)){const y=p.fn(x),old=ends.find(t=>t.x===x&&Math.abs(t.y-y)<1e-9);if(old)old.closed ||= closed;else ends.push({x,y,closed,endpoint:true});}q.endpoints=ends;q.points=[...ends,...pieces.map(p=>{const x=!Number.isFinite(p.from)?p.to-1:!Number.isFinite(p.to)?p.from+1:(p.from+p.to)/2;return{x,y:p.fn(x),closed:true};})];q.prompt='Plot at least one interior point on each piece and every finite endpoint. Use open or closed endpoints as required. Extra correct points are allowed.';q.explain='Endpoint marks: '+ends.map(p=>`(${p.x}, ${p.y}) ${p.closed?'closed':'open'}`).join('; ')+'. Interior examples: '+q.points.slice(ends.length).map(p=>`(${p.x}, ${p.y})`).join(', ');const ys=q.points.map(p=>p.y),xs=q.points.map(p=>p.x);q.graphBounds={xmin:Math.min(-8,...xs.map(x=>x-1)),xmax:Math.max(8,...xs.map(x=>x+1)),ymin:Math.min(-8,...ys.map(y=>y-1)),ymax:Math.max(8,...ys.map(y=>y+1))};}
 const levels={33:1,34:1,35:2,36:2,37:1,38:2,39:2,40:2,41:2,42:3,43:3,44:2,45:3,46:3,47:3,48:3,49:2,50:3};
 const covered=new Set();for(const q of bank){if(q.unit!=='22'||q.kind!=='piecewiseGraph')continue;const m=q.source.match(/§2\.2 homework, #(\d+)/);if(m&&defs[m[1]]){setup(q,defs[m[1]]);q.level=levels[m[1]];covered.add(Number(m[1]));}else if(!q.equation.includes('{'))q.kind='graph';}
 function add(id,source,pieces,equation,level=3){const q={id:'piecewise-'+id,unit:'22',section:'2.2',kind:'piecewiseGraph',type:'Graph Lab',level,source,equation,fields:[]};setup(q,pieces);bank.push(q);return q;}
 for(let i=33;i<=50;i++)if(!covered.has(i))add('hw-'+i,`Textbook · §2.2 homework, #${i}${i>=49?' · graph reconstructed from solution key':''}`,defs[i],'f(x) = {\n'+defs[i].map(p=>p.rule+' for x in '+interval(p)).join('\n')+'\n}',levels[i]);
 const extra=[
 ['21-31','Textbook · §2.1 homework, #31 · graphing adaptation',[part('x²',x=>x*x,-Infinity,0),part('x + 1',x=>x+1,0,Infinity,true)]],
 ['21-32','Textbook · §2.1 homework, #32 · graphing adaptation',[part('5',x=>5,-Infinity,2,false,true),part('2x − 3',x=>2*x-3,2)]],
 ['21-33','Textbook · §2.1 homework, #33 · graphing adaptation',[part('x² + 2x',x=>x*x+2*x,-Infinity,-1,false,true),part('x',x=>x,-1,1,false,true),part('−1',x=>-1,1)]],
 ['21-34','Textbook · §2.1 homework, #34 · graphing adaptation',[part('3x',x=>3*x,-Infinity,0),part('x + 1',x=>x+1,0,2,true,true),part('(x − 2)²',x=>(x-2)**2,2)]],
 ['review-37','Textbook · Chapter 2 review, #37',[part('1 − x',x=>1-x,-Infinity,0),part('1',x=>1,0,Infinity,true)]],
 ['review-38','Textbook · Chapter 2 review, #38',[part('−x',x=>-x,-Infinity,0),part('x²',x=>x*x,0,2,true),part('1',x=>1,2,Infinity,true)]],
 ['test-10','Textbook · Chapter 2 test, #10b',[part('1 − x',x=>1-x,-Infinity,1,false,true),part('2x + 1',x=>2*x+1,1)]]
 ];
 for(const [id,source,pieces]of extra){const existing=bank.filter(q=>q.unit==='22'&&q.kind==='piecewiseGraph'&&q.source.startsWith(source));if(existing.length)existing.forEach(q=>setup(q,pieces));else add(id,source,pieces,'f(x) = {\n'+pieces.map(p=>p.rule+' for x in '+interval(p)).join('\n')+'\n}');}
 // Boundary-focused evaluation drill for every §2.2 piecewise function.
 for(let i=33;i<=50;i++){const pieces=defs[i],xs=[...new Set(pieces.flatMap(p=>[p.from,p.to]).filter(Number.isFinite))];for(const x of xs){const fn=pieces.find(p=>includes(p,x)).fn;bank.push({id:`piecewise-value-${i}-${x}`,unit:'21',section:'2.1',kind:'evalPiecewise',type:'Piecewise value',level:2,source:`Textbook · §2.2 homework, #${i} · boundary-value adaptation`,equation:'f(x) = {\n'+pieces.map(p=>p.rule+' for x in '+interval(p)).join('\n')+'\n}',prompt:`Find f(${x}).`,fields:[{label:'Function value',kind:'number',answer:String(fn(x)),placeholder:'Number',groups:[]}],explain:`Use the piece that includes x = ${x}: ${pieces.find(p=>includes(p,x)).rule}. f(${x}) = ${fn(x)}.`});}}
 const utility=add('utility-81','Textbook · §2.2 homework, #81b · supplied cost rule',[part('6 + 0.10x',x=>6+.1*x,0,300,true,true),part('36 + 0.06(x − 300)',x=>36+.06*(x-300),300,600,false,true)],'E(x) = {\n6 + 0.10x, 0 ≤ x ≤ 300\n36 + 0.06(x − 300), 300 < x ≤ 600\n}\nE is the monthly cost in dollars; x is kWh.');utility.graphBounds={xmin:-25,xmax:625,ymin:-5,ymax:60};
 const taxiPieces=[part('2.00',x=>2,0,1,false,true)];for(let i=1;i<=10;i++){const cost=2+.2*i;taxiPieces.push(part(cost.toFixed(2),x=>cost,Number((1+(i-1)/10).toFixed(1)),Number((1+i/10).toFixed(1)),false,i<10));}const taxi=add('taxi-82','Textbook · §2.2 homework, #82',taxiPieces,'C(x): $2.00 for the first mile (or part), then $0.20 per additional tenth of a mile (or part), 0 < x < 2.');taxi.graphBounds={xmin:-.1,xmax:2.1,ymin:0,ymax:4.5};taxi.plotStep=.01;taxi.graphTolerance=.005;
 const postage=add('postage-83','Textbook · §2.2 homework, #83',[part('49',x=>49,0,1,false,true),part('70',x=>70,1,2,false,true),part('91',x=>91,2,3,false,true),part('112',x=>112,3,3.5,false,true)],'P(x) = {\n49, 0 < x ≤ 1\n70, 1 < x ≤ 2\n91, 2 < x ≤ 3\n112, 3 < x ≤ 3.5\n}\nPostage P is in cents; weight x is ounces.');postage.graphBounds={xmin:-.5,xmax:4,ymin:-10,ymax:125};postage.plotStep=.25;
 add('notes6','Class notes · p. 6, Ex 3',[part('2',x=>2,-Infinity,-3,false,true),part('2x + 1',x=>2*x+1,-3,-1),part('x² − 4',x=>x*x-4,-1,Infinity,true)],'f(x) = {\n2, x ≤ −3\n2x + 1, −3 < x < −1\nx² − 4, x ≥ −1\n}');
 for(const [x,y]of [[-1,-3],[0,-4],[-2,-3],[-.5,-3.75]])bank.push({id:'piecewise-notes6-value-'+x,unit:'21',section:'2.1',kind:'evalPiecewise',type:'Piecewise value',level:2,source:'Class notes · p. 6, Ex 3',equation:'f(x) = {\n2, x ≤ −3\n2x + 1, −3 < x < −1\nx² − 4, x ≥ −1\n}',prompt:`Find f(${x}).`,fields:[{label:'Function value',kind:'number',answer:String(y),placeholder:'Number',groups:[]}],explain:`Choose the piece containing ${x}. f(${x}) = ${y}.`});
 // Below half a grid unit: accept a shaky click, never the adjacent whole number.
 const tolerance=q=>q.graphTolerance??Math.min(.45,...(q.pieces||[]).map(p=>Number.isFinite(p.to-p.from)?(p.to-p.from)/4:Infinity));
 const snap=(n,q)=>Math.abs(n-Math.round(n))<=tolerance(q)?Math.round(n):n;
 const parent={quad:x=>x*x,square:x=>x*x,abs:Math.abs,cubic:x=>x**3,cube:x=>x**3,sqrt:Math.sqrt,cbrt:Math.cbrt};
 function curve(q){if(typeof q.fn==='function')return q.fn;const t=q.target,f=parent[q.family];return t&&f?x=>t.a*f(t.b*(x-t.h))+t.k:null;}
 function onCurve(q,p,fn){if(p.closed===false||!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;return Math.abs(p.y-fn(p.x))<=tolerance(q)||Math.abs(snap(p.y,q)-fn(snap(p.x,q)))<1e-8;}
 function functionMisses(q,points){const fn=curve(q);if(!fn)return q.points.filter(t=>!points.some(p=>match(p,t,q))).map(t=>`point near (${t.x}, ${t.y})`);
  const issues=[],valid=points.filter(p=>onCurve(q,p,fn)),xs=[];for(const p of valid){const x=p.x;if(!xs.some(v=>Math.abs(v-x)<.1))xs.push(x)}
  if(xs.length<3)issues.push('at least 3 distinct x-values on the curve');
  for(const p of points)if(!onCurve(q,p,fn))issues.push(`point (${p.x}, ${p.y}) should lie on the curve`);
  if(['abs','quad','square','sqrt'].includes(q.family)){
   // These source key-point triples contain the vertex in the middle, or the
   // leftmost root endpoint. Generated transformations carry the exact anchor.
   const sorted=[...q.points].sort((a,b)=>a.x-b.x),v=q.target?{x:q.target.h,y:q.target.k}:sorted[q.family==='sqrt'?0:Math.floor(sorted.length/2)];
   if(!valid.some(p=>match(p,{...v,closed:true},q)))issues.push(q.family==='sqrt'?'the root endpoint':'the vertex');
   const sideGap=Math.min(tolerance(q),...q.points.filter(p=>p.x!==v.x).map(p=>Math.abs(p.x-v.x)/2));
   if(q.family!=='sqrt'&&(!xs.some(x=>x<v.x-sideGap)||!xs.some(x=>x>v.x+sideGap)))issues.push('a point on each side of the vertex');
  }return issues;
 }
 function match(p,t,q){return Math.abs(p.x-t.x)<=tolerance(q)&&Math.abs(p.y-t.y)<=tolerance(q)&&(t.closed===undefined||(p.closed!==false)===t.closed);}
 function misses(q,points){if(!q.piecewise)return functionMisses(q,points);const issues=[];for(const t of q.endpoints)if(!points.some(p=>match(p,t,q)))issues.push(`${t.closed?'closed':'open'} endpoint (${t.x}, ${t.y})`);q.pieces.forEach((piece,i)=>{if(!points.some(p=>p.closed!==false&&p.x>piece.from&&p.x<piece.to&&(Math.abs(p.y-piece.fn(p.x))<=tolerance(q)||Math.abs(snap(p.y,q)-piece.fn(snap(p.x,q)))<1e-8)))issues.push(`interior point on piece ${i+1}: ${piece.rule}, x in ${interval(piece)}`);});for(const p of points){const endpoint=q.endpoints.some(t=>match(p,t,q)),interior=p.closed!==false&&q.pieces.some(t=>p.x>t.from&&p.x<t.to&&(Math.abs(p.y-t.fn(p.x))<=tolerance(q)||Math.abs(snap(p.y,q)-t.fn(snap(p.x,q)))<1e-8));if(!endpoint&&!interior)issues.push(p.closed===false?`open endpoint near (${p.x}, ${p.y}) is not at an excluded boundary`:`incorrect point near (${p.x}, ${p.y})`);}return issues;}
 function correct(q,points){return points.length>0&&!misses(q,points).length;}
 for(const q of bank)if(q.type==='Graph Lab'&&!q.piecewise)q.prompt='Plot any 3 distinct points on the curve, including its vertex or root endpoint when present. Extra correct points and small plotting slips are OK.';
 window.PunstemGraph={correct,misses,match,setup,interval};
})();
