import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    type: 'postgres' as const,
    url: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    synchronize: false,
    logging: !isProduction,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // Migration sozlamalari
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: isProduction,
  };
});
