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
      inputError(input)
      changeStatusInfo(input, `${statusEmpty}`)
    } else if (input.value.length > max || input.value.length < min) {
      inputError(input)
      changeStatusInfo(input, `Количество символов должно быть от ${min} до ${max}`)
    } else {
      inputSuccess(input)
      changeStatusInfo(input, 'Подтверждено')
    }

  }

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
  })
  movieValue.textContent = 0
  moviePrice.textContent = 0
};

// Change movie in select 
movieSelect.addEventListener('change', (e) => {
  moviePriceValue = +e.target.value;
  resetValues()
});

// Change movie value and save data seat in local storage 
const changeValue = () => {
  const chosenSeats = document.querySelectorAll('.movie__seats .seat-chose');

  movieValue.textContent = chosenSeats.length
  moviePrice.textContent = chosenSeats.length * moviePriceValue
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
changeCurrencyImg = (currencyName, img) => {

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
  }
}

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
    return {...user, wealth: user.wealth * 2}
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

