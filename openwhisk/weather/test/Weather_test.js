/**
 * Created by Armin on 26.08.2017.
 */
var request = require('request');
<<<<<<< HEAD
var actionUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/8bcfac1b2e290d7c624a362c87384ca2a7e87ca8552f084a095f1fd8411d26e9/iwibotTest/weather';
=======
var actionUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/'+process.env.WSK_API_CODE+'/iwibotTest/weather';
>>>>>>> ba769fa618beaaecf1839b371c6126cec755bb1b
var params = {
    semester: 5,
    courseOfStudies: 'INFB'
};

module.exports = {
    'Weather Action Test' : function (test) {
        test.expect(2);
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            console.log('Body: ' + body);
            console.log('Error: ' + err);
            console.log('Response: ' + JSON.stringify(response));
            body = JSON.parse(body);
            test.ok('payload' in body);
            test.ok('htmlText' in body);
            test.done();
        });
    }
};