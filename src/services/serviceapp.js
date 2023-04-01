import axios from 'axios';
import {URL_DATA} from "../constants";

let BASE_URL = '';

let requestCustom;
let data;

const serviceapp = axios.create({
  withCredentials: true
});

serviceapp.interceptors.request.use(async (request) => {

  // request.baseURL = `http://services.gruposolar.com.br:8082/servicecomercial/servlet/isCobol`;
  // BASE_URL = `http://services.gruposolar.com.br:8082/servicecomercial/servlet/isCobol`;
  request.baseURL = URL_DATA;
  BASE_URL = URL_DATA;

  requestCustom = request;
  data = request.data;

  return request;
});

serviceapp.interceptors.response.use(
  response => response,
  async _error => {
    console.log('Abrindo sessão com o servidor novamente');

    const axiosNew = axios.create({
      baseURL: BASE_URL,
      withCredentials: true
    });

    let session = await axiosNew
      .get('(serviceapp)')
      .then(resp => resp)
      .catch(_err => {
        return {
          status: 404,
          success: false,
          message: 'Não foi possível conectar ao servidor'
        };
      });

    if (session.status !== 200) {
      session = {
        status: 404,
        success: false,
        message: 'Não foi possível conectar ao servidor',
      };

      return session;
    }

    console.log('Refazendo a chamada original...');
    let originalResponse;
    if (requestCustom.method === 'POST' || requestCustom.method === 'post') {
      originalResponse = await serviceapp.post(`${requestCustom.url}`, data);
    } else {
      originalResponse = await serviceapp.get(`${requestCustom.url}`);
    }
    if (originalResponse.status !== 200) {
      session = {
        status: 404,
        success: false,
        message: 'Não foi possível conectar ao servidor'
      };
      return session;
    }
    return originalResponse;
  },
);

export default serviceapp;
