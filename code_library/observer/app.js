class Observable {
    constructor() {
        this.observers = [];
    }

    static of() {
        return new Observable();
    }

    subscribe(observer) {
        this.observers.push(observer);
        return this;
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
        return this;
    }

    notify(data) {
        this.observers.forEach(observer => observer(data));
        return this;
    }
}
  
const totalPriceInput = document.getElementById('total-price');
const igvValue = document.getElementById('igv-value');
const subtotalValue = document.getElementById('subtotal-value');

const priceObservable = Observable.of().subscribe(calculateIGV).subscribe(calculateSubtotal);

function calculateIGV(totalPrice) {
    const igv = totalPrice * 0.18;
    igvValue.innerText = igv.toFixed(2);
}

function calculateSubtotal(totalPrice) {
    const subtotal = totalPrice / 1.18;
    subtotalValue.innerText = subtotal.toFixed(2);
}

totalPriceInput.addEventListener('input', (event) => {
    const totalPrice = parseFloat(event.target.value);
    if (!isNaN(totalPrice)) {
    priceObservable.notify(totalPrice);
    } else {
    igvValue.innerText = '0';
    subtotalValue.innerText = '0';
    }
});
  

/* 
Esta es la forma de trabajar si se va a suscribir una función antes de ser definida.

let formulario = Observable.of().subscribe(arg => mensaje_a(arg));

let mensaje_a = (arg)=>{
    console.log(arg);
}

document.addEventListener('click', (event) => {
    formulario.notify('Hola mundo');
    // aquí puedes colocar el código que se ejecutará cuando se haga clic en cualquier parte de la página
});

*/