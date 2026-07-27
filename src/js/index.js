class Weather {
  constructor() {
    this.prikleyka()
    this.bindEvent()
  }

  citiesCoordinates = {
    moscow: {
      latitude: 55.7558,
      longitude: 37.6173,
      timezone: 'Europe%2FMoscow'
    },
    saintPetersburg: {
      latitude: 59.9343,
      longitude: 30.3351,
      timezone: 'Europe%2FMoscow'
    },
    rostovNaDonu: {
      latitude: 47.2357,
      longitude: 39.7015,
      timezone: 'Europe%2FMoscow'
    },
  }

  weatherCodes = {
    0: 'Ясно',
    1: 'Почти ясно',
    2: 'Переменная облачность',
    3: 'Пасмурно',
    45: 'Туман',
    48: 'Инейный туман',
    51: 'Лёгкая морось',
    53: 'Морось',
    55: 'Сильная морось',
    61: 'Слабый дождь',
    63: 'Дождь',
    65: 'Сильный дождь',
    71: 'Слабый снег',
    73: 'Снег',
    75: 'Сильный снег',
    95: 'Гроза',
    96: 'Гроза с градом',
    99: 'Сильная гроза с градом',
  }

  selectors = {
    location: '[data-js-location]',
    date: '[data-js-date]',
    form: '#weather__form',
  }

  notClearWheatherCity = {
    locationValue: '', //записан после сбора данных (moscow)
    weather: '',
    dateValue: '', //записан после сбора данных (segodnya)
  }

  currentLatitudeLongitudeTimezone = {
    latitude: null, //47.2357
    longitude: null, //39.7015
    timezone: null, //Europe%2FMoscow
  }


  currentWeatherFetch = {
    dataTemperature: '', //35
    dataTime: '', //22.22.22Ф21:10
    dataWeatherCod: '', //2
  }

  gluing() {
    const allLocationArray = Object.entries(this.citiesCoordinates)
    allLocationArray.forEach(element => {
      if (element[0] === this.notClearWheatherCity.locationValue) {
        this.currentLatitudeLongitudeTimezone = { ...element[1] }
        console.log('this.currentLatitudeLongitudeTimezone', this.currentLatitudeLongitudeTimezone);

      }
    });
  }



  prikleyka() {
    this.elementDate = document.querySelector(this.selectors.date)
    this.elementLocation = document.querySelector(this.selectors.location)
    this.elementForm = document.querySelector(this.selectors.form)


  }

  clickLocation(event) {
    const isLocation = event.target.closest(this.selectors.location)
    if (!isLocation) {
      return
    }

  }

  clickDate(event) {
    const isDate = event.target.closest(this.selectors.date)
    if (!isDate) {
      return
    }
    console.log('ура ты нажал по дате');
  }

  clickSubmit(event) {
    this.sborDannix()
    this.gluing()
    this.sending()
  }

  // ===================================================================
  sborDannix() {
    const dateValue = this.elementForm.elements.date.value
    const locationValue = this.elementForm.elements.location.value
    this.notClearWheatherCity = { ...this.notClearWheatherCity, dateValue, locationValue }
    console.log('notClearWheatherCity:', this.notClearWheatherCity);
  }


  // ===================================================================
  sending() {
    const urlStart = 'https://api.open-meteo.com/v1/forecast?'

    const urlEnd = `latitude=${this.currentLatitudeLongitudeTimezone.latitude}&longitude=${this.currentLatitudeLongitudeTimezone.longitude}&current=temperature_2m,weather_code&timezone=${this.currentLatitudeLongitudeTimezone.timezone}`

    fetch(`${urlStart}${urlEnd}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка короче - ищи сам')
        }
        return response.json()
      })
      .then((json) => {
        this.currentWeatherFetch = {
          dataTemperature: json.current.temperature_2m,
          dataTime: json.current.time,
          dataWeatherCod: json.current.weather_code,
        }
        console.log('данные от сервера (уже в моем объекте)', this.currentWeatherFetch);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  bindEvent() {
    document.addEventListener('click', (event) => {
      this.clickDate(event)
      this.clickLocation(event)
    })
    this.elementForm.addEventListener('submit', (event) => {
      event.preventDefault()
      this.clickSubmit(event)
    })
  }
}

new Weather()