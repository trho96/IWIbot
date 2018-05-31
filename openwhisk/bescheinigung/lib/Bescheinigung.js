var request = require('request');
var url = "http://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/certificate/live/"
var language = "de-DE";
var responseObject = {};

function main(params) {
    return new Promise(function (resolve, reject) {
        request({
                url: url + params.context.certificate,
                headers: {
                    'Authorization': 'Basic ' + params.context.iwibotCreds
                }
            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    responseObject.payload = "Hier ist deine Bescheinigung:";
                    responseObject.htmlText = "<a href='data:application/pdf;base64," + body + "'>" + params.context.certificate + "</a>";
                    responseObject.language = language;

                    resolve(responseObject);
                } else {
                    console.log('http status code:', (response || {}).statusCode);
                    console.log('error:', error);
                    console.log('body:', body);
                    responseObject.payload = "Um deine Bescheinigung zu erhalten, musst du dich einloggen.";

                    reject(responseObject);
                }
            });
    });
}
exports.main = main;