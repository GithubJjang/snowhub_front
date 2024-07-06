import Cookies from 'js-cookie'

export const removeCookies = () => {
  const cookies = Cookies.get()
  for (let cookie in cookies) {
    Cookies.remove(cookie)
  }
}