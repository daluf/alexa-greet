const AWS = require("aws-sdk");
const dynamoDBClient = new AWS.DynamoDB({ apiVersion: 'latest', region: process.env.DYNAMODB_REGION })

class DynamoDBUtils {
	getItem = async (id) => {
		return new Promise((resolve, reject) => {
			dynamoDBClient.getItem({
				TableName: process.env.DYNAMODB_TABLE,
				Key: {
					userId: { S: id }
				}
			}, (error, response) => {
				if (error) return reject(error);

				if (response.Item) {
					return resolve(response.Item);
				} else {
					return resolve({});
				}
			});
		})
	}

	saveItem = async (id, visitCount) => {
		return new Promise((resolve, reject) => {
			dynamoDBClient.updateItem({
				TableName: process.env.DYNAMODB_TABLE,
				Key: {
					userId: { S: id }
				},
				UpdateExpression: `SET visitCount = :visitCount`,
				ExpressionAttributeValues: {
					":visitCount": { N: visitCount.toString() } // values are always saved as string
				}
			}, (error, response) => {
				if (error) return reject(error);

				resolve(response);
			})
		});
	}
}

module.exports = new DynamoDBUtils();
