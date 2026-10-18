(()=>{
 const $=s=>document.querySelector(s),dialog=$('#homeGemini'),classes=$('#classHome'),input=$('#homeGeminiInput'),send=$('#homeGeminiSend'),answer=$('#homeGeminiAnswer'),fast=$('#homeGeminiFast');
 const chat=window.PunstemTutorChat.create(answer,{context:()=>({mode:'home'}),onSuccess:()=>{dialog.classList.add('has-chat')},onReset:()=>{dialog.classList.remove('has-chat')}});fast.hidden=true;
 function greet(){const name=window.PunstemCurrentUser?.displayName?.trim().split(/\s+/)[0];$('#homeWelcome').textContent=name?'Welcome, '+name+'!':'Welcome!';$('#geminiGreeting').textContent=name?'Let’s work through it, '+name+'.':'Let’s work through it.';}
 function showHome(){greet();classes.hidden=true;dialog.hidden=false;window.scrollTo({top:0,behavior:'instant'});}
 function showClasses(){if(!window.PunstemAuth?.require())return;chat.stop();send.disabled=false;dialog.hidden=true;classes.hidden=false;window.scrollTo({top:0,behavior:'instant'});}
 $('#homeAskGemini').onclick=showHome;$('#closeHomeGemini').onclick=showClasses;$('#practiceProblems').onclick=showClasses;
 document.querySelectorAll('[data-gemini-prompt]').forEach(b=>b.onclick=()=>{input.value=b.dataset.geminiPrompt;input.focus();});
 $('#homeGeminiForm').onsubmit=async e=>{e.preventDefault();const text=input.value.trim();if(!text||send.disabled)return;send.disabled=true;try{if(await chat.ask(text))input.value=''}finally{send.disabled=false}};
 input.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#homeGeminiForm').requestSubmit();}};
 document.addEventListener('punstem-auth-ready',()=>{input.value='';send.disabled=false;greet();});showHome();
})();
