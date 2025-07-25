# libbooks

This is a React and Spring Boot project. Library Management System.

## Database

Mock data is given in the mysql/sql/init.sql. Can use Docker to run locally if MySQL not installed  in workstation.

## Enabling HTTPS for React and Spring Boot in Local Development

There are several ways can be done, this is just one of it.

- Install Chocolatey - using cmd.exe as admin
```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command " [System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```
- Check if Chocolatey installed - run choco
```
> choco
Chocolatey v2.5.0
Please run 'choco --help' or 'choco <command> --help' for help menu.
```
- Install mkcert
```
choco install mkcert
mkcert -install
```
- For React, either way, can use any directory, then can run for example:
```
mkcert -key-file key.pem -cert-file cert.pem localhost
```
- This will generate:
```
cert.pem (certificate)
key.pem (private key)
```
- Update vite.config.ts to include something like:
```
server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/cert.pem')),
    },
    port: 5173,
    host: 'localhost'
}
```
- For Spring Boot, either way, can use any directory, then can run for example:
```
mkcert localhost
```
- This will generate:
```
localhost.pem (certificate)
localhost-key.pem (private key)
```
- Then can run for example, password prompt you decide:
```
openssl pkcs12 -export -in localhost.pem -inkey localhost-key.pem -out keystore.p12 -name selfsigned
```
- This will generate:
```
keystore.p12
```
- Update application.properties:
```
server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=changeit
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=selfsigned
```
- With that, should be able to use https:
```
https://localhost:5173/
https://localhost:8443/
```

## Using Auth0

- Make an account
- Go to Applications -> Applications -> Create Application
- Provide name and fill in the following fields with your url:
```
Allowed Callbacks URLs
Allowed Logout URLs
Allowed Web Origins
Allowed Origins (CORS)
Cross-Origin Verification Fallback URL
```
- Go to Applications -> APIs -> Create API
- Provide name and identifier as in your backed url
- Go to Actions -> Library -> Create Action
- Build from scratch -> Provide name, Trigger select "Login/Post Login"
- Use code below:
```
exports.onExecutePostLogin = async (event, api) => {
    const namespace = 'https://<any-name-you-like>.com'; // Use your own namespace

    if (event.authorization) {
        api.idToken.setCustomClaim('email', event.user.email);
        api.idToken.setCustomClaim(`${namespace}/roles`, event.authorization.roles);
        api.accessToken.setCustomClaim(
            `${namespace}/roles`,
            event.authorization.roles
        );
        api.accessToken.setCustomClaim('email', event.user.email);
    }
};
```
- Then deploy
- Go to Actions -> Triggers
- Select "post-login"
- Drag the custom library created to the flow
- Other than that, create use roles in User Management -> Roles
- Roles can be assigned to users
- The rest configuration (for Spring Boot etc.) can refer to other documentations

*Disclaimer, this is not a guide, just some personal notes*
