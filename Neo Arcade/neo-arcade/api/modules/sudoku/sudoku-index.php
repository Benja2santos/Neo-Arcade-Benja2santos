<?php
require_once __DIR__ . '/../../core/Response.php';

$action = $_GET['action'] ?? 'generate';
$diff = $_GET['diff'] ?? 'easy';

function generateSudoku($difficulty){
    // base pattern valido
    $base = [];
    for($r=0;$r<9;$r++){
        $base[$r]=[];
        for($c=0;$c<9;$c++){
            $base[$r][$c] = ($r*3 + intval($r/3) + $c) % 9 + 1;
        }
    }
    // mezclar un poco filas dentro de bandas
    shuffle($base);
    
    $solution = $base;
    $puzzle = array_map(fn($row)=>$row, $base);
    
    $remove = $difficulty==='easy'?40:($difficulty==='medium'?50:58);
    $count=0;
    while($count<$remove){
        $r=rand(0,8); $c=rand(0,8);
        if($puzzle[$r][$c]!==0){
            $puzzle[$r][$c]=0;
            $count++;
        }
    }
    return ['puzzle'=>$puzzle, 'solution'=>$solution];
}

if($action==='generate'){
    $data = generateSudoku($diff);
    Response::json(['ok'=>true, 'diff'=>$diff, 'puzzle'=>$data['puzzle'], 'solution'=>$data['solution']]);
}

if($action==='validate' && $_SERVER['REQUEST_METHOD']==='POST'){
    $input = json_decode(file_get_contents('php://input'), true);
    $board = $input['board'] ?? null;
    $solution = $input['solution'] ?? null;
    if(!$board || !$solution) Response::error('Faltan datos');
    
    $correct = true;
    $errors=[];
    for($r=0;$r<9;$r++){
        for($c=0;$c<9;$c++){
            if($board[$r][$c] != $solution[$r][$c]){
                $correct=false;
                $errors[]=['r'=>$r,'c'=>$c];
            }
        }
    }
    Response::json(['ok'=>true,'correct'=>$correct,'errors'=>$errors]);
}

Response::error('Accion sudoku no valida');
