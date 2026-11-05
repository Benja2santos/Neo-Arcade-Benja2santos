<?php
require_once __DIR__ . '/../../core/Response.php';

$action = $_GET['action'] ?? 'validate';

if($action==='validate' && $_SERVER['REQUEST_METHOD']==='POST'){
    $input = json_decode(file_get_contents('php://input'), true);
    $board = $input['board'] ?? [];
    // board es array de 9 posiciones '' 'X' 'O'
    $wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    $winner = null;
    $line = null;
    foreach($wins as $w){
        [$a,$b,$c]=$w;
        if(!empty($board[$a]) && $board[$a]===$board[$b] && $board[$a]===$board[$c]){
            $winner=$board[$a];
            $line=$w;
            break;
        }
    }
    $draw = !$winner && !in_array('', $board) && !in_array(null, $board);
    Response::json(['ok'=>true,'winner'=>$winner,'line'=>$line,'draw'=>$draw]);
}
Response::error('Accion tateti no valida');
