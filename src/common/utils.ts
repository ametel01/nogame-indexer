export function unixTimestampToPostgres(timestamp: number) {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  return date.toISOString().replace("T", " ").replace("Z", "");
}
