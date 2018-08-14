// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiEndpoints: {
    CONVERSATION_API_URL: 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/c9f88de3acb5a4648e4f118769d019c8df8797d1777c4342f43260626b4c51bf/iwibot/router',
    HSKA_STUDENT_INFO_URL: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/v2/info',
    BULLETIN_BOARD_NEWS_URL: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/newsbulletinboard',
  }
};
