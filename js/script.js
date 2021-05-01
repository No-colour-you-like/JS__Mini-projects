'use strict';

// ==============Validation form=============
const form = document.querySelector('#form'),
  username = document.querySelector('#input-username'),
  email = document.querySelector('#input-email'),
  password = document.querySelector('#input-password'),
  confirm = document.querySelector('#input-confirm'),
  submitBtn = document.querySelector('#validator-submit');


// Validate email
function checkEmail(input) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(input.value.trim())) {
    inputSuccess(input)
    changeStatusInfo(input, 'Подтверждено')
  } else {
    inputError(input)
    changeStatusInfo(input, 'Email не верен')
  }
}


// Success status input
const inputSuccess = (input) => {
  const validatorPart = input.parentElement;

  validatorPart.classList.remove('validator-error-status')
  validatorPart.classList.add('validator-success-status')
}

// Error status input
const inputError = (input) => {
  const validatorPart = input.parentElement;

  validatorPart.classList.remove('validator-success-status')
  validatorPart.classList.add('validator-error-status')
}

// Change status text
const changeStatusInfo = (input, statusText) => {
  const validatorPart = input.parentElement;
  const statusInfo = validatorPart.querySelector('p');

  statusInfo.innerHTML = `${statusText}`
}

// Check match passwords
const checkPasswords = (passwordOne, passwordTwo) => {
  if (passwordOne.value !== passwordTwo.value) {
    inputError(confirm)
    changeStatusInfo(confirm, 'Пароли не совпадают')
  } else if (confirm.value === '') {
    inputError(confirm)
    changeStatusInfo(confirm, 'Введите пароль')
  } else {
    inputSuccess(confirm)
    changeStatusInfo(confirm, 'Пароли совпадают')
  }

}


// Check all form
submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const checkValue = (input, max, min, statusEmpty) => {

    if (input.value.trim() === '') {
      inputError(input);
      changeStatusInfo(input, `${statusEmpty}`);
    } else if (input.value.length > max || input.value.length < min) {
      inputError(input);
      changeStatusInfo(input, `Количество символов должно быть от ${min} до ${max}`);
    } else {
      inputSuccess(input);
      changeStatusInfo(input, 'Подтверждено');
    }

  };

  checkValue(username, 10, 4, 'Введите имя');
  checkValue(password, 15, 7, 'Введите пароль');
  checkValue(confirm, 15, 7, 'Введите пароль');
  checkEmail(email);
  checkPasswords(password, confirm);

});

// ============== Movie seats ==================== 

const seats = document.querySelectorAll('.movie__seats .seat'),
  movieValue = document.querySelector('.movie__info-value'),
  moviePrice = document.querySelector('.movie__info-price'),
  movieSelect = document.querySelector('#movie-select'),
  movie = document.querySelector('#movie');

let moviePriceValue = +movieSelect.value;

// Reset values
const resetValues = () => {
  seats.forEach(seat => {
    seat.classList.remove('seat-chose')
  });
  movieValue.textContent = 0;
  moviePrice.textContent = 0;
};

// Change movie in select 
movieSelect.addEventListener('change', (e) => {
  moviePriceValue = +e.target.value;
  resetValues();
});

// Change movie value and save data seat in local storage 
const changeValue = () => {
  const chosenSeats = document.querySelectorAll('.movie__seats .seat-chose');

  movieValue.textContent = chosenSeats.length;
  moviePrice.textContent = chosenSeats.length * moviePriceValue;
}

// Click on seat
seats.forEach(seat => {
  if (!seat.classList.contains('seat-occupy')) {
    seat.addEventListener('click', () => {
      seat.classList.toggle('seat-chose')
      changeValue()
    })
  }
})

// ================== Currency calculator ======================

const currencySelectOne = document.querySelector('#select-one'),
  currencySelectTwo = document.querySelector('#select-two'),
  currencyInputOne = document.querySelector('#input-one'),
  currencyInputTwo = document.querySelector('#input-two'),
  changeInputsBtn = document.querySelector('#calculate-btn'),
  smallCurrencyNameOne = document.querySelectorAll('.currency__small-name-one'),
  smallCurrencyNameTwo = document.querySelectorAll('.currency__small-name-two'),
  currencyValueSingleOne = document.querySelector('#small-currency-one'),
  currencyValueSingleTwo = document.querySelector('#small-currency-two'),
  currencyInfo = document.querySelectorAll('.currency__info'),
  currencyImg = document.querySelectorAll('.currency__img');


