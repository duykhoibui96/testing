import { TOKEN, HOST } from "./config";
import request from "request";
import fs from "fs";

export const httpRequest = (url, method = 'GET') => {
    const headers = {
        'Authorization': 'Basic ' + TOKEN,
        'Accept': 'application/json'
    };

    return new Promise((resolve, reject) => {
        request({
            url: `${HOST}${url}`,
            json: true,
            method: 'GET',

            headers: headers
        }, function (err, response, body) {
            return (err || (response.statusCode < 200 || response.statusCode >= 300)) ? reject({ err, statusCode: response.statusCode }) : resolve(body);
        });
    })

}

export const writeFile = (path, filename, data) => new Promise((resolve, reject) => fs.writeFile(path + '/' + filename, data, 'utf8', err => err ? reject() : resolve()))

export const log = (text) => console.log(text);