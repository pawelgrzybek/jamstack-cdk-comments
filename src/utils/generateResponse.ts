interface IResponse {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  body: string;
}

export default (
  statusCode: number,
  data: Record<string, unknown>
): IResponse => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify(data, null, 2),
});
