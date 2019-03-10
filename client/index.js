var region = 'us-east-1';

AWS.config.region = region; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:c0b7ec27-911d-4944-85d3-fd4f551444ea',
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
    } else {

    }
  });

}
