import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

  @Column('boolean', { default: false })
  public deleted: boolean;

  /* Listeners */
  @BeforeUpdate()
  public updateDates() {
    this.updated_at = new Date();
  }
}
