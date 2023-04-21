<?php
require_once __DIR__.'/../../env.php';

try {
    $connect = new \PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $connect->exec("SET CHARACTER SET utf8");
    #echo "Conexión exitosa a la base de datos"; 
  } catch(PDOException $e) {
    echo "La conexión a la base de datos falló: " . $e->getMessage();
  }

return $connect;