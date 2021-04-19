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

