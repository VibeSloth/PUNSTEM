// Deterministic tests only: no model calls, live keys, or production data.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url));
const corpusPath=path.join(root,'db/tutor-corpus.json');
let privateCorpus=false;
try{const corpus=JSON.parse(fs.readFileSync(corpusPath,'utf8'));privateCorpus=Array.isArray(corpus.pages)&&corpus.pages.length>0;}catch{}
const privateTests=new Set(['test-tutor-sources.mjs','test-tutor-lookup.mjs']);
if(process.argv.includes('--require-private-corpus')&&!privateCorpus){
 console.error('Private-source tests require the authorized local db/tutor-corpus.json. It is intentionally excluded from the public repository.');
 process.exit(1);
}

const cases=[
 ...fs.readdirSync(path.join(root,'scripts')).filter(f=>/^test-.*\.mjs$/.test(f)).map(f=>({file:'scripts/'+f,private:privateTests.has(f)})),
 ...fs.readdirSync(path.join(root,'tests')).filter(f=>f.endsWith('.test.mjs')).map(f=>({file:'tests/'+f,private:false})),
].sort((a,b)=>a.file.localeCompare(b.file));
let passed=0,failed=0,skipped=0;
for(const test of cases){
 if(test.private&&!privateCorpus){console.log(`SKIP ${test.file}: private source corpus unavailable (not verified).`);skipped++;continue;}
 console.log(`\nRUN ${test.file}`);
 const result=spawnSync(process.execPath,[test.file],{cwd:root,stdio:'inherit',env:process.env,timeout:120000});
 if(result.error||result.status!==0){failed++;console.error(`FAIL ${test.file}${result.error?': '+result.error.message:''}`);}else passed++;
}
console.log(`\nTests: ${passed} passed, ${failed} failed, ${skipped} skipped.`);
if(skipped)console.log('Skipped private-source checks are not a full source-retrieval verification.');
if(!cases.length||failed)process.exitCode=1;
