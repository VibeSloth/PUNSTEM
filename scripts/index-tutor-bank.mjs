import fs from 'node:fs';
import vm from 'node:vm';
const memory=new Map(),context=vm.createContext({window:{},console,localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)}});
for(const file of ['hard-functions','source-questions','chem-unit3','chem-unit4','more-source-questions','source-expansion','piecewise-graphs'])vm.runInContext(fs.readFileSync(`public/${file}.js`,'utf8'),context);
const bank=[...context.window.PunstemSources.math,...context.window.PunstemSources.chem].map(q=>({id:q.id,kind:q.kind||q.topic||q.type,section:q.section||'chemistry',question:q.q||q.equation,prompt:q.prompt,data:q.data,source:q.source,sourceRef:q.sourceRef,answer:q.answer||q.fields?.map(f=>({label:f.label,answer:f.answer})),explanation:q.method||q.explain,visual:q.visual||q.pieces,table:q.table}));
fs.writeFileSync('db/tutor-bank.json',JSON.stringify(bank));
console.log('Private verified question context:',bank.length,'records');
