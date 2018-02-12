'use strict';

var exports = module.exports = {};
var chat = require("./chat.js");
var context = null;
var url = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/' + $WSK_API_CODE + '/iwibot/router';
var $mainDiv = $("#mainDiv");
var $btnCircle = $(".btn-circle");
var positionFlag = false;

exports.sendMessage = function (init, result) {
        var requestObject = {};
        if(init) {
            requestObject.conInit = true;
        }

        requestObject.payload = result;
        requestObject.context = context;

        if ("courseOfStudies" in localStorage && "semester" in localStorage) {
            requestObject.courseOfStudies = localStorage.getItem("courseOfStudies");
            requestObject.semester = localStorage.getItem("semester");

        } else if ("courseOfStudies" in sessionStorage && "semester" in sessionStorage) {
            requestObject.courseOfStudies = sessionStorage.getItem("courseOfStudies");
            requestObject.semester = sessionStorage.getItem("semester");
        }
        if(!!positionFlag)	{
		return new Promise(function(resolve, reject)	{
			var watchID = navigator.geolocation.getCurrentPosition(function(position) {
				requestObject.position = [position.longitude,position.langitude];
				resolve(continueSendMessage());
			});
		});
	}
	else	{
		return continueSendMessage();
	}

	function continueSendMessage()	{
		
                console.log("CONVERSATION_RequestObject : " + JSON.stringify(requestObject));

                var options = {
                    url: url,
                    type: 'POST',
                    data: JSON.stringify(requestObject),
                    contentType: "application/json",
                    processData: false,
                    success: function (data) {
                        console.log("CONVERSATION_recivedData: " + JSON.stringify(data));

                        var dataObj = JSON.parse(data);
                        var payload = dataObj.payload.toString();

			if("positionFlag" in dataObj)	{
				positionFlag = dataObj.positionFlag;
	    		}
                        chat.appendReceivedMessage(payload + positionFlag);

                        if("htmlText" in dataObj) {
                            chat.appendReceivedMessage(dataObj.htmlText.toString());
                        }
                        if("context" in dataObj) {
                            context = dataObj.context;
                        }

                    },
                    error: function (/*err*/) {
                        //remove loader animation and show recording button
                        $mainDiv.removeClass("loader");
                        $btnCircle.show();
                    }
                };
                
                return $.ajax(options);
        }
};
