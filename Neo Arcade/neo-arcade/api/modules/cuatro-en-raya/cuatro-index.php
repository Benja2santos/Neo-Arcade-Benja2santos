<?php
require_once __DIR__ . '/../../core/Response.php';

$action = $_GET['action'] ?? 'validate';

if($action==='validate' && $_SERVER['REQUEST_METHOD']==='POST'){
    $input = json_decode(file_get_contents('php://input'), true);
    $grid = $input['grid'] ?? []; // 6x7
    $last = $input['last'] ?? null; // ['r'=>, 'c'=>, 'player'=>]
    
    if(!$last) Response::error('Falta last move');
    
    $ROWS=6; $COLS=7;
    $r=$last['r']; $c=$last['c']; $player=$last['player'];
    $dirs=[[0,1],[1,0],[1,1],[1,-1]];
    
    foreach($dirs as $d){
        [$dr,$dc]=$d;
        $count=1;
        // contar hacia un lado
        $rr=$r+$dr; $cc=$c+$dc;
        while($rr>=0 && $rr<$ROWS && $cc>=0 && $cc<$COLS && isset($grid[$rr][$cc]) && $grid[$rr][$cc]===$player){
            $count++; $rr+=$dr; $cc+=$dc;
        }
        // otro lado
        $rr=$r-$dr; $cc=$c-$dc;
        while($rr>=0 && $rr<$ROWS && $cc>=0 && $cc<$COLS && isset($grid[$rr][$cc]) && $grid[$rr][$cc]===$player){
            $count++; $rr-=$dr; $cc-=$dc;
        }
        if($count>=4){
            Response::json(['ok'=>true,'winner'=>$player,'win'=>true]);
        }
    }
    Response::json(['ok'=>true,'winner'=>null,'win'=>false]);
}
Response::error('Accion cuatro no valida');
