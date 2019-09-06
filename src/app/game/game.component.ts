import { Component, OnInit } from '@angular/core';
import {palabras} from '../palabras'
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { ServicioPalabrasService } from '../servicio-palabras.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

 //constantes que determinan la ruta relativa y extension de las imagenes del juego del ahorcado 

URL_IMAGENES_PRE = "assets/"
URL_IMAGENES_EXT = ".jpg"  

 palabritas: palabras = new palabras // Instanciamos la clase palabras, donde hallamos las palabras para jugar

  constructor(
    private _location: Location, 
    private route: Router, 
    private servicioPalabras: ServicioPalabrasService
    ) {

    //Rellenamos en el constructor las letras que vamos a utilizar para el juego (minusculas de la a-z)
   for(let letter=0; letter<26; letter++) {
      this.abecedario[letter] = String.fromCharCode(97+letter)
    }     
   }

  

   //Booleanos que controlan la aparicion o desaparicion de los botones de jugar y volver a intentar   
  juegoOn = true;
  juegoOff = !this.juegoOn;

  //Definimos las variables del scope que van a interactuar con el DOM por medio del bindeado

palabraoculta; 
mascara;
abecedario = [];
vidas = 4;
letrasUsadas = "";
mensaje = "¿Qué desea hacer?";

vidaImagen = this.URL_IMAGENES_PRE+"ahorcadoinicial"+this.URL_IMAGENES_EXT; //URL imagen cambiante durante los fallos en el juego


// Cuenta atras del juego. Si la cuenta llega a cero, el juego se acaba. 

timeLeft: number = 90;
interval;

// número Random entre 0 y la longitud del array de palabras para el juego

aleatorio = (Math.floor(Math.random() * (this.palabritas.palabrasJuego.length - 0 + 1)) + 0);


ngOnInit() {  

  
     this.palabraoculta = this.palabritas.palabrasJuego[this.aleatorio]  

    this.dibujarJuego(); //Al iniciar, ejecutamos el metodo dibujar
    this.cuentaAtras();
    
    this.getPalabras
   
  }

//Creamos el método dibujar juego que, una vez elegida la palabra a adivinar, va a enmascararla y mostrarla oculta en el DOM

dibujarJuego() {
 
  let temp = [...this.palabraoculta];  
  for (let i=0; i<this.palabraoculta.length; i++) {   
   temp[i] = '-'
    }    
    this.mascara = temp.join("");

}     

//Metodo o función principal que se encarga de ejecutar todas las acciones del juego, una vez que pulsamos el boton de "probar suerte" (en el HTML)

  game(selectedLetter) {

    let temp = [...this.mascara];  //Creamos una array temporal que recibe el valor actual de la palabra oculta  
    //let character = 'o'
    let contador = temp.length; //creamos una variable que nos sirve para evaluar. Tambien podemos usar un boolean

    for (let i=0; i<temp.length; i++) { //Recorremos la mascara
      if(this.palabraoculta.charAt(i) ==selectedLetter) { //Si la palabra elegida en el comboBox resulta que existe en el bucle, se ejecuta la acción
      temp[i] = selectedLetter; //sustituimos el valor de la posición del array temporal por la palabra elegida
      contador--;       //Indicamos que hemos encontrado un valor correcto, disminuyendo el contador para que sea distinto al valor original 
        }
      } 
      if(contador == temp.length) { //Si el contador tiene un valor identico al original, significa que no hemos acertado letra, y por tanto perdemos vidas
        this.vidas--;
        this.lifes();
      }
      this.mascara = temp.join(""); // modificamos el valor de la mascara con el valor del array temporal, convirtiendolo en string por medio de join()
      this.letrasEmpleadas(selectedLetter);  //Insertamos la letra elegida en el array de letras empleadas
   
      if(this.mascara == this.palabraoculta) { //Si la palabra de la mascara coincide con la palabra oculta, significa que hemos ganado. ¡HURRA!       
      this.gameOver(); //En tal caso, ejecutariamos la función de fin de juego
      }
      
     
  }  

  // Metodo que rellena el array de letras utilizadas durante el juego

  letrasEmpleadas(selectedLetter) {
    let tempusadas = [...this.letrasUsadas];
    tempusadas[(tempusadas.length)] = selectedLetter+" ";
    this.letrasUsadas = tempusadas.join("");
  }


  //Metodo que contiene un switch que nos permite cambiar la imagen que se muestra durante el juego y determinar si el jugador ha perdido, por medio del contador de vidas. 

  lifes() {
switch(this.vidas) {
  case 4:
      this.vidaImagen = this.URL_IMAGENES_PRE+"ahorcadoinicial"+this.URL_IMAGENES_EXT;    
    break;
    case 3:    
    this.vidaImagen = this.URL_IMAGENES_PRE+"ahorcadounfallo"+this.URL_IMAGENES_EXT;    
    break;
    case 2: 
    this.vidaImagen = this.URL_IMAGENES_PRE+"ahorcadodosfallos"+this.URL_IMAGENES_EXT;    
    break;
    case 1: 
    this.vidaImagen = this.URL_IMAGENES_PRE+"ahorcadotresfallos"+this.URL_IMAGENES_EXT;    
    break;
    case 0: 
     this.vidaImagen = this.URL_IMAGENES_PRE+"ahorcadocompleto"+this.URL_IMAGENES_EXT;    
    this.gameOver();
    break;   

    }
  }

  getPalabras() {
    this.servicioPalabras.getPost().subscribe(
      words=> {
        console.log(words);
        console.log(words)
      }
    )
    
  }

  cuentaAtras() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
       this.vidas = 0;
       this.lifes();
      }
    },1000)
  }


//Metodo que ejecutamos cuando el juego se termina, tanto si hemos perdido o ganado

  gameOver() {
     this.juegoOn = false;
  this.juegoOff = !this.juegoOn
    if(this.vidas==0){ //Evaluamos si hemos perdido por medio del marcador de vidas del jugador
  this.mascara = this.palabraoculta;
  this.mensaje = "HAS PERDIDO. EL JUEGO HA TERMINADO" 
  } else {
    this.mensaje = "¡FELICIDADES! ¡HAS GANADO!" 
    clearInterval(this.interval);
  }
  }

  //Metodo que nos permite recargar la página
  reload() {
    window.location.reload();
  }

  //Metodo que nos permite regresar atras

  backClicked() {
    this._location.back();
  }

}
