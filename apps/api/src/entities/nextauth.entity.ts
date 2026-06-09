import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './kurumachi.entity';

@Entity('accounts')
@Unique(['provider', 'providerAccountId'])
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'varchar', name: 'provider_account_id' })
  providerAccountId: string;

  @Column({ type: 'text', nullable: true, name: 'refresh_token' })
  refresh_token: string;

  @Column({ type: 'text', nullable: true, name: 'access_token' })
  access_token: string;

  @Column({ type: 'int', nullable: true, name: 'expires_at' })
  expires_at: number;

  @Column({ type: 'varchar', nullable: true, name: 'token_type' })
  token_type: string;

  @Column({ type: 'varchar', nullable: true })
  scope: string;

  @Column({ type: 'text', nullable: true, name: 'id_token' })
  id_token: string;

  @Column({ type: 'varchar', nullable: true, name: 'session_state' })
  session_state: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, name: 'session_token' })
  sessionToken: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'timestamp' })
  expires: Date;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

@Entity('verification_tokens')
@Unique(['identifier', 'token'])
export class VerificationToken {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  identifier: string;

  @Column({ type: 'varchar', unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expires: Date;
}