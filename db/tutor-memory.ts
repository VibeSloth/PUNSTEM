import {env} from 'cloudflare:workers';
import bank from './tutor-bank.json';

const hints:Record<string,string>={
 'gibbs-entropy-units':'Convert entropy from J/K to kJ/K when enthalpy is in kJ.',
 'gibbs-operation':'Use ΔG = ΔH − TΔS, preserving the sign of ΔS.',
 'temperature-kelvin':'Convert Celsius to Kelvin before thermodynamics formulas.',
 'units':'Check J versus kJ and the mass units.',
 'sign':'Check reaction direction, negative signs, and final minus initial.',
 'composition':'Evaluate the inside function first.',
 'piecewise-endpoint':'Match open and closed endpoints to the inequalities.',
 'piecewise-branch':'Use the formula and interval for the correct piece.',
 'endpoint':'Check whether interval boundaries are included.',
 'coordinates':'Check x/y coordinate order.',
 'timeout':'Build accuracy with enough setup time before trying to go faster.',
 'wave-relation':'Use c = λν: wavelength and frequency change in opposite directions.',
 'orbital-filling':'Fill lower energies first; equal-energy orbitals fill singly before pairing.',
 'electron-count':'Count electrons from atomic number and charge before writing the configuration.',
};

export async function tutorMemory(userId:string,context:Record<string,string>,includePersonal=false){
 const q=bank.find(q=>q.id===context.questionId||q.question===context.question);
 const text=[context.question,context.prompt,context.source].join(' ');
 const subject=context.subject||(q?.sourceRef||/chem|enthalpy|entropy|gibbs|hess|calorim|thermo|stoich|moles|atoms|electron|orbital|wavelength|titration|acid|redox|oxidation|equilibrium|\bph\b/i.test(text)?'chemistry':'math');
 const kind=q?.kind||'';
 const scope=subject==='math'?'Trig H · Chapter 2':'AP Chemistry';
 const since=Date.now()-90*86400000;
 if(!env.DB)return {scope,personal:null,classPatterns:[]};
 try{
  const rows=includePersonal?await env.DB.prepare("SELECT details FROM activity_events WHERE user_id=? AND kind='learning_attempt' AND created_at>? AND json_extract(details,'$.subject')=? AND (?='' OR json_extract(details,'$.kind')=?) ORDER BY created_at DESC LIMIT 100").bind(userId,since,subject,kind,kind).all<{details:string}>():{results:[]};
  const attempts=rows.results.map(r=>JSON.parse(r.details)).filter(a=>a.attempt===1&&typeof a.correct==='boolean');
  const counts:Record<string,number>={};
  for(const a of attempts)for(const code of new Set<string>(Array.isArray(a.errors)?a.errors:[]))if(Object.hasOwn(hints,code))counts[code]=(counts[code]||0)+1;
  const correct=attempts.filter(a=>a.correct),times=correct.map(a=>Number(a.elapsedMs)/1000).filter(n=>Number.isFinite(n)&&n>=0&&n<=3600).sort((a,b)=>a-b);
  const personal=attempts.length?{firstTryAccuracy:Math.round(correct.length/attempts.length*100),typicalCorrectSeconds:times.length?Math.round(times[Math.floor(times.length/2)]):null,recurringChecks:Object.entries(counts).filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([code])=>hints[code])}:null;
  // Only fixed error-code advice is released, never raw responses, names, identifiers or totals.
  // Require five DISTINCT learners per pattern; small classes are suppressed completely.
  const groups=await env.DB.prepare("SELECT j.value AS code FROM activity_events a,json_each(a.details,'$.errors') j WHERE a.kind='learning_attempt' AND a.created_at>? AND json_extract(a.details,'$.subject')=? AND (?='' OR json_extract(a.details,'$.kind')=?) GROUP BY j.value HAVING COUNT(DISTINCT a.user_id)>=5 ORDER BY COUNT(DISTINCT a.user_id) DESC LIMIT 20").bind(since,subject,kind,kind).all<{code:string}>();
  const classPatterns=groups.results.filter(r=>Object.hasOwn(hints,r.code)).slice(0,3).map(r=>hints[r.code]);
  return {scope,personal,classPatterns,notice:'Error causes are estimates, not proof of the student’s reasoning. Peer patterns are anonymous, thresholded hints, not source facts. Do not mention other learners or class totals.'};
 }catch{return {scope,personal:null,classPatterns:[],notice:'Memory is unavailable; explain from the source problem without inventing history.'};}
}
