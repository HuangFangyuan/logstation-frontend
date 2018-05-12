import { http ,baseUrl }from './public'

export const getContact = () => {
  return http.fetchQuickSearch(baseUrl + '/contact');
};

export const addContact = (params) => {
  return http.post(baseUrl + '/contact', params);
};

export const deleteContact = (id) => {
  return http.delete(baseUrl + '/contact/' + id);
};
