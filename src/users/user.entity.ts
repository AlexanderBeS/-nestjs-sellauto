import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  //хуки выполняются если проводить работы именно с этой сущностью
  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id ', this.id)
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id ', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id ', this.id)
  }
}
