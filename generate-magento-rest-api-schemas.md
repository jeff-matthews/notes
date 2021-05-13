## Install Magento

1. Go to the [wiki](https://wiki.corp.magento.com/display/MDOC/Set+up+Magento+environment).
1. Download the [devdocs-cloud-docker-b2b-prod.sh](https://wiki.corp.magento.com/download/attachments/112825795/devdocs-cloud-docker-b2b-prod.sh?version=1&modificationDate=1605823837000&api=v2) shell script.
1. Open the shell script and change the following:

   - B2B version
   - Magento version
   - Cloud Docker template version

1. Go to http://magento2.docker/admin/.
1. Configure 2FA:
   - Go to the [Mailhog service](https://devdocs.magento.com/cloud/docker/docker-containers-service.html#mailhog-container): http://magento2.docker:8025/
   - Click the link in the email
   - Select a provider and configure your device
1. Confirm access to admin using the one-time password (OTP)/code from your authenticator app.

## Generate REST API schemas

1. Go to the [wiki](https://wiki.corp.magento.com/display/MDOC/How+to+Generate+a+Schema+for+Swagger+or+ReDoc#HowtoGenerateaSchemaforSwaggerorReDoc-Usingscript).
1. Clone the [magennto-openapi-transformer](https://github.com/magento-devdocs/magento-openapi-transformer).
1. Follow instructions in the README.

   Note: I had to remove the `http' protocol to get this to work. I kept getting this error:

   ```terminal
   bin/get-rest-schemas-from-2_4 http://magento2.docker/

   Getting REST schema as Admin
   Enter code from the Google Authenticator app: 288116
   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
   0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0curl: (6) Could not resolve host: http
   ```

#adobeio-devsite-onboarding
