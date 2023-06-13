//import configData from "../config.json"

//const API_SERVER = configData["API_SERVER"];
const API_SERVER = process.env.REACT_API_SERVER_URL;

export async function POST(data, url) {
  const api_url = API_SERVER + url;
  
  return fetch(api_url, 
	       {
		 method: 'POST',
		 headers: {
		   'Content-Type': 'application/json'
		 },
		 body: JSON.stringify(data)
	       }
	      )
    .then(data => data.json())
};
