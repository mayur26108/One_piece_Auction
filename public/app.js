const socket=io();let code=null,isHost=false,state=null,timerStart=0;let lastRound=null;
const $=id=>document.getElementById(id);function show(id){$(id).classList.remove('hidden')}function hide(id){$(id).classList.add('hidden')}
function err(x){alert(x)}
$('create').onclick=()=>socket.emit('create',{name:$('hostName').value,maxPlayers:$('players').value,budget:$('budget').value,timer:$('timer').value},r=>r.ok?enter(r.code,true):err(r.error));
$('join').onclick=()=>socket.emit('join',{name:$('joinName').value,code:$('code').value},r=>r.ok?enter(r.code,false):err(r.error));
function enter(c,h){code=c;isHost=h;hide('home');show('game');$('room').textContent=c;$('lobbyCode').textContent=c;$('role').textContent=h?'HOST':'PLAYER'}
$('start').onclick=()=>socket.emit('start',{code},r=>{if(!r.ok)err(r.error)});
$('bidBtn').onclick=()=>{const v=Number($('bid').value);socket.emit('bid',{code,amount:v},r=>{if(!r.ok)err(r.error);else $('status').textContent='Bid submitted. You can change it before the timer ends.'})};
$('exit').onclick=()=>{if(confirm('Exit this game? The current game will be closed for you.'))socket.emit('exit',{code},()=>location.reload())};
$('reset').onclick=()=>{if(confirm('Reset the auction and return everyone to the lobby?'))socket.emit('reset',{code},r=>{if(!r.ok)err(r.error)})};
$('newGame').onclick=()=>location.reload();
socket.on('closed',()=>{alert('The host ended the game.');location.reload()});
socket.on('state',g=>{state=g;code=g.code;$('room').textContent=g.code;$('lobbyCode').textContent=g.code;isHost=g.hostId===socket.id;$('role').textContent=isHost?'HOST':'PLAYER';document.querySelectorAll('.hostOnly').forEach(x=>x.classList.toggle('hidden',!isHost));
 $('playersList').innerHTML=g.players.map(p=>`<div class="player ${p.id===socket.id?'you':''} ${p.done?'done':''}"><b>${escapeHtml(p.name)}</b> — ${p.budget} bounty ${p.connected?'':'(offline)'}<div class="chars">${p.characters.length}/6: ${p.characters.map(escapeHtml).join(', ')||'No characters yet'}</div></div>`).join('');
 if(g.status==='lobby'){show('lobby');hide('auction');hide('finished');return} hide('lobby');
 if(g.status==='finished'){hide('auction');show('finished');$('final').innerHTML=g.players.map(p=>`<div class="player"><b>${escapeHtml(p.name)}</b>: ${p.characters.join(', ')} — ${p.budget} left</div>`).join('');return}
 hide('finished');show('auction');$('character').textContent=g.current?.name||'—';$('round').textContent=g.current?`#${g.current.number} / ${g.maxPlayers*6}`:'';$('bid').max=state.players.find(p=>p.id===socket.id)?.budget||0;$('bid').value='';$('status').textContent='';
 if(g.current&&lastRound!==g.current.number){lastRound=g.current.number;timerStart=Date.now()} renderBoard(g);});
function renderBoard(g){$('board').innerHTML=g.players.map(p=>`<div class="player ${p.id===socket.id?'you':''}"><b>${escapeHtml(p.name)}</b><br>💰 ${p.budget} | 🏴‍☠️ ${p.characters.length}/6<br><span class="chars">${p.characters.map(escapeHtml).join(', ')||'—'}</span></div>`).join('')}
setInterval(()=>{if(!state?.current||state.status!=='playing')return;const left=Math.max(0,state.timer-Math.floor((Date.now()-timerStart)/1000));$('countdown').textContent=left+'s'},250);
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
