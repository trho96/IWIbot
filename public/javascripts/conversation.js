'use strict';

var exports = module.exports = {};
var chat = require("./chat.js");
var locationEventHandler = require("./locationEventHandler.js");
var context = null;
var url = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/'+ $WSK_API_CODE +'/iwibot/router';
var $mainDiv = $("#mainDiv");
var $btnCircle = $(".btn-circle");
// Entscheidet ob GPS-Daten erhoben und zum Backend mitgesendet werden. Wird momentan angeschaltet von der Antwort des Conversation-
// Service auf den ersten Teil der GPS-Anfrage (="Navigation", "Zeige mir den Weg", etc)
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
	// Ueberprueft, ob das positionFlag gesetzt ist und fordert wenn gesetzt GPS-Daten an. Speichert die Koordinaten in dem Object,
	// welches dann spaeter im AJAX-Call an den Router.js im OpenWhisk mituebergeben wird.
        if(!!positionFlag)	{
		return new Promise(function(resolve, reject)	{
			var watchID = navigator.geolocation.getCurrentPosition(function(position) {
				requestObject.position = [position.coords.longitude,position.coords.latitude];
				resolve(continueSendMessage());
			});
		});
	}
	else	{
		return continueSendMessage();
	}

	// Fortfuehrung von sendMessage. Notwendig wegen Asynchronitaet des GPS-Aufrufes.
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
                        
			    
			// Ueberprueft, ob das JSON aus dem Conversation-Service eine Anfrage zur Aenderung des positionFlag enthaelt
			// und aendert das Flag auf den im JSON angegebenen Wert.
			if("positionFlag" in dataObj)	{
                positionFlag = dataObj.positionFlag;
                }
                
            if ("navigationData" in dataObj) {
                var navigationData = dataObj.navigationData;
                console.log("Location Data: " + JSON.stringify(navigationData));
                locationEventHandler.setNewNavigation(navigationData);
            }



                        chat.appendReceivedMessage(payload);

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
