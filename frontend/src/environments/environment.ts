// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiEndpoints: {
    CONVERSATION_API_URL: 'https://service.eu-de.apiconnect.ibmcloud.com/gws/apigateway/api/05228ef049045b87490b99e65d97270739d670d9ebb2ea5d5684c205ebd7deb6/iwibot/router',
    HSKA_STUDENT_INFO_URL: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/v2/info',
    BULLETIN_BOARD_NEWS_URL: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/newsbulletinboard',
  }
};
