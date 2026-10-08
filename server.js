const path=require('path');
const http=require('http');
const express=require('express');
const {Server}=require('socket.io');
const app=express(); const server=http.createServer(app); const io=new Server(server);
const PORT=process.env.PORT||3000;
app.use(express.static(path.join(__dirname,'public')));

const CHARACTERS=require('./data/characters.json');
const games=new Map();
const MIN_PLAYERS=2, MAX_PLAYERS=8, SLOTS=6;
function id(){return Math.random().toString(36).slice(2,8).toUpperCase()}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function publicGame(g){return {code:g.code,status:g.status,hostId:g.hostId,playerCount:g.players.size,maxPlayers:g.maxPlayers,budget:g.budget,timer:g.timer,current:g.current?{name:g.current.name,number:g.current.number,total:g.total}:null,players:[...g.players.values()].map(p=>({id:p.id,name:p.name,budget:p.budget,characters:p.characters,connected:p.connected,done:p.characters.length>=SLOTS}))}}
function emit(g){io.to(g.code).emit('state',publicGame(g))}
function roomCode(){let c;do{c=Math.floor(100000+Math.random()*900000).toString()}while(games.has(c));return c}
function createGame(hostId,name,maxPlayers,budget,timer){const code=roomCode();const g={code,hostId,maxPlayers,budget,timer,status:'lobby',players:new Map(),deck:[],total:0,current:null,timerHandle:null};g.players.set(hostId,{id:hostId,name:name||'Host',budget,characters:[],connected:true});games.set(code,g);return g}
function nextEligible(g){return [...g.players.values()].filter(p=>p.characters.length<SLOTS && p.budget>0)}
function finish(g){clearTimeout(g.timerHandle);g.timerHandle=null;g.status='finished';g.current=null;emit(g)}
function assignFree(g, p){if(p.characters.length<SLOTS){p.characters.push(g.current.name);g.total++}}
function resolve(g){if(!g.current)return;clearTimeout(g.timerHandle);g.timerHandle=null;const entries=g.current.bids;const eligible=[...g.players.values()].filter(p=>p.characters.length<SLOTS);
  const paid=eligible.filter(p=>p.budget>0&&entries.has(p.id));
  let winner=null,price=0;
  if(paid.length){let high=Math.max(...paid.map(p=>Math.min(entries.get(p.id),p.budget)));let ties=paid.filter(p=>Math.min(entries.get(p.id),p.budget)===high);winner=ties[Math.floor(Math.random()*ties.length)];price=high}
  else {const free=eligible.filter(p=>p.characters.length<SLOTS); if(free.length) winner=free[Math.floor(Math.random()*free.length)]}
  if(winner){winner.characters.push(g.current.name);winner.budget=Math.max(0,winner.budget-price)}
  g.total++;
  if(g.total>=g.maxPlayers*SLOTS){finish(g);return}
  g.current=null; setTimeout(()=>startRound(g),700); emit(g)
}
function startRound(g){if(g.status!=='playing')return; if([...g.players.values()].every(p=>p.characters.length>=SLOTS)){finish(g);return}
  const remaining=shuffle(g.deck.filter(x=>!g.used.has(x))); if(!remaining.length){finish(g);return} const name=remaining[0];g.used.add(name);g.current={name,number:g.total+1,bids:new Map()};emit(g);g.timerHandle=setTimeout(()=>resolve(g),g.timer*1000)
}
function start(g){if(g.status!=='lobby')return false;if(g.players.size<MIN_PLAYERS)return false;if(CHARACTERS.length<g.maxPlayers*SLOTS)return false;g.status='playing';g.deck=shuffle(CHARACTERS);g.used=new Set();g.total=0;startRound(g);return true}
function leave(g,socketId){const p=g.players.get(socketId);if(!p)return; if(g.status==='lobby'){g.players.delete(socketId);if(g.hostId===socketId){const n=g.players.values().next().value;if(n)g.hostId=n.id;else{games.delete(g.code);return}}}else{p.connected=false} emit(g)}
io.on('connection',socket=>{
 socket.on('create',({name,maxPlayers,budget,timer},cb)=>{maxPlayers=Math.max(MIN_PLAYERS,Math.min(MAX_PLAYERS,Number(maxPlayers)||3));budget=Math.max(1,Number(budget)||50);timer=Math.max(5,Math.min(120,Number(timer)||20));const g=createGame(socket.id,String(name||'Player').slice(0,24),maxPlayers,budget,timer);socket.join(g.code);cb({ok:true,code:g.code});emit(g)})
 socket.on('join',({code,name},cb)=>{const g=games.get(String(code||'').trim());if(!g)return cb({ok:false,error:'Lobby not found.'});if(g.status!=='lobby')return cb({ok:false,error:'That game has already started.'});if(g.players.size>=g.maxPlayers)return cb({ok:false,error:'Lobby is full.'});g.players.set(socket.id,{id:socket.id,name:String(name||'Player').slice(0,24),budget:g.budget,characters:[],connected:true});socket.join(g.code);cb({ok:true,code:g.code});emit(g)})
 socket.on('start',({code},cb)=>{const g=games.get(code);if(!g||g.hostId!==socket.id)return cb({ok:false,error:'Only the host can start.'});if(g.players.size<MIN_PLAYERS)return cb({ok:false,error:'Need at least 2 players.'});start(g);cb({ok:true});emit(g)})
 socket.on('bid',({code,amount},cb)=>{const g=games.get(code),p=g&&g.players.get(socket.id);amount=Number(amount);if(!g||g.status!=='playing'||!g.current||!p)return cb({ok:false,error:'No active auction.'});if(p.characters.length>=SLOTS)return cb({ok:false,error:'You already have 6 characters.'});if(!Number.isFinite(amount)||amount<0||amount>p.budget)return cb({ok:false,error:'Bid must be between 0 and your remaining budget.'});g.current.bids.set(socket.id,amount);cb({ok:true});emit(g)})
 socket.on('resolve',{code},cb=>{const g=games.get(code);if(!g||g.hostId!==socket.id)return cb({ok:false,error:'Only the host can resolve.'});resolve(g);cb({ok:true})})
 socket.on('reset',{code},cb=>{const g=games.get(code);if(!g||g.hostId!==socket.id)return cb({ok:false,error:'Only the host can reset.'});clearTimeout(g.timerHandle);g.status='lobby';g.deck=[];g.used=new Set();g.total=0;g.current=null;for(const p of g.players.values()){p.budget=g.budget;p.characters=[];p.connected=true}emit(g);cb({ok:true})})
 socket.on('exit',{code},cb=>{const g=games.get(code);if(!g)return cb({ok:true});if(g.hostId===socket.id){clearTimeout(g.timerHandle);games.delete(code);io.to(code).emit('closed')}else{leave(g,socket.id)}socket.leave(code);cb({ok:true})})
 socket.on('disconnect',()=>{for(const g of games.values())if(g.players.has(socket.id))leave(g,socket.id)})
});
server.listen(PORT,()=>console.log(`One Piece Bounty Auction running at http://localhost:${PORT}`));
