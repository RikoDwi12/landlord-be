import { EntityCategory, EntityType } from '@prisma/client';

export const ENTITY_CATEGORIES = {
  LANDLORD: 'Landlord',
  PIC: 'PIC',
  OTHER: 'Lainnya',
  SAKSI: 'Saksi',
  BROKER: 'Broker',
  CLIENT: 'Client',
  NOTARIS: 'Notaris',
} satisfies Record<EntityCategory, string>;

export const ENTITY_TYPES = {
  CV: 'CV',
  PT: 'PT',
  FIRMA: 'Firma',
  PERORANGAN: 'Perorangan',
} satisfies Record<EntityType, string>;
