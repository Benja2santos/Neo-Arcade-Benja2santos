export function initTateti(container, { getPlayers, addScore }){
  container.innerHTML = `<div class="board-tateti" id="tatetiBoard"></div>
  <div class="controls"><button class="neon-btn" id="resetTateti">REINICIAR</button></div>
  <div class="status" id="tatetiStatus"></div>`;
  const boardEl = container.querySelector('#tatetiBoard');
  const status = container.querySelector('#tatetiStatus');
  let board = Array(9).fill('');
  let turn = 'X';
  let over = false;
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function render(){
    boardEl.innerHTML='';
    board.forEach((v,i)=>{
      const d=document.createElement('div');
      d.className='cell-tateti';
      d.textContent=v;
      d.style.color = v==='X' ? 'var(--cyan)' : 'var(--magenta)';
      d.onclick=()=>move(i);
      boardEl.appendChild(d);
    });
    const p = getPlayers();
    if(!over) status.textContent = `Turno: ${turn==='X'?p.p1:p.p2} [${turn}]`;
  }
  function move(i){
    if(board[i]||over) return;
    board[i]=turn;
    check();
    if(!over) turn = turn==='X'?'O':'X';
    render();
  }
  function check(){
    for(let w of wins){
      const [a,b,c]=w;
      if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
        over=true;
        status.textContent=`GANA ${board[a]==='X'?getPlayers().p1:getPlayers().p2}!`;
        setTimeout(()=>{ w.forEach(idx=>boardEl.children[idx]?.classList.add('win')); },0);
        addScore('tateti', board[a]==='X'?'J1':'J2');
        return;
      }
    }
    if(!board.includes('')){ over=true; status.textContent='EMPATE - GRIDLOCK'; }
  }
  container.querySelector('#resetTateti').onclick=()=>{
    board=Array(9).fill(''); turn='X'; over=false; status.textContent=''; render();
  };
  render();
}
