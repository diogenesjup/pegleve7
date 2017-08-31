
var apiUrl = "https://104.238.100.93/~peglevecom/administrativo/";

// GEOLOCALIZAÇÃO
    $('#getInfoEndereco').click(function(){

        var endereco = $("#enderecoGeocoding").val();
        var request = $.ajax({
            method: "GET",
            url: "https://maps.googleapis.com/maps/api/geocode/json?address="+endereco+"&key=AIzaSyCUGRiH2iey-c2WqqeegGF2qpxBDNLsmfQ"
            //data: { email: login, senha: senha }
        })
        request.done(function (msg) {
            
            console.log(msg["results"]);
            $("#resultadoGeocoding").append("<b>Endereço:</b> "+msg["results"][0]["formatted_address"]+"<br>");
            $("#resultadoGeocoding").append("<b>Place ID GoogleMaps:</b> "+msg["results"][0]["place_id"]+"<br>");
            $("#resultadoGeocoding").append("<b>Latitude:</b> "+msg["results"][0]["geometry"]["location"]["lat"]+"<br>");
            $("#resultadoGeocoding").append("<b>Longitude:</b> "+msg["results"][0]["geometry"]["location"]["lng"]+"<br><br>");
           

        });
        request.fail(function () {
            alert("Ocorreu um erro ao tentar se comunicar com o Google Maps");
        });

    });


    // DISTANCIA MATRIX
    $('#getInfoEnderecoDistMatrix').click(function(){

        $("#resultadoGeocodingMatrix").append("<div style='padding:12px;padding-top:6px;text-align:center;'>carregando...</div>");

    });     
    $('#getInfoEnderecoDistMatrix').click(function(){

        var enderecoOrigem = $("#enderecoOrigemMatrix").val();
        var enderecoDestino = $("#enderecoDestinoMatrix").val();   
        var tipoVeiculo = $("#tipoVeiculo").val();
        console.log("Iniciamos");

        var request = $.ajax({
        method: "POST",
        url: apiUrl+"api-ler-xml.php",
        data: { enderecoOrigem: enderecoOrigem, enderecoDestino: enderecoDestino, tipoVeiculo: tipoVeiculo }
        })
        request.done(function (msg) {
            
            $("#resultadoGeocodingMatrix").html(msg);     
            
            // ORIGEM
            var matrixOrigem = document.getElementById('matrixOrigem');
            var origemXml    = matrixOrigem.getAttribute('data-info');
            localStorage.setItem("origemXml", origemXml);

            // DESTINO
            var matrixDestino = document.getElementById('matrixDestino');
            var destinoXml    = matrixDestino.getAttribute('data-info');
            localStorage.setItem("destinoXml", destinoXml);
            
            // TRANSPORTE
            var matrixTransporte = document.getElementById('matrixTransporte');
            var transporteXml    = matrixTransporte.getAttribute('data-info');
            localStorage.setItem("transporteXml", transporteXml);

            // DURAÇÃO
            var matrixDuracao = document.getElementById('matrixDuracao');
            var duracaoXml    = matrixDuracao.getAttribute('data-info');
            localStorage.setItem("duracaoXml", duracaoXml);
            
            // DISTANCIA
            var matrixDistancia = document.getElementById('matrixDistancia');
            var distanciaXml    = matrixDistancia.getAttribute('data-info');
            localStorage.setItem("distanciaXml", distanciaXml);
            
            // VALOR
            var matrixValor     = document.getElementById('matrixValor');
            var valorXml        = matrixValor.getAttribute('data-info');
            localStorage.setItem("valorXml", valorXml);

            console.log("ORIGEM: "+origemXml); 
            console.log("DESTINO: "+destinoXml);   
            console.log("TRANSPORTE: "+transporteXml);     
            console.log("DURAÇÃO: "+duracaoXml);
            console.log("DISTANCIA: "+distanciaXml);   
            console.log("VALOR: "+valorXml);       

        });
        request.fail(function (msg) {

            alert("Não foi possível acessar a API GoogleMaps");
            
        });       

    }); 


    // CONSTRUIR ROTA
    var map;
    var directionsDisplay; // Instanciaremos ele mais tarde, que será o nosso google.maps.DirectionsRenderer
    var directionsService = new google.maps.DirectionsService();
    

        //############################################################################################
        //############################################################################################
        //
        // PEGAR COORDENADAS ATUAIS
        if( navigator.geolocation )
        {
           // Call getCurrentPosition with success and failure callbacks
           navigator.geolocation.getCurrentPosition( success, fail );
        }
        else
        {
           alert("Não foi possível pegar as coordenadas atuais");
        }
        function success(position)
             {
                 var pscLat;
                 var pscLon;
                 var cordenadas = "";  
                 cordenadas = position.coords.longitude;
                 cordenadas = cordenadas+", ";
                 cordenadas = cordenadas + position.coords.latitude;
                 pscLat = position.coords.latitude;
                 pscLon = position.coords.longitude;
                 // SE TIVERMOS A LOCALIZAÇÃO ATUAL, A GENTE COMEÇA A EXIBIR O MAPA A PARTIR DESSE PONTO
                 initialize(pscLat,pscLon);
                 console.log("V4: Coordenas atuais pegas com sucesso:"+cordenadas);
             }
        function fail()
             {
                alert("Não foi possível pegar as coordenadas atuais");
             }
        //     
        // FIM PEGAR COORDENADAS ATUAIS     
        //
        //##############################################################################################
        //##############################################################################################


