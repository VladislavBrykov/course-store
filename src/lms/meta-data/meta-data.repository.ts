import { EntityRepository, Repository } from 'typeorm';
import { FileMetaData } from '@cms/lms/meta-data/meta-data.entity';

@EntityRepository(FileMetaData)
export class FileMetaDataRepository extends Repository<FileMetaData> {
  async findByExternalId(externalId: string): Promise<FileMetaData> {
    return await this.findOne({
      where: {
        externalId,
      },
    });
  }
}
