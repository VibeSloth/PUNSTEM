/* Review/replay uses a separate state. Original scored work is never removed. */
(()=>{
 function create(adapter){let parked=null,draft=null;
  const back=document.getElementById('previousProblem'),redo=document.getElementById('redoCurrent'),resume=document.getElementById('resumeSprint'),status=document.getElementById('replayStatus');
  function update(){const s=adapter.get();back.disabled=s.i===0;resume.hidden=!parked;status.textContent=parked?'Replay · doesn’t change your sprint score':'';}
  function replay(index){const s=adapter.get();if(index<0)return;if(!parked){draft=adapter.capture();parked=s;clearInterval(s.timer);}else clearInterval(s.timer);adapter.set({...parked,i:index,results:[],timer:null,replay:true,saved:true,progressSaved:true});adapter.load();update();}
  function restore(){if(!parked)return;clearInterval(adapter.get().timer);const s=parked,d=draft;parked=null;draft=null;adapter.set(s);adapter.load();adapter.restore(d);update();}
  function next(){if(!parked)return false;const s=adapter.get();if(!adapter.done())return true;if(s.i+1>=parked.i)restore();else replay(s.i+1);return true;}
  back.onclick=()=>replay(adapter.get().i-1);redo.onclick=()=>replay(adapter.get().i);resume.onclick=restore;
  return{update,next,restore,reset(){parked=null;draft=null;update();}};
 }
 window.PunstemNavigation={create};
})();
