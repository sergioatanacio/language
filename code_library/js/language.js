
class Element_html {
    constructor(create_html_element) {
        typeof create_html_element === 'function'
            ? this.html_element = create_html_element
            : (console.error('Error: El argumento del constructor debe ser una función.'), null);
    }

    static isNode(check_node) {
        const isNodeType = check_node.nodeType === 1 || check_node.nodeType === 11;
        return typeof isNodeType === 'boolean' ? isNodeType : null;
    }

    static of(arg) {
        return typeof arg === 'string'
            ? new Element_html(() => Element_html.createHTMLElement(arg))
            : Element_html.isNode(arg)
                ? new Element_html(() => arg.cloneNode(true))
                : (console.error('Error: El argumento no es una cadena o un nodo válido.'), null);
    }

    static createHTMLElement(string_of_html) {
        return Element_html.isNode(string_of_html)
            ? document.importNode(string_of_html, true)
            : typeof string_of_html === 'string'
                ? (()=>{
                    const div = document.createElement('div');
                    div.innerHTML = htmlString.trim();                    
                    const nodosHijos = div.childNodes;                    
                    const fragmento = document.createDocumentFragment();                    
                    // Utiliza forEach para iterar sobre cada nodo hijo y agregarlo al fragmento de documento
                    nodosHijos.forEach(nodoHijo => fragmento.appendChild(nodoHijo));
                    
                    return fragmento;
                    })()
                : (console.error('Error: La asignación a html_element ha fallado, el nombre no es una cadena o un nodo válido.'), null);
    }

    run() {
        return (this.html_element)();
    }

    get_string_html() {
        const element = this.html_element();
        return Element_html.isNode(element)
            ? document.createElement('div').appendChild(element.cloneNode(true)).innerHTML
            : null;
    }

    map(transformFunction) {
        return typeof transformFunction === 'function' && transformFunction.length === 1
            ? new Element_html(() => transformFunction(this.run()))
            : (console.error('Error: El argumento del método map debe ser una función anónima con un solo parámetro.'), null);
    }
}

class Io {
    constructor(action) {
        if (typeof action !== "function") {
            throw new Error("action must be a callable function");
        }
        this._action = action;
    }

    static of(action) {
        const func = typeof action === "function" ? action : () => action;
        return new Io(func);
    }
  
    run() {
        return (this._action)();
    }
  
    map(fn) {
        if (typeof fn !== "function") {
            throw new Error("fn must be a callable function");
        }
    
        return new Io(() => {
            const result = this.run();
            return fn(result);
        });
    }
}

  
  
class Either {
    constructor(left, right) {
        this._left = left;
        this._right = right;
    }

    static right(value) {
        return new Either(null, value);
    }

    static left(value) {
        return new Either(value, null);
    }

    isLeft() {
        return this._left !== null;
    }

    isRight() {
        return this._right !== null;
    }

    getLeft() {
        return this._left;
    }

    getRight() {
        return this._right;
    }
}
  
class Maybe {
    constructor(value, hasValue) {
        this._value = value;
        this._hasValue = hasValue;
    }
  
    static just(value) {
        return new Maybe(value, true);
    }
  
    static nothing() {
        return new Maybe(null, false);
    }
  
    isJust() {
        return this._hasValue;
    }
  
    isNothing() {
        return !this._hasValue;
    }
  
    getOrElse(defaultValue) {
        return this._hasValue ? this._value : defaultValue;
    }
  
    map(fn) {
        if (typeof fn !== 'function') {
            throw new Error('fn must be a callable function');
        }
  
        return this._hasValue ? Maybe.just(fn(this._value)) : Maybe.nothing();
    }
  
    flatMap(fn) {
        if (typeof fn !== 'function') {
            throw new Error('fn must be a callable function');
        }
  
        return this._hasValue ? fn(this._value) : Maybe.nothing();
    }
  
    toString() {
        return this._hasValue ? `Just ${this._value}` : 'Nothing';
    }
}


class State {
    constructor(fn) {
        if (typeof fn !== "function") {
            throw new Error("fn must be a callable function");
        }
        this._fn = fn;
    }
  
