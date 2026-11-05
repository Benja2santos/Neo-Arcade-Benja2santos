<?php
class Response {
    public static function json($data, $code=200){
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
    public static function error($msg, $code=400){
        self::json(['ok'=>false,'error'=>$msg], $code);
    }
}
