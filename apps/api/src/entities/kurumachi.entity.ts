import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Account, Session } from './nextauth.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') // Замість cuid в TypeORM стандарт — uuid
  id: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column({ type: 'timestamp', nullable: true, name: 'email_verified' })
  emailVerified: Date;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Animation, (animation) => animation.author)
  animations: Animation[];
}

@Entity('animations')
export class Animation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  tag: string;

  @Column({ type: 'varchar' })
  filename: string;

  @Column({ type: 'boolean', default: true, name: 'is_system' })
  isSystem: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.animations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}