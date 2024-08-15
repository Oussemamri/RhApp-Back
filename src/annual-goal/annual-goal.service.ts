import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnualGoalEntity } from './entity/annual-goal.entity';
import { CreateAnnualGoalDto } from './dto/create-annual-goal.dto';
import { UpdateAnnualGoalDto } from './dto/update-annual-goal.dto';

@Injectable()
export class AnnualGoalService {
    constructor(
        @InjectRepository(AnnualGoalEntity)
        private annualGoalRepository: Repository<AnnualGoalEntity>,
    ) {}

    createGoal(createGoalDto: CreateAnnualGoalDto): Promise<AnnualGoalEntity> {
        const goal = this.annualGoalRepository.create(createGoalDto);
        return this.annualGoalRepository.save(goal);
    }

    getGoalsByUser(userId: number): Promise<AnnualGoalEntity[]> {
        return this.annualGoalRepository.find({ where: { user: { id: userId } as any } });
    }

    getAllGoals(): Promise<AnnualGoalEntity[]> {
        return this.annualGoalRepository.find();
    }

    getGoalsByStatus(status: string): Promise<AnnualGoalEntity[]> {
        return this.annualGoalRepository.find({ where: { status } });
    }

    getGoalsByApprovalStatus(approvedBy: 'employee' | 'manager', approved: boolean): Promise<AnnualGoalEntity[]> {
        if (approvedBy === 'employee') {
            return this.annualGoalRepository.find({ where: { employeeApproved: approved } });
        } else if (approvedBy === 'manager') {
            return this.annualGoalRepository.find({ where: { managerApproved: approved } });
        } else {
            throw new ForbiddenException('Invalid approver type');
        }
    }

    async updateGoal(id: number, updateGoalDto: UpdateAnnualGoalDto): Promise<AnnualGoalEntity> {
        const goal = await this.annualGoalRepository.preload({ id, ...updateGoalDto });

        if (!goal) {
            throw new NotFoundException('Goal not found');
        }

        return this.annualGoalRepository.save(goal);
    }

    async approveGoal(id: number, approvedBy: 'employee' | 'manager'): Promise<AnnualGoalEntity> {
        const goal = await this.annualGoalRepository.findOne({ where: { id } });

        if (!goal) {
            throw new NotFoundException('Goal not found');
        }

        if (approvedBy === 'employee') {
            goal.employeeApproved = true;
        } else if (approvedBy === 'manager') {
            goal.managerApproved = true;
        } else {
            throw new ForbiddenException('Invalid approver');
        }

        if (goal.employeeApproved && goal.managerApproved) {
            goal.status = 'Approved';
        }

        return this.annualGoalRepository.save(goal);
    }

    async deleteGoal(id: number): Promise<void> {
        const goal = await this.annualGoalRepository.findOne({ where: { id } });

        if (!goal) {
            throw new NotFoundException('Goal not found');
        }

        if (goal.employeeApproved && goal.managerApproved) {
            throw new ForbiddenException('Cannot delete an approved goal');
        }

        const result = await this.annualGoalRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException('Goal not found');
        }
    }
}
