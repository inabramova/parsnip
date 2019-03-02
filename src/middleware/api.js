import axios from "axios";
import { API_BASE_URL } from "../api";

export const CALL_API = "CALL_API";

const apiMiddleware = store => next => action => {
  const callApi = action[CALL_API];
  if (typeof callApi === "undefined") {
    return next(action);
  }
  const [startA, succeedA, failA] = callApi.types;
  next({ type: startA });
  const { endpoint, method, body } = callApi;
  makeCall({ endpoint, method, body })
    .then(resp => next({ type: succeedA, payload: resp.data }))
    .catch(error => next({ type: failA, error: error.message }));
};

function makeCall({ endpoint, method = "GET", body }) {
  const url = `${API_BASE_URL}${endpoint}`;
  const params = {
    method: method,
    url,
    data: body,
    headers: {
      "Content-Type": "application/json"
    }
  };

  return axios(params)
    .then(resp => resp)
    .catch(err => err);
  // return axios
  //   .get(url)
  //   .then(resp => {
  //     return resp;
  //   })
  //   .catch(err => {
  //     return err;
  //   });
}

export default apiMiddleware;
