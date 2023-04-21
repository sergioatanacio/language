<?php
/**
 * funciòn para poder crear un predicado, o un test, tipo tdd.
 */
if(! function_exists('assocQuery'))
    {
    function predicade_die($argument_result, array $test){
        $result = array_reduce(
            $test, 
            fn($carry, $item)=> 
                ($item === true && $carry === true) 
                    ? $item 
                    : ((is_string($carry)) 
                        ? $carry."\n".((is_string($item) ? $item : '')) 
                        : $item) , 
            true);

        return ($result === true) ? $argument_result : die($result);
    }
}

/**
 * Convierte el resultado de una consulta SQL en un array. Al parecer, los valores se traen en
 * un array que está en indice 0, y dentro de ese array se crea, entonces, si no se pone ningún
 * valor como segundo parámetro entonces se trae el valor, como por defecto el array 0, mientras 
 * que si se pone true, se trae el array tal cual. O tambien puede ser que si el array solo tiene
 * un elemento, se trae todo lo demás.
 */
if(! function_exists('assocQuery'))
{
    function assocQuery($query, $index = null) :? array
    {
        return ($query != null)
            ? (function($petition) use ($index)
                {
                    $result = [];
                    while ($elements = $petition->fetch(\PDO::FETCH_ASSOC))
                    {
                        $result[] = ($index != null) ? $elements[$index] : $elements;
                    }
                    return $result;
                })($query)
            : null;
    }
}

/**
 * Permite usar el array reduce, pero usando las llaves, como parámetro.
 */
if(! function_exists('array_reduce_key'))
{
    function array_reduce_key(array $array, callable $callback, $initial = [])
    {
        $carry = $initial;
        foreach($array as $key => $value){
            $carry = $callback($carry, $key, $value);
        }
        return $carry;
    };
}

/**
 * Permite usar el array reduce, pero usando las llaves, como parámetro.
 */
if(! function_exists('array_map_key'))
{
   function array_map_key(callable $callback, array $array) : array
    {
        $return = [];
        foreach ($array as $key => $value) {
            $return[$key] = $callback($key, $value);
        }
        return $return;
    };
}




if(! function_exists('upload_files'))
{
   function upload_files(string $dir)
    {
        $files = array_filter(scandir($dir), fn($file)=>strpos($file, '.php') !== false);

        array_reduce($files, function($carry, $file) use ($dir) {
            return require_once $dir . $file;
        });
    };
}



/* 
function iva($amount) { return $amount + ($amount * 0.16);}
function discount($amount) {return $amount - ($amount * 0.1);}
function surcharge($amount) {return $amount + ($amount * 0.2);}
function annualPartialities($amount) {return $amount / 12;}
 */

class Composition {
    private $result;
    
    private function __construct($start){
        $this->result = $start;
    }
    
    public static function of($arg){
        return new Composition($arg);
    }
    
    public function map(callable $f){
        return new Composition(function() use ($f) {
            $result = $this->run();
            return $f($result);
        });
    }
    
    public function run(){
        return is_callable($this->result)
            ? ($this->result)()
            : $this->result;
    }
}
/* 
$total = Composition::of(100)
    ->map('surcharge')
    ->map('iva')
    ->map('discount')
    ->map('annualPartialities')
    ->run();
    
echo $total . PHP_EOL; 
*/


class Io {
    private $action;

    private function __construct(callable $action) {
        $this->action = $action;
    }

    public static function of(callable $action) {
        return new Io($action);
    }

    public function run() {
        return ($this->action)();
    }

    public function map(callable $function) {
        return new Io(function() use ($function) {
            $result = $this->run();
            return $function($result);
        });
    }
}
/* 
// Creamos una función que lee un archivo
function leerArchivo($filename) {
    return file_get_contents($filename);
}

// Creamos una mónada Io que encapsula la lectura de un archivo
$ioLeerArchivo = Io::of(function() {
    return leerArchivo('archivo.txt');
});

// Aplicamos una función al contenido del archivo usando map (sin leerlo todavía)
$ioContenidoMayusculas = $ioLeerArchivo->map('strtoupper');

// Ejecutamos la mónada Io y leemos el archivo
$contenidoMayusculas = $ioContenidoMayusculas->run();
echo $contenidoMayusculas;
 */



class Either {
    private $left;
    private $right;

    private function __construct($left, $right) {
        $this->left = $left;
        $this->right = $right;
    }

    public static function right($value) {
        return new Either(null, $value);
    }

