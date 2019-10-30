import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ProviderName {
  GOOGLE = 'google',
}

@Entity('oauth')
export class Oauth {
  @PrimaryGeneratedColumn()
  public id!: number;

  @PrimaryGeneratedColumn('uuid')
  public uuid!: string;

  @Column('int', { name: 'actor_id' })
  public actorId!: number;

  @Column('enum', { enum: ProviderName })
  public provider!: ProviderName;

  @Column('varchar', { name: 'access_token' })
  public accessToken!: string;

  @Column('varchar', { name: 'refresh_token', nullable: true })
  public refreshToken!: string;

  @Column('timestamptz', { name: 'expires_at', nullable: true })
  public expiresAt!: string;

  @Column('timestamptz', { name: 'deleted_at', nullable: true })
  public deletedAt!: string;
}
