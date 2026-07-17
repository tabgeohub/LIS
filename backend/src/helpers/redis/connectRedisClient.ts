import { createClient, type RedisClientType } from "redis";

export async function connectRedisClient(
  url: string | undefined
): Promise<RedisClientType | null> {
  const client = createClient({ url });
  client.on("error", (error) => {
    console.error(
      JSON.stringify({
        type: "lis.redis",
        event: "client_error",
        message: error.message,
        ts: new Date().toISOString(),
      })
    );
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error(
      JSON.stringify({
        type: "lis.redis",
        event: "connect_failed",
        message: (error as Error)?.message,
        ts: new Date().toISOString(),
      })
    );
    return null;
  }
}

export function logRedisConnected(input: {
  sessions: boolean;
  rateLimit: boolean;
}) {
  console.warn(
    JSON.stringify({
      type: "lis.redis",
      event: "connected",
      sessions: input.sessions,
      rateLimit: input.rateLimit,
      ts: new Date().toISOString(),
    })
  );
}
