# How to Setup Development Environment
Assuming you already forked your verion of the bot on GitHub and cloned your repository to your development computer, the following steps will guide you to a fully functioning development environment.
## Required IBM Bluemix Services
The first step is to create all necessary IBM Bluemix Services. To create a service, on your Bluemix Dashboard, click on "Ressource erstellen". Then select the following Services from the list and name them according to the naming convention listed below. Most of the services can be found in the "Watson" category.
### 1. Conversation:
    naming convention: conversation
    After creating the service, click on it and launch the tool. Here you can import a workspace. Use the json file in the conversation folder of this repository.
### 2. Speech to Text
    naming convention: speech_to_text
### 3. Text to Speech
    naming convention: text_to_speech
### 4. Weather Company Data
    naming convention: weatherinsights

## Setup Travis CI
The second step is to set up Travis CI to automatically build and deploy every commit that is made to your Fork to your own Instance of the IWIBot.
### Add the IWIBot to Travis
To log in on the Travis CI website (https://travis-ci.org/), you can use your GitHub Credentials.
After logging in, you should see a list of Repositories on the left side. Click on **the IWIBot Repository with your username** and activate it. Since there is already a travis.yml file in the repository, the build button should already be active. But it won't work yet. Since Travis will deploy to your own instance of Bluemix, it needs to know your credentials and a few other things.
### Adding Environment Variables to Travis
In order for Travis to be able to build and deploy your IWIBot, it needs some additional credentials and variables. These are saved as Environment Variables. To add a Environment Variable, go to the Settings of your Repository in Travis CI and Scroll down to the section *Environment Variables*. Now add the following Keys:
+ **WSK_API_CODE**: Click on APIs in the menu on the left. Then click on the API that is listed here. Click it again and in the following view, you will be able to copy the Code out of the URL.
+ **BLUEMIX_ORGANIZATION**: *The name of the Organization you defined, when setting up Bluemix*
+ **BLUEMIX_PASS**: *Your Bluemix Password*
+ **BLUEMIX_SPACE**: *The name of the Space you defined, when setting up Bluemix*
+ **BLUEMIX_USER**: *Your IBMid (e-mail address)*
+  **CONVERSATION_PASSWORD** *Click on the conversation service in the dashboard. Then, on the left, select "Serviceberechtigungsnachweis". Then, expand the "Berechtigungsnachweise anzeigen" dropdown. There you will find your conversation password.
+  **CONVERSATION_Username** *Click on the conversation service in the dashboard. Then, on the left, select "Serviceberechtigungsnachweis". Then, expand the "Berechtigungsnachweise anzeigen" dropdown. There you will find your conversation username.
+  **CONVERSATION_WORKSPACE_ID**: *You will find this, when you click on your conversation service in the dashboard and launch the tool with the Launch Tool button. Then, click on the 3-points icon on the conversation service you imported (IWIBot Conversation Service). Then select "View Details", there you will find the Workspace ID*
+ **CONVERSATION_ID**: *You will find this, when you click on your conversation service in the dashboard and launch the tool with the Launch Tool button. Then, click on the conversation service you imported (IWIBot Conversation Service). Select the "Dialog" tab and click on the "Greeting" Field. In the "Response" Text Field, add \<?context?> at the end. Then start a new conversation by clicking the chat icon in the upper right corner. Type "hallo" and your conversation id will be printed out in the chat window.*
+ **DEPLOY_HOSTNAME**: *You can choose this yourself. This will be the sub-url where your instance is deployed (DEPLOY_HOSTNAME.mybluemix.net). Use alphanumeric values only!*
+ **OPENWHISK_KEY**: *In the menu on the left, click on "Funktionen", then on "API-Schlüssel". You can copy the key from here.
+ **WEATHER_COMPANY_URL**: *Just like the conversation username and passwords. Click on the Weather Service, then select "Servicebenachrichtigungsnachweis, expand "Berechtigungsnachweise anzeigen" and copy your URL.

With all of this done, you should be able to run your first build. Every time you push commits to GitHub, Travis will try to build your current version and deploy it to the url specified above.
