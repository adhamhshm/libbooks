export const auth0Config = {
    clientId: '"<<UPDATE-WITH-YOUR-APP-CLIENT-ID>>"',
    issuer: "<<UPDATE-WITH-YOUR-DOMAIN>>",
    audience: "http://localhost:8080",
    redirectUri: window.location.origin + "/callback",
    scope: 'openid profile email'
}

// export const auth0Config = {
//  clientId: 'abcdefgdE3mAoSMTNAbcdEFgvvLl4ZqU2',
//  issuer: '1234567luv2code.us.auth0.com',
//  audience: "http://localhost:8080",
//  redirectUri: window.location.origin+"/callback",
//  scope: 'openid profile email'
// }