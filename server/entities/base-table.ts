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

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;

  @Column('timestamptz', { name: 'deleted_at', nullable: true })
  public deletedAt!: Date;

  /* Listeners */
  @BeforeUpdate()
  public updateDates(): void {
    this.updatedAt = new Date();
  }
}
