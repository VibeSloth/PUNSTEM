import corpus from './tutor-corpus.json';
import bank from './tutor-bank.json';

const stop=new Set('the a an and or of to in is are for on with as at by be it this that from if find use what how when then can does has have not you your'.split(' '));
const aliases:Record<string,string[]>={hess:['hess','enthalpy','reaction'],gibbs:['gibbs','entropy','spontaneous','free'],inverse:['inverse','one','functions'],piecewise:['piecewise','defined','functions'],calorimetry:['calorimetry','specific','heat'],hvap:['vaporization','heat'],mcat:['specific','heat','temperature']};
type Page={source:string;title:string;pdfPage:number;text:string};
const pages=corpus.pages as Page[],postings=corpus.postings as Record<string,number[][]>;

// Private offline index: no Google embeddings, uploads, background requests, or public PDFs.
export function tutorSources(context:Record<string,string>){
 const original=bank.find(q=>(context.questionId&&q.id===context.questionId)||q.question===context.question);
 const query=[context.question,context.prompt,context.data,context.source,context.part].filter(Boolean).join(' ').toLowerCase();
 const words=new Set(query.match(/[a-z0-9]{2,}/g)||[]);
 for(const word of [...words])for(const expanded of aliases[word]||[])words.add(expanded);
 const chemistry=context.subject?context.subject==='chemistry':/chem|enthalpy|entropy|hess|gibbs|calorim|thermo|vapor|specific heat|stoich|moles|atoms|electron|orbital|wavelength|titration|acid|redox|oxidation|equilibrium|\bph\b|δh|δg|δs/.test(query);
 const pageByPart:Record<string,number>={'4.1':70,'4.3':72,'4.4':73};
 const requestedPage=Number(context.sourcePage)||pageByPart[context.part]||0;
 const bookRanges:Record<string,number[]>={'2.1':[215,225],'2.2':[226,237],'2.6':[265,277],'2.7':[278,285],'2.8':[286,296]},noteRanges:Record<string,number[]>={'2.1':[5,7],'2.2':[2,8],'2.6':[10,23],'2.7':[26,32],'2.8':[33,42]};
 const allowed=(p:Page)=>{const range=(p.source==='textbook'?bookRanges:noteRanges)[context.part];return (chemistry?p.source.startsWith('chem-'):!p.source.startsWith('chem-'))&&(!context.material||context.material==='chem-packet'&&p.source.startsWith('chem-')||p.source===context.material)&&(!requestedPage||p.pdfPage===requestedPage)&&(!(chemistry&&context.part==='3')||p.pdfPage>=48&&p.pdfPage<=69)&&(chemistry||!range||p.pdfPage>=range[0]&&p.pdfPage<=range[1]);};
 const verified=original&&(chemistry?!!original.sourceRef:!original.sourceRef)&&(!context.part||(chemistry?context.part==='3'?original.sourceRef?.printedPage.startsWith('3.')||original.sourceRef?.pdfPage>=48&&original.sourceRef.pdfPage<=69:original.sourceRef?.printedPage===context.part:original.section===context.part))&&(!context.material||context.material==='chem-packet'&&!!original.sourceRef||context.material==='math-notes'&&/class notes/i.test(original.source)||context.material==='textbook'&&!original.sourceRef&&!/class notes/i.test(original.source))?original:null;
 const scores=new Map<number,number>();
 for(const word of words){if(stop.has(word))continue;const hits=postings[word];if(!hits)continue;const weight=Math.log(1+pages.length/hits.length);for(const [i,count]of hits){if(!allowed(pages[i]))continue;scores.set(i,(scores.get(i)||0)+weight*(1+Math.log(count)));}}
 const exactPage=requestedPage||original?.sourceRef?.pdfPage||Number((original?.source||context.source||'').match(/(?:Class notes.*?|PDF)\s*p\.?\s*(\d+)/i)?.[1]||0);
 const exactSource=chemistry?'chem-unit3':/class notes/i.test(original?.source||context.source||'')?'math-notes':'textbook';
 if(exactPage)pages.forEach((p,i)=>{if(allowed(p)&&(chemistry?p.source.startsWith('chem-'):p.source===(context.material||exactSource))&&p.pdfPage===exactPage)scores.set(i,(scores.get(i)||0)+100)});
 // Punstem's current math class is Chapter 2; generic "inverse" should not land in inverse trig.
 const trig=/trigon|sine|cosine|tangent|arcsin|arccos|arctan/.test(query);
 for(const [i,score]of scores){const p=pages[i];if(chemistry&&p.source==='chem-unit3'&&/hess|enthalpy|entropy|gibbs|calorim|thermo/.test(query))scores.set(i,score*1.5);if(!chemistry&&!trig){if(p.source==='math-notes')scores.set(i,score*1.25);else if(p.pdfPage>=214&&p.pdfPage<=303)scores.set(i,score*1.8);}}
 const ranked=[...scores].sort((a,b)=>b[1]-a[1]);
 const selected:Page[]=[],seen=new Set<string>();let budget=11000;
 for(const [i,score]of ranked){if(score<2||selected.length===4)break;const page=pages[i],key=page.source+':'+page.pdfPage;if(seen.has(key))continue;seen.add(key);const text=page.text.slice(0,Math.min(3400,budget));if(text.length<200)break;selected.push({...page,text});budget-=text.length;}
 return {version:corpus.version,verifiedOriginalProblem:verified,passages:selected,references:[...(verified?.source?[verified.source]:[]),...selected.map(p=>`${p.title} · PDF p. ${p.pdfPage}`)].slice(0,2),limitations:'Text extraction only. Some textbook formulas have PDF font encoding artifacts; use verified problem data and independently check calculations. Diagrams, graphs, handwritten work and image-only pages may be absent; do not guess their contents. PDF page numbers include front matter and may differ from printed page numbers.'};
}
