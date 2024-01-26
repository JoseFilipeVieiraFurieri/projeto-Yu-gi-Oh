// Manutenção de state

const state = {

        view: {
          score: {
            scoreBox: document.querySelector(".score_points"),
            scorePlayer: document.querySelector(".player-score"),
            computerScore: document.querySelector(".computer-score")
          },
          cardSprites: {
            avatar: document.getElementById("card_image"),
            name: document.getElementById("card_name"),
            type: document.getElementById("card_type"),
          },
          fieldCard: {
              player: document.getElementById("player-field-card"),
              computer: document.getElementById("computer-field-card")
            },
          handCards: {
            player: document.getElementById("player-cards"),
            computer: document.getElementById("computer-cards")
          }
        },
        values : {
            score: {
                playerScore: 0,
                computerScore: 0
              }
        },
        actions: {
            button: document.getElementById("next-duel")
        }
    
}




// objetos mapeando as cartas
const pathImg = 'src/assets/icons/'

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImg}dragon.png`,
        WinOf : [1 , 4],
        LoseOf : [2, 5],
        
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImg}magician.png`,
        WinOf : [2, 5],
        LoseOf : [0, 3],
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImg}exodia.png`,
        WinOf : [0, 3],
        LoseOf : [1, 4],
    },
    {
        id:3,
        name: "Caneta Azul",
        type: "Paper",
        img: `${pathImg}manoel-gomes.jpg`,
        WinOf : [1, 4],
        LoseOf : [2, 5],
    },
    {
        id:4,
        name: "Obelisk",
        type: "Rock",
        img: `${pathImg}obelisk.jpg`,
        WinOf : [2, 5],
        LoseOf : [0, 3],
    },
    {
        id:5,
        name: "Dark Magician Girl",
        type: "Scissors",
        img: `${pathImg}dark-magician-girl-anime-card.png`,
        WinOf : [0, 3],
        LoseOf : [1, 4],
    }
]

// funçoes

async function getRandomCardId() {
    const randomId = Math.floor(Math.random() * cardData.length)
    return cardData[randomId].id;
}

async function drawSelectCard(index) {

    state.view.cardSprites.avatar.src = cardData[index].img;
    state.view.cardSprites.name.innerText = cardData[index].name;
    state.view.cardSprites.type.innerText = `Atributo: ${cardData[index].type}`;

}

//essa função renderiza os detalhes das cartas no canto esquerdo. A logica é a seguinte, os elementos do documente ja estão selecinados no state. Nesse caso as imagens ja estão
// criadas(as tags ja estão no DOM sem necessidade do createElement) ai essa função vai ser chamada no mouseover e vai setar no src do elemento o caminho que esta no src do vetor
// cardData de acordo com o indice recebido no drawCards. A mesma coisa com o nome e type a unica difrerença e que vai mudar o innerText


async function removeAllCardsImages() {

    let cards = document.querySelector('#computer-cards');
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    cards = document.querySelector('#player-cards');
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
    //state.view.fieldCard.player.src = "";

    //state.view.fieldCard.computer.src = "";
}

// essa função serve para limpar os valores de dentro do field antes de setar cartas novas. coloquei o jeito que eu fiz comentado e o processo que o cara, eu não vi muita diferença
// em questão de resultado. Mas o metodo que eu coloquei remove o src e o do curso a imagens, teoricamente como a remoção de um elemento inteiro economiza mais memoria do que a remoção
// do endereço da imagem(pq a tag ainda vai estar la) ei creio que o metodo de remove deve ser mais perfomatico. Na verdade a intenção dele era remover para impedir repedtidos cliques
// eu não sabia dessa intenção , mas vou deixar ai para servir como aprendizado

async function updateScore(checkWin) {

    if (checkWin === "You win!!!") {
        let scoreText = state.view.score.scorePlayer.innerText.trim();
        let score = Number(scoreText.split(":")[1].trim()) || 0;
        let convert = score + 1;
        state.view.score.scorePlayer.innerText = `Win: ${convert}`;
    } else if (checkWin === "You Lose!!!") {
        let scoreText = state.view.score.computerScore.innerText.trim();
        let score = Number(scoreText.split(":")[1].trim()) || 0;
        let convert = score + 1;
        state.view.score.computerScore.innerText = `Lose: ${convert}`;
    }
}

// eu acabei mudando os elementos e tive que recorrer ao split. Em resumo ele separa o texto, corta ele depois do : e converte pra numero. O erro e que ao mudar
// os elementos de dentro pra um paragrafo e o texto o Nan não funcionava(pq ele não podia converter uma tag pra numero), ai tive que separam desse jeito.


async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

// so atualiza o botão com o texto e coloca display block(ele começa com none)

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.view.fieldCard.player.style.display = "block";

    state.view.fieldCard.computer.style.display = "block";

    state.view.fieldCard.player.src = cardData[cardId].img;

    state.view.fieldCard.computer.src = cardData[computerCardId].img;

    

    await hiddenCardDetails();

    await showHiddenCardFieldImages(true);


    let checkWin = await checkWinCondition(cardId, computerCardId);

    await updateScore(checkWin);
    await drawButton(checkWin);
}

// refatorar pra os 3 ultimos states ( em uma função separada)

async function hiddenCardDetails() {
    state.view.cardSprites.name.innerText = "";

    state.view.cardSprites.type.innerText = "";

    state.view.cardSprites.avatar.src = "";
}

async function showHiddenCardFieldImages(value) {
    if (value === true) {
        state.view.fieldCard.player.style.display = "block";

        state.view.fieldCard.computer.style.display = "block";
    } else {
        state.view.fieldCard.player.style.display = "none";
        state.view.fieldCard.computer.style.display = "none";
    }
}



// Essa função coloca as cartas clicadas no centro da tela. a logica e simples os states ja estão selecionados e as imagens ja estão no HTML( so não tem o src). Agora não entendi pq
// ele setou esse display block ai não, por padrão os elementos ja vem com display block . Aqui tambem é setado a carta do CPU( logico que não a IA por traz e so o random mesmo).
// Por fim tem a logica de duelo( regra do jokenpo)


// as funçoes hiddenCardDestails são refatoramentos das que tem o intuido de modificar compartimentalizar as funçoes de exibir os elementos na tela. A showHiddenCardFieldImages(value)
// recebe true na hora de clicar e na hora de resetar esconde
// obs: esta sumindo a borda, ver isso depois


async function checkWinCondition(cardId, computerCardId) {
    if ( cardData[cardId].WinOf.includes(computerCardId)) {
        await playAudio("win");
        return "You win!!!";
    } else if (cardData[cardId].LoseOf.includes(computerCardId)) {
        await playAudio("lose");
        return "You Lose!!!";
    }
    
    
    return "Draw!!!";
}

// eu coloquei ja a logica de duelo ai eu usei o includes para verificar se a o computer id esta presente no vetor winsOf. O cardId e usado para buscar o card do player e o computer
// id para ver se ha correspodencia no vetor winsOF, se não houver checa se a no loseOF e se nenhumadas duas forem correspondidas, é empate.


async function createCardImage(IdCard, fieldSide) {
    const imageCreated = document.createElement("img");
    imageCreated.setAttribute("height", "100px");
    // setar atributo do ele recem-criado. primeiro o atributo depois o valor
    imageCreated.setAttribute("src", "src/assets/icons/card-back.png");
    // vai setar primeiro a carta de costas
    imageCreated.setAttribute("data-id", IdCard);
    // atrelar o numero de id na carta criada
    imageCreated.classList.add("card");
    //add um classe

    console.log(fieldSide);

    if (fieldSide === 'player-cards') {
        imageCreated.addEventListener("click", () => {
            setCardsField(imageCreated.getAttribute("data-id"))
            console.log("clique");
        })

        imageCreated.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
        
    }

    // a logica é : ele vai adicionar um evento de clique se a carta setada for do espaço do player( no if). Se true ele vai adicionar um listener de clique
    // que ira chamar a função setCardsFields(id) que ira ser responsavel por jogar as cartas da mão do jogador para o campo. esse função recebe um id que é pega
    // atraves do get-atb do elemento recem-criado

    
    // eira adicionar um listener do tipo mouse hover(passar o mouse pra cima), e quando acontecer ira desenhar a carta no lado esquerdo da tela

    return imageCreated
}

async function playAudio(status) {
    const audio = new Audio(`src/assets/audios/${status}.wav`);
    audio.play();
}

async function drawCards(cardNumbers, handSide) {
    const handElement = document.getElementById(handSide);

    // Limpar o conteúdo existente antes de adicionar novas cartas
    handElement.innerHTML = "";


    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        let cardImage = await createCardImage(randomIdCard, handSide);

        handElement.appendChild(cardImage);
    }

    
}

// a função vai gerar um id aleatorio, que ira criar uma imagem atraves da função e por fim ira pegar o elemento de acordo com o fieldside(player-field-card e computer) que estão
// mapeados no objeto acima e fazer apend nelas ( o mapeamento e para evitar trocas frequentes de parametros e funçoes)

// eu tive que fazer a limpeza pq por algum motivo quando eu chamo a função duas vezes no init, ela ficava com a memoria da chamada anterior. Isso resultava em dados duplicados
// e renderização incorreta(renderizava 4 cartas para o jogador e 2 para o pc) então a cada loop feito eu limpei o conteudo do elemento e adicionei o novo. Eu acho que por algum motivo
// ele pegava a imagem com algum valor dentro e ocorria uma sobreposição, mas não entendi direito

// um dos principios do solid e que cada função fica encarregada de apenas um aspecto então e sempre bom dividir e não deixar uma unica função sobrecarregada. Acima a uma função 
// para gerar um id aleatoria, uma para criar a imagem e por fim a função drawCards fica responsavel mesmo por por apendar as cartas no field





// função init


async function resetDuel() {
        state.view.cardSprites.avatar.src = "";
        state.actions.button.style.display = "none";

        
    
    
        init();
}

function init() {
    
    const bgm = document.getElementById("bgm");
    bgm.play();
    
  showHiddenCardFieldImages(false);

  drawCards(6, "player-cards");
  drawCards(6, "computer-cards");




};



init();