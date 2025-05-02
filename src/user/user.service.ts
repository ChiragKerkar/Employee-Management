import { Injectable, UnauthorizedException } from '@nestjs/common';
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

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return user;
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

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }


        // Generate JWT token
        const payload = { sub: user.id, username: user.email, role: user.role };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'), // <-- Better way
            expiresIn: '60s',
        });
        return { access_token: token };
    }
}
