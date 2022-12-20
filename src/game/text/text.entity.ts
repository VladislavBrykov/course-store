import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@cms/utilities/base.entity';
import { Content } from '@cms/game/content/content.entity';
import { Lang } from '@cms/utilities/lang.enum';

@Entity({ name: 'text' })
export class Text extends BaseEntity {
  @Column({ name: 'text', type: 'text' })
  text: string;

  @Column({
    name: 'lang',
    type: 'enum',
    enumName: 'lang_enum',
    enum: Lang,
    default: Lang.ENG,
  })
  lang: Lang;

  @ManyToOne(() => Content, (content) => content.texts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'id', name: 'content_id' })
  content: Content;
}
