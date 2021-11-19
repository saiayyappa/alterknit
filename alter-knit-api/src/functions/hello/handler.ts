
export class AlterKnit {
  static check(event) {
    return new Promise(async (resolve) => {
      try {
        console.log('hello');
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Headers": "Accept,Origin,DNT,User-Agent,Referer,Content-Type,X-Amz-Date,x-amz-date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
          },
          body: JSON.stringify({
            message: 'Go Serverless!!! Your function executed successfully!',
            input: event,
          }),
        };
        resolve(response);
      } catch (error) {
        console.log('error');
      }
    });
  }
}

export const check = AlterKnit.check;
