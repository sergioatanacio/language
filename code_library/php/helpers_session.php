<?php

/**
 * Permite debuguear una variable en php.
 */
if(! function_exists('pre'))
{
    function pre($pre)
    {
        print('<pre>');
        print(var_export($pre));
        print('</pre>');
    }
}

/**
 * Inicia la sesión de una persona.
 */
function sessionStarted(array $user_of_session)
{
    return (!isset($_SESSION)) 
        ? (function() use ($user_of_session) : array
            {
                if(!isset($_SESSION)){ session_start();}
                $_SESSION['session'] = true;
                $_SESSION['user'] = $user_of_session;
                return $_SESSION['user']; 
            })()
        : false;
    /*
    if(!isset($_SESSION)){ session_start();}
    $_SESSION['session'] = true;*/
}

/**
 * Hace que las personas que accedan al recurso en cuestión deban tener la sesión iniciada.
 */
function activeSession(string $direction = 'index.html')
{
    return (function()
        {
            if(!isset($_SESSION)){ session_start();}
            return (!isset($_SESSION['session'])) ? [] : $_SESSION;
        })();
}

function active_session_get_boolean()
{
    return (function()
        {
            if(!isset($_SESSION)){ session_start();}
            return (fn() : bool => $_SESSION['session'] ?? false)();
        })();
}


/**
 * La ejecución de esta función cierra la sesión de una persona.
 */
function sessionEnded()
{
    if(!isset($_SESSION)){ session_start();}

    $_SESSION['session'] = false;
    return $_SESSION['user'] ?? false; 
    
    /*if(!isset($_SESSION)){ session_start();}
    $_SESSION['session'] = false;*/
}

