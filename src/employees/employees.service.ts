import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
    constructor(private readonly PrismaService: PrismaService) { }

    async create(createEmployeeDto: CreateEmployeeDto) {
        try {
            const employee = await this.PrismaService.employee.create({ data: createEmployeeDto });
            return {
                message: 'Employee created successfully',
                data: employee,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to create employee');
        }
    }

    async findAll(page: number = 1, limit: number = 10) {
        try {
            const employees = await this.PrismaService.employee.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: { deletedAt: null },
            });

            return {
                message: 'Employees fetched successfully',
                data: employees,
            };
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch employees');
        }
    }

    async findOne(id: number) {
        try {
            const employee = await this.PrismaService.employee.findUnique({ where: { id } });

            if (!employee) {
                throw new NotFoundException('Employee not found');
            }

            return {
                message: 'Employee fetched successfully',
                data: employee,
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
        try {
            const employee = await this.PrismaService.employee.update({
                where: { id },
                data: updateEmployeeDto,
            });



            return {
                message: 'Employee updated successfully',
                data: employee,
            };
        } catch (error) {
            console.log('error', error.message);
            throw new InternalServerErrorException(
                `Failed to update employee: ${error.message}`,
            );
        }
    }

    async softDelete(id: number) {
        try {
            const employee = await this.PrismaService.employee.findUnique({ where: { id } });
            if (!employee) {
                throw new NotFoundException('Employee not found');
            }

            const deleted = await this.PrismaService.employee.update({
                where: { id },
                data: { deletedAt: new Date() },
            });

            return {
                message: 'Employee deleted successfully',
                data: deleted,
            };
        } catch (error) {
            throw error;
        }
    }
}
