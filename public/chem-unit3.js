/* Page-by-page audit of AP Chemistry Packets Fall 2026, Section 3 ONLY.
 * PDF pp.48–69; printed Review.1–11 and 3.1–11. Questions are source
 * exercises or clearly labelled recognition adaptations, not generated numbers.
 * Drawing tasks and measured-data labs retain their original task in the audit.
 */
(()=>{
 const bank=window.PunstemSources.chem, pages=Array.from({length:22},(_,i)=>({pdf:i+48,printed:i<11?'Unit 3 Review.'+(i+1):'3.'+(i-10),items:[]}));
 const names={basics:'Heat & energy',specific:'Specific heat',phase:'Phase changes',combined:'Heating curves',hess:'Hess’s law',stoich:'Thermochemical stoich',bde:'Bond energies',cal:'Calorimetry',formation:'Heats of formation',entropy:'Entropy',gibbs:'Gibbs free energy'};
 const src=(p,label)=>`AP Chemistry packet · ${pages[p-48].printed} (PDF p.${p}) · ${label}`;
 function cover(q,p,label,original,mode='exercise',note=''){
  q.source=src(p,label)+(mode==='recognition'?' · recognition adaptation':mode==='concept'?' · notes concept check':'');q.sourceRef={pdfPage:p,printedPage:pages[p-48].printed,item:label};
  q.originalPrompt=original||q.q;q.sourceMode=mode;
  pages[p-48].items.push({label,original:q.originalPrompt,questionId:q.id,mode,note});return q;
 }
 function old(id,p,label,note=''){const q=bank.find(q=>q.id===id);if(!q)throw Error(id);return cover(q,p,label,q.q,'exercise',note);}
 let seq=0;
 function mc(p,label,kind,prompt,correct,wrong,why,data='',mode='exercise',original=prompt,note=''){
  const q={id:'c-u3-'+p+'-'+(++seq),kind,topic:names[kind],q:prompt,data,options:[correct,...wrong],answer:{type:'text',display:correct,accepted:[correct]},method:why};bank.push(cover(q,p,label,original,mode,note));return q;
 }
 function num(p,label,kind,prompt,data,value,unit,why){const q={id:'c-u3-'+p+'-'+(++seq),kind,topic:names[kind],q:prompt,data,answer:{type:'number',value,unit,tol:.015,display:Number(value.toFixed(5))+' '+unit},method:why};bank.push(cover(q,p,label,prompt));return q;}
 const concept=(p,label,kind,prompt,correct,wrong,why,data='')=>mc(p,label,kind,prompt,correct,wrong,why,data,'concept');
 // Review Station 1: these are notes definitions, not fictitious numbered exercises.
 concept(48,'Vocabulary: temperature','basics','What does temperature measure?','Average translational kinetic energy',['Total heat','Potential energy only'],'Temperature reflects average particle motion, not the total thermal energy.');
 concept(48,'Vocabulary: temperature units','basics','Which units measure temperature?','K or °C',['J or kJ','J/mol'],'Temperature uses kelvin or Celsius; heat uses energy units.');
 concept(48,'Vocabulary: heat','basics','What is heat?','Energy transferred by temperature difference',['Energy stored as temperature','Mass transferred'],'Heat is thermal energy in transit from hot to cold.');
 concept(48,'Vocabulary: heat units','basics','Which units measure heat?','J or kJ',['K or °C','g/mol'],'Heat is an energy transfer, measured in joules.');
 concept(48,'Vocabulary: calorie conversion','basics','Which conversion is given for 1 cal?','4.18 J',['4.18 kJ','4180 J'],'A small calorie is 4.18 J; a food Calorie is 4180 J.');
 concept(48,'Vocabulary: food Calorie','basics','Which conversion is given for 1 Cal?','4180 J',['4.18 J','4180 kJ'],'Capital-C Cal is a kilocalorie, 1000 small calories.');
 concept(48,'Vocabulary: energy/work','basics','Lifting or compressing something requires what?','Energy transfer to do work',['No energy transfer','A phase change'],'Work transfers energy, for example lifting a weight or compressing a gas.');
 concept(48,'Vocabulary: endothermic','basics','An endothermic system does what?','Absorbs heat',['Releases heat','Has no heat transfer'],'Heat enters the system, so ΔH is positive.');
 concept(48,'Vocabulary: exothermic','basics','An exothermic system does what?','Releases heat',['Absorbs heat','Has no heat transfer'],'Heat leaves the system, so ΔH is negative.');
 concept(48,'Heat transfer direction','basics','Heat transfers spontaneously in which direction?','Hot → cold',['Cold → hot','Both with no net direction'],'Energy flows from the hotter body to the colder body.');
 concept(48,'Heat transfer mechanisms','basics','Which heat-transfer mechanisms are listed?','Conduction and IR radiation',['Only particle flow','Only nuclear decay'],'Direct conduction or infrared radiation can transfer heat.');
 concept(48,'Enthalpy definition','basics','What does ΔH represent here?','Heat of reaction',['Temperature of reaction','Reaction rate'],'ΔH is the reaction enthalpy change.');
 for(const [endo,sign,pe,side]of [[true,'Positive','Products higher','Reactant'],[false,'Negative','Reactants higher','Product']]){
  const word=endo?'Endothermic':'Exothermic';
  concept(48,word+': ΔH sign','basics',word+': what is the sign of ΔH?',sign,[endo?'Negative':'Positive','Always zero'],endo?'Absorbed heat gives ΔH > 0.':'Released heat gives ΔH < 0.');
  concept(48,word+': potential energy','basics',word+': which side has higher potential energy?',pe,[endo?'Reactants higher':'Products higher','Equal energies'],'The enthalpy difference is products minus reactants.');
  concept(48,word+': heat in equation','basics',word+': where does heat appear?',side,[endo?'Product':'Reactant','Neither side'],'Absorbed heat is a reactant; released heat is a product.');
 }
 // Heating curve drawing/labels are assessed as diagram/label recognition.
 mc(49,'Heating curve: sketch','combined','Which sequence is a heating curve?','Rise, flat, rise, flat, rise',['Flat, fall, flat, fall','Rise with no plateaus'],'Temperature rises within a phase and stays constant during melting and boiling.','','recognition','Sketch a heating curve below.');
 mc(49,'Heating curve: axes','combined','Label the heating-curve axes.','x: heat added; y: temperature',['x: temperature; y: mass','x: time; y: heat only'],'The diagram plots temperature against heat supplied.','','recognition','Label the axes.');
 mc(49,'Heating curve: phases','combined','Label the rising parts, left to right.','Solid → liquid → gas',['Gas → liquid → solid','Solid → gas → liquid'],'Solid warms, then liquid warms, then gas warms.','','recognition','Label phases on the heating curve.');
 mc(49,'Heating curve: phase changes','combined','Label the two plateaus, left to right.','Melting → boiling',['Freezing → condensation','Boiling → melting'],'Added energy breaks intermolecular attractions without changing temperature.','','recognition','Label phase changes.');
 mc(49,'Heating curve: KE/PE on slopes','combined','On the rising parts, what changes?','KE rises; PE roughly constant',['PE rises; KE constant','Both constant'],'Average kinetic energy tracks temperature.','','recognition','Label where kinetic energy and potential energy change or stay constant.');
 mc(49,'Heating curve: KE/PE on plateaus','combined','On a phase-change plateau, what changes?','PE rises; KE constant',['KE rises; PE constant','Both constant'],'Temperature is constant; energy changes intermolecular potential energy.','','recognition','Label where kinetic energy and potential energy change or stay constant.');
 mc(49,'Heat equations: temperature change','specific','Which equation gives heat for a temperature change?','q = mcΔT',['q = nΔHvap','q = ΔG'],'Use mass, specific heat, and final minus initial temperature.');
 mc(49,'Heat equations: phase change','phase','Which equation gives heat for a phase change?','q = nΔHphase',['q = mcΔT','q = mΔHphase (g)'],'Multiply moles by molar latent heat.');
 for(const [symbol,correct,wrong]of [['ΔHrxn','Per balanced reaction',['Per gram','Per degree']],['ΔHcomb','Per mole burned in O₂',['Per mole water made','Per gram melted']],['ΔHvap','Per mole vaporized',['Per mole frozen','Per degree warmed']],['ΔHfus','Per mole melted',['Per mole boiled','Per degree warmed']],['ΔHneut','Per mole water formed',['Per mole acid regardless','Per gram solution']],['ΔHsoln','Per mole solute dissolved',['Per mole solvent','Per degree cooled']],['ΔHf','One mole compound from elements',['One gram compound','Any amount from ions']]])concept(49,'Standard enthalpy: '+symbol,'formation',symbol+': which basis is used?',correct,wrong,'A molar enthalpy must match its defined process and amount.');
 concept(49,'Standard conditions','formation','Which standard conditions are stated in these notes?','25°C and 1 atm',['0°C and 1 atm','100°C and 1 atm'],'The packet specifies 25°C and 1 atm, not STP.');
 for(const n of [1,2,3,4])old('c-s2-'+n,50,'Station 2 #'+n,n===4?'The prompt says released but water warms; the calculated heat absorbed is positive.':'');
 concept(50,'Specific heat definition','specific','Specific heat is energy needed to raise what?','1 g by 1°C',['1 mol by 1°C','1 g through a phase change'],'Specific heat is per gram per degree.');
 concept(50,'Water specific heat','specific','What specific heat is given for water?','4.18 J/(g·°C)',['0.129 J/(g·°C)','40.7 kJ/mol'],'Use 4.18 with mass in grams and temperature change in °C.');
 mc(50,'Station 2 #2 comparison','specific','Compare the heat for lead in #2 to water in #1.','Lead needs much less heat',['Lead needs more heat','They need equal heat'],'At equal mass and ΔT, q is proportional to c: 0.129 versus 4.18.');
 for(const n of [5,6,7,8])old('c-s2-'+n,51,'Station 2 #'+n,n===8?'Signed system heat is negative; heat released is its positive magnitude.':'');
 for(const [n,ans,wrong,why]of [[7,'Warm liquid → vaporize',['Melt → warm liquid','Vaporize → warm solid'],'First warm 25→100°C; then boil at constant temperature.'],[8,'Condense → cool → freeze',['Cool gas → melt','Freeze → cool → condense'],'Steam starts at its condensation temperature; liquid then cools to 0°C and freezes.']])mc(51,'Station 2 #'+n+' heating-curve sketch','combined','Which heating-curve segments apply to #'+n+'?',ans,wrong,why,'','recognition','Sketch a heating curve first, to show what is happening for #'+n+'.');
 concept(51,'Phase changes: temperature and energy','phase','During a phase change, what stays constant?','Temperature and average KE',['Potential energy','All energy'],'Heat changes potential energy while temperature and average kinetic energy remain constant.');
 concept(52,'Hess toolbox: reverse','hess','Reverse an equation: what happens to ΔH?','Flip its sign',['Keep its sign','Multiply by two'],'The reverse process transfers the same amount of heat in the opposite direction.');
 concept(52,'Hess toolbox: scale','hess','Multiply an equation by 3: what happens to ΔH?','Multiply ΔH by 3',['Divide ΔH by 3','Keep ΔH unchanged'],'Reaction enthalpy scales with the amount of reaction.');
 concept(52,'Hess toolbox: cancel','hess','When adding equations, which species cancel?','Same species on opposite sides',['Every repeated species','Only gaseous species'],'Cancel equal amounts only when a species appears as both reactant and product.');
 concept(52,'Hess toolbox: add','hess','How do you get the net reaction enthalpy?','Add the adjusted ΔH values',['Multiply all ΔH values','Ignore negative values'],'Reverse and scale first, then sum the enthalpies.');
 old('c-s3-1',52,'Station 3 #1');old('c-s3-2',52,'Station 3 #2');old('c-s3-3',53,'Station 3 #3');
 mc(53,'Al₂O₃ worked example: equation','formation','Choose the formation equation for Al₂O₃(s).','2Al(s) + 3/2O₂(g) → Al₂O₃(s)',['4Al + 3O₂ → 2Al₂O₃','Al₂ + O₃ → Al₂O₃'],'Formation makes exactly one mole of compound from elements in their standard states.','','recognition','Worked example: formation of Al₂O₃(s).');
 num(53,'Al₂O₃ worked example: ΔHf','formation','What ΔHf is given for Al₂O₃(s)?','2Al(s) + 3/2O₂(g) → Al₂O₃(s)',-1676,'kJ/mol','The worked example gives −1676 kJ for formation of one mole.');
 mc(53,'Formation example: KCl','formation','Choose the formation equation for KCl(s).','K(s) + 1/2Cl₂(g) → KCl(s)',['K(g) + Cl(g) → KCl(s)','2K + Cl₂ → 2KCl'],'Use standard-state K(s) and Cl₂(g), and form one mole.','','recognition','Write the standard enthalpy of formation equation for potassium chloride solid.');
 mc(53,'Formation example: Na₂S₂O₃','formation','Choose the formation equation for Na₂S₂O₃(s).','2Na(s) + 2S(s) + 3/2O₂(g) → Na₂S₂O₃(s)',['Na₂(g) + S₂(g) + O₃(g) → Na₂S₂O₃','2Na + 2S + 3O₂ → Na₂S₂O₃'],'Balance two Na, two S and three O atoms; make one mole of compound.','','recognition','Write the standard enthalpy of formation equation for solid sodium thiosulfate.','Packet notation S(s); equivalently use 1/4 S₈(s).');
 for(const n of [1,2,3])old('c-s4-'+n,54,'Station 4 #'+n);
 mc(54,'Bond-strength discussion','bde','For endothermic 2NH₃ → N₂ + 3H₂, which total is larger?','Energy to break reactant bonds',['Energy from forming product bonds','The two totals are equal'],'ΔH = broken − formed > 0. Compare the totals, not the strength of every individual bond.','','exercise','Do reactants or products have stronger bonds? Briefly discuss.');
 mc(55,'Lewis structures: all species','bde','Choose correct Lewis structures for NH₃, N₂ and H₂.','NH₃: 3 bonds + lone pair; N₂: triple; H₂: single',['NH₃: 4 bonds; N₂: double; H₂: single','NH₃: 3 bonds; N₂: single; H₂: double'],'NH₃ has one lone pair on N; N₂ has one lone pair on each N and a triple bond; H₂ has a single bond.','','recognition','Draw Lewis structures for ALL reactants and products: 2NH₃ → N₂ + 3H₂.');
 old('c-s4-b1',55,'Unnumbered BDE calculation 1');old('c-s4-b2',55,'Unnumbered BDE calculation 2','Given bond energies yield −90 kJ, not Gemini’s −84.');
 concept(56,'System: chemical example','cal','In Mg + 2HCl → MgCl₂ + H₂, what is the system?','The reacting chemicals',['The surrounding water','The room only'],'The system is the reaction of interest.');
 concept(56,'System: physical example','cal','When ice melts, what is the system?','The water changing phase',['The room air only','The thermometer'],'The system can be a physical change as well as a chemical reaction.');
 concept(56,'Surroundings','cal','What measures heat indirectly in these calorimeters?','Surrounding water',['Only the reactant mass','Only the vessel pressure'],'The surroundings change temperature as the system exchanges heat.');
 mc(56,'Calorimeter drawing: combustion','cal','In a combustion calorimeter, what heats the water?','Burning sample below the water',['Dissolved sample only','A temperature reading'],'Heat from burning transfers into surrounding water.','','recognition','Draw a picture for a typical combustion calorimetry experiment.');
 mc(56,'Calorimeter drawing: aqueous','cal','In an aqueous calorimeter, where is the reaction?','In solution inside the cup',['Outside the cup','Below an open flame'],'Reactants mixed inside an insulated cup transfer heat to the solution.','','recognition','Draw a picture for a typical aqueous solution calorimetry experiment.');
 mc(56,'Measurement in both experiments','cal','What are you measuring in BOTH experiments?','Surroundings’ temperature change',['Direct reaction enthalpy','Number of bonds'],'Measure ΔT, then calculate qsurroundings from mass and specific heat.');
 const outline=mc(56,'Calorimetry calculation outline','cal','Choose the route to molar ΔH.','mcΔT → −qsur → kJ/mol',['mcΔT → qsur/mol (same sign)','ΔT → ΔG → temperature'],'Calculate qsur, reverse its sign for qsys, convert J to kJ, and divide by reacted moles.','','recognition','Outline the steps for calculating ΔH in typical calorimetry experiments.');
 outline.speedSteps=[{id:'sur',label:'qsur = mcΔT',requires:[]},{id:'sys',label:'qsys = −qsur',requires:['sur']},{id:'molar',label:'qsys (kJ) ÷ moles',requires:['sys']}];
 old('c-s5',57,'Glucose lab: main task / #4');
 num(57,'Glucose lab #1','cal','Find the heat absorbed by the water.','200 g water: 23→34°C; c = 4.18 J/(g·°C)',200*4.18*11,'J','qsur = 200 × 4.18 × (34 − 23) = 9196 J.');
 num(57,'Glucose lab #2','cal','Find the heat change of the glucose system.','Water absorbs 9196 J.',-9196,'J','qsys = −qsur = −9196 J.');
 num(57,'Glucose lab #3','cal','Find the moles of glucose burned.','Mass: 2.45 g before; 1.25 g after; MM = 180 g/mol',1.2/180,'mol','Burned mass = 2.45 − 1.25 = 1.20 g; divide by 180.');
 mc(57,'Glucose lab #5','cal','What major experimental error affects calorimetry?','Heat exchange with surroundings',['Moles are always zero','Water has no heat capacity'],'Not all reaction heat reaches the measured water.');
 mc(57,'Glucose lab #6','cal','Extra unmeasured water was already in the can. What happens to calculated ΔHcomb?','Less negative (smaller magnitude)',['More negative (larger magnitude)','Exactly unchanged'],'The true water mass is larger. Using only 200 g underestimates absorbed heat, so ΔH is less negative.');
 // The blank lab has no measured temperatures. Never manufacture a numeric key.
 for(const [label,correct,wrong,why]of [['Mass NaHCO₃','10 g',['100 g','110 g'],'The procedure measures 10 g of solute.'],['Mass water','100 g',['10 g','110 g'],'The procedure measures 100 g of water.'],['Initial temperature','Measure before adding solute',['Assume 25°C','Measure after dissolving'],'The initial reading must be measured; it is blank in the packet.'],['Final temperature','Measure final peak temperature',['Assume 0°C','Use initial temperature'],'Measure the final peak after dissolving and stirring.'],['Qualitative observations','Record what actually happens',['Invent a color change','Replace with an assumed ΔT'],'Observations must come from the actual experiment.']])mc(58,'NaHCO₃ results: '+label,'cal','NaHCO₃ lab: '+label+'?',correct,wrong,why,'','recognition','Record '+label+' in the lab results.','Measured observations/readings are intentionally blank; recognition adaptation only.');
 mc(58,'NaHCO₃ lab #1','cal','Choose qsur for this lab.','110 × 4.18 × (Tf − Ti) J',['100 × 4.18 × (Ti − Tf) J','10 × 4.18 × (Tf − Ti) J'],'Use 10 + 100 = 110 g of solution. Actual Ti and Tf must be measured.','','recognition','Calculate heat of surroundings; solution specific heat 4.18 J/(g·°C).','No numeric ΔT supplied.');
 mc(58,'NaHCO₃ lab #2','cal','How do you get heat of the system?','qsys = −qsur',['qsys = qsur','qsys = 0'],'The system and surroundings exchange equal-and-opposite heat.','','recognition','Calculate the heat of the system.');
 num(58,'NaHCO₃ lab #3','cal','Find the moles of NaHCO₃ dissolved.','10 g NaHCO₃; MM = 84.01 g/mol',10/84.01,'mol','Divide solute mass by molar mass.');
 mc(58,'NaHCO₃ lab #4','cal','How do you calculate ΔHsoln?','−qsur / (1000 × n) kJ/mol',['qsur / n kJ/mol','−qsur × n kJ/mol'],'qsur is in J; reverse the sign and divide by 1000 and moles. Measured temperatures are still required.','','recognition','Determine ΔHsoln for this reaction.','No temperatures supplied; formula rather than fabricated numeric answer.');
 mc(58,'NaHCO₃ lab #5','cal','What is the major source of error in this lab?','Heat exchange with surroundings',['A perfectly insulated cup','The mole definition'],'The cup is not perfectly insulated; heat exchange changes the observed ΔT.');
 old('c-p1',59,'#1');old('c-p2a',59,'#2a');old('c-p2b',59,'#2b','Recomputed using 94.11 g/mol and printed heat: −28.7661 kJ/mol; printed rounded key inconsistent.');
 for(const [label,correct,other,why]of [['water / steam','Steam','Water','Gas has more accessible microstates than liquid.'],['CH₄ / C₄H₁₀','C₄H₁₀','CH₄','The larger molecule has more ways to store energy.'],['hot / cold copper','Hot copper','Cold copper','Higher temperature gives more accessible energy states.'],['2 mol / 1 mol water','2 mol water','1 mol water','Entropy is extensive: more substance has more total entropy.'],['copper / carbon dioxide','Carbon dioxide','Copper','At ordinary conditions CO₂ is a gas and copper is a solid.']])mc(60,'#3: '+label,'entropy','Which has greater entropy?',correct,[other],why,label);
 mc(60,'#4','entropy','Which is an example of a very low-entropy substance?','Diamond (solid)',['Steam','Hot CO₂ gas'],'A highly ordered solid has low entropy; a perfect crystal has zero entropy at 0 K.');
 for(const id of ['5a','5b','5c'])old('ent'+id,60,'#'+id);
 mc(60,'#5d','entropy','Predict ΔS for H₂ + Cl₂ → 2HCl.','Positive; entropy increases',['Negative; entropy decreases','Exactly zero'],'Given S° values: 2(187) − (131 + 223) = +20 J/K. Equal gas-mole counts alone do not determine the sign.','S°: H₂ 131; Cl₂ 223; HCl 187 J/(mol·K)');
 old('c-p6a',60,'#6a','Printed key −201 is inconsistent with 192, 131, 193; correct result −199.');old('c-p6b',60,'#6b');
 concept(60,'Entropy definition','entropy','Entropy describes what?','Energy dispersal / microstates',['Reaction speed','Heat only'],'More accessible arrangements correspond to greater entropy.');
 mc(61,'Spontaneous exothermic entropy-decrease example','gibbs','Which is spontaneous, exothermic, and decreases system entropy?','Water freezing below 0°C',['Ice melting above 0°C','Water boiling'],'Freezing releases heat and orders the water; surroundings entropy increases enough.','','recognition','Describe an everyday spontaneous process that is exothermic but decreases system entropy.');
 for(const [h,s,answer,wrong,why]of [['−','+','All temperatures',['Only low T','Never'],'Both enthalpy and entropy favor the process.'],['+','−','Never',['All temperatures','Only high T'],'Neither term favors negative ΔG.'],['−','−','Below ΔH/ΔS',['Above ΔH/ΔS','All temperatures'],'At low T the favorable enthalpy wins; at high T the entropy penalty wins.'],['+','+','Above ΔH/ΔS',['Below ΔH/ΔS','Never'],'At high T the favorable entropy term wins.']])mc(61,'Spontaneity table: ΔH '+h+', ΔS '+s,'gibbs','ΔH '+h+', ΔS '+s+': when is it spontaneous?',answer,wrong,why,'','recognition','Complete the ΔH / ΔS / spontaneous-at table.');
 concept(61,'Second law','entropy','For a spontaneous process, what is ΔSuniverse?','Positive',['Negative','Always zero'],'ΔSuniverse = ΔSsystem + ΔSsurroundings > 0.');
 concept(61,'Third law','entropy','A perfect crystal at 0 K has what entropy?','Zero',['Infinite','Always negative'],'The third law assigns zero entropy to a perfect crystal at absolute zero.');
 concept(61,'Surroundings entropy','entropy','Which expression gives ΔSsurroundings?','−ΔHsystem / T',['ΔHsystem × T','ΔHsystem / T'],'Heat released by the system increases surroundings entropy; use T in K.');
 concept(61,'Gibbs definition','gibbs','What does Gibbs free energy describe here?','Maximum useful work',['Total particle mass','Reaction speed'],'Gibbs free energy relates to useful non-expansion work at constant T and pressure.');
 for(const [sign,answer,wrong]of [['−','Spontaneous',['Nonspontaneous','Always equilibrium']],['+','Nonspontaneous',['Spontaneous','Always equilibrium']]])concept(61,'ΔG '+sign+' interpretation','gibbs','ΔG '+sign+': what does it mean?',answer,wrong,'Negative ΔG is thermodynamically favorable; positive ΔG is not.');
 for(const [symbol,answer,wrong,why]of [['ΔG','Negative',['Positive','Zero'],'Rust forms spontaneously under the stated conditions.'],['ΔS','Negative',['Positive','Zero'],'Gas reactants become solid product, reducing system entropy.'],['ΔH','Negative',['Positive','Zero'],'With negative ΔS, spontaneous rusting requires sufficiently favorable negative ΔH.']])mc(62,'#7: '+symbol,'gibbs','Rusting at room temperature: sign of '+symbol+'?',answer,wrong,why,'4Fe(s) + 6H₂O(l) + 3O₂(g) → 4Fe(OH)₃(s)');
 old('c-p8',62,'#8','Preserve printed ΔGf methanol +163; this gives −2030, not −1378.');old('c-p9',62,'#9').tags=['hess'];
 old('c-p10',63,'#10');
 mc(63,'#10: formation-equation hint','formation','Choose the formation equation for ethylene.','2C(s) + 2H₂(g) → C₂H₄(g)',['C₂(g) + 4H(g) → C₂H₄(g)','C₂H₆ → C₂H₄ + H₂'],'Make one mole of ethylene from standard-state elements.','','recognition','Hint: write the correct equation for formation of ethylene first.');
 mc(63,'#11','gibbs','What drives the rusting reaction in #7?','Enthalpy',['Entropy','Neither'],'ΔS is unfavorable; negative ΔH makes the process favorable.');
 for(const [label,ans,wrong,why]of [['ΔH','Negative',['Positive','Zero'],'More favorable at lower T with ΔS < 0 implies ΔH < 0.'],['ΔS','Negative',['Positive','Zero'],'Dissolving a gas in liquid reduces its freedom of motion.'],['Driving force','Enthalpy',['Entropy','Neither'],'Negative enthalpy outweighs the unfavorable entropy at lower temperature.']])mc(63,'#12: '+label,'gibbs','CO₂(g) → CO₂(aq): '+label+'?',ans,wrong,why,'The process becomes more spontaneous when temperature decreases.');
 old('c-p13',64,'#13: equilibrium temperature');mc(64,'#13: above/below','gibbs','ΔH = −25 kJ/mol; ΔS = −50 J/(mol·K). Spontaneous where?','Below 500 K',['Above 500 K','At all temperatures'],'ΔG = −25 + 0.050T; it is negative below 500 K.');
 mc(64,'#14a','phase','Write the ice-melting process.','H₂O(s) → H₂O(l)',['H₂O(l) → H₂O(s)','H₂O(l) → H₂O(g)'],'Melting changes solid ice into liquid water.','','recognition','Write the equation for ice melting.');
 mc(64,'#14b','gibbs','Ice melting: signs of ΔH and ΔS?','ΔH +, ΔS +',['ΔH −, ΔS −','ΔH −, ΔS +'],'Melting absorbs heat and increases disorder.');
 num(64,'#14c','gibbs','At what temperature is ice melting at equilibrium?','At normal pressure.',273.15,'K','The phase transition is at 0°C = 273.15 K; ΔG = 0.');
 mc(64,'#14d','gibbs','Ice melting is spontaneous where?','Above the melting temperature',['Below the melting temperature','At all temperatures'],'At higher T, the positive entropy contribution makes ΔG negative.');
 old('c-couple',64,'Coupling worked example').tags=['hess'];concept(64,'Equilibrium definition','gibbs','At equilibrium, what is ΔG?','Zero',['Positive','Negative'],'Forward and reverse directions have no net thermodynamic driving force.');
 for(const n of ['a','b','c'])old('c-p15'+n,65,'#15'+n);
 mc(65,'#15d','gibbs','N₂ + 3F₂ → 2NF₃: enthalpy or entropy driven?','Enthalpy',['Entropy','Neither'],'ΔH < 0 is favorable; ΔS < 0 is unfavorable.','ΔH = −264 kJ; ΔS = −278 J/K');
 for(const n of ['a','b','c','e'])old('c-p16'+n,66,'#16'+n);
 mc(66,'#16d','gibbs','2A + B → 2C at 25°C: which term drives it?','Entropy',['Enthalpy','Neither'],'ΔH = +30 kJ is unfavorable, but TΔS is large enough to make ΔG negative.','ΔS = +290 J/K');
 mc(66,'#16f','gibbs','Below the equilibrium temperature, is #16 spontaneous?','Nonspontaneous',['Spontaneous','Always equilibrium'],'For positive ΔH and ΔS, low T does not provide enough favorable entropy.');
 mc(67,'HW #1a','basics','KBr dissolves and the solution gets colder. Endo or exo?','Endothermic',['Exothermic','Neither'],'The dissolving system absorbs heat from the solution.');
 mc(67,'HW #1b','basics','CH₄ burns in a furnace. Endo or exo?','Exothermic',['Endothermic','Neither'],'Combustion releases heat to the surroundings.');
 for(const id of ['2a','2b','3','4','5'])old('c-hw'+id,67,'HW #'+id);
 old('c-hw6',68,'HW #6','AgCl precipitation, not neutralization.');old('c-hw7',68,'HW #7');old('c-hw8',68,'HW #8');
 old('c-hw9',69,'HW #9');for(const id of ['10a','10b'])old('ent'+id,69,'HW #'+id);
 for(const [part,correct,other,why]of [['a','Graphite','Diamond','Graphite has greater standard molar entropy than diamond.'],['b','C₂H₅OH(g)','C₂H₅OH(l)','The gas has more accessible microstates than the liquid.'],['c','CO₂(g)','CO₂(s)','The gas has more accessible microstates than the solid.']])mc(69,'HW #11'+part,'entropy','Which substance has greater S°?',correct,[other],why,correct+' or '+other);
 old('c-hw12',69,'HW #12');
 // Actual equation manipulations, instead of the same generic four-step route.
 const routes={
  'c-s3-1':['Add equations 1 + 2','Add ΔH₁ + ΔH₂'],
  'c-s3-2':['Reverse equation 1','2 × equation 2','Reverse and 3 × equation 3','Add equations and ΔH'],
  'c-s3-3':['Keep equation 1','2 × equation 2','Reverse equation 3','Add equations and ΔH'],
  'c-hw7':['Reverse and 4 × equation 1','Reverse and 3 × equation 2','Add equations and ΔH'],
  'c-hw8':['Reverse and ½ × equation 1','Reverse and ½ × equation 2','Keep equation 3','Add equations and ΔH'],
  'c-p9':['Reverse and ½ × equation 1','6 × equation 2','3 × equation 3','Add equations and ΔG'],
  'c-couple':['Keep equation 1','2 × equation 2','Add equations and ΔG']
 };
 for(const [id,labels]of Object.entries(routes)){const q=bank.find(q=>q.id===id);q.speedSteps=labels.map((label,i)=>({id:'route-'+i,label,requires:i===labels.length-1?labels.slice(0,i).map((_,j)=>'route-'+j):[]}));}
 // Lab subparts ask for the intermediate, not the entire old generic lab route.
 const labSteps={ 'Glucose lab #1':['ΔT = Tf − Ti','qsur = mcΔT'], 'Glucose lab #2':['qsys = −qsur'], 'Glucose lab #3':['Mass burned = before − after','n = mass burned / M'], 'NaHCO₃ lab #3':['n = m / M'] };
 for(const q of bank){if(labSteps[q.sourceRef?.item])q.speedSteps=labSteps[q.sourceRef.item].map((label,i)=>({id:'lab-'+i,label,requires:i?['lab-'+(i-1)]:[]}));}
 window.PunstemChemAudit={title:'AP Chemistry packet — Section 3',pdfPages:[48,69],pages,questionCount:bank.length,notes:'No fabricated numeric lab results. Drawing tasks use labelled recognition adaptations. Notes-only facts are separate concept checks.'};
})();
