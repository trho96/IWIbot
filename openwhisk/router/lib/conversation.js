var ConversationV1 = require('watson-developer-cloud/conversation/v1');

exports.sendMessage = function sendMessage(init, params) {

    console.log("------Conversation Started!------");
    console.log('Conversation Params: ' + params.payload);

    var conversation = new ConversationV1({
        username: params.__bx_creds.conversation.username,
        password: params.__bx_creds.conversation.password,
        path: {workspace_id: "49d2a377-47a0-42aa-9649-cbce4637b624"},
        version_date: "2018-09-01"
    });

    return new Promise(function (resolve, reject) {
        var options = init ? {} : {
            input: {text: params.payload.toString()},
            context: params.context
        };
        conversation.message(options, function (err, response) {
            if (err) {
                console.error("Conversation Error: " + err);
                reject(err);
            }

            console.log("Conversation Response: " + JSON.stringify(response, null, 4));
            resolve(response);
        });
    });
};