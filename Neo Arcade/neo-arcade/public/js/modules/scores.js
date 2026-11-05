const API_URL = '../../api/?module=scores';
let localScores = JSON.parse(localStorage.getItem('neon_scores')||'{"tateti":{"J1":0,"J2":0},"cuatro":{"J1":0,"J2":0},"sudoku":{"J1":0,"J2":0}}');
export function getScores(){ return localScores; }
export async function addScore(game, player){
  if(!localScores[game]) localScores[game]={J1:0,J2:0};
  localScores[game][player]++;
  localStorage.setItem('neon_scores', JSON.stringify(localScores));
  try{
    await fetch(`${API_URL}&action=add`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({game, player})});
  }catch(e){}
  renderScoreboard();
}
export function resetScores(){
  localScores={"tateti":{"J1":0,"J2":0},"cuatro":{"J1":0,"J2":0},"sudoku":{"J1":0,"J2":0}};
  localStorage.setItem('neon_scores', JSON.stringify(localScores));
  fetch(`${API_URL}&action=reset`, {method:'POST'}).catch(()=>{});
  renderScoreboard();
}
export function renderScoreboard(){
  const el=document.getElementById('scoreboard');
  if(!el) return;
  const players={p1:document.getElementById('player1')?.value||'J1', p2:document.getElementById('player2')?.value||'J2'};
  const games=[
    {key:'tateti', label:'TA-TE-TI'},
    {key:'cuatro', label:'4 EN RAYA'},
    {key:'sudoku', label:'SUDOKU'},
  ];
  let html='';
  games.forEach(g=>{
    const s=localScores[g.key]||{J1:0,J2:0};
    html+=`<div class="score-card"><h4>${g.label}</h4><div class="pts"><span>${players.p1}: ${s.J1}</span><span>${players.p2}: ${s.J2}</span></div></div>`;
  });
  const totalJ1 = Object.values(localScores).reduce((a,b)=>a+b.J1,0);
  const totalJ2 = Object.values(localScores).reduce((a,b)=>a+b.J2,0);
  html+=`<div class="score-card" style="border-color:var(--yellow)"><h4>TOTAL</h4><div class="pts"><span style="color:var(--cyan)">${players.p1}: ${totalJ1}</span><span style="color:var(--magenta)">${players.p2}: ${totalJ2}</span></div></div>`;
  el.innerHTML=html;
}
