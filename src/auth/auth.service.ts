import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    //on va chercher si l'user existe
    const user = await this.prisma.users.findUnique({ where: { email: email } });

    //si y'a pas on retourne une erreur
    if (!user) {
      throw new NotFoundException(`User not found for email: ${email}`);
    }

    //check du password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    //si le password n'est pas bon, on renvoie une erreur
    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid password`);
    }

    //on génère un JWT qui contient le userId
    return {
      accessToken: this.jwtService.sign({ userId: user.id})
    }
  }
}
