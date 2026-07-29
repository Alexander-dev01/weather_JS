class DarkTheme {
  constructor() {
    this.prikleyka()
    this.bindEvent()
    this.loadThemeLocalStorage()
  }

  onTheme = false

  selectors = {
    theme: '[data-js-theme]',
  }

  prikleyka() {
    this.elementTheme = document.querySelector(this.selectors.theme)
  }

  theme(event) {
    if (!event.target.closest(this.selectors.theme)) {
      return
    }
    this.onTheme = !this.onTheme
    this.changeTheme()
    this.saveThemeLocalStorage()
  }

  changeTheme() {
    document.body.classList.toggle('dark', this.onTheme)
  }

  saveThemeLocalStorage() {
    localStorage.setItem('themeWeather', JSON.stringify(this.onTheme))
  }

  loadThemeLocalStorage() {
    this.onTheme = JSON.parse(localStorage.getItem('themeWeather')) ?? false
    console.log('темная тема?', this.onTheme);
    this.changeTheme()
  }

  bindEvent() {
    document.addEventListener('click', (event) => {
      this.theme(event)
    })
  }
}

new DarkTheme()