import bank from './tutor-bank.json';
import corpus from './tutor-corpus.json';

// Resolve source references locally before using Gemini. Ambiguous references never burn quota.
export function lookupProblem(text:string){
 const page=text.match(/(?:page|pg\.?|p\.)\s*(\d+(?:\.\d+)?)/i)?.[1];
 const section=text.match(/(?:section|sec\.?|§)\s*(2\.[12678])/i)?.[1];
 const number=text.match(/(?:problem|question|example|exercise|ex\.?|#)\s*#?\s*(\d+[a-z]?)/i)?.[1];
 if(!(page||section)||!number)return null;
 const chemistry=/chem|hess|enthalpy|entropy|gibbs/i.test(text),notes=/notes/i.test(text),review=/review/i.test(text),pdf=/pdf/i.test(text);
 const scope=bank.filter(q=>chemistry?Boolean(q.sourceRef):!q.sourceRef);
 const candidates=scope.filter(q=>{
  const source=q.source||'';
  const item=q.sourceRef?.item||source;
  const numbered=new RegExp('(?:#|\\bEx(?:ample)?\\.?\\s*)'+number+'(?!\\d)','i').test(item);
  if(!numbered)return false;
  if(section)return source.includes('§'+section);
  if(chemistry){if(pdf)return q.sourceRef?.pdfPage===Number(page);const label=(q.sourceRef?.printedPage||'').toLowerCase();if(review&&!label.includes('review'))return false;return label===page||label.endsWith('.'+page)||q.sourceRef?.pdfPage===Number(page);}
  if(notes)return /class notes/i.test(source)&&new RegExp('p\\.?\\s*'+page+'(?!\\d)').test(source);
  return new RegExp('(?:p\\.?|PDF p\\.)\\s*'+page+'(?!\\d)').test(source);
 });
 if(candidates.length===1)return {problem:candidates[0],clarification:null};
 if(candidates.length>1){const format=/orbital diagram/i.test(text)?'orbital diagram':/unpaired/i.test(text)?'unpaired electrons':/configuration/i.test(text)?'configuration':'';const narrowed=format?candidates.filter(q=>q.sourceRef?.item.includes(format)):[];if(narrowed.length===1)return {problem:narrowed[0],clarification:null};}
 if(candidates.length>1)return {problem:null,clarification:'Which one do you mean? '+candidates.slice(0,3).map(q=>q.source).join('; ')+'. Include the station or example label.'};
 if(chemistry&&pdf&&Number.isInteger(Number(page))&&corpus.pages.some(p=>p.source.startsWith('chem-')&&p.pdfPage===Number(page)))return {problem:null,clarification:null,sourcePage:Number(page)};
 const covered=chemistry?'the AP Chemistry packet':'the math textbook or Chapter 2 notes';
 return {problem:null,clarification:'I couldn’t identify that exact problem in '+covered+'. Include the source, printed page or section, and problem number—or paste the problem. Use PDF page numbers for chemistry units outside the Unit 3 exercise bank.'};
}
