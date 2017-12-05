# IWIbot - Intelligent Chatbot Platform

## About
Virtual assistants are an upcoming area of modern user interfaces and intelligent systems. They are exciting in terms of flexible methods for speech processing and conversation management, the realization of intents by means of intelligent service composition in the cloud and many novel types of innovative applications.

In the IWIbot project we are building a simple but complete platform for cloud-based implementation of virtual assistants. Such an assistant utilizes the natural-language-based orchestration of web-accessible services to collectively create a desired output for the user.

We have realized a concrete prototype of an assistant for the intranet of the Computer Science Faculty (IWI) at Karlsruhe University of Applied Sciences (HsKA) - the **HskA IWIbot** - based on the IBM Bluemix Cloud platform. The IWIbot illustrates some basic applications, such as querying of cafeteria food ("What's in the cafeteria today?") or jokes ("Tell me a joke").

The IWIbot interacts with natural language and provides various functions of the IWI Intranet via conversations. It is implemented as a chatbot in IBM Bluemix and uses IBM Watson language processing services. In order to make it easily scalable and extensible, it is implemented "serverless" as a chain of stateless function calls (Function-as-a-Service). A web app has been developed as a user interface.

Various modern technologies and programming languages ​​can be used to implement individual components. Java and Spring, JavaScript and Node.js or Python and Flask are just some possible choices. The communication of components and services is predominantly realized via interoperable REST calls.

IWIbot is open source software under the Apache license.

## Environment
### Cloud Platform (Bluemix)
### CI Pipeline (Github and Travis)
## Development
### Prepare
1. Fork and clone the repository 
2. Create a local branch if required or checkout an existing one
3. Copy `template.local.env` to `local.env` and fill in the values
### Code
1. Select an existing feature directory or create a new one (e.g. `openwhisk/<myfearure>`)
2. Do changes and create isolated tests in the feature directory
3. Build the feature by running grunt in your feature directory 
### Test
### Integrate
### Document
1. Add documentation to a `README.md` in your feature directory and any other you have worked on

---
**2017, Distributed Systems (VSYS)  
Karlsruhe University of Applied Sciences (HsKA)**
