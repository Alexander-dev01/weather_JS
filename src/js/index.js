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
    66: 'Ледяной дождь слабый',
    67: 'Ледяной дождь ',
    71: 'Слабый снег',
    73: 'Снег',
    75: 'Сильный снег',
    77: 'Снег',
    80: 'Слабый ливень',
    81: 'Умеренный ливень',
    82: 'Сильный ливень',
    85: 'Слабый снегопад',
    86: 'Сильный снегопад',
    95: 'Гроза',
    96: 'Гроза с градом',
    99: 'Сильная гроза с градом',
  }

  weatherImages = {
    0: 'src/images/weather/solnecno.png',
    1: 'src/images/weather/solnecno.png',
    2: 'src/images/weather/pasmurno.png',
    3: 'src/images/weather/pasmurno.png',
    45: 'src/images/weather/tuman.png',
    48: 'src/images/weather/tuman.png',
    51: 'src/images/weather/dojd.png',
    53: 'src/images/weather/dojd.png',
    55: 'src/images/weather/dojd.png',
    61: 'src/images/weather/dojd.png',
    63: 'src/images/weather/dojd.png',
    65: 'src/images/weather/dojd.png',
    66: 'src/images/weather/dozdSneg.png',
    67: 'src/images/weather/dozdSneg.png',
    71: 'src/images/weather/sneg.png',
    73: 'src/images/weather/sneg.png',
    75: 'src/images/weather/sneg.png',
    77: 'src/images/weather/sneg.png',
    80: 'src/images/weather/dojd.png',
    81: 'src/images/weather/dojd.png',
    82: 'src/images/weather/dojd.png',
    85: 'src/images/weather/sneg.png',
    86: 'src/images/weather/sneg.png',
    95: 'src/images/weather/groza.png',
    96: 'src/images/weather/groza.png',
    99: 'src/images/weather/groza.png',
  }

  selectors = {
    form: '#weather__form',

    outputImage: '[data-js-image]',
    outputTemperature: '[data-js-temperature]',
    outputWeather: '[data-js-weather]',
  }

  notClearWheatherCity = {
    locationValue: '', //записан после сбора данных (moscow)
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
    this.elementForm = document.querySelector(this.selectors.form)

    this.elementImage = document.querySelector(this.selectors.outputImage)
    this.elementTemperature = document.querySelector(this.selectors.outputTemperature)
    this.elementWeather = document.querySelector(this.selectors.outputWeather)

  }


  clickSubmit(event) {
    this.sborDannix()
    this.gluing()
    this.sending()
  }

  sborDannix() {
    const dateValue = this.elementForm.elements.date.value
    const locationValue = this.elementForm.elements.location.value
    this.notClearWheatherCity = { ...this.notClearWheatherCity, dateValue, locationValue }
    console.log('notClearWheatherCity:', this.notClearWheatherCity);
  }


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
          throw new Error(response.status === 400
            ? `ошибка ${response.status} - пинайте фронтендера`
            : `ошибка ${response.status}`)
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
          const index = json.daily.time.findIndex((element) => element === this.currentLatitudeLongitudeTimezone.tomorrowDate)
          let srTemperature = (json.daily.temperature_2m_max[index] + json.daily.temperature_2m_min[index]) / 2
          srTemperature = Math.round(srTemperature)
          this.currentWeatherFetch = {
            dataTemperature: srTemperature,
            dataTime: json.daily.time[index],
            dataWeatherCod: json.daily.weather_code[index],
          }
        }
        this.render()


        console.log('данные от сервера (уже в моем объекте)', this.currentWeatherFetch);
      })
      .catch((error) => {
        this.elementTemperature.textContent = error.message
        console.log(error);
      })
  }

  render() {
    const { dataWeatherCod, dataTemperature, dataTime } = this.currentWeatherFetch
    this.elementTemperature.textContent = dataTemperature + '°' ?? '° не найден'
    this.elementWeather.textContent = this.weatherCodes[dataWeatherCod] ?? 'погода не найдена'
    this.elementImage.src = this.weatherImages[dataWeatherCod] ?? 'src/images/weather/empty.png'


    this.elementImage.classList.toggle('beauty')
    setTimeout(() => {
      this.elementImage.classList.toggle('beauty')
    }, 200);

  }

  bindEvent() {
    this.elementForm.addEventListener('submit', (event) => {
      event.preventDefault()
      this.clickSubmit(event)
    })
  }
}

new Weather()