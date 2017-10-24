/**
 * Created by Armin on 11.06.2017.
 */
var request = require('request');
var actionUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/8bcfac1b2e290d7c624a362c87384ca2a7e87ca8552f084a095f1fd8411d26e9/iwibotTest/router';
var params = {
    use_unauthenticated: true,
    semester: 5,
    courseOfStudies: 'INFB',
    context: { conversation_id: "652d4d40-1597-46d3-ad61-8f6f1564663f", system: { dialog_stack: [], dialog_turn_counter: 2, dialog_request_counter: 2, _node_output_map: { Willkommen: [0], node_1_1504124913816: [0] } }, timezone: "CET" }
};

module.exports = {
    'Router Action Test (timetables)': function (test) {
        console.log("TESTING ROUTER: ACTION TIMETABLE \n");
        console.log('actionUrl: ' + actionUrl + "\n");
        test.expect(2);
        params.payload = 'timetable friday';
        request.post({
            headers: { 'content-type': 'text/plain' },
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            console.log('Body: ' + body);
            console.log('Error: ' + err);
            console.log('Response: ' + JSON.stringify(response));
            body = JSON.parse(body);
            test.ok(typeof body.payload === 'string');
            test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
            test.done();
        });
    },
    'Router Action Test (meal)': function (test) {
        console.log("TESTING ROUTER: ACTION MEAL");
        test.expect(2);
        params.payload = 'Food 1';
        request.post({
            headers: { 'content-type': 'text/plain' },
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            console.log('Body: ' + body);
            console.log('Error: ' + err);
            console.log('Response: ' + JSON.stringify(response));
            body = JSON.parse(body);
            test.ok(typeof body.payload === 'string');
            test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
            test.done();
        });
    },
    'Router Action Test (joke)': function (test) {
        console.log("TESTING ROUTER: ACTION JOKE");
        test.expect(1);
        params.payload = 'joke';
        request.post({
            headers: { 'content-type': 'text/plain' },
            url: actionUrl,
            body: JSON.stringify(params)
        }, function (err, response, body) {
            console.log('Body: ' + body);
            console.log('Error: ' + err);
            console.log('Response: ' + JSON.stringify(response));
            body = JSON.parse(body);
            test.ok('payload' in body);
            test.done();
        });
    }
};