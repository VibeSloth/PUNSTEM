import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const target=fileURLToPath(new URL('../db/tutor-corpus.json',import.meta.url));
if(!fs.existsSync(target)){
 fs.copyFileSync(new URL('../db/tutor-corpus.example.json',import.meta.url),target);
 console.log('Created an empty private-source index. Textbook page retrieval needs authorized local source materials; the public exercise bank remains available.');
}
