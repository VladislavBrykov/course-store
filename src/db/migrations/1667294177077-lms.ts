import { MigrationInterface, QueryRunner } from 'typeorm';

export class lms1670882297323 implements MigrationInterface {
  name = 'lms1670882297323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lms_note" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "human_readable_id" character varying(500) NOT NULL, "language" "public"."lang_enum" NOT NULL, "note_file" integer, CONSTRAINT "UQ_10f9855b06ae1a058bc445d29bc" UNIQUE ("human_readable_id"), CONSTRAINT "PK_517766439e4f3e2d051b5f110da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lms_meta_data" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file_name" character varying(500) NOT NULL, "url" character varying(1000) NOT NULL, "ext" character varying(1000) NOT NULL, "size" integer NOT NULL, "external_id" character varying(1000) NOT NULL, CONSTRAINT "PK_ab60d279885a159edd31da286f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lms_episode_content" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(500), "learning_outcome" character varying(1000), "language" "public"."lang_enum" NOT NULL, "external_id" integer NOT NULL, "lms_episode" integer, "image_file" integer, "activity_file" integer, "episode_guide_file" integer, "homework_file" integer, "homework_guide_file" integer, "worksheet_file" integer, "note" integer, CONSTRAINT "PK_77551d8be69cc0a513033caef67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lms_episode" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "episode_number" integer NOT NULL, "human_readable_id" character varying(200) NOT NULL, "external_id" integer NOT NULL, "lms_course" integer, CONSTRAINT "PK_4c3077611b39be302553cb1ae7c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lms_course" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "serial_number" integer NOT NULL, "human_readable_id" character varying(200) NOT NULL, "external_id" integer NOT NULL, "image_file" integer, CONSTRAINT "UQ_d1d092a1fff554e73e7b21b9e73" UNIQUE ("human_readable_id"), CONSTRAINT "PK_a0c9ad25df835feb0b8e4a89a7a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lms_course_description" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(500), "short_description" character varying(1000), "description" character varying(3000), "external_id" integer NOT NULL, "lms_course_content" integer, CONSTRAINT "PK_0d2dc253290695de119cfae3757" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."card_name" AS ENUM('classroom_materials', 'curriculum_overview', 'course_module', 'mission_overview', 'title')`,
    );
    await queryRunner.query(
      `CREATE TABLE "lms_course_summary_item" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "card_name" "public"."card_name" NOT NULL, "serial_number" integer NOT NULL, "title" character varying(500) NOT NULL, "body" character varying(3000), "external_id" integer NOT NULL, "lms_course_content" integer, CONSTRAINT "PK_3cbe4ac8e504cfb3d2b6842ae00" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lms_course_content" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "language" "public"."lang_enum" NOT NULL, "external_id" integer NOT NULL, "lms_course_id" integer, CONSTRAINT "PK_05528d0250f647906d4d1f347ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_note" ADD CONSTRAINT "FK_5327f2f4b4f325959dd9ba373ea" FOREIGN KEY ("note_file") REFERENCES "lms_meta_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" ADD CONSTRAINT "FK_765b6268dd24dffe4369a59e783" FOREIGN KEY ("lms_episode") REFERENCES "lms_episode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" ADD CONSTRAINT "FK_4e863dc12ba2462ef822fa11a5e" FOREIGN KEY ("image_file") REFERENCES "lms_meta_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" ADD CONSTRAINT "FK_3a06c1b62c9a557979668c902ca" FOREIGN KEY ("activity_file") REFERENCES "lms_meta_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" ADD CONSTRAINT "FK_512a88e7f52c16ae549e38d1e71" FOREIGN KEY ("episode_guide_file") REFERENCES "lms_meta_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" ADD CONSTRAINT "FK_88063a20e39c1ec0c5f5ecc8d53" FOREIGN KEY ("homework_file") REFERENCES "lms_meta_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" ADD CONSTRAINT "FK_a7fec4619b339cf404f21504be5" FOREIGN KEY ("homework_guide_file") REFERENCES "lms_meta_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" ADD CONSTRAINT "FK_f4928fc64b8d505a2fae0598852" FOREIGN KEY ("worksheet_file") REFERENCES "lms_meta_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" ADD CONSTRAINT "FK_50bbe38feb73e8e17902e11981b" FOREIGN KEY ("note") REFERENCES "lms_note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode" ADD CONSTRAINT "FK_998ea57eaefc9960bb401b5306a" FOREIGN KEY ("lms_course") REFERENCES "lms_course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_course" ADD CONSTRAINT "FK_59a503d8fd389edd699c0dd9e64" FOREIGN KEY ("image_file") REFERENCES "lms_meta_data"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_course_description" ADD CONSTRAINT "FK_19fef50a48decb71ab2fa069aa6" FOREIGN KEY ("lms_course_content") REFERENCES "lms_course_content"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_course_summary_item" ADD CONSTRAINT "FK_d8f9981c2537dee9a6030725b23" FOREIGN KEY ("lms_course_content") REFERENCES "lms_course_content"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_course_content" ADD CONSTRAINT "FK_474e1ad55be7107b1f342cddfb2" FOREIGN KEY ("lms_course_id") REFERENCES "lms_course"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lms_course_content" DROP CONSTRAINT "FK_474e1ad55be7107b1f342cddfb2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_course_summary_item" DROP CONSTRAINT "FK_d8f9981c2537dee9a6030725b23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_course_description" DROP CONSTRAINT "FK_19fef50a48decb71ab2fa069aa6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_course" DROP CONSTRAINT "FK_59a503d8fd389edd699c0dd9e64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode" DROP CONSTRAINT "FK_998ea57eaefc9960bb401b5306a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" DROP CONSTRAINT "FK_50bbe38feb73e8e17902e11981b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" DROP CONSTRAINT "FK_f4928fc64b8d505a2fae0598852"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" DROP CONSTRAINT "FK_a7fec4619b339cf404f21504be5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" DROP CONSTRAINT "FK_88063a20e39c1ec0c5f5ecc8d53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" DROP CONSTRAINT "FK_512a88e7f52c16ae549e38d1e71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" DROP CONSTRAINT "FK_3a06c1b62c9a557979668c902ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" DROP CONSTRAINT "FK_4e863dc12ba2462ef822fa11a5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_episode_content" DROP CONSTRAINT "FK_765b6268dd24dffe4369a59e783"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_meta_data" DROP CONSTRAINT "FK_d13370a7d4df507a4e18c4cb813"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lms_note" DROP CONSTRAINT "FK_5327f2f4b4f325959dd9ba373ea"`,
    );
    await queryRunner.query(`DROP TABLE "lms_course_content"`);
    await queryRunner.query(`DROP TABLE "lms_course_summary_item"`);
    await queryRunner.query(`DROP TYPE "public"."card_name"`);
    await queryRunner.query(`DROP TABLE "lms_course_description"`);
    await queryRunner.query(`DROP TABLE "lms_course"`);
    await queryRunner.query(`DROP TABLE "lms_episode"`);
    await queryRunner.query(`DROP TABLE "lms_episode_content"`);
    await queryRunner.query(`DROP TABLE "lms_meta_data"`);
    await queryRunner.query(`DROP TABLE "lms_note"`);
  }
}
