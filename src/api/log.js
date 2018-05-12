import { http ,baseUrl }from './public'

export const getLogs = (params) => {
  return http.fetchGet(baseUrl + '/logs', params)
};

export const getLogsByCondition = (params) => {
  return http.fetchGet(baseUrl + '/logs/condition', params)
};
