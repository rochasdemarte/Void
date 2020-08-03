//-----------------------------
const mb = document.querySelector('.menu-bar');
const inputUser = document.querySelector('.msg');
inputUser.focus();
const send = document.querySelector('.send');
const mic = document.querySelector('.mic');
const micIcon = document.querySelector('.fa-microphone-slash');
const palavras = document.querySelector('.palavras');
let div = document.createElement('div');
let idiv = document.createElement('div');
let brLine = document.createElement('br');
const wKey = () =>{
  return '668ee6a4b1983a6a992d85802ac27508';
}
//-----------------------------

var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

const synth = window.speechSynthesis;
const fala = new SpeechSynthesisUtterance();
fala.voice = synth.getVoices()[16];
fala.lang = 'pt_BR';
fala.volume = 1;
fala.rate = 1;
fala.pitch = 1;
//-----------------------------
fala.onend = () => {
  
};
//-----------------------------
let on = false;

const voidOnOff = () => {
  if (!on) {
    micIcon.classList.remove('fa-microphone-slash');
    micIcon.classList.add('fa-microphone');
    ouvir();
    on = true;
  } else {
    micIcon.classList.remove('fa-microphone');
    micIcon.classList.add('fa-microphone-slash');
    on = false;
  }
};

mic.onclick = () => {
  voidOnOff();
};
//-----------------------------
send.onclick = () => {
  if (inputUser.value !== '') {
    ler();
  }
};
//-----------------------------
inputUser.onkeydown = e =>{
  if (e.keyCode == 13 && inputUser.value !== '') {
    ler();
  }
};
//-----------------------------
let showBar = x => {
  x.classList.toggle("muda");
}
//-----------------------------
const ler = () => {
  let tscript = inputUser.value;
  idiv = document.createElement('div');
  idiv.classList.add('user-msg');
  brLine = document.createElement('br');
  palavras.appendChild(idiv);
  palavras.appendChild(brLine);
  idiv.innerHTML = tscript;
  palavras.scrollTop = palavras.scrollHeight;
  inputUser.value = '';
  inputUser.focus();
  responder(tscript);
  console.log('Lendo:'+tscript);
};
//-----------------------------
const ouvir = () => {
  recognition.start();
  recognition.onresult = evt => {
    console.log(evt);
    const transcript = Array.from(evt.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')


    if (evt.results[0].isFinal) {
      idiv = document.createElement('div');
      idiv.classList.add('user-msg');
      palavras.appendChild(idiv);
      idiv.innerHTML = transcript;
      palavras.scrollTop = palavras.scrollHeight;
      responder(transcript);
    }

    console.log('Ouvindo:'+transcript);
  };
  recognition.addEventListener('end', recognition.start);
};
//-----------------------------
const falar = (msg) => {
  div = document.createElement('div');
  div.classList.add('void-msg');
  palavras.appendChild(div);
  div.innerHTML = msg;
  palavras.scrollTop = palavras.scrollHeight;
  fala.voice = synth.getVoices()[16];
  let msgNoSpan = msg.replace(/<span class=\"searchmatch\">|<\/span>|&nbsp;Nota:&nbsp;/g, '');
  fala.text = msgNoSpan;
  synth.speak(fala);
};
//-----------------------------
const responder = (msgRaw) => {

  let msg = msgRaw.toLowerCase();

  let resposta = 'Não entendi';

  if (msg.includes('void desligar')) {
    if (on) {
      let resposta = 'Ok, desligando ';
      voidOnOff();
    } else {
      let resposta = 'Reconhecimento de voz desativado. Para ativa-lo digite ou diga Void Ligar.';
    }
    console.log(resposta);
    falar(resposta);
  } else if (msg.includes('void ligar')) {
    if (!on) {
      let resposta = 'Ok, desligando ';
      voidOnOff();
    } else {
      let resposta = 'Já estou ouvindo, gostaria de alguma ajuda?';
    }
    console.log(resposta);
    falar(resposta);
  }
  else if (msg.includes('bom dia')) {
    let resposta = 'Bom dia, como está no dia de hoje?';
    console.log(resposta);
    falar(resposta);
  }
  else if (msg.includes('que horas são')) {
    console.log(getHora());
    falar(getHora());
  }
  else if (msg.includes('que dia é hoje')) {
    console.log(getDia());
    falar(getDia());
  }
  else if (msg.includes('o que é')) {
    console.log('Pesquisando Wikpédia');
    getWiki(msg.slice(msg.lastIndexOf(' é ')+3));
  }
  else if (msg.includes('qual é o')) {
    console.log('Pesquisando Wikpédia');
    getWiki(msg.slice(msg.lastIndexOf(' o ')+3));
  } else if (msg.includes('qual é a')) {
    console.log('Pesquisando Wikpédia');
    getWiki(msg.slice(msg.lastIndexOf(' a ')+3));
  } else if (msg.includes('quais são os')) {
    console.log('Pesquisando Wikpédia');
    getWiki(msg.slice(msg.lastIndexOf(' os ')+4));
  } else if (msg.includes('quais são as')) {
    console.log('Pesquisando Wikpédia');
    getWiki(msg.slice(msg.lastIndexOf(' as ')+4));
  }
  else if (msg.includes('qual a previsão do tempo em')) {
    console.log('prevendo');
    getPrevisãoTempo(msg.slice(msg.lastIndexOf(' em ')+4));
  } else if (msg.includes('qual a previsão do tempo na')) {
    console.log('prevendo');
    getPrevisãoTempo(msg.slice(msg.lastIndexOf(' na ')+4));
  } else if (msg.includes('qual a previsão do tempo nas')) {
    console.log('prevendo');
    getPrevisãoTempo(msg.slice(msg.lastIndexOf(' nas ')+5));
  } else if (msg.includes('qual a previsão do tempo no')) {
    console.log('prevendo');
    getPrevisãoTempo(msg.slice(msg.lastIndexOf(' no ')+4));
  } else if (msg.includes('qual a previsão do tempo nos')) {
    console.log('prevendo');
    getPrevisãoTempo(msg.slice(msg.lastIndexOf(' nos ')+5));
  }
  else if (msg.includes('qual a temperatura em')) {
    console.log('prevendo');
    getTemperatura(msg.slice(msg.lastIndexOf(' em ')+4));
  } else if (msg.includes('qual a temperatura na')) {
    console.log('prevendo');
    getTemperatura(msg.slice(msg.lastIndexOf(' na ')+4));
  } else if (msg.includes('qual a temperatura nas')) {
    console.log('prevendo');
    getTemperatura(msg.slice(msg.lastIndexOf(' nas ')+5));
  } else if (msg.includes('qual a temperatura no')) {
    console.log('prevendo');
    getTemperatura(msg.slice(msg.lastIndexOf(' no ')+4));
  } else if (msg.includes('qual a temperatura nos')) {
    console.log('prevendo');
    getPrevisãoTempo(msg.slice(msg.lastIndexOf(' nos ')+5));
  } else {
    console.log(resposta);
    falar(resposta);
  }
};
//-----------------------------
const getHora = () => {
  const time = new Date(Date.now());
  return `Agora são ${time.toLocaleTimeString('pt-BR', { hour: 'numeric', minute: 'numeric', hour12: false })}`;
};
//-----------------------------
const getDia = () => {
  const time = new Date(Date.now());
  return `Hoje é ${time.toLocaleDateString()}`;
};
//-----------------------------
const getWiki = (input) => {
  let pesquisa = input.replace(' ','%20');
  fetch(`https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${pesquisa}&format=json&origin=*`)
  .then( resposta => resposta.json())
  .then( resultadoBruto => {
    let resultado_0 = resultadoBruto.query.search[0].snippet;
    let resultado_0_title = resultadoBruto.query.search[0].title;
    let resultado_lista = resultadoBruto.query.search.length;
    console.log(resultado_lista);
    let resultado_wiki_final = resultado_0;
    falar(resultado_wiki_final);
  })
};
//-----------------------------
const getTemperatura = (cidade) => {
  //comando.split(' ')[5]
  fetch(`https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${wKey()}&units=metric&lang=pt_br`)
  .then( response => response.json())
  .then((clima)=>{
    if (clima.cod === '404'){
      falar(`Não consegui achar a temperatura para ${cidade}`);
      console.log(`Não consegui achar a temperatura para ${cidade}`);
      return;
    }
    falar(`${clima.name}, tem a Temperatura atual de ${clima.main.temp} graus Célcius`);
  })
};
//-----------------------------
const getPrevisãoTempo = (cidade) => {
  //comando.split(' ')[5]
  fetch(`https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${wKey()}&units=metric&lang=pt_br`)
  .then((response)=>{
    return response.json();
  }).then((clima)=>{
    if (clima.cod === '404'){
      falar(`Não consegui achar a previsão para ${cidade}`);
      console.log(`Não consegui achar a previsão para ${cidade}`);
      return;
    }
    falar(`A previsão do tempo para ${clima.name} é de ${clima.weather[0].description}`);
  })
};