const changeCurrency = () => {

  const currencyNameOne = currencySelectOne.value;
  const currencyNameTwo = currencySelectTwo.value;

  changeCurrencyImg(currencyNameOne, currencyImg[0])
  changeCurrencyImg(currencyNameTwo, currencyImg[1])

  currencyInfo.forEach(info => {
    info.classList.add('visibility-visible')
  })

  smallCurrencyNameOne.forEach(name => {
    name.textContent = currencyNameOne;
  })

  smallCurrencyNameTwo.forEach(name => {
    name.textContent = currencyNameTwo;
  })

  fetch(`https://api.exchangerate-api.com/v4/latest/${currencyNameOne}`)
    .then(res => res.json())
    .then(data => {
      const rate = data.rates[currencyNameTwo]
      currencyValueSingleOne.textContent = data.rates[currencyNameTwo]
      currencyInputTwo.value = (currencyInputOne.value * rate).toFixed(1)
    })

  fetch(`https://api.exchangerate-api.com/v4/latest/${currencyNameTwo}`)
    .then(res => res.json())
    .then(data => {
      currencyValueSingleTwo.textContent = data.rates[currencyNameOne]
    })
};

// Change currency image 
const changeCurrencyImg = (currencyName, img) => {

  function imgSrc(src) {
    return img.setAttribute('src', `img/currency/${src}`)
  }

  switch (currencyName) {
    case 'USD':
      imgSrc('usd.png')
      break
    case 'EUR':
      imgSrc('euro.png')
      break
    case 'RUB':
      imgSrc('russia.png')
      break
    case 'AUD':
      imgSrc('australia.png')
      break
    case 'CHF':
      imgSrc('switzerland.png')
      break
    case 'GBP':
      imgSrc('united-kingdom.png')
      break
  };
};

// Change inputs 
changeInputsBtn.addEventListener('click', () => {
  const selectValueOne = currencySelectOne.value
  currencySelectOne.value = currencySelectTwo.value
  currencySelectTwo.value = selectValueOne
  changeCurrency()
})

currencySelectOne.addEventListener('change', changeCurrency)
currencySelectTwo.addEventListener('change', changeCurrency)
currencyInputOne.addEventListener('input', changeCurrency)
currencyInputTwo.addEventListener('input', changeCurrency)


//============ Person filter =======================

const userBtn = document.querySelector('#add-user'),
  doubleMoneyBtn = document.querySelector('#double-money'),
  millionaireBtn = document.querySelector('#show-millionaire'),
  richestBtn = document.querySelector('#sort-richest'),
  calculateWealthBtn = document.querySelector('#calculate-wealth'),
  personMain = document.querySelector('#person-main');


let usersArr = [];

async function getUser() {
  // Download data user
  const res = await fetch('https://randomuser.me/api')
  const userData = await res.json()

  const userDataName = userData.results[0]

  const userDataMain = {
    name: `${userDataName.name.first} ${userDataName.name.last}`,
    wealth: Math.floor(Math.random() * 100000)
  }

  addUser(userDataMain)
}

// Add user in array and in HTML
const addUser = (user) => {
  usersArr.push(user)
  addUserInHTML(user.name, user.wealth)
};

// Make new div and put datas
const addUserInHTML = (userName, userWealth) => {
  const div = document.createElement('div')
  div.className = 'user-single'
  div.innerHTML = `<p>${userName}</p> <p>${userWealth} руб.</p>`
  personMain.append(div)
}

// Update users and add 5 new on click
userBtn.addEventListener('click', () => {
  usersArr = []
  personMain.innerHTML = ''
  for (i = 0; i < 5; i++) {
    getUser()
  }
})

doubleMoneyBtn.addEventListener('click', () => {
  personMain.innerHTML = ''

  usersArr = usersArr.map((user) => {
    return {
      ...user,
      wealth: user.wealth * 2
    }
  })

  usersArr.forEach((item, i) => {
    addUserInHTML(usersArr[i].name, usersArr[i].wealth)
  })

})

