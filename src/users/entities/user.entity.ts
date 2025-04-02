import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string | null; //null dit au controller d'accepter explicitement les retours NULL de prisma

  @ApiProperty()
  email: string;

  @Exclude() //permet d'exclure le password de la réponse
  password: string;
}
