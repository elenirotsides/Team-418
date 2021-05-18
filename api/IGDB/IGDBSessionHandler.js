const axios = require('axios');
const settings = require('../config/settings.json');

// API session token
var token;
// Expiration date of the token
var tokenExperation;

var nextQueue = [];
var lastCallTime = new Date().getTime();
var callsThisSecond = 0;

// Singleton class
class IGDBSessionHandler {

    constructor() {
        if (!IGDBSessionHandler.instance) {
            token = null;
            tokenExperation = null;
            IGDBSessionHandler.instance = this;
        }
        return IGDBSessionHandler.instance;
    }

    // Middleware function to validate if IGDB token
    validateSession() {
        return async (req, res, next) => {

            // check if token is expired
            let nowDate = new Date();
            var expirationDate = new Date();
            var dateDiffInSeconds = 0;

            if (tokenExperation) {
                expirationDate = new Date(tokenExperation);
                dateDiffInSeconds = expirationDate - nowDate.getTime();
            }

            // if token is null or token will expire in 15 mins, refresh token
            if (token == null || dateDiffInSeconds < 900) {
                // make a post request to twitch API to get token information
                await axios({
                    method: 'post',
                    url: `https://id.twitch.tv/oauth2/token?client_id=${settings.igdb.clientID}&client_secret=${settings.igdb.clientSecret}&grant_type=client_credentials`
                }).then((response) => {
                    // save token
                    token = response.data.access_token;
                    // save expiration date
                    let now = new Date().getTime();
                    tokenExperation = now + response.data.expires_in;
                }, (error) => {
                    console.log(error);
                });
            }

            // next please!
            next();
        };
    }

    // utility method for making a request to IGDB enpoint
    igdbAxiosConfig(endpoint, queryParams, data) {
        var url = `https://api.igdb.com/v4/${endpoint}`;

        // add query params if applicable 
        if (queryParams) {
            url += '?'
            var i = 0;
            for (const [key, value] of Object.entries(queryParams)) {
                url += `${key}=${value}`;
                i++;
                if (i < queryParams.length - 1) {
                    url += '&';
                }
            }
        }

        // return request config
        return {
            method: 'post',
            url: url,
            headers: {
                'Client-ID': settings.igdb.clientID,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: data
        }
    }

    addToRateLimit = async (req, res, next) => {
        nextQueue.push(next);
    } 

    checkRateLimit() {

        if (nextQueue.length === 0) {
            setTimeout(() => { this.checkRateLimit() }, 10);
            return;
        } else {
            if ((new Date().getTime()) - lastCallTime < 1000) {
                callsThisSecond++;
            } else {
                lastCallTime = new Date().getTime();
                callsThisSecond = 0;
            }

            if (callsThisSecond < 4) {
                setTimeout(() => { this.checkRateLimit() }, 10);
            } else {
                setTimeout(() => { this.checkRateLimit() }, 1000);
            }


            const next = nextQueue[0];
            nextQueue.shift();

            next();
        }
    }

}

// singleton instance
const instance = new IGDBSessionHandler();
Object.freeze(instance);


// module export
module.exports = { instance };