// Sort by richest
richestBtn.addEventListener('click', () => {
  personMain.innerHTML = ''
  usersArr = usersArr.sort((a, b) => {
    return b.wealth - a.wealth
  })

  usersArr.forEach((item, i) => {
    addUserInHTML(usersArr[i].name, usersArr[i].wealth)
  })
});

// Filter more 30000
millionaireBtn.addEventListener('click', () => {
  personMain.innerHTML = ''

  usersArr = usersArr.filter((user) => {
    return user.wealth > 40000
  })

  usersArr.forEach((item, i) => {
    addUserInHTML(usersArr[i].name, usersArr[i].wealth)
  })
});

// Calculate all wealh 
calculateWealthBtn.addEventListener('click', () => {

  const calculateWealth = usersArr.reduce((a, b) => a + b.wealth, 0)

  const div = document.createElement('div')
  div.className = 'users-wealth'
  div.innerHTML = `${calculateWealth} руб.`
  personMain.append(div)

})


//=================== Modal and menu =============================

const modalHamburger = document.querySelector('#modal-hamburger'),
  modalMenu = document.querySelector('#modal-menu'),
  modalBlock = document.querySelector('#modal-block-container'),
  modalBlockOpen = document.querySelector('#modal-block-open'),
  modalBlockClose = document.querySelector('#modal-block-close');

modalHamburger.addEventListener('click', () => modalMenu.classList.toggle('open-modal-menu'));

modalBlockOpen.addEventListener('click', () => modalBlock.classList.add('open-modal-block'));

modalBlockClose.addEventListener('click', () => modalBlock.classList.remove('open-modal-block'));

window.addEventListener('click', e => {
  if (e.target.classList.contains('modal__block-container')) {
    modalBlock.classList.remove('open-modal-block')
  };
});



// ======================= Expense Tracker ========================

const allBalance = document.querySelector('#balance-money'),
  balanceUp = document.querySelector('#balance-up'),
  balanceDown = document.querySelector('#balance-down'),
  transactionList = document.querySelector('#transaction-list'),
  transactionNameInput = document.querySelector('#transaction-name-input'),
  transactionAmountInput = document.querySelector('#transaction-amount-input'),
  transactionBtn = document.querySelector('#transaction-btn'),
  transactionDeleteBtn = document.querySelectorAll('.expense__single-delete');

// Add new transaction
transactionBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const nameValue = transactionNameInput.value;
  const amountValue = parseInt(transactionAmountInput.value);

  if (!nameValue == '' && !amountValue == '') {
    transactionBtn.classList.remove('border-red');
    singleTransaction(nameValue, amountValue);

    if (amountValue >= 0) {
      balanceUp.textContent = parseInt(balanceUp.textContent) + amountValue;
    } else {
      balanceDown.textContent = parseInt(balanceDown.textContent) - amountValue;
    };

    calculateAllBalance(balanceUp.textContent, balanceDown.textContent);
    mainBalanceColor();
  } else {
    transactionBtn.classList.add('border-red');
  }
});

// Delete transaction
transactionList.addEventListener('click', function (e) {
  const singleTransaction = e.target.parentElement;
  let singleTransactionValue = +singleTransaction.querySelector('.expense__single-value').textContent;

  if (e.target.classList.contains('expense__single-delete')) {
    singleTransaction.remove()

    allBalance.textContent = +allBalance.textContent - singleTransactionValue

    if (singleTransactionValue >= 0) {
      balanceUp.textContent = +balanceUp.textContent - singleTransactionValue
    } else {
      balanceDown.textContent = +balanceDown.textContent + singleTransactionValue
    };

    mainBalanceColor();
  };
});


// Make new single transaction 
const singleTransaction = (name, amount) => {
  const singleTransaction = document.createElement('div');
  singleTransaction.classList.add('expense__history-single');

  if (amount < 0) {
    singleTransaction.classList.add('border-red-right')
  }

  singleTransaction.innerHTML = `
    <p class="expense__single-name">${name}</p>
    <p class="expense__single-value">${amount}</p>
    <div class="expense__single-delete">X</div>
  `
  transactionList.prepend(singleTransaction);
};

// Change all amount info 
const calculateAllBalance = (balanceUp, balanceDown) => {
  allBalance.innerHTML = `${balanceUp - balanceDown}`;

};

