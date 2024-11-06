import { IsOptional, IsString, IsEnum, IsBoolean } from "class-validator";

export class UpdateAnnualGoalDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(["Not Started", "In Progress", "Completed"])
  status?: string;

  @IsOptional()
  @IsBoolean()
  employeeApproved: boolean;

  @IsOptional()
  @IsBoolean()
  managerApproved: boolean;
}
