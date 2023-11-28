import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLegalBodyDto } from './dto/create-legal.dto';
import { updateLegalBodyDto } from './dto/update-legal.dto';
import { PrismaService } from 'src/prisma';
import { Media, MediaTag, Prisma, type User } from '@prisma/client';
import { MediaService } from 'src/media';
import { Mediable } from 'src/media/media.const';
import { FindLegalQueryDto } from './dto';

@Injectable()
export class LegalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}
  async create(
    { attachments, witnesses, parties, ...data }: CreateLegalBodyDto,
    user: User,
  ) {
    await this.validateRelationData(data, parties, witnesses);
    attachments = attachments.filter(
      ({ id }) => typeof id == 'string' && !id.includes('http'),
    );
    return await this.prisma.$transaction(async (trx) => {
      const newLegal = await trx.legal.create({ data });
      // attach parties
      if (parties?.length) {
        await trx.legalParty.createMany({
          data: parties.map((x) => ({
            ...x,
            legal_id: newLegal.id,
          })),
        });
      }

      // attach witnesses
      if (witnesses?.length) {
        await trx.legalWitness.createMany({
          data: witnesses.map((x) => ({
            ...x,
            legal_id: newLegal.id,
          })),
        });
      }

      // attach media
      const newAttachments = await this.media.attachMedia(
        trx,
        user,
        attachments,
        {
          mediable_id: newLegal.id,
          mediable_type: Mediable.Entity,
          tags: [MediaTag.ATTACHMENT],
        },
      );
      // cleanup temporary uploaded attachments
      await this.media.cleanTmp(user, attachments);
      return {
        ...newLegal,
        attachments: newAttachments,
      };
    });
  }

  async findAll(query: FindLegalQueryDto) {
    //TODO:handle filter jika ada
    const filter: Prisma.LegalWhereInput[] = [];
    let search: Prisma.LegalWhereInput[] = [];
    if (query.search) {
      search = [
        {
          title: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          detail: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const res = await this.prisma.extended.legal.paginate({
      limit: query.limit || 10,
      page: query.page,
      where: {
        deleted_at: null,
        AND: [
          ...filter,
          {
            OR: search,
          },
        ],
      },
      orderBy: {
        [query.orderBy]: query.orderDirection,
      },
    });
    return {
      ...res,
      hasNextPage: res.hasNextPage,
    };
  }

  async findOne(id: number) {
    const rows = await this.prisma.legal.findFirst({
      where: { id, deleted_at: null },
      include: {
        notary: true,
        parties: true,
        witnesses: true,
      },
    });

    return {
      ...rows,
      attachments: await this.media.findAll({
        mediable_id: id,
        mediable_type: Mediable.Legal,
        tags: [MediaTag.ATTACHMENT],
      }),
    };
  }

  async update(
    id: number,
    { attachments, parties, witnesses, ...data }: updateLegalBodyDto,
    user: User,
  ) {
    await this.validateRelationData(data, parties, witnesses);

    const legal = await this.prisma.legal.findFirstOrThrow({
      where: { id, deleted_at: null },
      include: {
        parties: true,
        witnesses: true,
      },
    });

    // get deleted and new parties
    const currentPartyIds = legal.parties.map((p) => p.entity_id) || [];
    const partyIds = parties?.map((p) => p.entity_id) || [];
    const deletedParties = legal.parties.filter(
      (p) => !partyIds.includes(p.entity_id),
    );
    const newParties =
      parties?.filter((p) => !currentPartyIds.includes(p.entity_id)) || [];

    // get deleted and new witnesses
    const currentWitnessIds = legal.witnesses.map((w) => w.entity_id) || [];
    const witnessIds = witnesses?.map((w) => w.entity_id) || [];
    const deletedWitnesses = legal.witnesses.filter(
      (w) => !witnessIds.includes(w.entity_id),
    );
    const newWitnesses =
      witnesses?.filter((w) => !currentWitnessIds.includes(w.entity_id)) || [];

    // handle attachments
    const newAttachmentNames = attachments.filter(
      ({ id }) => typeof id == 'string' && !id.includes('http'),
    );
    const keepAttachments = attachments.filter((x) => typeof x == 'object');

    return await this.prisma.$transaction(async (trx) => {
      // delete detached parties
      await trx.legalParty.deleteMany({
        where: {
          id: {
            in: deletedParties.map((x) => x.id),
          },
        },
      });
      // attach new parties
      await trx.legalParty.createMany({
        data: newParties.map((x) => ({
          ...x,
          legal_id: id,
        })),
      });

      // delete detached witnesses
      await trx.legalWitness.deleteMany({
        where: {
          id: {
            in: deletedWitnesses.map((x) => x.id),
          },
        },
      });
      //attach new witnesses
      await trx.legalWitness.createMany({
        data: newWitnesses.map((x) => ({
          ...x,
          legal_id: id,
        })),
      });

      // upload new attachments
      await this.media.attachMedia(trx, user, newAttachmentNames, {
        mediable_id: id,
        mediable_type: Mediable.Legal,
        tags: [MediaTag.ATTACHMENT],
      });

      // remove attachment yang tidak dikeep
      const deletedAttachments = await trx.media.findMany({
        where: {
          id: {
            notIn: keepAttachments.map((x) => (x as Media).id),
          },
        },
      });
      await this.media.deleteMedia(trx, deletedAttachments, {
        mediable_type: Mediable.Legal,
      });
      // cleanup temporary uploaded attachments
      await this.media.cleanTmp(user, newAttachmentNames);
      // return result with new attachments
      return await trx.legal
        .update({ where: { id }, data })
        .then(async (legal) => {
          return {
            ...legal,
            attachments: await this.media.findAll(
              {
                tags: [MediaTag.ATTACHMENT],
                mediable_id: id,
                mediable_type: Mediable.Legal,
              },
              trx,
            ),
          };
        });
    });
  }

  remove(id: number) {
    return this.prisma.legal.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  private async validateRelationData(
    data: Omit<CreateLegalBodyDto, 'attachments'>,
    parties: CreateLegalBodyDto['parties'],
    witnesses: CreateLegalBodyDto['witnesses'],
  ) {
    // validate notaris
    if (
      data.notary_id &&
      !(await this.prisma.entity.findFirst({
        where: {
          id: data.notary_id,
          categories: {
            hasSome: ['NOTARIS'],
          },
        },
      }))
    )
      throw new HttpException('Notary not found', HttpStatus.NOT_FOUND);

    // validate parties (pihak2)
    if (parties?.length) {
      const validPartiesCount = await this.prisma.entity.count({
        where: {
          id: {
            in: parties.map((x) => x.entity_id),
          },
        },
      });
      if (validPartiesCount !== parties.length) {
        throw new HttpException(
          'Some of the parties are not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    // validate witnesses (saksi2)
    if (witnesses?.length) {
      const validWitnessesCount = await this.prisma.entity.count({
        where: {
          id: {
            in: witnesses.map((x) => x.entity_id),
          },
          categories: {
            hasSome: ['SAKSI'],
          },
        },
      });
      if (validWitnessesCount !== witnesses.length) {
        throw new HttpException(
          'Some of the witnesses are not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }
}
