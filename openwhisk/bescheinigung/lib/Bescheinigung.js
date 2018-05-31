var request = require('request');

function main(params) {
    var pdfUrl = "http://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/certificate/cache/";
    var url = "http://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/certificates/links";
    var language = "de-DE";
    var responseObject = {};

    return new Promise(function (resolve, reject) {
        request({
                url: url,
                headers: {
                    'Authorization': 'Basic ' + params.context.iwibotCreds
                }
            }, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    var bodyObject = JSON.parse(body);
                    bodyObject.forEach(function (element) {
                        if (element.certificateType == params.entities[0].value.toLowerCase()) {
                            pdfUrl += element.linkHashCode;
                        }
                    });

                    responseObject.payload = "Hier ist deine Bescheinigung:";
                    responseObject.htmlText = "<a href='" + pdfUrl + "' target='_blank'>" + params.entities[0].value.toLowerCase() + "</a>";
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