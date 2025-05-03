import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    // Register a new user
    async register(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;

        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role: createUserDto.role || 'user',
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                },
            });

            return {
                status: 'success',
                message: 'User registered successfully',
                data: user,
            };
        } catch (err) {
            throw new InternalServerErrorException('Failed to register user');
        }
    }
    // Login and generate JWT token
    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        // Find the user by email
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        try {
            const payload = { sub: user.id, email: user.email, role: user.role };
            const token = this.jwtService.sign(payload, {
              secret: this.configService.get('JWT_SECRET'),
              expiresIn: '1h', // adjust as needed
            });

            return {
              status: 'success',
              message: 'Login successful',
              access_token: token,
            };
          } catch (err) {
            throw new InternalServerErrorException('Failed to generate token');
          }
    }
}
