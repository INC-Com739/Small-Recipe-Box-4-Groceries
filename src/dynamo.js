import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

const REGION = import.meta.env.VITE_APP_AWS_REGION;
const ACCESS_KEY_ID = import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY;

const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

export async function scanRecipes() {
  const command = new ScanCommand({ TableName: 'Recipies' });
  const result = await ddbDocClient.send(command);
  return result.Items || [];
}

export async function createRecipe(item) {
  const command = new PutCommand({ TableName: 'Recipies', Item: item });
  await ddbDocClient.send(command);
}

export async function updateRecipe(item) {
  const command = new UpdateCommand({
    TableName: 'Recipies',
    Key: { Cake: item.Cake },
    UpdateExpression: 'set #ingredients = :ingredients',
    ExpressionAttributeNames: {
      '#ingredients': 'ingredients',
    },
    ExpressionAttributeValues: {
      ':ingredients': item.ingredients,
    },
  });
  await ddbDocClient.send(command);
}

export async function deleteRecipe(Cake) {
  const command = new DeleteCommand({
    TableName: 'Recipies',
    Key: { Cake },
  });
  await ddbDocClient.send(command);
}