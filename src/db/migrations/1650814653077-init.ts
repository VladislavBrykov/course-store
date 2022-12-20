import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1650814653077 implements MigrationInterface {
  name = 'init1650814653077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "base_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "screen_writer" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_profile_id" integer, CONSTRAINT "REL_5b8d7f83a9f19adca98badd8a6" UNIQUE ("user_profile_id"), CONSTRAINT "PK_4cc7d73a99e3d5ac59345da7347" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "teacher" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_profile_id" integer, CONSTRAINT "REL_f462afc954887cf39bdf9a1efb" UNIQUE ("user_profile_id"), CONSTRAINT "PK_2f807294148612a9751dacf1026" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'screen-writer', 'student', 'teacher')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL, CONSTRAINT "UQ_e336cc51b61c40b1b1731308aa5" UNIQUE ("email"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "student" ("id" SERIAL NOT NULL, "is_test" BOOLEAN DEFAULT FALSE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "player_name" character varying, "user_profile_id" integer, CONSTRAINT "REL_6c47f81ec42cc2eee56c823b6b" UNIQUE ("user_profile_id"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_79db6a0da2c5a96474d28d8a89" ON "student" ("player_name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "episode_state" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_active" boolean NOT NULL DEFAULT true, "is_completed" boolean NOT NULL DEFAULT false, "episode_id" integer, "student_id" integer NOT NULL, "episode_stage_id" integer, "shown_clue_id" integer, CONSTRAINT "PK_691481ce1d8c3f0ed3bd3263f87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lang_enum" AS ENUM('eng', 'ita')`,
    );
    await queryRunner.query(
      `CREATE TABLE "codeword_clue" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "clue" character varying NOT NULL, "lang" "public"."lang_enum" NOT NULL DEFAULT 'eng', "content_id" integer NOT NULL, CONSTRAINT "PK_4da94729d350154b800dde61066" PRIMARY KEY ("id"))`,
    );
    // await queryRunner.query(`CREATE TYPE "public"."lang_enum" AS ENUM('eng')`);
    await queryRunner.query(
      `CREATE TABLE "text" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "text" text NOT NULL, "lang" "public"."lang_enum" NOT NULL DEFAULT 'eng', "content_id" integer NOT NULL, CONSTRAINT "PK_ef734161ea7c326fedf699309f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."content_type_enum" AS ENUM('text', 'codeword-clue')`,
    );
    await queryRunner.query(
      `CREATE TABLE "content" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content_type" "public"."content_type_enum" NOT NULL, "episode_stage_id" integer NOT NULL, CONSTRAINT "REL_1d3815b0b8dde0d6d1e2f4d036" UNIQUE ("episode_stage_id"), CONSTRAINT "PK_6a2083913f3647b44f205204e36" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."episode_stage_trait_enum" AS ENUM('info', 'challenge', 'success', 'error', 'clue')`,
    );
    await queryRunner.query(
      `CREATE TABLE "episode_stage" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "trait" "public"."episode_stage_trait_enum" NOT NULL, "is_entry_point" boolean NOT NULL DEFAULT false, "next_stage_id" integer, "rollback_stage_id" integer, "episode_id" integer NOT NULL, CONSTRAINT "PK_df2e63e82226263bc822c6ab18d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "episode" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(250) NOT NULL, "codeword" character varying(50) NOT NULL, "is_published" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7258b95d6d2bf7f621845a0e143" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5b8186cd5641b3bf6ee49479ce" ON "episode" ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_557a06f87aff3cfac01dba1770" ON "episode" ("codeword") `,
    );
    // await queryRunner.query(`CREATE TYPE "public"."lang_enum" AS ENUM('eng')`);
    await queryRunner.query(
      `CREATE TABLE "answer_validator" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "validator_function" character varying NOT NULL, "lang" "public"."lang_enum" NOT NULL DEFAULT 'eng', "episode_id" integer NOT NULL, CONSTRAINT "PK_75d47b7dd656205a78b95d39880" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "screen_writer" ADD CONSTRAINT "FK_5b8d7f83a9f19adca98badd8a69" FOREIGN KEY ("user_profile_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teacher" ADD CONSTRAINT "FK_f462afc954887cf39bdf9a1efbe" FOREIGN KEY ("user_profile_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student" ADD CONSTRAINT "FK_6c47f81ec42cc2eee56c823b6b7" FOREIGN KEY ("user_profile_id") REFERENCES "user_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_state" ADD CONSTRAINT "FK_b4a2551bf2ed8332e160f361299" FOREIGN KEY ("episode_id") REFERENCES "episode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_state" ADD CONSTRAINT "FK_284c19fa3a92c0b250b81e90062" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_state" ADD CONSTRAINT "FK_3462fd6317f558e170b51d70908" FOREIGN KEY ("episode_stage_id") REFERENCES "episode_stage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_state" ADD CONSTRAINT "FK_3e1e4fc8b77073dffcf117925f1" FOREIGN KEY ("shown_clue_id") REFERENCES "codeword_clue"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "codeword_clue" ADD CONSTRAINT "FK_6dd29bd226c4d8a8ea3701c6b7d" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "text" ADD CONSTRAINT "FK_2ea24a6a41875b92fc637400deb" FOREIGN KEY ("content_id") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "content" ADD CONSTRAINT "FK_1d3815b0b8dde0d6d1e2f4d0366" FOREIGN KEY ("episode_stage_id") REFERENCES "episode_stage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_stage" ADD CONSTRAINT "FK_0e5fdc218be169e3fc1f73343a0" FOREIGN KEY ("next_stage_id") REFERENCES "episode_stage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_stage" ADD CONSTRAINT "FK_ef0335d845afcfc6239e159fbc9" FOREIGN KEY ("rollback_stage_id") REFERENCES "episode_stage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_stage" ADD CONSTRAINT "FK_44055a75f52ddfcdb9be1cd0a62" FOREIGN KEY ("episode_id") REFERENCES "episode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_validator" ADD CONSTRAINT "FK_c8644b75f6e0ed30330fab10640" FOREIGN KEY ("episode_id") REFERENCES "episode"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.commitTransaction();
    await queryRunner.startTransaction();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "answer_validator" DROP CONSTRAINT "FK_c8644b75f6e0ed30330fab10640"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_stage" DROP CONSTRAINT "FK_44055a75f52ddfcdb9be1cd0a62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_stage" DROP CONSTRAINT "FK_ef0335d845afcfc6239e159fbc9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_stage" DROP CONSTRAINT "FK_0e5fdc218be169e3fc1f73343a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content" DROP CONSTRAINT "FK_1d3815b0b8dde0d6d1e2f4d0366"`,
    );
    await queryRunner.query(
      `ALTER TABLE "text" DROP CONSTRAINT "FK_2ea24a6a41875b92fc637400deb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "codeword_clue" DROP CONSTRAINT "FK_6dd29bd226c4d8a8ea3701c6b7d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_state" DROP CONSTRAINT "FK_3e1e4fc8b77073dffcf117925f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_state" DROP CONSTRAINT "FK_3462fd6317f558e170b51d70908"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_state" DROP CONSTRAINT "FK_284c19fa3a92c0b250b81e90062"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episode_state" DROP CONSTRAINT "FK_b4a2551bf2ed8332e160f361299"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student" DROP CONSTRAINT "FK_6c47f81ec42cc2eee56c823b6b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teacher" DROP CONSTRAINT "FK_f462afc954887cf39bdf9a1efbe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "screen_writer" DROP CONSTRAINT "FK_5b8d7f83a9f19adca98badd8a69"`,
    );
    await queryRunner.query(`DROP TABLE "answer_validator"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_557a06f87aff3cfac01dba1770"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5b8186cd5641b3bf6ee49479ce"`,
    );
    await queryRunner.query(`DROP TABLE "episode"`);
    await queryRunner.query(`DROP TABLE "episode_stage"`);
    await queryRunner.query(`DROP TYPE "public"."episode_stage_trait_enum"`);
    await queryRunner.query(`DROP TABLE "content"`);
    await queryRunner.query(`DROP TYPE "public"."content_type_enum"`);
    await queryRunner.query(`DROP TABLE "text"`);
    await queryRunner.query(`DROP TABLE "codeword_clue"`);
    await queryRunner.query(`DROP TYPE "public"."lang_enum"`);
    await queryRunner.query(`DROP TABLE "episode_state"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_79db6a0da2c5a96474d28d8a89"`,
    );
    await queryRunner.query(`DROP TABLE "student"`);
    await queryRunner.query(`DROP TABLE "user_profile"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "teacher"`);
    await queryRunner.query(`DROP TABLE "screen_writer"`);
    await queryRunner.query(`DROP TABLE "base_entity"`);
    await queryRunner.commitTransaction();
    await queryRunner.startTransaction();
  }
}
