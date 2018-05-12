import { baseUrl, http } from './public'

export const getMonitorById = (id) => {
  return http.fetchGet(baseUrl + '/monitor/' + id);
};

export const getMonitor = (params) => {
  return http.fetchGet(baseUrl + '/monitor', params);
};

export const addMonitor = (params) => {
  return http.fetchPost(baseUrl + '/monitor', params);
};

export const modifyMonitor = (params) => {
  return http.put(baseUrl + '/monitor', params);
};

export const deleteMonitor = (id) => {
  return http.delete(baseUrl + '/monitor/' + id);
};
