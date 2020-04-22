import {
  AsyncStorage
} from 'react-native';

import requests from './requestRoutes.json'
const BaseURL = 'http://18.234.79.214:6000'

export async function requestHandler(type, reqData) {
  let _auth = await AsyncStorage.getItem('auth')
  let auth = {}
  if(_auth){
    let { token } = JSON.parse(_auth)
    auth = { "Authorization": "bearer " + token.value }
  }
  let { req, route } = _setupRequest(type, reqData, auth)
  return new Promise((resolve, reject) => {
    // console.log("Sending request to: ", BaseURL + route)
    // console.log("Request data: ", req)
    fetch(BaseURL + route, {...req, cache: "no-cache"})
      .then(response => {
        // console.log('I am your response', response);
        return response.json()
        
      })
      .then((res) => {
        // console.log('This is the actual response',res);
        resolve(res);
        })
      .catch( (error) => {
        console.log("ERROR FROM REQUEST",error);
          reject(error);
        });
  });
}

function _setupRequest(type, reqData, auth) {
  let req = null
  let route = null
  
  if(requests[type].method === 'GET') {
    req = {
      method: 'GET',
      headers: { ...auth },
    }
    route = requests[type].route
    if(reqData)
      route + '?' + new URLSearchParams({...reqData}).toString()
  } else if(requests[type].method === 'POST') {
    if(!reqData) reqData = {}
    req = {
        method: 'POST',
        headers: { ...auth, 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...reqData})
    }
    route = requests[type].route
    // console.log('the request body', req)
  }

  return { req, route } 
}