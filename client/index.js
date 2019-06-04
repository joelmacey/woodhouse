var region = 'us-east-1';

AWS.config.region = region; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:19145b56-e674-4e9d-ac0c-0fa4406806c2',
});
AWS.config.credentials.get(function(err) {
  if (err) alert(err);
  // console.log(AWS.config.credentials);
});
var dynamodb = new AWS.DynamoDB();
var dbTable = 'woodhouse-table';
var params = {
  TableName: dbTable
}
var intervalID = window.setInterval(myCallback, 1000);

function myCallback() {
    dynamodb.scan(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else if(data.Items[0].id.S != 'undefined'){
      var id =data.Items[0].id.S;
      var url = data.Items[0].url.S;
      console.log(url);           // successful response
      window.open(url, '_blank');
      var params = {
        Key: {
         "id": {
           S: id
          }
        },
        TableName: dbTable
       };
       dynamodb.deleteItem(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response
       });
    }
  });
}
