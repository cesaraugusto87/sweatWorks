SweatWork Test

To run The Backend

```
 cd backEnd
 npm install
 sls offline start

```

 To run the FrontEnd

 ```
 cd frontEnd
 npm install
 npm start
 ```
 Create the Following file on the backEnd/Commons Folder

 ```
 credentials.json
 ```

 With the following Format

 ```
 {
   "stage": "production",
   "production": {
     "layerVersion": 1,
     "awsAccountId": "",
     "stage": "production",
     "accessKeyId": "",
     "secretAccessKey": "",
     "clientId":"",
     "fileEnvironment": "."
   },
   "dev": {
     "layerVersion": 1,
     "awsAccountId": "",
     "stage": "dev",
     "accessKeyId": "",
     "secretAccessKey": "",
     "clientId":"",
     "fileEnvironment": "."
   }
 }
 ```

 Filling all the AWS Account Key and Secret Access Key of your own.

 To change from dev to prod on the backend just run this.

 ```
 sls offline start --stage production

 ```

 and this for the frontEnd

 ```
 npm run prod

 ```