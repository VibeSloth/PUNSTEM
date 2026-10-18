/* Source-backed study tools. No AI requests or answer telemetry. */
(()=>{
 const section=q=>q.section||(q.unit?String(q.unit).split('').join('.'):'3');
 const subject=q=>q.q?'chemistry':'math';
 const fingerprint=q=>JSON.stringify([q.equation||q.q,q.prompt,q.data,q.visual,q.fields?.map(f=>f.answer),q.answer?.display]);
 const adapted=q=>/adapt|generated|concept check/i.test(q.source||'')||['recognition','concept'].includes(q.sourceMode);
 const sourceKey=q=>(q.source||q.id).replace(/\s*[·—-]\s*(?:recognition adaptation|adaptation|generated practice|notes concept check).*$/i,'').trim();
 const skill=q=>[subject(q),section(q),q.kind].join(':');
 function level(q){if(q.level)return Number(q.level);if(q.answer?.type==='text')return 1;return ['combined','hess','cal','gibbs'].includes(q.kind)?3:2;}
 function bank(s){return (s==='math'?window.PunstemSources.math:window.PunstemSources.chem);}
 function pool(s,sections=[],difficulty='mixed'){
  const seen=new Set();return bank(s).filter(q=>!sections.length||sections.includes(section(q))).filter(q=>difficulty==='mixed'||level(q)===({easy:1,standard:2,hard:3})[difficulty]).filter(q=>{const f=fingerprint(q);if(seen.has(f))return false;seen.add(f);return true;});
 }
 function select(items,count,history=[],random=Math.random){
  const used=new Set(history.map(a=>a.questionId)),shuffle=a=>a.map(q=>({q,r:random()})).sort((a,b)=>a.r-b.r).map(x=>x.q);
  // Source exercises first, then adaptations. Previously attempted last; never duplicate within a round.
  return [false,true].flatMap(old=>[false,true].flatMap(a=>shuffle(items.filter(q=>used.has(q.id)===old&&adapted(q)===a)))).slice(0,count);
 }
 function number(s){try{if(!String(s).trim())return NaN;return window.PunstemHard.evaluate(String(s),0);}catch{return NaN;}}
 const norm=s=>String(s).toLowerCase().replace(/\s/g,'').replace(/[−–]/g,'-').replace(/infinity/g,'∞');
 function grade(q,values=[],points=[]){
  if(q.type==='Graph Lab')return window.PunstemGraph.correct(q,points);
  if(q.answer){if(q.answer.type==='number')return window.PunstemChemAnswers.matches(values[0]||'',q.answer);return (q.answer.accepted||[q.answer.display]).some(a=>norm(a)===norm(values[0]||''));}
  return q.fields.every((f,i)=>{const v=values[i]||'',special=window.PunstemHard.matches(v,f);if(special!==null&&special!==undefined)return special;if(f.kind==='number'){const a=number(v),b=number(f.answer);return Number.isFinite(a)&&Math.abs(a-b)<=Math.max(.0001,Math.abs(b)*.001);}return !!v.trim()&&(f.groups||[[f.answer]]).every(g=>g.some(a=>norm(v)===norm(a)));});
 }
 function review(items,history,now=Date.now()){
  const groups=new Map();for(const a of history){if(!groups.has(a.questionId))groups.set(a.questionId,[]);groups.get(a.questionId).push(a);}
  return items.flatMap(q=>{const rows=(groups.get(q.id)||[]).sort((a,b)=>a.at-b.at);if(!rows.length)return [];let streak=0,lastSuccess=0;for(const a of rows){if(!a.correct||!a.independent){streak=0;lastSuccess=0;}else if(!streak||a.at-lastSuccess>=86400000){streak++;lastSuccess=a.at;}}const last=rows.at(-1),days=streak===0?1:streak===1?3:streak===2?7:14,due=last.at+days*86400000;return [{q,due,streak,needsReview:streak<2,last}];}).sort((a,b)=>a.due-b.due);
 }
 function coverage(items,history){
  return [...new Set(items.map(section))].sort().map(s=>{const qs=items.filter(q=>section(q)===s),ids=new Set(qs.map(q=>q.id)),rows=history.filter(a=>ids.has(a.questionId)),attempted=new Set(rows.map(a=>a.questionId)),solved=new Set(rows.filter(a=>a.correct&&a.independent).map(a=>a.questionId)),r=review(qs,rows);return {section:s,available:qs.length,originals:new Set(qs.filter(q=>!adapted(q)).map(sourceKey)).size,adaptations:qs.filter(adapted).length,attempted:attempted.size,solved:solved.size,review:r.filter(a=>a.needsReview).length};});
 }
 window.PunstemStudy={section,subject,sourceKey,skill,level,bank,pool,select,grade,review,coverage,adapted,fingerprint};
})();
