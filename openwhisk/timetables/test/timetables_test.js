/**
 * Created by Armin on 11.06.2017.
 */
var request = require('request');
<<<<<<< HEAD
var actionUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/8bcfac1b2e290d7c624a362c87384ca2a7e87ca8552f084a095f1fd8411d26e9/iwibotTest/timetables';
=======
var actionUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/'+process.env.WSK_API_CODE+'/iwibotTest/timetables';
>>>>>>> ba769fa618beaaecf1839b371c6126cec755bb1b
var params = {
    semester: 5,
    courseOfStudies: 'INFB'
};

module.exports = {
    'Meal Action Test' : function (test) {
        test.expect(1);
        request.post({
            headers: {'content-type': 'text/plain'},
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            console.log('Body: ' + body);
            console.log('Error: ' + err);
            console.log('Response: ' + JSON.stringify(response));
            body = JSON.parse(body);
            test.ok(typeof body.payload === 'string');
            test.done();
        });
    }
};