import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';import assert from 'node:assert/strict';
const corpus=JSON.parse(fs.readFileSync('db/tutor-corpus.json','utf8'));const bank=JSON.parse(fs.readFileSync('db/tutor-bank.json','utf8')),exports={},ctx=vm.createContext({exports,require:n=>n.includes('corpus')?corpus:bank});
vm.runInContext(ts.transpileModule(fs.readFileSync('db/tutor-lookup.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,ctx);
const a=exports.lookupProblem('Chemistry PDF p. 50, Station 2 #1 — why did I get 219.45?');assert(a.problem);assert.equal(a.problem.id,'c-s2-1');assert.equal(a.problem.sourceRef.pdfPage,50);
const b=exports.lookupProblem('Chemistry page 2.1 problem #1');assert(b.clarification);assert(!b.problem);
assert.equal(exports.lookupProblem('Explain Hess law'),null);
const c=exports.lookupProblem('Math textbook section 2.2 problem #33');assert(c.problem||c.clarification);if(c.problem)assert(c.problem.source.includes('§2.2'));
const unit4=exports.lookupProblem('Chemistry page 4.4 problem #6a configuration');assert(unit4.problem);assert.equal(unit4.problem.sourceRef.printedPage,'4.4');assert(unit4.problem.sourceRef.item.includes('#6a configuration'));
console.log('Source lookup passed: exact Chemistry PDF reference, safe ambiguity/missing-reference clarification, textbook section and no guessed exercise.');
