import * as AWS from "aws-sdk";

const dynamoDBClient = new AWS.DynamoDB({ apiVersion: 'latest', region: process.env.DYNAMODB_REGION })
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE ?? "usersTable";

class DynamoDBUtils {
	getItem = async (id: string): Promise<AWS.DynamoDB.AttributeMap | {}> => {
		return new Promise((resolve, reject) => {
			dynamoDBClient.getItem({
				TableName: DYNAMODB_TABLE,
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

	saveItem = async (id: string, visitCount: number): Promise<AWS.DynamoDB.UpdateItemOutput> => {
		return new Promise((resolve, reject) => {
			dynamoDBClient.updateItem({
				TableName: DYNAMODB_TABLE,
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

export const dynamoDBUtils = new DynamoDBUtils();
