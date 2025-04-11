import { ApiProperty } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements Users {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @Exclude() //permet d'exclure le password de la réponse
  password: string;

  @ApiProperty()
  is_admin: boolean;

  @ApiProperty()
  profile_picture: string | null; //null dit au controller d'accepter explicitement les retours NULL de prisma

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