// Main balace color 
const mainBalanceColor = () => {
  if (+allBalance.textContent > 0) {
    allBalance.style.color = '#00b350'
  } else if (+allBalance.textContent == 0) {
    allBalance.style.color = '#b8b8b8'
  } else {
    allBalance.style.color = '#b80000'
  }
};


// ============== Music player ========================
const playerPlayBtn = document.querySelector('#player-play'),
  playerPauseBtn = document.querySelector('#player-pause'),
  playerNextBtn = document.querySelector('#player-next'),
  playerPrevBtn = document.querySelector('#player-prev'),
  playerImg = document.querySelector('#player-image'),
  playerSoundName = document.querySelector('#player-sound-name'),
  playerProgressBlock = document.querySelector('#player-progress'),
  playerProgressAction = document.querySelector('#player-progress-action'),
  playerAudio = document.querySelector('#player-audio');

const musicArr = [{
    songName: 'Pink Floyd - When You\'re In',
    songLink: 'sound/when_you_are_in.mp3',
    songImg: 'img/player/obscured_by_clouds.jpg'
  },
  {
    songName: 'The Doors - Twentieth Century Fox',
    songLink: 'sound/twentieth_century_fox.mp3',
    songImg: 'img/player/the-doors.jpg'
  },
  {
    songName: 'Rolling Stones - Gimme Shelter',
    songLink: 'sound/gimme_shelter.mp3',
    songImg: 'img/player/let-it-bleed.jpg'
  },
]

// Autoplay audio with spin image
const autoplayAudio = () => {
  playerAudio.setAttribute('autoplay', '');
  playerImg.classList.remove('player-image-pause');
  playerImg.classList.add('player-image-spin');
};

// Change song name, song link and song image
const cnahgeSongData = (songNumber) => {
  playerSoundName.textContent = musicArr[songNumber].songName;
  playerAudio.setAttribute('src', musicArr[songNumber].songLink);
  playerImg.setAttribute('src', musicArr[songNumber].songImg);
};


let musicNumber = 0;

// Play music and spin image on click
playerPlayBtn.addEventListener('click', () => {
  playerAudio.play();
  playerProgressBlock.classList.add('player-progress-show');
  autoplayAudio()
});

playerPauseBtn.addEventListener('click', () => {
  playerAudio.pause();
  playerImg.classList.add('player-image-pause')
  playerProgressBlock.classList.remove('player-progress-show');
});

// Change song on click
playerNextBtn.addEventListener('click', () => {
  autoplayAudio();
  playerProgressBlock.classList.add('player-progress-show');

  if (musicNumber === (musicArr.length - 1)) {
    musicNumber = 0;
    cnahgeSongData(musicNumber)
  } else {
    musicNumber++
    cnahgeSongData(musicNumber)
  }
});

playerPrevBtn.addEventListener('click', () => {
  autoplayAudio();
  playerProgressBlock.classList.add('player-progress-show');

  if (musicNumber === 0) {
    musicNumber = musicArr.length - 1
    cnahgeSongData(musicNumber)
  } else {
    musicNumber--
    cnahgeSongData(musicNumber)
  }
});

// Progress line
playerAudio.addEventListener('timeupdate', () => {
  let songTime = playerAudio.currentTime / playerAudio.duration * 100;

  playerProgressAction.style.width = `${songTime}%`;

  if (songTime === 100) {
    playerImg.classList.add('player-image-pause');
  }
});

// Progress line click 
playerProgressAction.parentElement.addEventListener('click', (e) => {
  const progressActionWrapperWidth = window.getComputedStyle(playerProgressAction.parentElement).width;

  const clickProgressPoint = +((`${e.offsetX}` * 100) / parseInt(progressActionWrapperWidth)).toFixed();

  playerAudio.currentTime = clickProgressPoint * playerAudio.duration / 100;
});

//======================= Blog ===============================

const blogFilter = document.querySelector('#blog-filter'),
  blogContent = document.querySelector('#blog-content'),
  blogLoading = document.querySelector('#blog-loading'),
  blogWrapper = document.querySelector('#blog-wrapper');

let maxPosts = 3;
let page = 1;

