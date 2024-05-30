import axios from 'axios'
import ms from 'ms'

export type DynamicObjectType = {
  [key: string]: any
}

export default axios.create({
  timeout: ms('3m'),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0 axios/0.18.0',
  },
})

export const axiosCustomTimeout = (timeout: string) =>
  axios.create({
    timeout: ms(timeout),
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0',
    },
  })
