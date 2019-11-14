import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';

export abstract class BaseTable {
  @PrimaryGeneratedColumn()
  public id!: number;

  @PrimaryGeneratedColumn('uuid')
  public uuid!: string;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;

  @Column('timestamptz', { nullable: true })
  public deleted_at!: Date;

  /* Listeners */
  @BeforeUpdate()
  public updateDates(): void {
    this.updated_at = new Date();
  }
}
