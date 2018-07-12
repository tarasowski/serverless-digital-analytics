const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()


const TABLE_NAME = process.env.TABLE_NAME || 'ServerlessWebTracker'

exports.handler = (event, context, callback) => {

    // needs to be refactored with a map() - code smell
    const { name, date, url, website, cookie } = JSON.parse(event.Records[0].Sns.Message)

    const params = {
        TableName: TABLE_NAME,
        Key: {
            "website": {
                "S": website,
            },
            "url": {
                "S": url
            }
        },
        UpdateExpression: "SET #nm = :val1, #dt =:val2, #ck = :val5, #ct = if_not_exists(#ct, :val3) + :val4",
        ExpressionAttributeNames: {
            "#nm": "name",
            "#dt": "date",
            "#ct": "counter",
            "#ck": "cookie"
        },
        ExpressionAttributeValues: {
            ":val1": {
                "S": name
            },
            ":val2": {
                "S": String(date)
            },
            ":val3": {
                "N": "0"
            },
            ":val4": {
                "N": "1"
            },
            ":val5": {
                "S": cookie
            }
        },
        ReturnValues: "UPDATED_NEW"
    }

    dynamodb.updateItem(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred   
            callback(err)
        }
        else {
            console.log(data); // successful response   
            callback(null, 'Everything works')
        }
    })


}
