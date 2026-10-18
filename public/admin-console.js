(()=>{
const labels={gemini_request:'Gemini help',sign_in:'Signed in',account_created:'Created account',sign_out:'Signed out',page_view:'Opened page',visit:'Visit',active_use:'Active use',sprint_started:'Started sprint',question_shown:'Opened question',question_attempt:'Answered question',sprint_completed:'Completed sprint',sprint_saved:'Saved partial sprint'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let cursor=null,busy=false,initialized=false,timer;
async function init(){
 if(initialized||!window.PunstemCurrentUser?.isAdmin)return;initialized=true;
 const panel=document.createElement('section');panel.className='card';panel.id='activityConsole';
 panel.innerHTML=`<h2>Activity console</h2><p>Updates every 5 seconds. Detailed events start with this update. Times are shown in your local timezone.</p><div class="console-controls"><label>Find user <input id="consoleSearch" type="search" placeholder="Name or email"></label><label>Event <select id="consoleKind"><option value="">All events</option>${Object.entries(labels).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label><input id="consoleLive" type="checkbox" checked> Live updates</label><button id="consoleRefresh">Refresh</button></div><p id="consoleStatus" role="status"></p><div class="console-scroll"><table><thead><tr><th>Time</th><th>User</th><th>Event</th><th>Page</th><th>Details</th></tr></thead><tbody id="consoleRows"></tbody></table></div><button id="consoleOlder" hidden>Load older events</button>`;
 document.querySelector('#accountStatus').after(panel);
 const $=id=>panel.querySelector('#'+id);
 async function load(older=false){
  if(busy)return;busy=true;
  try{
   const params=new URLSearchParams({search:$('consoleSearch').value,kind:$('consoleKind').value});if(older&&cursor)params.set('before',cursor);
   const response=await fetch('/api/activity?'+params,{cache:'no-store'});const data=await response.json();if(!response.ok)throw Error(data.error||'Could not load activity');
   const html=data.events.map(e=>{let d={};try{d=JSON.parse(e.details)}catch{}const detail=Object.entries(d).map(([k,v])=>`${k}: ${k.endsWith('Ms')?(Number(v)/1000).toFixed(1)+' sec':v}`).join(' · ');return `<tr><td>${esc(new Date(e.created_at).toLocaleString())}</td><td>${esc(e.display_name)}<br><small>${esc(e.email)}</small></td><td>${esc(labels[e.kind]||e.kind)}</td><td>${esc(e.page)}</td><td>${esc(detail||'—')}</td></tr>`}).join('');
   if(older)$('consoleRows').insertAdjacentHTML('beforeend',html);else $('consoleRows').innerHTML=html||'<tr><td colspan="5">No matching activity yet.</td></tr>';
   cursor=data.nextBefore;$('consoleOlder').hidden=!cursor;$('consoleStatus').textContent='Updated '+new Date().toLocaleTimeString();
  }catch(e){$('consoleStatus').textContent=e.message}finally{busy=false}
 }
 $('consoleSearch').oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>load(),350)};$('consoleKind').onchange=()=>load();$('consoleRefresh').onclick=()=>load();$('consoleOlder').onclick=()=>{$('consoleLive').checked=false;load(true)};
 setInterval(()=>{if(!document.hidden&&$('consoleLive').checked)load()},5000);load();
}
document.addEventListener('punstem-auth-ready',init);document.addEventListener('DOMContentLoaded',init);
})();
