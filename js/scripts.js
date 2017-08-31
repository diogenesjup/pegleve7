/*##################################################################################################################
####################################################################################################################
####################################################################################################################

	CORE DE PROCESSOS E FUNÇÕES PEGA&LEVA
	DIOGENES OLIVEIRA DOS SANTOS JUNIOR
	HTTPS://WWW.DIOGENESJUNIOR.COM.BR
	CONTATO@DIOGENESJUNIOR.COM.BR

	VERSÃO 1
	DATA: 14 DE ABRIL DE 2017
   
    
    SEC001 - URL GERAL DA API
    SEC002 - FAZER A DIV DE CAPA SUMIR DEPOIS DE 6 SEGUNDOS
    SEC003 - VERIFICAR LOGIN E SENHA DO USUÁRIO
    SEC004 - CADASTRAR NOVO USUÁRIO
    SEC005 - VERIFICAR SE O USUÁRIO ESTÁ LOGADO PARA PODER ACESSAR DETERMINADA TELA
    SEC006 - PREENCHER DADOS DO USUÁRIO LOGADO NA PÁGINA DE PERFIL
    SEC007 - SALVAR SOLICITAÇÃO DE VIAGEM NO BANCO DE DADOS


####################################################################################################################
####################################################################################################################
####################################################################################################################*/


// SEC001 - URL DA API

var apiUrl = "https://104.238.100.93/~peglevecom/administrativo/";


// SEC002 - FAZER A DIV DE CAPA SUMIR DEPOIS DE 6 SEGUNDOS
setTimeout(function() {
    $(".cover").fadeOut("500");
}, 6000);


// SEC003 - VERIFICAR LOGIN
$('#loginLogar').click(function(){

    var login = $("#loginEmail").val();
    var senha = $("#loginSenha").val();

    // ACESSO A API E VALIDAÇÃO DOS DADOS
    var request = $.ajax({
        method: "POST",
        url: apiUrl+"api-verificar-login.php",
        data: { login: login, senha: senha }
    })
    request.done(function (msg) {
        
        // CONVERTER DADOS PARA JSON
        var dados = JSON.parse(msg);

        if (dados["erro"]) {

             //aqui deu erro de login e senha
             console.log("Login e senha não encontrados");
             alert("Login e senha não encontrados");
             $("#loginEmail").val("");
             $("#loginSenha").val("");

        } else {
            
            //aqui login e senha deu certo
            console.log("Deu certo o login e senha, vamos direcionar o usuário:");
            localStorage.setItem("usuario", "logado");
            localStorage.setItem("idUsuario",dados["id_usuario"]);
            localStorage.setItem("saldo",dados["saldo_usuario"]);
            localStorage.setItem("nome_completo",dados["nome_completo"]);
            localStorage.setItem("nome_curto",dados["nome_curto"]);        
            console.log(dados["nome_completo"]);

            location.href="dashboard.html";               

        }

    });
    request.fail(function (msg) {

       //aqui é se deu erro na chamada
       console.log("Não conseguimos acessar o servidor da API");

    });
    // FIM DA CHAMADA

    

});




// SEC004 - CADASTRAR NOVO USUÁRIO
$('#loginCadastro').click(function(){

    var nome = $("#cadastroNome").val();
    var email = $("#cadastroEmail").val();
    var senha = $("#cadastroSenha").val();

    // ACESSO A API E VALIDAÇÃO DOS DADOS
    var request = $.ajax({
        method: "POST",
        url: apiUrl+"api-cadastrar-usuario.php",
        data: { nome: nome, email: email, senha: senha }
    })
    request.done(function (msg) {
        

        // CONVERTER DADOS PARA JSON
        var dados = JSON.parse(msg);

        if (dados["erro"]) {

             //aqui deu erro de login e senha
             console.log("E-mail já cadastrado");
             alert("Esse e-mail já está cadastrado no nosso sistema");
             $("#cadastroNome").val("");
             $("#cadastroEmail").val("");
             $("#cadastroSenha").val("");

        } else {
            
            //aqui login e senha deu certo
            console.log("Deu certo o cadastro foi realizado com sucesso");

            localStorage.setItem("usuario", "logado");
            localStorage.setItem("idUsuario",dados["id_usuario"]);
            localStorage.setItem("saldo",dados["saldo_usuario"]);
            localStorage.setItem("nome_completo",dados["nome_completo"]);
            localStorage.setItem("nome_curto",dados["nome_curto"]);        

            console.log(dados);
            alert("Cadastro realizado com sucesso! Bem vindo :)");
            location.href="dashboard.html";               

        }

    });
    request.fail(function (msg) {

       //aqui é se deu erro na chamada
       console.log("Não conseguimos acessar o servidor da API");

    });
    // FIM DA CHAMADA
    

});



