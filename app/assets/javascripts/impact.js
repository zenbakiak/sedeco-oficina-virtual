      /*Flags*/
    var IMPACTO = 1;
    var SUELO = 2;
    var SEGURIDAD = 3;

    var TIPO_NORMAL= 1;
    var TIPO_FECHA = 2;
    var TIPO_RANGO = 3;
    var TIPO_LUGAR = 4;

    
  /*Cuando se da clic a una opcion se obtiene el tama*/
  function buttonClick(actual,clicked, next, restriction, next_restrictions){
    changeColorSelected(actual,clicked);
    deleteAndFill(actual,clicked, next, restriction, next_restrictions,TIPO_NORMAL, 0);
  }

  /*Cuando se da clic a una opcion se obtiene el tama*/
  function dateClick(actual,clicked, next, restriction, next_restrictions,index){
    //var date = $(".date_"+clicked).val();
    var date = $("#date_"+actual+"_"+clicked+" option:selected").text();
    alert(date);
    deleteAndFill(actual,clicked, next, restriction, next_restrictions,TIPO_FECHA, date);
  }

  /*Se elimina la classe hidden para hacer visible el view y se actualizan los progress bar*/
  function hidden_div(id, impacto, suelo, seguiridad){
    //hacemos invisible la salida
    $('.diagnostic').addClass("hidden");
    //hacemos visible el view de pregunta
    document.getElementById(id).removeAttribute("class");
    //Actualizamos los progressBars
    progressBar(impacto, suelo, seguiridad);
  }

  /*Elimina todos los views despues del clickeado y con ajax muestra el siguiente view*/
  function deleteAndFill(actual,clicked,next,restriction,next_restrictions, tipo, date){
    for(i = parseInt(actual)+1; i <= number_of_views; i++){
      var element = document.getElementById(i)
        if(element != null){
          element.setAttribute("class", "hidden");
        }
    }

    if(tipo == TIPO_NORMAL){
      save_advance(actual,clicked,next,restriction,next_restrictions);
    }else if(tipo == TIPO_FECHA){
     save_advance_date(actual,clicked,next,restriction,next_restrictions, date);
    }
    
  }

  /*Cambia el color del texto seleccionado, en caso de regresarte cambia todos los textos siguientes a color original*/
  function changeColorSelected(actual, clicked){
    for(i=actual; i<=number_of_views; i++){
      for(j=1; j<8; j++){

        var element = document.getElementById(i+"-"+j)
        if(element != null){
          element.style.color = '#000000';//Cambiamos el color del texto por default
        }

        var element = document.getElementById("image"+i+"-"+j)
        if(element != null){
          element.classList.remove("rcorner-selected");
        }
      }
    }

    document.getElementById(actual+"-"+clicked).style.color = '#871C57'; //Cambiamos el color del texto que seleccionamos
    document.getElementById("image"+actual+"-"+clicked).className = "rcorner rcorner-selected";

  }

  /*Se guarda el valor clikeado para saber que vista sigue*/
  function save_advance(actual,clicked,next,restriction,next_restrictions){
    $.ajax({
         type:'GET', 
         url: "#{root_path}",
         success: function(){
          show_view(next, restriction, next_restrictions)
         },
        error: function(){
        }, 
         data: $.param({ savetime: {actual: actual, clicked: clicked}})
    });
  }

  /*Se guarda el valor clikeado para saber que vista sigue SOLO PARA LOS DE FORMATO FECHA*/
  function save_advance_date(actual,clicked,next,restriction,next_restrictions, date){
    $.ajax({
         type:'GET', 
         url: "#{root_path}",
         success: function(){
          show_view(next, restriction, next_restrictions)
         },
        error: function(){
        }, 
         data: $.param({ savedate: {actual: actual, clicked: clicked, date: date}})
    });
  }

  /*Se muestra la vista dependiendo si existe una restriccion */
  function show_view(next, restriction,next_restrictions){
    $.ajax({
         type:'GET', 
         url: "#{root_path}",
         success: function(){
          window.scrollBy(0, 300);
         },
        error: function(){
        }, 
         data: $.param({ pagetime: {next: next, totals: number_of_views, restriction: restriction, next_restrictions: next_restrictions }})
    });
  }


  function finaliza_uso_equipamiento(){
    //hacemos visible la salida y la llenamos con la información
    $('.diagnostic').removeClass("hidden");
    $('.jumbotron').html('<H2 class="colorprimario">Especial<H2>');
    $('.next-step').html('<colorprimario>Siguiente paso "Hacer una cita"</colorprimario><a class="colorprimario" href="/"><span class="glyphicon glyphicon-chevron-right"></span></a>');   
    progressBar("100","100","0"); 
  }


  /*Prepara la vista cuando de detecta un impacto zonal*/
  function finaliza_impacto_zonal(){
    //hacemos visible la salida y la llenamos con la información
    $('.diagnostic').removeClass("hidden");
    $('.jumbotron').html('<H2 class="colorprimario">Impacto Zonal<H2>');
    $('.next-step').html('<colorprimario>Siguiente paso "Hacer una cita"</colorprimario><a class="colorprimario" href="/"><span class="glyphicon glyphicon-chevron-right"></span></a>');    
    //Actualizamos los progressBars
    progressBar("100","0","0");

  }

  /*Prepara la vista cuando de detecta un impacto vecinal*/
  function finaliza_impacto_vecinal(tipo){
    //hacemos visible la salida y la llenamos con la información
    $('.diagnostic').removeClass("hidden");
    $('.jumbotron').html('<H2 class="colorprimario">Impacto Vecinal<H2>');

    if(tipo == 'cita'){
      $('.next-step').html('<colorprimario>Siguiente paso "Hacer una cita"</colorprimario><a class="colorprimario" href="/"><span class="glyphicon glyphicon-chevron-right"></span></a>');   
    }else if('normal'){
      $('.next-step').html('<colorprimario>Siguiente paso "Uso de suelo"</colorprimario><a class="colorprimario" href="/zoning"><span class="glyphicon glyphicon-chevron-right"></span></a>');   
    }
     
    //Actualizamos los progressBars
    progressBar("100","0","0");
  }

  /*Prepara la vista cuando de detecta un bajo impacto*/
  function finaliza_bajo_impacto(){
    //hacemos visible la salida y la llenamos con la información
    $('.diagnostic').removeClass("hidden");
    $('.jumbotron').html('<H2 class="colorprimario">Bajo impacto<H2>');
    $('.next-step').html('<colorprimario>Siguiente paso "Uso de suelo"</colorprimario><a class="colorprimario" href="/zoning"><span class="glyphicon glyphicon-chevron-right"></span></a>');    
    //Actualizamos los progressBars
    progressBar("100","0","0");
  }

  /*Maneja el llenado de las barras de progreso*/
  function progressBar(impacto,suelo, seguiridad){
        $('.progress-impacto').text("Impacto: "+impacto+"%");
        $('.progress-impacto-css').css({'width': impacto+'%'});

        $('.progress-uso').text("Suelo: "+suelo+"%");
        $('.progress-uso-css').css({'width': suelo+'%'});

        $('.progress-seguridad').text("Impacto: "+seguiridad+"%");
        $('.progress-seguridad-css').css({'width': seguiridad+'%'});

  }

   /*Se piden las colonias de una delegacion */
  function show_city(town){
    alert(town);
    $.ajax({
         type:'GET', 
         url: "#{root_path}",
         success: function(){
          window.scrollBy(0, 300);
         },
        error: function(){
        }, 
         data: $.param({ pagetime: {next: next, totals: number_of_views, restriction: restriction, next_restrictions: next_restrictions }})
    });
  }