    public static function left($value) {
        return new Either($value, null);
    }

    public function isLeft() {
        return isset($this->left);
    }

    public function isRight() {
        return isset($this->right);
    }

    public function getLeft() {
        return $this->left;
    }

    public function getRight() {
        return $this->right;
    }
}
//Mas que manejar errores, por lo que entiendo, la monada Either permite guardar el resultado de una condicional.
/* 
function divide($a, $b) {
  if ($b == 0) {
    return Either::left("Error: no se puede dividir por cero");
  } else {
    return Either::right($a / $b);
  }
}

$resultado = divide(10, 2);

if ($resultado->isRight()) {
  echo "El resultado es: " . $resultado->getRight();
} else {
  echo "Error: " . $resultado->getLeft();
}

*/
  

class Maybe {
    private $value;
    private $hasValue;
  
    private function __construct($value, $hasValue) {
        $this->value = $value;
        $this->hasValue = $hasValue;
    }
  
    public static function just($value) {
        return new Maybe($value, true);
    }
  
    public static function nothing() {
        return new Maybe(null, false);
    }
  
    public function isJust() {
        return $this->hasValue;
    }
  
    public function isNothing() {
        return !$this->hasValue;
    }
  
    public function getOrElse($defaultValue) {
        return $this->hasValue ? $this->value : $defaultValue;
    }
  
    public function map($fn) {
        return $this->hasValue ? Maybe::just($fn($this->value)) : Maybe::nothing();
    }
  
    public function flatMap($fn) {
        return $this->hasValue ? $fn($this->value) : Maybe::nothing();
    }
  
    public function __toString() {
        return $this->hasValue ? 'Just ' . $this->value : 'Nothing';
    }
}


/* 
function divide($x, $y) {
  return $y == 0 ? Maybe::nothing() : Maybe::just($x / $y);
}

$result = divide(6, 3)
  ->map(function($x) { return $x * 2; })
  ->flatMap(function($x) { return divide($x, 2); })
  ->getOrElse(0);

echo $result; // Output: 2.0

// Es cierto que la monada Maybe es útil para evitar errores causados por valores nulos, pero también puede ser útil para manejar otros tipos de errores

function safe_divide($x, $y) {
    if (!is_numeric($x) || !is_numeric($y)) {
        return Maybe::nothing(); // si alguno de los operandos no es un número, retornamos Maybe::nothing()
    }

    if ($y == 0) {
        return Maybe::nothing(); // si el divisor es cero, retornamos Maybe::nothing()
    }

    return Maybe::just(strval($x / $y)); // si todo está bien, retornamos el resultado como un string dentro de Maybe::just()
}

// Ejemplo de uso:
$result1 = safe_divide(10, 2)->map('strtoupper')->getOrElse('No se pudo calcular'); // Output: '5'
$result2 = safe_divide(10, 0)->map('strtoupper')->getOrElse('No se pudo calcular'); // Output: 'No se pudo calcular'
$result3 = safe_divide('10', 'a')->map('strtoupper')->getOrElse('No se pudo calcular'); // Output: 'No se pudo calcular'

*/

class State {
    private $fn;

    private function __construct(callable $fn) {
        $this->fn = $fn;
    }

    public static function of(callable $fn) {
        return new self($fn);
    }

    public function run($state) {
        return ($this->fn)($state);
    }

    public function map(callable $fn) {
        return State::of(function($state) use ($fn) {
        list($value, $newState) = $this->run($state);
        return [$fn($value), $newState];
        });
    }

    public function flatMap(callable $fn) {
        return State::of(function($state) use ($fn) {
        list($value, $newState) = $this->run($state);
        return $fn($value)->run($newState);
        });
    }

    public function modify(callable $fn) {
        return State::of(function($state) use ($fn) {
        return [null, $fn($state)];
        });
    }
}
/* 
function deposit($amount) {
    return State::of(function($balance) use ($amount) {
        return [$amount, $balance + $amount];
    });
}

function withdraw($amount) {
    return State::of(function($balance) use ($amount) {
        return [$amount, $balance - $amount];
    });
}

$initialBalance = 100;

$depositAndWithdraw = deposit(50)->flatMap(function() {
    return withdraw(25);
});

list($result, $newBalance) = $depositAndWithdraw->run($initialBalance);

echo "Resultado: " . $result . ", Nuevo balance: " . $newBalance; // Output: "Resultado: 25, Nuevo balance: 125"
 */