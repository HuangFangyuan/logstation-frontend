import axios from 'axios'

axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded';

export const baseUrl = "http://localhost:8088";

export const http = {
  fetchGet(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, params)
        .then(rep => resolve(rep.data))
        .catch(error => reject(error))
    })
  },

  fetchQuickSearch(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(rep => resolve(rep.data))
        .catch(error => reject(error))
    })
  },

  fetchPost(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then(rep => resolve(rep.data))
        .catch(error => reject(error))
    })
  },

  put(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, params)
        .then(rep => resolve(rep.data))
        .catch(error => reject(error))
    })
  },

  delete(url) {
    return new Promise((resolve, reject) => {
      axios.delete(url)
        .then(rep => resolve(rep.data))
        .catch(error => reject(error))
    })
  }
};
