<?php
$connect_db = require_once __DIR__.'/../../resources/databases/connection.php';
require_once __DIR__.'/Resources/Resources_files.php';

$start = Io::of(function() use ($connect_db) {
        
    $resource   = $_POST['resource']    ?? ''; 
    $petition   = $_POST['petition']    ?? '';
    //$session    = $_SESSION    ?? '';id_of_user
    $options    = array_merge($_POST ?? [], ['user' => activeSession()]);

    $chosen_class   = 'Resources\\'.$resource;


    $resource_val   = (class_exists($chosen_class) && (method_exists($chosen_class, $petition))) 
        ? Either::right(Io::of(fn()=>new $chosen_class($connect_db)))
        : Either::left(Io::of(fn()=>new Resources\Message()));

    $petition_val   = ($resource_val->isRight())
        ? $petition
        : 'request_message';

    $options_val    = $options;

    $result = ($resource_val->getRight() ?? $resource_val->getLeft())
        ->map(function($a) use ($petition_val, $options_val) {
            $result_of_resource = $a->$petition_val($options_val);
            return (is_array($result_of_resource)) ? $result_of_resource : [$result_of_resource];
        });
    //$result = ($resource_val->getRight())->$petition_val($options_val);

    return $result->run();
});

print(json_encode($start->run(), JSON_PRETTY_PRINT));



