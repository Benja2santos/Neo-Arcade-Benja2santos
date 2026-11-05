export function initSudoku(container, { getPlayers, addScore }){
  container.innerHTML = `
  <div class="controls">
    <button class="neon-btn small" data-diff="easy">FACIL</button>
    <button class="neon-btn small" data-diff="medium">MEDIO</button>
    <button class="neon-btn small" data-diff="hard">DIFICIL</button>
    <span style="margin-left:12px" id="timer">00:00</span>
  </div>
  <div class="board-sudoku" id="boardSudoku"></div>
  <div class="controls">
    <button class="neon-btn small" id="hint">PISTA</button>
    <button class="neon-btn small" id="check">VERIFICAR</button>
    <button class="neon-btn small" id="newGame">NUEVO</button>
  </div>
  <div class="status" id="sudokuStatus"></div>`;
  const boardEl=container.querySelector('#boardSudoku');
  const status=container.querySelector('#sudokuStatus');
  const timerEl=container.querySelector('#timer');
  let solution=[], puzzle=[], startTime=null, timerInt=null, diff='easy';
  function genBoard(){
    const base = Array.from({length:9},(_,r)=>Array.from({length:9},(_,c)=>(r*3+Math.floor(r/3)+c)%9+1));
    solution = base.map(r=>[...r]);
    const remove = diff==='easy'?40: diff==='medium'?50:58;
    puzzle = solution.map(row=>[...row]);
    let toRemove=remove;
    while(toRemove>0){
      const r=Math.floor(Math.random()*9), c=Math.floor(Math.random()*9);
      if(puzzle[r][c]!==0){ puzzle[r][c]=0; toRemove--; }
    }
    render();
    startTimer();
  }
  function render(){
    boardEl.innerHTML='';
    for(let r=0;r<9;r++) for(let c=0;c<9;c++){
      const inp=document.createElement('input');
      inp.className='cell-sudoku'+(puzzle[r][c]!==0?' fixed':'');
      inp.maxLength=1;
      inp.value = puzzle[r][c]||'';
      if(puzzle[r][c]!==0) inp.disabled=true;
      else {
        inp.addEventListener('input', e=>{
          const v=parseInt(e.target.value);
          if(!(v>=1&&v<=9)){ e.target.value=''; return; }
          e.target.classList.remove('error');
          checkComplete();
        });
      }
      inp.dataset.r=r; inp.dataset.c=c;
      boardEl.appendChild(inp);
    }
  }
  function checkComplete(){
    const inputs=[...boardEl.querySelectorAll('.cell-sudoku:not(.fixed)')];
    if(inputs.every(i=>parseInt(i.value)===solution[parseInt(i.dataset.r)][parseInt(i.dataset.c)])){
      clearInterval(timerInt);
      status.textContent=`COMPLETADO en ${timerEl.textContent}!`;
      const turn = window.__CURRENT_PLAYER_TURN || 'J1';
      addScore('sudoku', turn);
    }
  }
  container.querySelector('#check').onclick=()=>{
    [...boardEl.children].forEach((el,i)=>{
      const r=Math.floor(i/9), c=i%9;
      if(el.classList.contains('fixed')) return;
      const v=parseInt(el.value);
      if(v && v!==solution[r][c]) el.classList.add('error'); else el.classList.remove('error');
    });
    status.textContent='Errores marcados en magenta';
  };
  container.querySelector('#hint').onclick=()=>{
    const empties=[...boardEl.querySelectorAll('.cell-sudoku:not(.fixed)')].filter(e=>!e.value);
    if(empties.length){ const el=empties[Math.floor(Math.random()*empties.length)]; const r=el.dataset.r, c=el.dataset.c; el.value=solution[r][c]; checkComplete(); }
  };
  container.querySelector('#newGame').onclick=()=>genBoard();
  container.querySelectorAll('[data-diff]').forEach(b=>b.onclick=()=>{diff=b.dataset.diff; genBoard();});
  function startTimer(){ startTime=Date.now(); clearInterval(timerInt); timerInt=setInterval(()=>{ const s=Math.floor((Date.now()-startTime)/1000); const m=String(Math.floor(s/60)).padStart(2,'0'); const ss=String(s%60).padStart(2,'0'); timerEl.textContent=`${m}:${ss}`; },1000); }
  genBoard();
}
