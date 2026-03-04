import api from "./api";

export const getStates        = ()   => api.get('/states'); 
export const getCitiesByState = (id) => api.get(`/states/${id}/cities`);

