-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('PT', 'CV', 'FIRMA', 'PERORANGAN');

-- CreateEnum
CREATE TYPE "EntityCategory" AS ENUM ('BROKER', 'CLIENT', 'NOTARIS', 'LANDLORD', 'PIC', 'SAKSI', 'OTHER');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('RUKO', 'TANAH', 'GEDUNG', 'GUDANG', 'KANTOR', 'RUMAH', 'APARTEMEN', 'BILLBOARD', 'NEONBOX', 'PABRIK');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('SHM', 'SHGB', 'SHMSRS');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" SERIAL NOT NULL,
    "categories" "EntityCategory"[],
    "type" "EntityType" NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "nib" TEXT,
    "npwp" TEXT,
    "address" TEXT,
    "contact_name" TEXT,
    "contact_phone" TEXT,
    "city_code" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_group" (
    "entity_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "entity_group_pkey" PRIMARY KEY ("entity_id","group_id")
);

-- CreateTable
CREATE TABLE "nops" (
    "id" SERIAL NOT NULL,
    "nop" TEXT NOT NULL,
    "taxpayer_id" INTEGER,
    "location" TEXT,
    "subdistrict_code" TEXT,
    "land_area" INTEGER,
    "building_area" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "nops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER,
    "name" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "address" TEXT NOT NULL,
    "city_code" TEXT,
    "land_area" INTEGER NOT NULL,
    "building_area" INTEGER NOT NULL,
    "dimension" TEXT NOT NULL,
    "link_gmap" TEXT,
    "specific_info" JSONB,
    "lease_price_monthly" INTEGER NOT NULL,
    "lease_price_yearly" INTEGER NOT NULL,
    "sell_price" INTEGER NOT NULL,
    "desc" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "other_info" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "behalf_of_id" INTEGER NOT NULL,
    "type" "CertificateType" NOT NULL,
    "no" TEXT NOT NULL,
    "subdistrict_code" TEXT,
    "address" TEXT,
    "location_name" TEXT,
    "original_cert" TEXT,
    "original_doc" TEXT,
    "copy_archive" TEXT,
    "no_copy_archive" TEXT,
    "ownership_status" TEXT,
    "owner_id" INTEGER,
    "functional" TEXT,
    "land_area" DOUBLE PRECISION NOT NULL,
    "ajb_notary_id" INTEGER NOT NULL,
    "ajb_no" TEXT NOT NULL,
    "publish_date" DATE NOT NULL,
    "expired_date" DATE NOT NULL,
    "other_info" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pbbs" (
    "id" SERIAL NOT NULL,
    "nop_id" INTEGER NOT NULL,
    "year" CHAR(4) NOT NULL,
    "land_area" INTEGER NOT NULL,
    "building_area" INTEGER NOT NULL,
    "njop_land" INTEGER NOT NULL,
    "njop_building" INTEGER NOT NULL,
    "njop_no_tax" INTEGER NOT NULL,
    "taxpayer_id" INTEGER NOT NULL,
    "stimulus" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "payment_fee" INTEGER NOT NULL DEFAULT 0,
    "total_payment" INTEGER,
    "payment_method" TEXT,
    "payment_date" DATE,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "pbbs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_nop" (
    "id" SERIAL NOT NULL,
    "certificate_id" INTEGER NOT NULL,
    "nop_id" INTEGER NOT NULL,

    CONSTRAINT "certificate_nop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crms" (
    "id" SERIAL NOT NULL,
    "property_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "prospect_client_id" INTEGER NOT NULL,
    "prospect_desc" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "crms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indonesia_provinces" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,

    CONSTRAINT "indonesia_provinces_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "indonesia_cities" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province_code" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,

    CONSTRAINT "indonesia_cities_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "indonesia_districts" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city_code" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,

    CONSTRAINT "indonesia_districts_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "indonesia_subdistricts" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "district_code" TEXT NOT NULL,
    "latitude" TEXT,
    "longitude" TEXT,

    CONSTRAINT "indonesia_subdistricts_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "directory" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "extension" CHAR(32) NOT NULL,
    "mime_type" CHAR(128) NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mediables" (
    "id" SERIAL NOT NULL,
    "media_id" INTEGER NOT NULL,
    "mediable_type" TEXT NOT NULL,
    "mediable_id" INTEGER NOT NULL,

    CONSTRAINT "mediables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nops_nop_key" ON "nops"("nop");

-- CreateIndex
CREATE UNIQUE INDEX "indonesia_provinces_code_key" ON "indonesia_provinces"("code");

-- CreateIndex
CREATE UNIQUE INDEX "indonesia_cities_code_key" ON "indonesia_cities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "indonesia_districts_code_key" ON "indonesia_districts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "indonesia_subdistricts_code_key" ON "indonesia_subdistricts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "media_directory_filename_extension_key" ON "media"("directory", "filename", "extension");

-- CreateIndex
CREATE UNIQUE INDEX "mediables_media_id_mediable_type_mediable_id_key" ON "mediables"("media_id", "mediable_type", "mediable_id");

-- AddForeignKey
ALTER TABLE "entities" ADD CONSTRAINT "entities_city_code_fkey" FOREIGN KEY ("city_code") REFERENCES "indonesia_cities"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_group" ADD CONSTRAINT "entity_group_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_group" ADD CONSTRAINT "entity_group_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nops" ADD CONSTRAINT "nops_subdistrict_code_fkey" FOREIGN KEY ("subdistrict_code") REFERENCES "indonesia_subdistricts"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nops" ADD CONSTRAINT "nops_taxpayer_id_fkey" FOREIGN KEY ("taxpayer_id") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_city_code_fkey" FOREIGN KEY ("city_code") REFERENCES "indonesia_cities"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_subdistrict_code_fkey" FOREIGN KEY ("subdistrict_code") REFERENCES "indonesia_subdistricts"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_ajb_notary_id_fkey" FOREIGN KEY ("ajb_notary_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_behalf_of_id_fkey" FOREIGN KEY ("behalf_of_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pbbs" ADD CONSTRAINT "pbbs_taxpayer_id_fkey" FOREIGN KEY ("taxpayer_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pbbs" ADD CONSTRAINT "pbbs_nop_id_fkey" FOREIGN KEY ("nop_id") REFERENCES "nops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_nop" ADD CONSTRAINT "certificate_nop_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "certificates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate_nop" ADD CONSTRAINT "certificate_nop_nop_id_fkey" FOREIGN KEY ("nop_id") REFERENCES "nops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crms" ADD CONSTRAINT "crms_prospect_client_id_fkey" FOREIGN KEY ("prospect_client_id") REFERENCES "entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crms" ADD CONSTRAINT "crms_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indonesia_cities" ADD CONSTRAINT "indonesia_cities_province_code_fkey" FOREIGN KEY ("province_code") REFERENCES "indonesia_provinces"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indonesia_districts" ADD CONSTRAINT "indonesia_districts_city_code_fkey" FOREIGN KEY ("city_code") REFERENCES "indonesia_cities"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indonesia_subdistricts" ADD CONSTRAINT "indonesia_subdistricts_district_code_fkey" FOREIGN KEY ("district_code") REFERENCES "indonesia_districts"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mediables" ADD CONSTRAINT "mediables_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
