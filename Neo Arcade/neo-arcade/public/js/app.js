import { initTateti } from './modules/tateti.js';
import { initCuatro } from './modules/cuatro.js';
import { initSudoku } from './modules/sudoku.js';
import { renderScoreboard, resetScores, addScore } from './modules/scores.js';

const getPlayers = ()=>({p1:document.getElementById('player1').value||'RUNNER_01', p2:document.getElementById('player2').value||'RUNNER_02'});
window.__CURRENT_PLAYER_TURN='J1';

function initTabs(){
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.game-view').forEach(v=>v.classList.remove('active'));
      btn.classList.add('active');
      const game=btn.dataset.game;
      document.getElementById(`game-${game}`).classList.add('active');
    };
  });
}
function initTheme(){
  const t=document.getElementById('themeToggle');
  t.onclick=()=>{
    const html=document.documentElement;
    const isDark=html.getAttribute('data-theme')==='dark';
    html.setAttribute('data-theme', isDark?'light':'dark');
    t.textContent=isDark?'LIGHT':'DARK';
  };
}
document.getElementById('player1').addEventListener('input', renderScoreboard);
document.getElementById('player2').addEventListener('input', renderScoreboard);
document.getElementById('resetScores').onclick=()=>{ if(confirm('Resetear todo?')) resetScores(); };

initTabs();
//initTheme();
renderScoreboard();

initTateti(document.getElementById('game-tateti'), {getPlayers, addScore});
initCuatro(document.getElementById('game-cuatro'), {getPlayers, addScore});
initSudoku(document.getElementById('game-sudoku'), {getPlayers, addScore});
