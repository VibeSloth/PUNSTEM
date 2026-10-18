// Numeric grading and answer-pattern checks share the same rounding rules.
(()=>{
 function parse(input){const s=String(input).replace(/,/g,'').replace(/[−–—]/g,'-').trim(),m=s.match(/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(?:\s*\/\s*([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?))?(?:\s*[a-zA-Z°/(·)\s⁻¹²³]+)?$/i);return m?Number(m[1])/(m[2]?Number(m[2]):1):NaN;}
 function matches(input,answer){const n=parse(input),v=answer.value;if(!Number.isFinite(n)||!Number.isFinite(v))return false;if(Math.abs(n-v)<=Math.max(Math.abs(v)*(answer.tol??.015),1e-10))return true;
  // Accept a correctly rounded two-or-more-significant-figure result, not a
  // broad absolute tolerance that could hide a small-value unit error.
  if(v!==0)for(let figures=2;figures<=8;figures++){const rounded=Number(v.toPrecision(figures));if(Math.abs(n-rounded)<=Math.max(Math.abs(rounded)*1e-10,1e-12))return true;}return false;
 }
 function diagnose(q,input){const t=q.thermo;if(!t||q.answer?.type!=='number'||matches(input,q.answer))return null;const h=t.deltaH,s=t.deltaS,T=t.temperatureK;if(!Number.isFinite(h)||!Number.isFinite(s)||s===0)return null;const candidates=t.mode==='equilibrium'?[{code:'gibbs-entropy-units',value:h/s}]:Number.isFinite(T)?[{code:'gibbs-entropy-units',value:h-T*s},{code:'gibbs-operation',value:h+T*s/1000},...(Number.isFinite(t.temperatureC)?[{code:'temperature-kelvin',value:h-t.temperatureC*s/1000}]:[])]:[];
  const info={'gibbs-entropy-units':{label:'Possible ΔS unit conversion',hint:'ΔH is in kJ. Divide ΔS in J/(mol·K) by 1,000 before using ΔG = ΔH − TΔS (or T = ΔH/ΔS).'},'gibbs-operation':{label:'Possible Gibbs subtraction error',hint:'Use ΔH − TΔS, not ΔH + TΔS. Keep the sign of ΔS.'},'temperature-kelvin':{label:'Possible Celsius / Kelvin error',hint:'Use T in Kelvin: °C + 273.15.'}};
  for(const c of candidates)if(!matches(String(c.value),q.answer)&&matches(input,{value:c.value,tol:.015}))return {code:c.code,...info[c.code]};return null;
 }
 window.PunstemChemAnswers={parse,matches,diagnose};
})();
