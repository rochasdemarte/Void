//-----------------------------
var elem = document.documentElement;
const ferramentasBar = document.querySelector('.nav-ferramentas');
const mb = document.querySelector('.menu-bar');
let navBarOpen = false;
const inputUser = document.querySelector('.msg');
inputUser.focus();
const send = document.querySelector('.send');
const mic = document.querySelector('.mic');
const micIcon = document.querySelector('.fa-microphone-slash');
const palavras = document.querySelector('.palavras');
const blocoDeNotas = document.querySelector('.bloco-de-notas');
let div = document.createElement('div');
let idiv = document.createElement('div');
let brLine = document.createElement('br');
let lastComando = '';
const wKey = () =>{
  return '668ee6a4b1983a6a992d85802ac27508';
}
//-----------------------------
let onEscritaDireta = false;
let finalTranscript = '';
var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

const synth = window.speechSynthesis;
const fala = new SpeechSynthesisUtterance();
fala.voice = synth.getVoices()[10];
fala.lang = 'pt-BR';
fala.volume = 1;
fala.rate = 1.5;
fala.pitch = 1;
//-----------------------------
const vozOpt = document.querySelector('#vozesOpt');
const vozVolume = document.querySelector('#vozVol');
const vozR = document.querySelector('#vozRate');
const vozP = document.querySelector('#vozPitch');
let vozMap = [];
//-----------------------------
const loadVozes = () => {
  let vozes = synth.getVoices();
  for (var i = 0; i < vozes.length; i++) {
    let voz = vozes[i];
    let op = document.createElement('option');
    op.value = voz.name;
    op.innerHTML = voz.name;
    vozOpt.appendChild(op);
    vozMap[voz.name] = voz;
  }
}
synth.onvoiceschanged = () => {
  loadVozes();
}
//-----------------------------
let on = false;
let onCounter = true;
const voidOnOff = () => {
  if (!on) {
    micIcon.classList.remove('fa-microphone-slash');
    micIcon.classList.add('fa-microphone');
    if (onCounter) {
      ouvir();
      onCounter = false;
    }
    on = true;
    console.log('Void Ligando');
  } else {
    micIcon.classList.remove('fa-microphone');
    micIcon.classList.add('fa-microphone-slash');
    on = false;
    console.log('Void Desligando');
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
  if (!navBarOpen) {
    ferramentasBar.style.right = '0';
    navBarOpen = true;
  } else {
    ferramentasBar.style.right = '-100px';
    navBarOpen = false;
  }
}
//-----------------------------
window.onfocus = () => {
  if (!onCounter) {
    ouvir();
  }
}
//-----------------------------
window.onblur = () => {
  if (!onCounter) {
    recognition.abort();
    recognition.removeEventListener('end', ouvir);
  }
}
//-----------------------------
fala.onstart = () => {
  recognition.abort();
  recognition.removeEventListener('end', ouvir);
};
//-----------------------------
fala.onend = () => {
  ouvir();
};
//-----------------------------
const escritaDireta = () => {
  onEscritaDireta = !onEscritaDireta;
  recognition.continuous = !recognition.continuous;
}
//-----------------------------
const insereConversa = (isUser, text) => {
  if (isUser) {
    idiv = document.createElement('div');
    idiv.classList.add('user-msg');
    palavras.appendChild(idiv);
    idiv.innerHTML = transcript;
    palavras.scrollTop = palavras.scrollHeight;
  } else {

  }
};
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
    if (onEscritaDireta) {
      let interimTranscripts = '';
      for (var i = evt.resultIndex; i < evt.results.length; i++) {
        let transcript = evt.results[i][0].transcript;
        if (evt.results[i].isFinal && on) {
          finalTranscript += transcript;
        } else {
          interimTranscripts += transcript;
        }
      }
      blocoDeNotas.innerHTML = finalTranscript + '<span style="color:#999">' + interimResults + '</span>';
    } else {
      const transcript = Array.from(evt.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')

      if (evt.results[0].isFinal && (on || transcript.toLowerCase() === 'ativar voz')) {
        idiv = document.createElement('div');
        idiv.classList.add('user-msg');
        palavras.appendChild(idiv);
        idiv.innerHTML = transcript;
        palavras.scrollTop = palavras.scrollHeight;
        responder(transcript);
      }
      console.log('Ouvindo:'+transcript);
    }
  };
  recognition.addEventListener('end', ouvir);
};
//-----------------------------
const falar = (msg) => {
  if (msg !== '' || msg !== ' ') {
    div = document.createElement('div');
    div.classList.add('void-msg');
    palavras.appendChild(div);
    if (msg.includes('Nota:')) {
      msg = msg.slice(msg.indexOf('.')+2);
    }
    div.innerHTML = msg;
    palavras.scrollTop = palavras.scrollHeight;
    //fala.voice = vozMap[vozOpt.value];
    fala.voice = synth.getVoices()[16];
    let msgNoSpan = msg.replace(/<span class=\"searchmatch\">|<\/span>|&nbsp;/g, '');
    fala.text = msgNoSpan;
    synth.speak(fala);
  }
};
//-----------------------------
const responder = (msgRaw) => {

  let msg = msgRaw.toLowerCase();
  msg = msg.replace('?', '');

  let resposta = naoSei[Math.floor(Math.random()*naoSei.length)];
  if (msg.includes('desativar voz')) {
    let resposta = '';
    if (on) {
      resposta = 'Ok, desligando ';
      voidOnOff();
    } else {
      resposta = 'Reconhecimento de voz desativado. Para ativá-lo digite ou diga Ativar voz.';
    }
    console.log(resposta);
    falar(resposta);
  } else if (msg.includes('ativar voz')) {
    let resposta = '';
    if (!on) {
      resposta = 'Olá, em que posso ajudar?';
      voidOnOff();
    }  else {
      resposta = 'Já estou ouvindo, em que posso ajudar?';
    }
    console.log(resposta);
    falar(resposta);
  }
  else if (msg.includes('full screen')||msg.includes('tela cheia')) {
    let resposta = 'Ok';
    console.log(resposta);
    falar(resposta);
    if (!document.fullscreen) {
      openFullscreen();
    } else {
      closeFullscreen();
    }
  } else if (msg.includes('limpar conversa')||msg.includes('limpar tela')) {
    let resposta = 'Ok, Tela limpa';
    console.log(resposta);
    falar(resposta);
    palavras.innerHTML = "";
  }
  else if (msg.includes('bom dia')) {
    let resposta = 'Bom dia, como está no dia de hoje?';
    console.log(resposta);
    falar(resposta);
  }
  else if (msg.includes('oi') || msg.includes('olá') || msg.includes('e aí')|| msg.includes('ola') || msg.includes('e ai')) {
    let resposta = saudacao[Math.floor(Math.random()*saudacao.length)];
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
  else if (msg.includes('qual o significado da palavra')) {
    console.log('Pesquisando Dicionário');
    getDicio(msg.slice(msg.lastIndexOf(' palavra ')+9));
  } else if (msg.includes('qual o significado de')) {
    console.log('Pesquisando Dicionário');
    getDicio(msg.slice(msg.lastIndexOf(' de ')+4));
  } else if (msg.includes('o que significa')) {
    console.log('Pesquisando Dicionário');
    getDicio(msg.slice(msg.lastIndexOf(' significa ')+11));
  } else if (msg.includes('o que é')) {
    console.log('Pesquisando Wikpédia');
    getWiki(msg.slice(msg.lastIndexOf(' é ')+3));
  } else if (msg.includes('o que são')) {
    console.log('Pesquisando Wikpédia');
    getWiki(msg.slice(msg.lastIndexOf(' são ')+5));
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
  lastComando = msgRaw;
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
// const getHTML = (input) => {
//   let pesquisa = input.replace(' ','%20');
//   const url = `https://https://cors-anywhere.herokuapp.com/tudogostoso.com.br/busca?q=${pesquisa}`;
//   const html = await fetch(url).text();
//   const doc = new DOMParser().parseFromString(html, 'text/html');
//   doc.body;
//}
//-----------------------------
const getWiki = (input) => {
  let pesquisa = input.replace(' ','%20');
  const extractWiki =`https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=2&exlimit=1&titles=${pesquisa}&format=json&explaintext=1&formatversion=2&origin=*`;
  fetch(extractWiki)
  .then( resposta => resposta.json())
  .then( resultadoBruto => {
    let resultado_0 = resultadoBruto.query.pages[0].extract;
    let resultado_0_title = resultadoBruto.query.pages[0].title;
    console.log(resultado_0);
    let resultado_wiki_final = resultado_0;
    if (resultado_wiki_final === '') {
      getWikiList(pesquisa, false);
    } else {
      falar(resultado_wiki_final);
    }
  })

};
//-----------------------------
const getWikiImage = (input) => {
  let pesquisa = input.replace(' ','%20');
  const imageWiki =`https://pt.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${pesquisa}&origin=*`;
  fetch(imageWiki)
  .then( resposta => resposta.json())
  .then( res => {
    let pagina = res.query.pages;
    let imgURLpagina = Object.values(pages)[0].original.source;
    let paginatitulo = Object.values(pages)[0].title;
    console.log(paginatitulo);
    let resultado_wiki_final = imgURLpagina;
    if (resultado_wiki_final === '') {
      console.log('Não encontrei imagem para '+paginatitulo);
    } else {
      console.log('Link encontrado');
    }
  })

};
//-----------------------------
const getWikiList = (input, list) => {
  let pesquisa = input.replace(' ','%20');
  const listWiki = `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${pesquisa}&format=json&origin=*`;
  fetch(listWiki)
  .then( resposta => resposta.json())
  .then( resultadoBruto => {
    if (list) {
      let resultado_0 = resultadoBruto.query.search[0].snippet;
      let resultado_0_title = resultadoBruto.query.search[0].title;
      let resultado_lista = resultadoBruto.query.search.length;
      console.log(resultado_lista+'resultados para: '+resultado_0_title);
      falar('Achei '+resultado_lista+' resultados para '+resultado_0_title);
    } else {
      let resultado_0 = resultadoBruto.query.search[0].snippet;
      console.log(resultado_0);
      let resultado_wiki_final = resultado_0;
      falar(resultado_wiki_final);
    }
  })
};
//-----------------------------
const getDicio = (palavra) => {
  fetch(`https://dicio-api-ten.vercel.app/v2/${palavra}`)
    .then( res => res.json())
      .then( signif => {
        let significado = signif[0].meanings[0];
        let signifLength = signif[0].meanings.length;
        let signifClasseGramatical = signif[0].class;
        console.log(significado);
        console.log(signifClasseGramatical);
        falar(significado + 'Encontrei mais ' + signifLength + ' significados para ' + palavra)
      })
};
//-----------------------------
const getReceita = (palavra) => {
  fetch(`https://cors-anywhere.herokuapp.com/significado.herokuapp.com/${palavra}`)
    .then( res => res.json())
      .then( livroreceita => {
        let significado = signif[0].meanings[0];
        let signifLength = signif[0].meanings.length;
        let signifClasseGramatical = signif[0].class;
        console.log(significado);
        console.log(signifClasseGramatical);
        falar(significado + 'Encontrei mais ' + signifLength + ' significados para ' + palavra)
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
//-----------------------------
let cep_pesquisa = {};
const getCEP = (cep) => {
  const getCEPURL = `https://cors-anywhere.herokuapp.com/api.postmon.com.br/v1/cep/${cep}`; //*cep*
  fetch(getCEPURL)
  .then((response)=>{
    return response.json();
  }).then((endereco)=>{
    if (endereco.cod === '404'){
      falar(`Não consegui achar nenhum endereço para o CEP ${cep}, confira se os dígitos estão todos certos`);
      console.log(`Não consegui achar nenhum endereço para o CEP ${cep}, confira se os dígitos estão todos certos`);
      return;
    }
    falar(`CEP encontrado`);
    cep_pesquisa = {
      numero: endereco.cep,
      logradouro: endereco.logradouro,
      complemento: endereco.complemento,
      cidade: endereco.cidade,
      estado: endereco.estado_info.nome,
      estado_sigla: endereco.estado,
    }
    console.log(cep_pesquisa);
  })
};
//-----------------------------
const getEncomenda = (codigo) => {
  const getEncomendaURL = `https://cors-anywhere.herokuapp.com/api.postmon.com.br/v1/rastreio/ect/${codigo}`; //*codigo_rastreio*
  fetch(getEncomendaURL)
  .then((response)=>{
    return response.json();
  }).then((encomenda)=>{
    if (encomenda.cod === '404'){
      falar(`Não consegui achar a encomenda para o código ${codigo}`);
      console.log(`Não consegui achar a encomenda para o código ${codigo}`);
      return;
    }
    falar(`Encomenda rastreada`);
    console.log(encomenda);
  })
};
//-----------------------------
const openFullscreen = () => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari e Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}
const closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}
