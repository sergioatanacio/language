<?php
require __DIR__.'/language.php';
require_once __DIR__.'/helpers_session.php';
require_once __DIR__.'/../../env.php';

$connection = require __DIR__.'/../databases/connection.php';

$view = fn($file_view) : callable =>require __DIR__.'/../../views/'.$file_view.'.php';

$template = fn($file_template) : callable =>$view("/templates/$file_template");
$component = fn($file_component) : callable =>$view("/components/$file_component");


$session_user = function(string $arg = '')
{
    if(!isset($_SESSION)){session_start();}
    return ($arg === '')  ? $_SESSION['user'] : $_SESSION['user'][$arg];
};

