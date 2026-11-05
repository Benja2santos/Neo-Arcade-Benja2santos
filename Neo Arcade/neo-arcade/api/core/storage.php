<?php
class Storage {
    private $file;
    public function __construct($filename){
        $dir = __DIR__ . '/../data';
        if(!is_dir($dir)) mkdir($dir, 0777, true);
        $this->file = $dir . '/' . $filename;
        if(!file_exists($this->file)){
            file_put_contents($this->file, json_encode([]));
        }
    }
    public function getAll(){
        $content = file_get_contents($this->file);
        return json_decode($content, true) ?: [];
    }
    public function save($data){
        file_put_contents($this->file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}
