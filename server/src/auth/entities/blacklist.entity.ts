import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('token_blacklist')
export class TokenBlacklist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ unique: true })
  token: string;

  @CreateDateColumn()
  blacklisted_at: Date;

  @Column({ type: 'timestamp' })
  expires_at: Date;
}
