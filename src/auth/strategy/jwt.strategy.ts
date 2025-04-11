import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { jwtSecret } from '../auth.module';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') { //les argument sont l'implementation de la strategy et son nom, c'est une strategie qui vient de passport-jwt
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //on dit qu'il faut recuperer le bearer token depuis le header (méthode standard)
      secretOrKey: jwtSecret //on spécifie que le secret est un JWT (y'a d'autre options valable)
    });
  }

  //on va aller valider le jwt en lui passant le JSON qui a été décodé par passport-jwt, si aucun user n'est reconnu alors on throw une erreur
  async validate(payload: { userId: string}) {
    const user = await this.userService.findOne(payload.userId);
    if(!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}