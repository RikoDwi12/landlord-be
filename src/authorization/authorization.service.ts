import { AbilityBuilder } from '@casl/ability';
import { createPrismaAbility } from '@casl/prisma';
import { Injectable, Scope } from '@nestjs/common';
import type { User } from '@prisma/client';
import { AppAbility } from 'src/@types/authorization.type';
import { PrismaService } from 'src/prisma';


@Injectable({ scope: Scope.REQUEST })
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService){}
  public ability!: AppAbility;
  async forUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );
    const roles = await this.prisma.userRole.findMany({
      where:{
        user_id: user.id
      },
      include: {
        role: {
          select: {
            permissions: true
          }
        }
      }
    })

    const permissions = roles.map(r=>r.role.permissions).flat();
    permissions.forEach((permission) => {
      if(permission == "*") return can('manage', 'all' as any);
      const [resource, action] = permission.split('.');
      if (action == '*') {
        return can('manage', resource as any);
      }
      can(action as any, resource as any);
    });
    this.ability = build();
  }
}
