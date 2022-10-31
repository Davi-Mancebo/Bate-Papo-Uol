// links da api
const entrarSalaUrl = "https://mock-api.driven.com.br/api/v6/uol/participants";
const testaConecUrl = "https://mock-api.driven.com.br/api/v6/uol/status";
const mensagensUrl = "https://mock-api.driven.com.br/api/v6/uol/messages"
// links da api
let usuario = prompt("insira seu nome de usuario:");
let ultimaMensagem = 0

const mainHtml = document.querySelector("main");

let scrollDown = true;



login();
recebeMensagens();

function login() {
    let user =  { name: usuario }
    const promisse = axios.post(entrarSalaUrl, user)
    .then(usuarioNovo)
    .catch(usuarioLogado);
}
function usuarioNovo(){

    let user = { name: usuario }
    setInterval(() => {
        const statusLogado = axios.post(testaConecUrl, user);
        statusLogado.catch(usuarioSaiu);
    }, 5000);

    setInterval(function(){
        recebeMensagens();    
    }, 3000);

}

function usuarioLogado(){zas
    usuario = prompt("usuario já existe, tente com um nome diferente!");
    login();
}

function usuarioSaiu(){
    alert("você perdeu conecxão com a sala!");
    window.location.reload();
}

function recebeMensagens(){
    const promisse = axios.get(mensagensUrl)
    promisse.then(imprimeMensagens);
    promisse.catch(semMensagens);
}
function imprimeMensagens(response){
    mainHtml.innerHTML = "";
    for(let i = 0; i < response.data.length; i++){
        if(response.data[i].type === "status"){
            mainHtml.innerHTML += `
            <div class="message status message${i}">
                <p>
                    <span class="time">(${response.data[i].time})</span> <span class="name">${response.data[i].from}</span> ${response.data[i].text}
                </p>
            </div>
            `;
        }
        else if(response.data[i].type === "message"){
            mainHtml.innerHTML += `
            <div class="message message${i}">
            <p>
                <span class="time">(${response.data[i].time})</span> <span class="name">${response.data[i].from}</span> para <span class="name">${response.data[i].to}:</span> ${response.data[i].text}
            </p>
        </div>
        `;
        }
        else if(response.data[i].to === usuario || response.data[i].from === usuario){
            mainHtml.innerHTML += `
            <div class="message private message${i}">
                <p>
                    <span class="time">(${response.data[i].time})</span> <span class="name">${response.data[i].from}</span> reservadamente para <span class="name">${response.data[i].to}</span>: ${response.data[i].text}
                </p>
            </div>
            `;
        }
        ultimaMensagem = i;
        scrollDown = true;
    }   
    mostraMensagem();
}
function semMensagens(){
    alert("Não foi possivel obter as mensagens do servidor");
    window.location.reload()
}

function mostraMensagem() {
    let showThisMessage = document.querySelector(".message" + ultimaMensagem);
    if(scrollDown){
        console.log(scrollDown)
        scrollDown = false;
        showThisMessage.scrollIntoView();
    }
}

function enviarMensagem() {
    let dados = {
        from: usuario,
        to: "Todos",
        text: document.querySelector("input").value,
        type: "message",
    }
    let promisse = axios.post(mensagensUrl, dados)
    promisse.then(imprimeMensagens, document.querySelector("input").value = "");
    promisse.catch(erroEnviarMensagem);
}
function erroEnviarMensagem() {
    alert("Erro ao enviar a mensagem, você foi desconectado!");
    window.location.reload();
}