<?php
require_once __DIR__ . '/../../core/Response.php';
require_once __DIR__ . '/../../core/Storage.php';

$storage = new Storage('scores.json');
$action = $_GET['action'] ?? 'get';
$method = $_SERVER['REQUEST_METHOD'];

if($method === 'OPTIONS'){ Response::json(['ok'=>true]); }

if($action === 'get'){
    $scores = $storage->getAll();
    // estructura por defecto
    if(empty($scores)){
        $scores = [
            'tateti'=>['J1'=>0,'J2'=>0],
            'cuatro'=>['J1'=>0,'J2'=>0],
            'sudoku'=>['J1'=>0,'J2'=>0]
        ];
    }
    Response::json(['ok'=>true,'scores'=>$scores]);
}

if($action === 'add' && $method === 'POST'){
    $input = json_decode(file_get_contents('php://input'), true);
    $game = $input['game'] ?? $_POST['game'] ?? null;
    $player = $input['player'] ?? $_POST['player'] ?? null;
    
    $allowedGames = ['tateti','cuatro','sudoku'];
    $allowedPlayers = ['J1','J2'];
    
    if(!in_array($game, $allowedGames)) Response::error('Juego no valido');
    if(!in_array($player, $allowedPlayers)) Response::error('Jugador no valido');
    
    $scores = $storage->getAll();
    if(empty($scores)){
        $scores = [
            'tateti'=>['J1'=>0,'J2'=>0],
            'cuatro'=>['J1'=>0,'J2'=>0],
            'sudoku'=>['J1'=>0,'J2'=>0]
        ];
    }
    if(!isset($scores[$game])) $scores[$game]=['J1'=>0,'J2'=>0];
    $scores[$game][$player]++;
    
    $storage->save($scores);
    Response::json(['ok'=>true,'scores'=>$scores]);
}

if($action === 'reset' && $method === 'POST'){
    $scores = [
        'tateti'=>['J1'=>0,'J2'=>0],
        'cuatro'=>['J1'=>0,'J2'=>0],
        'sudoku'=>['J1'=>0,'J2'=>0]
    ];
    $storage->save($scores);
    Response::json(['ok'=>true,'scores'=>$scores]);
}

Response::error('Accion no valida');
