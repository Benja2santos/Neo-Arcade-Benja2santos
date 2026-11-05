<?php
// Router principal /api/index.php?module=scores&action=get
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD']==='OPTIONS'){ http_response_code(200); exit; }

$module = $_GET['module'] ?? null;
if(!$module){
    http_response_code(400);
    echo json_encode(['ok'=>false,'error'=>'Falta ?module= (scores, sudoku, tateti, cuatro)']);
    exit;
}

$allowed = ['scores','sudoku','tateti','cuatro'];
if(!in_array($module, $allowed)){
    http_response_code(400);
    echo json_encode(['ok'=>false,'error'=>'Modulo no permitido']);
    exit;
}

$path = __DIR__ . "/modules/$module/index.php";
if(!file_exists($path)){
    http_response_code(404);
    echo json_encode(['ok'=>false,'error'=>'Modulo no encontrado']);
    exit;
}

require $path;
