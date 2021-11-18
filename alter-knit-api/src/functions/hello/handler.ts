
export class AlterKnit {
  static check(event) {
    return new Promise(async (resolve) => {
      try {
        console.log('hello');
        const response = {
          statusCode: 200,
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
