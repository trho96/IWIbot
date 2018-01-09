# How to Setup Development Environment
Assuming you already forked your verion of the bot on GitHub and cloned your repository to your development computer, the following steps will guide you to a fully functioning development environment.
## Required IBM Bluemix Services
The first step is to create all necessary IBM Bluemix Services. To create a service, on your Bluemix Dashboard, click on "Ressource erstellen". Then select the following Services from the list and name them according to the naming convention listed below. Most of the services can be found in the "Watson" category.
### 1. Conversation:
    naming convention: conversation
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
+ **BLUEMIX_API_URL**: *you will find this * i don't remember...
+ **BLUEMIX_ORGANIZATION**: *The name of the Organization you defined, when setting up Bluemix*
+ **BLUEMIX_PASS**: *Your Bluemix Password*
+ **BLUEMIX_SPACE**: *The name of the Space you defined, when setting up Bluemix*
+ **BLUEMIX_USER**: *Your IBMid (e-mail address)*
+ **CONVERSATION_ID**: *You will find this, when you click on your conversation service in the dashboard and launch the tool with the Launch Tool button. 