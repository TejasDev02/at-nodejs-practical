import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar" ,nullable :true})
  username: string ;

  @Column({type:"varchar", nullable:true ,unique:true })
  email: string;

  @Column({type:"varchar"})
  password: string;
}
