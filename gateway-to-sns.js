const AWS = require('aws-sdk')
const sns = new AWS.SNS()

const SNS_TOPIC = process.env.SNS_TOPIC

exports.handler = (event, context, callback) => {

    const { name, date, url, website, cookie } = JSON.parse(event.body)

    var params = {
        Message: JSON.stringify({ name, date, url, website, cookie }),
        TopicArn: SNS_TOPIC
    }

    sns.publish(params, function(err, data) {
        if (err) {
            console.log(err, err.stack)
            callback(err)
        }
        else {
            const response = processResponse(200, 'Done')
            callback(null, response)
        }

    });
}

const processResponse = (statusCode, message) => {

    return {
        statusCode: statusCode,
        body: message,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
}