    static of(fn) {
        return new State(fn);
    }
  
    run(state) {
        return this._fn(state);
    }
  
    map(fn) {
        if (typeof fn !== "function") {
            throw new Error("fn must be a callable function");
        }
    
        return State.of((state) => {
            const [value, newState] = this.run(state);
            return [fn(value), newState];
        });
    }
  
    flatMap(fn) {
        if (typeof fn !== "function") {
            throw new Error("fn must be a callable function");
        }
    
        return State.of((state) => {
            const [value, newState] = this.run(state);
            return fn(value).run(newState);
        });
    }
  
    modify(fn) {
        if (typeof fn !== "function") {
            throw new Error("fn must be a callable function");
        }
    
        return State.of((state) => {
            return [null, fn(state)];
        });
    }
}
  
class Composition {
    constructor(start) {
        this._result = start;
    }
  
    static of(arg) {
        return new Composition(arg);
    }
  
    map(f) {
        if (typeof f !== "function") {
            throw new Error("f must be a callable function");
        }
  
        return new Composition(() => {
                const result = this.run();
                return f(result);
      });
    }
  
    run() {
        return typeof this._result === "function" ? this._result() : this._result;
    }
}
  


export {Element_html, Io, Either, Maybe, State, Composition};


/* 

let booleanHtmlStructure = (html, pattern, flag) => {
    //pattern: Es una expreción regular
    //Example
    //let pattern = 
    //`([.\\s\\S]*)<div class="container">([.\\s\\S]*)`+
    //    `<div class="row my-5">([.\\s\\S]*)`+
    //    `<h2 class="text-center">([.\\s\\S]*)</h2>([.\\s\\S]*)`+
    //    `</div>([.\\s\\S]*)`+
    //`</div>([.\\s\\S]*)`; 
    
    let validar_parametros = () =>{
        let get_boolean = (is_node(html)) && (typeof pattern === 'string'); 
        
        return (typeof get_boolean === 'boolean') 
            ? get_boolean 
            : (()=>{
                    console.log('El html o el patron pasado no cumplen con los tipos de datos requeridos.');
                    console.log(html);
                    console.log(pattern);
                    return null;
                })();
    };
    
    let fn_this = () =>{
        let convert_html_to_string = html_to_string(html);  
        // console.log(convert_html_to_string);
            //console.log(html);
        let regex = new RegExp(pattern);
        
        let resultado_de_text = ()=>{
            let boolean_test = regex.test(convert_html_to_string);
            return (typeof boolean_test === 'boolean') ? boolean_test : null;
        };

        let result = {
            'html': convert_html_to_string,
            'regex': pattern,
        };
        console.log(resultado_de_text());
        console.log('resultado_de_text()');

        return result[flag] ?? 
            ((resultado_de_text() === true)
                ? true
                : (()=>{
                        console.log('El test no se ha pasado. Error en la función <<booleanHtmlStructure()>> '+((resultado_de_text() === null)
                            ? 'El tes no da un resultado boleano, debe haber algún error.'
                            : 'El test no se ha validado, el html no coincide con la expreción regular.'+ resultado_de_text()));
                        console.log(convert_html_to_string);
                        console.log(pattern);
                        console.log(html);
                        return resultado_de_text();
                    })());
    };

    return (validar_parametros() === true)
        ? fn_this()
        : (()=>{               
                console.log('El html y el patron no son compatibles.');                
                console.log(html);                
                console.log(pattern);
                return null;
            })();
}


let html_test = (test_html = true, pattern) => {
    
    let boolean_html_test = booleanHtmlStructure(test_html, pattern);
    
    let result_html_test = () => {
        return (boolean_html_test === true) 
            ? test_html
            : (()=>{
                console.log('El html pasado no cumple con el test previsto. Error usando la función <<html_test>>');
                console.log(test_html);
                console.log(pattern);
                return null;
            })();
    };
    
    return (test_html === true) ? booleanHtmlStructure : result_html_test();
}


let map_key = (object, callback) => {
    let result = [];
    for (const key in object) {
        result = [...result, callback(key, object[key])];
    }
    return result;
};


let reduce_key = (objects_or_arrays, callback, initialize_result = null) => {
    let carry = initialize_result;
    if (Array.isArray(objects_or_arrays)) {
        for (let index = 0; index < objects_or_arrays.length; index++) {
            carry = callback(carry, index, objects_or_arrays[index]);
        };
    } else if (typeof objects_or_arrays === 'object'){
        for (const key in objects_or_arrays) {
            carry = callback(carry, key, objects_or_arrays[key]);
        };
    } else {
        carry = null;
    }
    return carry;
};

let concatenate = (array_of_elements_to_concatenate) => {
    return reduce_key(array_of_elements_to_concatenate, (carry, key, item) => {
        carry.append(item);
        return carry;
    }, document.createDocumentFragment());
};





let is_node = (check_node) => {
    let isNodeType = (check_node.nodeType === 1 || check_node.nodeType === 11);

    return (typeof isNodeType === 'boolean') 
        ? isNodeType
        : (()=>{
                console.log('No es un nodo: ');
                console.log(check_node);
                return null;
            })();
};


let inner = (string) => {
    let create_html = document.createElement('template');
    create_html.innerHTML = string;
    return document.importNode(create_html.content, true);
};


let html_to_string = (node_html) => {
    let htmlString = () =>{
        let clone_node_html =  node_html.cloneNode(true);
        let parent = document.createElement('div');
        parent.appendChild(clone_node_html);
        let result = parent.innerHTML;

        return (typeof result === "string") ? result : null;
    };

    return (is_node(node_html) === true)
        ? htmlString()
        : (()=>{
                console.log('No es un nodo válido de string.');
                console.log(node_html);
                return null;        
            })();
};



class Element_html {
    constructor(name_element, string_of_html, events_for_elements = []) {
        
        this.name_element = (typeof name_element === 'string')
            ? name_element
            : (()=>{
                    console.log('hay un problema con el nombre del elemento html.');
                    return null;
                })();

        this.html_element = (()=>{
                let transform_string_to_html = (is_node(string_of_html) && (typeof name_element === 'string'))
                    ? string_of_html.cloneNode(true)
                    : ((typeof string_of_html === 'string')
                        ? (()=>{
                                let resultado_de_nodo_html = inner(string_of_html);
                                return resultado_de_nodo_html;
                            })()
                        : (()=>{
                                console.log('Error en la asignación a this.html_element() el nombre no es string.');
                                return null;
                            })());

                return is_node(transform_string_to_html) 
                    ? transform_string_to_html 
                    : (()=>{
                        console.log('transform_string_to_html no es un nodo');
                        console.log('Error al asignar una propiedad a this.html_element()');
                        return null;
                    })();
            })();
        
        this.events_for_elements = events_for_elements;
    }
    
    
    get_name() {
        return (is_node(this.html_element)) 
            ? this.name_element
            : (()=>{
                    console.log('Error en el método name_element');
                    console.log('Este elemento no contiene un nodo html');
                    console.log(this.html_element);
                    return null;
                })();
    }
    
  
    get_html() {
        this.events_for_elements.forEach((event_to_add)=>{            
            event_to_add(this.html_element);
        }, );
        
        //console.log(this.html_element);
        return is_node(this.html_element)
            ? this.html_element
            : (()=>{
                    console.log('Error en el método get_html()');
                    return null;
                })();
    }
  
    get_string_html() {
        return is_node(this.html_element)
            ? html_to_string(this.html_element)
            : (()=>{
                    console.log('Error en el método get_string_html()');
                    return null;
                })();
    }
    
    set_add_event(new_name, arg_add_event){
       
        let event_added_to_element = [...this.events_for_elements, arg_add_event];
        let new_node = (this.html_element).cloneNode(true);
        let new_element_html = new Element_html(new_name, new_node, event_added_to_element);
        return (typeof arg_add_event === 'function') 
            ? new_element_html
            : (()=>{
                    console.log('Error en el método set_add_event()');
                    return null;
                })();
    }
}

*/
