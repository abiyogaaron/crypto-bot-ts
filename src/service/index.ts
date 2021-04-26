import axios from 'axios';
import {
  EHTTP_METHOD,
} from '../interface';

class APIService {
  public static apiCall<TBody>(method: EHTTP_METHOD, url: string, body?: TBody) {
    return new Promise((resolve, reject) => {
      axios({
        method: method,
        url: url,
        data: JSON.stringify(body)
      }).then(res => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  }
}

export default APIService;
