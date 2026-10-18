(()=>{
 const math={
 evalFormula:['Replace every x with the requested input, using parentheses around negative numbers.','Evaluate powers first, then multiply, then add or subtract.'],
 evalPiecewise:['Compare the input with each inequality and choose the one matching piece.','Use ≤ or ≥ at an included boundary. Substitute the input only into that piece.'],
 domain21:['Require every denominator to be nonzero. Require every even-root radicand to be ≥ 0 (strictly > 0 if that root is a denominator). Odd roots, such as cube roots, allow negative inputs.','Solve the restrictions together. Use brackets for included finite endpoints; infinity always uses parentheses.'],
 domain:['Find the domains of both original functions, then apply any denominator or square-root restrictions.','Intersect all restrictions. A canceled denominator still excludes its original zero.'],
 symbolicInput:['Put the entire new input in parentheses wherever x appears.','Expand powers and distribute coefficients, then combine like terms.'],
 inverseRule:['Write y = f(x), swap x and y, then solve for y. For a fraction, multiply both sides by its denominator and collect the y terms.','Undo operations in reverse order. For a square root / square, keep the branch required by the original domain.','The inverse domain is the original range; check endpoints and excluded values.'],
 restrictDomain:['Keep only the branch specified in the question so each output has one input.','Swap x and y and solve. Choose the root sign matching that branch.'],
 symmetry:['Replace every x with −x and simplify, including denominators and absolute values.','If f(−x) = f(x), it is even. If f(−x) = −f(x), it is odd. Otherwise it is neither; the domain must also be symmetric.'],
 ruleComp:['Identify the inside function (the one on the right of ∘).','Substitute its entire rule in parentheses for every x in the outside rule.','Simplify; retain restrictions from the original inside and outside functions.'],
 formulaComp:['Evaluate the inside function at the given input.','Use that output as the input to the outside function—not the original x.'],
 tableComp:['Look up the inside function at the given x in the table.','Find that output in the x row, then read the outside function at that new input.'],
 graphComp:['Read the inside graph’s height at the original x.','Use that height as the new x on the outside graph. If an input is outside the shown domain, the composition is undefined.'],
 arithmetic:['Apply the indicated +, −, ×, or ÷ to the two function rules.','Put a subtracted rule in parentheses. Distribute and combine like terms; division excludes zeros of the divisor.'],
 inverseValue:['An inverse reverses inputs and outputs: f(a) = b means f⁻¹(b) = a.','Find the original input that produced the requested output.'],
 inverseTable:['Find the requested output in the f(x) row.','Read its matching x; that x is the inverse value. For nested inverses, repeat the lookup.'],
 inversePoint:['Swap the original coordinates: (x, y) becomes (y, x).','This is reflection across y = x, not either coordinate axis.'],
 verifyInverse:['Substitute g(x) into every x of f, then simplify.','Also substitute f(x) into g. Both compositions must equal x on their valid domains.'],
 oneToOne:['Ask whether two different inputs can produce the same output.','A horizontal line may intersect a one-to-one graph at most once. Use the given restricted domain.'],
 equationFunction:['Solve for y, or apply the vertical-line test.','Each valid x must have exactly one y. A ± root usually gives two outputs.'],
 verticalLine:['Imagine vertical lines passing through the graph.','If any line hits more than once, y is not a function of x.'],
 pointValue:['A point (a, b) on y = f(x) means f(a) = b.','The x-coordinate is the input; the y-coordinate is the output.'],
 graphRead:['Find the requested x on the horizontal axis.','Move vertically to the graph and read its y-coordinate.'],
 decompose:['Use the specified g(x) as the inside expression.','Replace that expression with x to obtain f(x), then check f(g(x)) against the original rule.']
 };
 const chem={
 'Specific heat':['Choose q = mcΔT, with ΔT = final − initial, or rearrange for the requested variable.','For a hot metal in water: mmetal cmetal(Tinitial,metal − Tf) = mwater cwater(Tf − Tinitial,water).','Substitute the given values; check that the units match.'],
 'Phase changes':['Convert mass to moles if the latent heat is per mole: n = mass / molar mass.','Use q = nΔH for the phase change; match J with J or kJ with kJ.','Melting and vaporizing absorb heat; freezing and condensing release it.'],
 'Heating curves':['Separate the process into temperature changes and phase changes.','For each temperature change use mcΔT. For each phase change use nΔH.','Convert every term to the same unit, assign the heating/cooling signs, and add.'],
 'Hess’s law':['Compare each given equation with the target; reverse any that run backward and reverse their ΔH signs.','Multiply equations and ΔH by matching factors.','Add and cancel species. Confirm the remaining equation is the target before adding ΔH.'],
 'Thermochemical stoich':['Convert the given amount to moles if needed.','Divide by that substance’s balanced-equation coefficient to get moles of reaction.','Multiply by ΔH for the reaction; reverse its sign if the reaction is reversed.'],
 'Bond energies':['Count every bond broken in the reactants and every bond formed in the products, including coefficients.','Calculate Σ(bonds broken) − Σ(bonds formed).','Keep the subtraction order: breaking costs energy and forming releases it.'],
 'Calorimetry':['Calculate heat gained by the water / solution: qsurroundings = mcΔT.','Use qreaction = −qsurroundings; convert J to kJ when necessary.','For molar heat, divide by moles of substance actually reacted, with the balanced ratio.'],
 'Heats of formation':['Multiply each formation value by its balanced coefficient.','Calculate Σ(products) − Σ(reactants); standard-state elements have zero formation enthalpy.','If a formation value is unknown, rearrange this equation to isolate it.'],
 'Entropy':['For a numerical ΔS, calculate Σ(coefficients × Sproducts) − Σ(coefficients × Sreactants).','For a sign prediction, compare phases and gas moles; more accessible particle arrangements generally mean greater entropy.']
 };
 function solution(q,{input='',errors=[],points=[]}={}){
  const pattern=window.PunstemChemAnswers?.diagnose(q,input),lines=[];
  if(pattern)lines.push(pattern.hint);
  if(q.q){const t=q.thermo;if(t){const s=t.deltaS/1000;lines.push(`Convert ΔS: ${t.deltaS} J/(mol·K) ÷ 1,000 = ${s} kJ/(mol·K).`);if(t.mode==='equilibrium')lines.push(`At equilibrium ΔG = 0, so T = ΔH/ΔS = ${t.deltaH} / (${s}).`);else{if(Number.isFinite(t.temperatureC))lines.push(`T = ${t.temperatureC} + 273.15 = ${t.temperatureK} K.`);lines.push(`ΔG = ΔH − TΔS = ${t.deltaH} − (${t.temperatureK})(${s}).`);}}else lines.push(...(chem[q.topic]||['Identify the requested quantity and select the relationship linking the given data.', 'Use the method below, substituting the supplied values with consistent units.']));lines.push('This problem: '+q.method);lines.push('Answer: '+q.answer.display);
  }else if(q.points){lines.push(q.piecewise?'Graph each piece only on its interval. At a finite boundary, ≤ / ≥ includes the endpoint (closed); < / > excludes it (open). Where pieces join at the same included point, one closed mark is enough.':'For each requested x, substitute into the function.');for(const p of q.points){const match=points.some(t=>Math.abs(t.x-p.x)<.13&&Math.abs(t.y-p.y)<.13&&(p.closed===undefined||(t.closed!==false)===p.closed));lines.push(`(${p.x}, ${p.y})${p.endpoint?` — ${p.closed?'closed':'open'} endpoint`:' — interior example'}${match?' — you placed this correctly':''}.`);}lines.push('Use the displayed correct curve to compare your points.');
  }else{lines.push(...(math[q.kind]||['Identify the requested input or operation, then apply it to the given function.', 'Check the result against the answer below.']));if(q.kind==='inverseRule'){const rule=q.equation?.match(/^[fg]\(x\)\s*=\s*(.*)$/)?.[1];if(rule){const swapped=rule.split(',')[0].replace(/x/g,'y');lines.push(`For this problem, after swapping: x = ${swapped}. Solve this equation for y; that y is f⁻¹(x).`);}}lines.push(q.explain||'Answer: '+q.fields.map(f=>f.label+' = '+f.answer).join('; '));}
  const personal=window.PunstemLearning?.coach(q,errors);if(personal)lines.push('For you: '+personal);
  return 'How to solve\n'+lines.map((line,i)=>`${i+1}. ${line}`).join('\n');
 }
 window.PunstemHelp={solution};
})();
