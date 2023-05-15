class NetworkManager {
    _baseURL = "";

    constructor(baseURL) {
        this._baseURL = baseURL;
    }

    async postJsonData(url, data) {
        var headers = {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            }
        };
    
        // TODO
        /*
        let result = await axios.post(url, JSON.stringify(payload), _headers);
        if(result.status === 200) {
            return result;
        }
        */
    }
}

export default NetworkManager;