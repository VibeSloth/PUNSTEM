(()=>{
  const page=location.pathname.includes('math')?'math':location.pathname.includes('trainer')?'chemistry':location.pathname.replace(/\W/g,'').slice(0,60)||'home';
  window.PunstemActivity={log(kind,details={}){
    if(!window.PunstemCurrentUser)return;
    fetch('/api/activity',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:crypto.randomUUID(),kind,page,details}),keepalive:true}).catch(()=>{});
  }};
  document.addEventListener('punstem-auth-ready',e=>{if(e.detail)window.PunstemActivity.log('page_view')});
  if(window.PunstemCurrentUser)window.PunstemActivity.log('page_view');
})();
