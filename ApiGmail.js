var axios = require('axios');
var qs = require('qs');

class ApiGmail{

    getAccessToken = async ()=>{
        var data = qs.stringify({
            client_id: "358467865769-i6ajje7v6qe5jm4tihell2qr4v6lloeh.apps.googleusercontent.com",
            client_secret: "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",
            refresh_token: "1//0dVLYRlL5JvASCgYIARAAGA0SNwF-L9IrXD6oh52L7agiYe3BE8Z02_v7l5Yk3h41PgEMVt2zTWImMBqF_NRXzttCAsarEsYvyF8",
            grant_type: "refresh_token" 
          });
          var config = {
            method: "post",
            url: "https://accounts.google.com/o/oauth2/token",
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded", 
            },
            data : data
          };
          
          var accessToken = "";
          
          await axios(config)
          .then(async function (response) {
            
            accessToken = await response.data.access_token;
          
            console.log("Access Token " + accessToken);
          })
          .catch(function (error) {
            console.log(error);
          });

          return accessToken;
    };

    searchGmail = async (searchItem)=>{
        var config = {
            method: 'get',
            url: 'https://www.googleapis.com/gmail/v1/users/me/messages?q=' + searchItem,
            headers: { 
                Authorization: `Bearer ${await this.getAccessToken()} `,
            },
        };

        var threadId = "";
        

        await axios(config)
            .then(async function (response) {     
            threadId = await response.data["messages"][0].id;

            console.log("ThreadId = " + threadId);

            })
            .catch(function (error) {
            console.log(error);
            });

            return threadId;
    };

    readGmailContent = async (messageId)=> {
        var config = {
            method: 'get',
            url: `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
            headers: { 
                Authorization: `Bearer ${await this.getAccessToken()} `,
            },
        };

        var data = {};
        

        await axios(config)
            .then(async function (response) {     
            data = await response.data;
            })
            .catch(function (error) {
            console.log(error);
            });

            return data;
    };

    readInboxContent = async (searchText)=>{

        const threadId = await this.searchGmail(searchText);
        const messages = await this.readGmailContent(threadId);

        const encodedMessage = await messages.payload["parts"][0].body.data;

        const decodedStr = Buffer.from(encodedMessage, "base64").toString("ascii");


        console.log(decodedStr);

        return decodedStr;


    }

}

module.exports= new ApiGmail();