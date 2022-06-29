import { Bucket, Client } from "reduct-js";

export const getBucket = async (): Promise<Bucket> => {
  const client = new Client(process.env.CLIENT_URL);
  return await client.getOrCreateBucket(process.env.BUCKET);
};

export const writeData = async (data: string): Promise<number> => {
  const timestamp = Date.now() * 1000;
  const bucket = await getBucket();
  await bucket.write("entry-1", data, BigInt(timestamp));
  return timestamp;
};

export const readData = async (timestamp?: bigint): Promise<string> => {
  const bucket = await getBucket();
  const data = await bucket.read("entry-1", timestamp);
  return data.toString();
};

export const listData = async (start: bigint, stop: bigint): Promise<any> => {
  const bucket = await getBucket();
  const data = await bucket.list("entry-1", start, stop);
  // optional step for formatting bigint data
  const entries = [];
  for (const entry of data) {
    entries.push({
      size: entry.size.toString(),
      timestamp: entry.timestamp.toString(),
    });
  }
  return entries;
};
