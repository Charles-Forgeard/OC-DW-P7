import {
  getMsgsUrl,
  postLoginUrl,
  postRegisterUrl,
  postActiveUserAccountUrl,
} from './urls'

const customFetch = async ({ url, payload, method = 'get' }) => {
  const result = {}
  let options
  if (method === 'post')
    options = {
      ...options,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  try {
    const response = await fetch(url, { ...options, credentials: 'include' })
    const data = await response.json()
    result.data = data
  } catch (err) {
    result.error = err
  }
  return result
}

export const getMsgs = async ({ limit = 10, offset = 0 }) =>
  customFetch({ url: getMsgsUrl({ limit: limit, offset: offset }) })

export const postLogin = async (payload) =>
  customFetch({ url: postLoginUrl(), payload: payload, method: 'post' })

export const postRegister = async (payload) =>
  customFetch({ url: postRegisterUrl(), payload: payload, method: 'post' })

export const postActiveUserAccount = async (payload) =>
  customFetch({
    url: postActiveUserAccountUrl(),
    payload: payload,
    method: 'post',
  })