// SEC005 - VERIFICAR SE O USUÁRIO ESTÁ LOGADO PARA PODER ACESSAR DETERMINADA TELA
function verificarSessao(){

    var logado = localStorage.getItem("usuario");    
    
    // SE O USUÁRIO NÃO TIVER SESSÃO ATIVA, VAMOS DIRECIONAR ELE PARA A PÁGINA DE LOGIN
    if(logado!="logado"){
        console.log("Usuário não está logado...");
        location.href="index-login.html";
    }else{
        console.log("Usuário logado...");
    }

}



// SEC006 - PREENCHER DADOS DO USUÁRIO LOGADO NA PÁGINA DE PERFIL
function preencherPerfil(){

    var idUsuario = localStorage.getItem("idUsuario"); 

    // ACESSO A API E VALIDAÇÃO DOS DADOS
    var request = $.ajax({
        method: "POST",
        url: apiUrl+"api-pop-perfil.php",
        data: { idUsuario: idUsuario }
    })
    request.done(function (msg) {
        
        // CONVERTER DADOS PARA JSON
        var dados = JSON.parse(msg);

        if (dados["erro"]) {

             //aqui deu erro de login e senha
             console.log("Ocorreu um erro ao consultar os dados do usuário");
             alert("Ocorreu um erro na plataforma, por favor faça seu login novamente");
             location.href="index.html";

        } else {
            
            //aqui login e senha deu certo
            console.log("Vamos preencher os dados do perfil do usuário");
            
            $("#perfilNome").val(dados["nome_completo"]);
            $("#perfilEmail").val(dados["email"]);
            $("#perfilSenha").val(dados["senha"]);
            $("#fotoPerfil").attr("src",apiUrl+"images_perfil/"+dados["fotoPerfil"]); 

            if(dados["fotoPerfil"]==""){
                 $("#fotoPerfil").attr("src","images/default.jpg"); 
            }

            console.log("NOME PERFIL: "+dados["nome_completo"]);
            console.log("EMAIL PERFIL: "+dados["email"]);
            console.log("SENHA PERFIL: "+dados["senha"]);
            console.log("FOTO PERFIL: "+dados["fotoPerfil"]);                          

        }

    });
    request.fail(function (msg) {

       //aqui é se deu erro na chamada
       console.log("Não conseguimos acessar o servidor da API");

    });
    // FIM DA CHAMADA
  

}



// SEC007 - SALVAR SOLICITAÇÃO DE VIAGEM NO BANCO DE DADOS
function iniciarJornada(){
    
    // RECUPERAÇÃO DE DADOS
    var idUsuario       = localStorage.getItem("idUsuario");
    var origemXml       = localStorage.getItem("origemXml");
    var destinoXml      = localStorage.getItem("destinoXml");
    var transporteXml   = localStorage.getItem("transporteXml");
    var duracaoXml      = localStorage.getItem("duracaoXml");
    var distanciaXml    = localStorage.getItem("distanciaXml");
    var valorXml        = localStorage.getItem("valorXml");

    // ACESSO A API E VALIDAÇÃO DOS DADOS
    var request = $.ajax({
        method: "POST",
        url: apiUrl+"api-iniciar-jornada.php",
        data: { idUsuario: idUsuario, origemXml: origemXml, destinoXml: destinoXml, transporteXml: transporteXml, duracaoXml: duracaoXml, distanciaXml: distanciaXml, valorXml: valorXml }
    })
    request.done(function (msg) {
        
        // CONVERTER DADOS PARA JSON
        //var dados = JSON.parse(msg);

        if (!msg) {

             //aqui deu erro de login e senha
             console.log("Ocorreu um erro ao consultar os dados do servidor");
             alert("Ocorreu um erro na plataforma, por favor tente novamente");
             location.href="dashboard.html#paginaViagemUnica";

        } else {
            
            console.log("DADOS DA VIAGEM SALVOS COM SUCESSO");    
            location.href="dashboard.html#paginaViagemUnicaConfirmacao";    
            console.log("RETORNO: "+msg);                  

        }

    });
    request.fail(function (msg) {

       //aqui é se deu erro na chamada
       console.log("Não conseguimos acessar o servidor da API");

    });
    // FIM DA CHAMADA
    

}