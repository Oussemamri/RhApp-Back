import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "../../user/entity/user.entity";

@Entity("annual_goals")
export class AnnualGoalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: "enum", enum: ["Not Started", "In Progress", "Completed"] })
  status: string;

  @Column({ type: "boolean", default: false })
  employeeApproved: boolean;

  @Column({ type: "boolean", default: false })
  managerApproved: boolean;

  @ManyToOne(() => UserEntity, (user) => user.annualGoals,{onDelete:'CASCADE'})
  @JoinColumn({ name: "user_id" })
  user: UserEntity;
}
