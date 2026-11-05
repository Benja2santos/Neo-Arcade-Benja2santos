export function initCuatro(container, { getPlayers, addScore }){
  const ROWS=6, COLS=7;
  container.innerHTML = `<div class="board-cuatro" id="boardCuatro"></div>
  <div class="controls"><button class="neon-btn" id="resetCuatro">REINICIAR</button></div>
  <div class="status" id="cuatroStatus"></div>`;
  const boardEl = container.querySelector('#boardCuatro');
  const status = container.querySelector('#cuatroStatus');
  let grid = Array.from({length:ROWS},()=>Array(COLS).fill(''));
  let turn='J1'; let over=false;
  function render(){
    boardEl.innerHTML='';
    for(let c=0;c<COLS;c++){
      const colDiv=document.createElement('div');
      colDiv.className='col-cuatro';
      colDiv.onclick=()=>drop(c);
      for(let r=0;r<ROWS;r++){
        const slot=document.createElement('div');
        slot.className='slot'+(grid[r][c]?` filled-${grid[r][c]}`:'');
        colDiv.appendChild(slot);
      }
      boardEl.appendChild(colDiv);
    }
    if(!over){
      const p=getPlayers();
      status.textContent=`Turno: ${turn==='J1'?p.p1:p.p2} [${turn}]`;
    }
  }
  function drop(c){
    if(over) return;
    for(let r=ROWS-1;r>=0;r--){
      if(!grid[r][c]){
        grid[r][c]=turn;
        if(checkWin(r,c)){
          over=true;
          status.textContent=`GANA ${getPlayers()[turn==='J1'?'p1':'p2']} - 4 EN RAYA!`;
          addScore('cuatro', turn);
        } else if(grid.flat().every(v=>v)){
          over=true; status.textContent='EMPATE';
        } else {
          turn=turn==='J1'?'J2':'J1';
        }
        render(); return;
      }
    }
  }
  function checkWin(r,c){
    const dirs=[[0,1],[1,0],[1,1],[1,-1]];
    for(let [dr,dc] of dirs){
      let count=1;
      count+=countDir(r,c,dr,dc);
      count+=countDir(r,c,-dr,-dc);
      if(count>=4) return true;
    }
    return false;
  }
  function countDir(r,c,dr,dc){
    let cnt=0, rr=r+dr, cc=c+dc;
    while(rr>=0&&rr<ROWS&&cc>=0&&cc<COLS&&grid[rr][cc]===turn){cnt++; rr+=dr; cc+=dc;}
    return cnt;
  }
  container.querySelector('#resetCuatro').onclick=()=>{grid=Array.from({length:ROWS},()=>Array(COLS).fill('')); turn='J1'; over=false; render();};
  render();
}
