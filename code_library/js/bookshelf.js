import {Element_html, Io} from './helpers.js';

let first_html_template = Io.of(() => {

    let first_head = Element_html.of(
        `<meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">`);
    
    let script_of_bootstrap = Element_html.of(`<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>`);
    
    /* Esto poner al inicio para que se cargue primero el head. */
    let head = document.querySelector('head');
    head.append(first_head.run());
    //head.append(document.cloneNode(first_head.run(), true));
    
    let body_end = document.querySelector('body');
    body_end.append(script_of_bootstrap.run());
}); 

export {first_html_template};