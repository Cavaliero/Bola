var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    colorFondo = '#f27d0c';
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = colorFondo;
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/objetivo.png');
      game.load.image('objetivo2', 'assets/objetivo2.png');
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });
      
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
      game.physics.arcade.enable(objetivo2);

      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
      game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntuacionPlus, null, this);


//ESTO PETAAAAAAAA
      if(bola.body.checkWorldBounds()===false){
      game.stage.backgroundColor=colorFondo;
      }else{
      game.stage.backgroundColor='#ff3300';
      }
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
    app.oscureceFondo();
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
      app.aclaraFondo();
    }
  },

  incrementaPuntuacionPlus: function(){
    puntuacion = puntuacion+10;
    scoreText.text = puntuacion;

    objetivo2.body.x = app.inicioX();
    objetivo2.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
      app.aclaraFondo();
    }
  },

    aclaraFondo: function(){
    CompRed = '0x'+colorFondo[1]+colorFondo[2];
    CompGreen = '0x'+colorFondo[3]+colorFondo[4];
    CompBlue = '0x'+colorFondo[5]+colorFondo[6];

    CompRed = parseInt(CompRed, 16);
    CompGreen = parseInt(CompGreen, 16);
    CompBlue = parseInt(CompBlue, 16);

    CompRed = CompRed+0x10;
    CompGreen = CompGreen+0x10;
    CompBlue = CompBlue+0x10;

    if(CompRed>=0xFF){CompRed=0xFF};
    if(CompGreen>=0xFF){CompGreen=0xFF};
    if(CompBlue>=0xFF){CompBlue=0xFF};

    CompRed = CompRed.toString(16);
    CompGreen = CompGreen.toString(16);
    CompBlue = CompBlue.toString(16);    

    colorFondo = '#' + CompRed + CompGreen + CompBlue;
  },

  oscureceFondo: function(){
    CompRed = '0x'+colorFondo[1]+colorFondo[2];
    CompGreen = '0x'+colorFondo[3]+colorFondo[4];
    CompBlue = '0x'+colorFondo[5]+colorFondo[6];

    CompRed = parseInt(CompRed, 16);
    CompGreen = parseInt(CompGreen, 16);
    CompBlue = parseInt(CompBlue, 16);

    CompRed = CompRed-0x10;
    CompGreen = CompGreen-0x10;
    CompBlue = CompBlue-0x10;

    if(CompRed<=0xf2){CompRed=0xf2};
    if(CompGreen<=0x7d){CompGreen=0x7d};
    if(CompBlue<=0x0c){CompBlue='0c'};

    CompRed = CompRed.toString(16);
    CompGreen = CompGreen.toString(16);
    CompBlue = CompBlue.toString(16);    

    colorFondo = '#' + CompRed + CompGreen + CompBlue;
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}