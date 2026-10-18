/* Verified against printed packet pp.4.1, 4.3, 4.4 (PDF pp.70,72,73).
   Drawing prompts are explicitly labelled recognition adaptations. No other
   Unit 4 pages are included in this practice pool. */
(()=>{
 const bank=window.PunstemSources.chem,coverage=[];
 const pageMap={'4.1':70,'4.3':72,'4.4':73},topics={'4.1':'4.1 · Waves & light','4.3':'4.3 · Orbitals & filling','4.4':'4.4 · Electron configurations'};
 function add(page,item,q,answer,wrong,method,mode='recognition',data=''){
  const id='c-u4-'+page.replace('.','')+'-'+coverage.length,source=`AP Chemistry packet · ${page} (PDF p.${pageMap[page]}) · ${item}`+(mode==='recognition'?' · recognition adaptation':mode==='concept'?' · notes concept check':'');
  const obj={id,kind:'u'+page.replace('.',''),section:page,topic:topics[page],q,data,answer:typeof answer==='number'?{type:'number',value:answer,unit:'m',tol:.015,display:answer.toPrecision(3)+' m'}:{type:'text',display:answer,accepted:[answer]},method,source,sourceRef:{pdfPage:pageMap[page],printedPage:page,item},sourceMode:mode,errorPatterns:wrong?Object.fromEntries(wrong.map(value=>[value,page==='4.1'?'wave-relation':page==='4.3'?'orbital-filling':'electron-count'])):{}};
  if(wrong)obj.options=[...new Set([answer,...wrong])];else obj.speedSteps=[{id:'formula',label:'λ = c / ν',requires:[]},{id:'units',label:'Use meters and seconds',requires:['formula']}];bank.push(obj);coverage.push({id,page,item,mode});return obj;
 }
 add('4.1','#1a','Which wave has a long wavelength and low frequency?','Widely spaced crests',['Closely spaced crests','Spacing does not matter'],'Long wavelength means widely spaced crests. At fixed c, frequency is lower.');
 add('4.1','#1b','Which wave has a short wavelength and high frequency?','Closely spaced crests',['Widely spaced crests','A taller wave only'],'Short wavelength means closely spaced crests, so more cycles pass each second.');
 add('4.1','#2','Which has greater energy, red light or UV light?','UV light',['Red light','Equal energy'],'UV has higher frequency; photon energy increases with frequency.','exercise');
 add('4.1','#3','What is the wavelength of light with frequency 6.35 × 10¹⁰ Hz?',2.998e8/6.35e10,null,'λ = c/ν = (2.998 × 10⁸)/(6.35 × 10¹⁰) = 4.72 × 10⁻³ m.','exercise','c = 2.998 × 10⁸ m/s. Answer in meters; scientific notation such as 4.72e-3 works.');
 for(const [item,q,a,w,m]of [
  ['Wavelength','What is wavelength?','Distance between successive crests','Number of cycles per second','Wavelength measures distance, in meters.'],
  ['Frequency','What does frequency measure?','Cycles per second','Height of a wave','Frequency is measured in Hz (s⁻¹).'],
  ['Amplitude','What is amplitude?','Maximum displacement from the midline','Distance between crests','Amplitude measures height from the midline, not wavelength.'],
  ['Speed','All EM radiation in vacuum travels at what speed?','2.998 × 10⁸ m/s','It depends on the frequency','In vacuum, all EM waves travel at c.'],
  ['Relationship','If wavelength increases, frequency…','Decreases','Increases','c = λν is constant in vacuum.'],
  ['Spectrum','Which has the shorter wavelength?','Gamma rays','Radio waves','The printed spectrum places gamma rays at the shortest wavelengths.']
 ])add('4.1',item,q,a,[w],m,'concept');
 for(const [sub,orbitals,electrons]of [['s',1,2],['p',3,6],['d',5,10],['f',7,14]]){
  add('4.3',sub+' sublevel orbitals',`How many orbitals are in an ${sub} sublevel?`,String(orbitals),[String(orbitals+1),String(orbitals*2)],`The ${sub} sublevel contains ${orbitals} orbital${orbitals===1?'':'s'}.`,'concept');
  add('4.3',sub+' capacity',`What is the maximum number of electrons in an ${sub} sublevel?`,String(electrons),[String(orbitals),String(electrons+2)],`${orbitals} orbital${orbitals===1?'':'s'} × 2 electrons = ${electrons}.`,'concept');
 }
 for(let n=1;n<=4;n++){
  add('4.3','n='+n+' orbitals',`How many orbitals are in energy level n = ${n}?`,String(n*n),[String(n*n+1),String(2*n*n)],`Total orbitals = n² = ${n*n}.`,'concept');
  add('4.3','n='+n+' capacity',`How many electrons can energy level n = ${n} hold?`,String(2*n*n),[String(n*n),String(2*n*n+2)],`Maximum electrons = 2n² = ${2*n*n}.`,'concept');
 }
 add('4.3','Aufbau','Which orbitals fill first in the ground state?','Lower-energy orbitals',['Higher-energy orbitals','All at once'],'Aufbau means building up from the lowest available orbital energy.','concept');
 add('4.3','Hund','How do electrons fill equal-energy orbitals?','Singly with parallel spins before pairing',['Pair in the first orbital immediately','Two same-spin electrons in one orbital'],'Hund’s rule maximizes unpaired electrons in equal-energy orbitals.','concept');
 add('4.3','Bohr model','An electron dropping to a lower energy level…','Emits a photon',['Absorbs a photon','Has no energy change'],'The energy gap is released as light.','concept');
 add('4.3','Quantum model','In the quantum model electrons occupy…','Orbitals',['Only fixed circular paths','The nucleus'],'Orbitals describe electron probability distributions; Bohr’s circular model does not generalize.','concept');
 const rows=[
  ['#6a','F','1s² 2s² 2p⁵','[He] 2s² 2p⁵','2p: [↑↓] [↑↓] [↑]',1],
  ['#6b','Si','1s² 2s² 2p⁶ 3s² 3p²','[Ne] 3s² 3p²','3p: [↑] [↑] [ ]',2],
  ['#6c','Ar','1s² 2s² 2p⁶ 3s² 3p⁶','[Ne] 3s² 3p⁶','3p: [↑↓] [↑↓] [↑↓]',0],
  ['#6d','V','[Ar] 4s² 3d³','[Ar] 3d³ 4s²','3d: [↑] [↑] [↑] [ ] [ ]',3],
  ['#6e','Mg²⁺','1s² 2s² 2p⁶','[Ne]','2p: [↑↓] [↑↓] [↑↓]',0],
  ['#6f','P³⁻','1s² 2s² 2p⁶ 3s² 3p⁶','[Ar]','3p: [↑↓] [↑↓] [↑↓]',0]
 ];
 for(const [item,atom,config,short,diagram,unpaired]of rows){
  add('4.4',item+' configuration',`Choose the ground-state electron configuration of ${atom}.`,short,[atom==='Mg²⁺'?'[Ne] 3s²':'[Ne] 3s¹',atom==='P³⁻'?'[Ne] 3s² 3p³':'[He] 2s¹'],`${atom}: ${config}. ${short} is an equivalent noble-gas configuration. Add electrons for negative ions; subtract for positive ions.`,'recognition');
  add('4.4',item+' orbital diagram',`Choose the outer partially filled or last occupied sublevel diagram for ${atom}.`,diagram,[diagram.replaceAll('↑↓','↑↑').replace('[↑] [↑]','[↑↓] [ ]'),'Every orbital is empty'],`Fill lower energies first. Each orbital holds two opposite spins; degenerate orbitals fill singly before pairing. ${diagram}.`);
  add('4.4',item+' unpaired electrons',`How many unpaired electrons does ground-state ${atom} have?`,String(unpaired),[String(unpaired+1),String(unpaired+2)],`${config}. Apply Hund’s rule: ${unpaired} unpaired electron${unpaired===1?'':'s'}.`);
 }
 add('4.4','#7a valence','How many valence electrons does P have?','5',['3','15'],'P: [Ne] 3s² 3p³. Five electrons occupy its outermost shell.');
 add('4.4','#7a core','How many core electrons does P have?','10',['5','15'],'P has 15 electrons: 10 core ([Ne]) and 5 valence.');
 add('4.4','#7b outer shell','Using the outermost-shell convention, how many valence electrons does Ni have?','2',['8','28'],'Ni: [Ar] 3d⁸ 4s². The highest n is 4: two outermost-shell electrons. Transition-metal bonding can also involve 3d electrons.');
 add('4.4','#7b inner electrons','Using the outermost-shell convention, how many inner electrons does Ni have?','26',['18','28'],'Ni has 28 electrons: 26 below n = 4, plus two 4s electrons. If counting 3d as valence in bonding, use 18 core and 10 valence instead.');
 add('4.4','#8a','What is the ground-state electron configuration of Cr?','[Ar] 3d⁵ 4s¹',['[Ar] 3d⁴ 4s²','[Ar] 3d⁶'],'Cr is an Aufbau-order exception: a half-filled 3d sublevel gives [Ar] 3d⁵ 4s¹.','recognition');
 add('4.4','#8b','What is the ground-state electron configuration of Cu?','[Ar] 3d¹⁰ 4s¹',['[Ar] 3d⁹ 4s²','[Ar] 3d¹¹'],'Cu is an exception: its ground state has a filled 3d sublevel and one 4s electron.','recognition');
 window.PunstemChemUnit4={coverage,topics};
})();
