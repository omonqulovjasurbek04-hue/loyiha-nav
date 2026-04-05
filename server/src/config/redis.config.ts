import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const redisUrl = process.env.REDIS_URL || '';
  const isTls = isProduction && redisUrl.startsWith('rediss://');

  return {
    url: redisUrl,
    tls: isTls ? { rejectUnauthorized: false } : undefined,
    retryStrategy: (times: number): number | null => {
      if (times > 3) {
        return null; // 3 martadan keyin ulanishni to'xtatadi
      }
      return 1000; // 1 soniyadan keyin qayta urunish
    },
    // Production da maxRetriesPerRequest cheklansin
    maxRetriesPerRequest: isProduction ? 3 : null,
  };
});
