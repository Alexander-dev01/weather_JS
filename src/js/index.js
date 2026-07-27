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
    tomorrowDate: null // (22-22-2026)+1
  }


  currentWeatherFetch = {
    dataTemperature: '', //35
    dataTime: '', //22.22.22Ф21:10
    dataWeatherCod: '', //2
  }

  gluing() {
    // дата пока не применяется но если будет расширение то она пригодится для поиска по дате в json и вычислением индекса этой даты который потом буду использовать для вынимания по индексу данных температуры и тд.
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().slice(0, 10);
    this.currentLatitudeLongitudeTimezone.tomorrowDate = tomorrowDate


    const allLocationArray = Object.entries(this.citiesCoordinates)
    allLocationArray.forEach(element => {
      if (element[0] === this.notClearWheatherCity.locationValue) {
        this.currentLatitudeLongitudeTimezone = {
          ...this.currentLatitudeLongitudeTimezone,
          ...element[1],
        }
        console.log('упакованный для отправки this.currentLatitudeLongitudeTimezone', this.currentLatitudeLongitudeTimezone);
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
    let urlEnd = ''
    if (this.notClearWheatherCity.dateValue == 'segodnya') {
      urlEnd = `latitude=${this.currentLatitudeLongitudeTimezone.latitude}&longitude=${this.currentLatitudeLongitudeTimezone.longitude}&current=temperature_2m,weather_code&timezone=${this.currentLatitudeLongitudeTimezone.timezone}`
    }
    else {
      urlEnd = `latitude=${this.currentLatitudeLongitudeTimezone.latitude}&longitude=${this.currentLatitudeLongitudeTimezone.longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=${this.currentLatitudeLongitudeTimezone.timezone}`
    }

    fetch(`${urlStart}${urlEnd}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка короче - ищи сам')
        }
        return response.json()
      })
      .then((json) => {
        console.log('json', json);

        if (this.notClearWheatherCity.dateValue == 'segodnya') {
          const temperatureRound = Math.round(json.current.temperature_2m)
          this.currentWeatherFetch = {
            dataTemperature: temperatureRound,
            dataTime: json.current.time,
            dataWeatherCod: json.current.weather_code,
          }
        }
        else {
          let srTemperature = (json.daily.temperature_2m_max[1] + json.daily.temperature_2m_min[1]) / 2
          srTemperature = Math.round(srTemperature)
          this.currentWeatherFetch = {
            dataTemperature: srTemperature,
            dataTime: json.daily.time[1],
            dataWeatherCod: json.daily.weather_code[1],
          }
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