function initialize(pscLat, pscLon) {

   directionsDisplay = new google.maps.DirectionsRenderer(); // Instanciando... 

   var latlng = new google.maps.LatLng(pscLat, pscLon);
 
   var options = {
      zoom: 13,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   };
  
 
   //map = new google.maps.Map(document.getElementById("mapa"), options);
   //directionsDisplay.setMap(map); // Relacionamos o directionsDisplay com o mapa desejado


   //carregarPontos();

}
 

/*
$('#getInfoEnderecoDistMatrix').click(function(){
   event.preventDefault();
 
   var enderecoPartida = $("#enderecoOrigemMatrix").val();
   var enderecoChegada = $("#enderecoDestinoMatrix").val();
 
   var request = { // Novo objeto google.maps.DirectionsRequest, contendo:
      origin: enderecoPartida, // origem
      destination: enderecoChegada, // destino
      travelMode: google.maps.TravelMode.DRIVING // meio de transporte, nesse caso, de carro
   };
 
   directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) { // Se deu tudo certo
         directionsDisplay.setDirections(result); // Renderizamos no mapa o resultado
         //directionsDisplay.setOptions( { suppressMarkers: true } );
      }
   });
});
*/




// NESSA FUNÇÃO QUE CARREGAMOS OS PONTOS NO MAPA
function carregarPontos() {

    console.log("Carregando pontos de marcadores no mapa");
 
    $.getJSON(apiUrl+'api-pontos.php', function(pontos) {
 
        $.each(pontos, function(index, ponto) {
 
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(ponto.Latitude, ponto.Longitude),
                title: "Meu ponto personalizado! :-D",
                icon: "images/car.png",
                map: map
            });
 
        });
 
    });
 
}



// FORÇAR A ATUALIZAÇÃO DO MAPA A CADA 30 SEGUNDOS
//setInterval("carregarPontos()", 15000);




// AUTO COMPLETE
function autoComplete() {

   // AUTO COMPLETE ORIGEM
   console.log("Tentando fazer o Auto Complete");
   var input = document.getElementById('enderecoOrigemMatrix');
   var autocomplete = new google.maps.places.Autocomplete(input);

   // AUTO COMPLETE DESTINO
   var input2 = document.getElementById('enderecoDestinoMatrix');
   var autocomplete2 = new google.maps.places.Autocomplete(input2);

}


   google.maps.event.addDomListener(window, 'load', autoComplete);