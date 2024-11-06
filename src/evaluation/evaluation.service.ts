import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EvaluationEntity } from "./entity/evaluation.entity";
import { CreateEvaluationDto } from "./dto/create-evaluation.dto";
import { UpdateEvaluationDto } from "./dto/update-evaluation.dto";
import { UserEntity } from "../user/entity/user.entity";

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(EvaluationEntity)
    private evaluationRepository: Repository<EvaluationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getEvaluationsByManager(
    managerId: number,
  ): Promise<EvaluationEntity[]> {
    return this.evaluationRepository.find({
      where: { manager: { id: managerId } },
      relations: ["manager", "user"],
    });
  }

  async getEvaluationsByUser(userId: number): Promise<EvaluationEntity[]> {
    return this.evaluationRepository.find({
      where: { user: { id: userId } },
      relations: ["user"],
    });
  }

  async createEvaluation(
    createEvaluationDto: CreateEvaluationDto,
  ): Promise<EvaluationEntity> {
    const {
      userId,
      managerId,
      comments,
      evaluationDate,
      employeeRating,
      managerRating,
    } = createEvaluationDto;

    if (!userId || !comments || !evaluationDate) {
      throw new BadRequestException("Missing required fields");
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["manager"],
    });

    const manager = await this.userRepository.findOne({
      where: { id: managerId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!manager) {
      throw new NotFoundException("Manager not found");
    }

    // Create a new evaluation instance
    const newEvaluation = this.evaluationRepository.create({
      user,
      manager,
      comments,
      evaluationDate,
      employeeRating,
      managerRating,
    });

    // Save and return the new evaluation
    return this.evaluationRepository.save(newEvaluation);
  }

  async update(
    id: number,
    updateEvaluationDto: UpdateEvaluationDto,
  ): Promise<EvaluationEntity> {
    await this.evaluationRepository.update(id, updateEvaluationDto);
    return this.evaluationRepository.findOneBy({ id });
  }
}