// Get all posts from API
const fetchPosts = async () => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${maxPosts}&_page=${page}`);
  const data = await res.json();

  return data;
};

// Make single post
const makePost = async () => {
  const posts = await fetchPosts();

  posts.forEach(postInfo => {
    const post = document.createElement('div');
    post.classList.add('blog__single');
    post.innerHTML = `
    <h2 class="blog__single-title">${postInfo.title}</h2>
    <p class="blog__single-text">${postInfo.body}</p>
    <div class="blog__single-number">${postInfo.id}</div>
  `
    blogContent.append(post);
  });
};

makePost();

// Show next posts after scroll 
blogWrapper.addEventListener('scroll', () => {
  let scrollTop = blogWrapper.scrollTop,
    clientHeight = blogWrapper.clientHeight,
    scrollHeight = blogWrapper.scrollHeight;

  if (scrollTop + clientHeight >= scrollHeight) {
    blogLoading.classList.add('blog-loading-show');

    setTimeout(() => {
      blogLoading.classList.remove('blog-loading-show');
    }, 1000);

    setTimeout(() => {
      page++;
      makePost();
    }, 1100);
  };
});

// Search posts by filter 
blogFilter.addEventListener('input', () => {
  const posts = document.querySelectorAll('.blog__single');
  const filterValue = blogFilter.value;

  posts.forEach(post => {
    const postTitleText = post.querySelector('h2').innerText;
    const postInfoText = post.querySelector('p').innerText;

    if (postTitleText.indexOf(filterValue) > -1 || postInfoText.indexOf(filterValue) > -1) {
      post.style.display = 'block'
    } else {
      post.style.display = 'none'
    };
  });
});

// ========================== Cards ===============================

const cardsClearBtn = document.querySelector('#cards-clear-btn'),
  cardsAddBtn = document.querySelector('#cards-add-btn'),
  cardsContent = document.querySelector('#cards-content'),
  cardsPrevBtn = document.querySelector('#cards-prev-btn'),
  cardsNextBtn = document.querySelector('#cards-next-btn'),
  cardsAmount = document.querySelector('#cards-amount-info'),
  cardsModal = document.querySelector('#cards-modal'),
  cardsModalAddBtn = document.querySelector('#cards-modal-add'),
  cardsModalCloseBtn = document.querySelector('#cards-modal-close');


let allCardsArr = [];
let currentCard = 0;
let cards;

//Create cards 
const createCard = () => {
  allCardsArr.forEach((info, i) => {
    createCards(info, i);
  });
};

//Add card info 
const updateCardsCounter = () => {
  cardsAmount.innerText = `${currentCard + 1}/${allCardsArr.length}`
};


//Open modal 
cardsAddBtn.addEventListener('click', () => {
  cardsModal.classList.add('cards-modal-show');
});

cardsModalCloseBtn.addEventListener('click', () => {
  cardsModal.classList.remove('cards-modal-show');
});


//
cardsModalAddBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const cardQuestionInput = document.querySelector('#cards-question-input').value;
  const cardAnswerInput = document.querySelector('#cards-answer-input').value;

  const cardInfo = {
    question: `${cardQuestionInput}`,
    answer: `${cardAnswerInput}`,
  }

  createCards(cardInfo, currentCard)

  cards = cardsContent.querySelectorAll('.cards__card');

  cards[0].classList.add('card-active')

});

const createCards = (info, i) => {
  const card = document.createElement('div');
  card.classList.add('cards__card');

  card.innerHTML = `
    <p class="cards__card-question">${info.question}</p>
    <p class="cards__card-answer">${info.answer}</p>
  `;

  allCardsArr.push({
    question: `${info.question}`,
    answer: `${info.answer}`
  })

  cardsContent.append(card);

  updateCardsCounter();
};


cardsNextBtn.addEventListener('click', () => {
  cards.forEach(card => {
    card.classList.remove('card-active')
  })

  cards[currentCard].classList.add('card-left')

  currentCard++;

  if (currentCard > allCardsArr.length - 1) {
    currentCard = allCardsArr.length - 1
  }

  cards[currentCard].className = 'cards__card card-active'

  updateCardsCounter()
});


cardsPrevBtn.addEventListener('click', () => {
  cards[currentCard].classList.add('card-right')

  currentCard--;

  if (currentCard < 0) {
    currentCard = 0;
  }

  cards[currentCard].className = 'cards__card card-active'

  updateCardsCounter();
});

cardsContent.addEventListener('click', e => {

  if (e.target.classList.contains('cards__card')) {

    e.target.classList.toggle('card-flip')

  };

});