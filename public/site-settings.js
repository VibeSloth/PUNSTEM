(()=>{
  const preferences={getItem(key){try{return localStorage.getItem(key)}catch{return null}},setItem(key,value){try{localStorage.setItem(key,value)}catch{}}};
  const storage={theme:'punstemTheme',sound:'punstemSound',volume:'punstemVolume'};
  if(preferences.getItem('punstemAudioV2')!=='1'){preferences.setItem(storage.sound,'on');preferences.setItem(storage.volume,'1');preferences.setItem('punstemAudioV2','1')}
  const value=(key,fallback)=>preferences.getItem(key)??fallback;
  const theme=()=>value(storage.theme,'light');
  document.documentElement.dataset.theme=theme();
  const audio={complete:new Audio('/sfx/sprint-complete.m4a'),streak:new Audio('/sfx/daily-streak.m4a'),correct:new Audio('/sfx/answer-correct.m4a'),click:new Audio('/sfx/button-click.m4a')};
  Object.values(audio).forEach(a=>a.preload='auto');
  let queuedDaily=false;
  function soundOn(){return value(storage.sound,'on')==='on'}
  function volume(){return Math.max(0,Math.min(1,Number(value(storage.volume,'1'))))}
  function playTail(track){
    if(track==='complete')return;
    if(!soundOn())return;const a=audio[track];if(!a)return;
    if(track==='click'&&['correct','complete','streak'].some(k=>!audio[k].paused&&!audio[k].ended))return;
    if(track==='streak'&&!audio.complete.paused&&!audio.complete.ended){queuedDaily=true;return}
    if(track!=='click')audio.click.pause();
    if(track==='complete')audio.correct.pause();
    a.pause();a.currentTime=0;a.muted=false;a.volume=volume();a.play().catch(()=>{});
  }
  audio.complete.addEventListener('ended',()=>{if(queuedDaily){queuedDaily=false;playTail('streak')}});
  let tickContext;
  function playTick(){if(!soundOn())return;try{tickContext??=new (window.AudioContext||window.webkitAudioContext)();tickContext.resume();const oscillator=tickContext.createOscillator(),gain=tickContext.createGain(),now=tickContext.currentTime;oscillator.type='sine';oscillator.frequency.setValueAtTime(850,now);gain.gain.setValueAtTime(.12*volume(),now);gain.gain.exponentialRampToValueAtTime(.001,now+.055);oscillator.connect(gain);gain.connect(tickContext.destination);oscillator.start(now);oscillator.stop(now+.06)}catch{}}
  window.PunstemSound={playTick,playCorrect:()=>playTail('correct'),playComplete:()=>playTail('complete'),playStreak:()=>playTail('streak'),playClick:()=>playTail('click'),setSource:(event,url)=>{if(!['correct','complete','streak','click'].includes(event))return;audio[event].src=url;audio[event].load()}};
  const problemTimer=document.querySelector('#quizScreen #timer'),problemCard=document.querySelector('#quizScreen .question-card');if(problemTimer&&problemCard){problemTimer.setAttribute('aria-label','Time remaining');problemCard.prepend(problemTimer)}
  document.addEventListener('click',e=>{if(!e.defaultPrevented&&e.target.closest?.('button,[role="tab"],.check label,.topic label,.seg label'))window.PunstemSound.playClick()});
  const zone=()=>Intl.DateTimeFormat().resolvedOptions().timeZone;
  window.PunstemStreak={refresh:async()=>{try{const r=await fetch('/api/streak?timezone='+encodeURIComponent(zone()));if(!r.ok)return;const s=await r.json();const badge=document.querySelector('#dailyStreak');if(badge){badge.textContent=s.current+' day streak';badge.title=s.completedToday?'Today is complete. Best: '+s.best+' days':'Finish a full round today. Best: '+s.best+' days';badge.hidden=false}document.dispatchEvent(new CustomEvent('punstem-streak',{detail:s}))}catch{}}};
  function setTheme(next){preferences.setItem(storage.theme,next);document.documentElement.dataset.theme=next;document.dispatchEvent(new CustomEvent('punstem-theme-change',{detail:{theme:next}}));sync()}
  function sync(){
    document.querySelectorAll('[data-theme-choice]').forEach(b=>b.classList.toggle('active',b.dataset.themeChoice===theme()));
    const s=document.querySelector('#punstemSoundToggle');if(s)s.checked=soundOn();
    const v=document.querySelector('#punstemVolume');if(v)v.value=volume();
  }
  function close(){document.querySelector('.settings-panel')?.classList.remove('open');document.querySelector('.settings-backdrop')?.classList.remove('open')}
  let signedInUser=null,authMode='login',authEpoch=0;
  const fullPageAuth=document.body?.hasAttribute('data-auth-page');
  function authOpen(){document.querySelector('.auth-panel')?.classList.add('open');document.querySelector('.auth-backdrop')?.classList.add('open');const loading=document.querySelector('#accountLoading');if(loading)loading.hidden=true}
  window.PunstemAuth={require:()=>{if(signedInUser)return true;authOpen();return false}};
  ['pointerdown','click','keydown','submit','input'].forEach(type=>document.addEventListener(type,e=>{if(signedInUser||e.target.closest?.('.auth-panel,.account-launch,.auth-backdrop,.feedback-launch,.feedback-dialog'))return;e.preventDefault();e.stopImmediatePropagation();authOpen()},{capture:true}));
  const feedbackScript=document.createElement('script');feedbackScript.src='/feedback.js';document.head.append(feedbackScript);
  const mathScript=document.createElement('script');mathScript.src='/math-tools.js';document.head.append(mathScript);
  function authClose(){if(fullPageAuth&&!signedInUser)return;document.querySelector('.auth-panel')?.classList.remove('open');document.querySelector('.auth-backdrop')?.classList.remove('open')}
  function authRender(){
    const launch=document.querySelector('.account-launch'),guest=document.querySelector('#authGuest'),account=document.querySelector('#authAccount');if(!launch)return;
    launch.textContent=signedInUser?.displayName||'Sign in';guest.hidden=Boolean(signedInUser);account.hidden=!signedInUser;
    document.querySelector('.auth-panel h2').textContent=signedInUser?'Your account':'Sign in to practice';
    document.querySelector('#authAdmin').hidden=!signedInUser?.isAdmin;if(signedInUser){document.querySelector('#authDisplayName').textContent=signedInUser.displayName;document.querySelector('#authEmailText').textContent=signedInUser.email}
    document.querySelectorAll('.auth-tab').forEach(x=>x.classList.toggle('active',x.dataset.authMode===authMode));
    document.querySelector('#authNameWrap').hidden=authMode!=='register';document.querySelector('#authName').required=authMode==='register';document.querySelector('#authSubmit').textContent=authMode==='register'?'Create account':'Sign in';document.querySelector('#authStatus').textContent='';
  }
  const activityScript=document.createElement('script');activityScript.src='/activity.js';document.head.appendChild(activityScript);
  async function authLoad(){const epoch=++authEpoch;try{const response=await fetch('/api/auth/me',{credentials:'same-origin',cache:'no-store'});if(!response.ok)throw new Error('Session check failed');const data=await response.json();if(epoch!==authEpoch)return;signedInUser=data.user||null;window.PunstemCurrentUser=signedInUser;authRender();document.dispatchEvent(new CustomEvent('punstem-auth-ready',{detail:signedInUser}));if(!signedInUser)authOpen();else{authClose();window.PunstemStreak.refresh()}}catch{if(epoch!==authEpoch)return;authOpen();const status=document.querySelector('#authStatus');if(status)status.textContent='Could not check your session. You can try signing in again.'}}
  async function authSubmit(event){event.preventDefault();++authEpoch;const status=document.querySelector('#authStatus'),submit=document.querySelector('#authSubmit');status.textContent='';submit.disabled=true;submit.textContent='Working…';try{const body={email:document.querySelector('#authEmail').value,password:document.querySelector('#authPassword').value,displayName:document.querySelector('#authName').value},response=await fetch(`/api/auth/${authMode==='register'?'register':'login'}`,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),data=await response.json();if(!response.ok)throw new Error(data.error||'Could not continue');const check=await fetch('/api/auth/me',{credentials:'same-origin',cache:'no-store'}),session=await check.json();if(!check.ok||!session.user){if(authMode==='register'){authMode='login';authRender()}throw new Error('Your browser blocked this session. Open full-page sign-in in your browser and allow cookies, then try again. Your account and password are unchanged.')}signedInUser=session.user;window.PunstemCurrentUser=signedInUser;preferences.setItem('functionSprintPlayerName',signedInUser.displayName);document.querySelector('#authPassword').value='';authRender();authClose();document.dispatchEvent(new CustomEvent('punstem-auth-ready',{detail:signedInUser}));window.PunstemStreak.refresh()}catch(error){status.textContent=error.message||'Could not continue'}finally{submit.disabled=false;submit.textContent=authMode==='register'?'Create account':'Sign in'}}
  document.addEventListener('DOMContentLoaded',()=>{
    document.addEventListener('pointerdown',()=>{Object.values(audio).forEach(a=>{a.load();a.volume=volume()})},{once:true,capture:true});
    const host=document.querySelector('.top-actions,.nav,.topbar,.top');
    if(!host)return;
    const badge=document.createElement('a');badge.id='dailyStreak';badge.className='daily-streak';badge.href='/profile.html';badge.hidden=true;host.appendChild(badge);
    const accountLaunch=document.createElement('button');accountLaunch.className='account-launch';accountLaunch.type='button';accountLaunch.textContent='Sign in';host.appendChild(accountLaunch);
    const launch=document.createElement('button');launch.className='settings-launch';launch.type='button';launch.setAttribute('aria-label','Open settings');launch.textContent='⚙';host.appendChild(launch);
    document.body.insertAdjacentHTML('beforeend',`<div class="settings-backdrop"></div><section class="settings-panel" role="dialog" aria-modal="true" aria-label="Settings"><div class="settings-title"><h2>Settings</h2><button class="settings-close" aria-label="Close settings">×</button></div><div class="settings-row"><label>Appearance</label><div class="settings-options"><button class="settings-option" data-theme-choice="light">Light</button><button class="settings-option" data-theme-choice="dark">Dark</button></div></div><div class="settings-row settings-switch"><div><strong>Sound effects</strong><br><small>Streaks and completed rounds</small></div><input id="punstemSoundToggle" type="checkbox" aria-label="Sound effects"></div><div class="settings-row"><label for="punstemVolume">Sound volume</label><input id="punstemVolume" type="range" min="0" max="1" step=".05"></div></section>`);
    document.body.insertAdjacentHTML('beforeend',`<div class="auth-backdrop"></div><section class="auth-panel" role="dialog" aria-modal="true" aria-label="Punstem account"><div class="settings-title"><h2>Your account</h2><button class="settings-close auth-close" aria-label="Close account">×</button></div><div id="authGuest"><div class="auth-tabs"><button class="auth-tab active" data-auth-mode="login">Sign in</button><button class="auth-tab" data-auth-mode="register">Create account</button></div><form class="auth-form" id="authForm"><label id="authNameWrap" hidden>Name<input id="authName" maxlength="24" autocomplete="name"></label><label>Email<input id="authEmail" type="email" maxlength="120" autocomplete="email" required></label><label>Password<input id="authPassword" type="password" minlength="8" maxlength="128" autocomplete="current-password" required></label><button class="auth-submit" id="authSubmit">Sign in</button><div class="auth-status" id="authStatus" aria-live="polite"></div><a href="/account.html" target="_top" class="auth-full-page">Open full-page sign-in ↗</a></form></div><div class="auth-account" id="authAccount" hidden><strong id="authDisplayName"></strong><p id="authEmailText"></p><p><a href="/profile.html">Your profile</a> <a id="authAdmin" href="/admin.html" hidden>Admin dashboard</a></p><button class="auth-signout" id="authSignout">Sign out</button></div></section>`);
    if(fullPageAuth){const auth=document.querySelector('.auth-panel');document.querySelector('#accountForm').appendChild(auth);auth.removeAttribute('aria-modal');auth.setAttribute('role','region');document.addEventListener('punstem-auth-ready',event=>{if(event.detail)window.top.location.replace('/home.html')})}
    const panel=document.querySelector('.settings-panel'),backdrop=document.querySelector('.settings-backdrop');
    launch.addEventListener('click',()=>{panel.classList.add('open');backdrop.classList.add('open');sync()});
    const authPanel=document.querySelector('.auth-panel'),authBackdrop=document.querySelector('.auth-backdrop');accountLaunch.addEventListener('click',()=>{authPanel.classList.add('open');authBackdrop.classList.add('open');authRender()});document.querySelector('.auth-close').addEventListener('click',authClose);authBackdrop.addEventListener('click',authClose);document.querySelectorAll('.auth-tab').forEach(tab=>tab.addEventListener('click',()=>{authMode=tab.dataset.authMode;document.querySelector('#authPassword').autocomplete=authMode==='register'?'new-password':'current-password';authRender()}));document.querySelector('#authForm').addEventListener('submit',authSubmit);document.querySelector('#authSignout').addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});signedInUser=null;authRender();location.reload()});
    document.querySelector('.settings-close').addEventListener('click',close);backdrop.addEventListener('click',close);
    document.querySelectorAll('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.themeChoice)));
    document.querySelector('#punstemSoundToggle').addEventListener('change',e=>{preferences.setItem(storage.sound,e.target.checked?'on':'off');if(e.target.checked)window.PunstemSound.playClick()});
    document.querySelector('#punstemVolume').addEventListener('input',e=>preferences.setItem(storage.volume,e.target.value));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();authClose()}});sync();authLoad();
  });

  // Count a visit once per browser session, and active seconds across pages.
  let pending=0,last=Date.now(),interaction=Date.now();
  const page=location.pathname.includes('super-speed')?'super-speed':location.pathname.includes('trainer')?'chemistry':location.pathname.includes('math')?'math':location.pathname.includes('profile')?'profile':location.pathname.includes('admin')||location.pathname.includes('stats')?'admin':location.pathname.includes('learn')?'learn':'home';
  let device=preferences.getItem('functionSprintDevice');if(!device){device=crypto.randomUUID().replaceAll('-','');preferences.setItem('functionSprintDevice',device)}
  const send=(eventType,durationMs=0)=>fetch('/api/analytics',{method:'POST',headers:{'content-type':'application/json'},keepalive:true,body:JSON.stringify({id:crypto.randomUUID().replaceAll('-',''),deviceId:device,page,eventType,occurredOn:new Date().toISOString().slice(0,10),durationMs})}).catch(()=>{});
  fetch('/api/auth/me').then(r=>r.json()).then(d=>{const key='punstemVisitV3:'+(d.user?.userId||'guest');if(!sessionStorage.getItem(key)){sessionStorage.setItem(key,'1');send('visit')}}).catch(()=>{});
  function tick(){const now=Date.now();if(signedInUser&&!document.hidden&&now-interaction<60000)pending+=Math.min(5000,now-last);last=now}
  function flush(){tick();if(pending>0){send('engagement',Math.min(30000,pending));pending=0}}
  ['pointerdown','pointermove','keydown','scroll'].forEach(e=>addEventListener(e,()=>{interaction=Date.now()},{passive:true}));
  setInterval(tick,1000);setInterval(flush,15000);addEventListener('pagehide',flush);document.addEventListener('visibilitychange',()=>{if(document.hidden)flush();last=Date.now()});
})();
