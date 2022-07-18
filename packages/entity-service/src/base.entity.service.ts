import { Data, DatabaseException, EntityNotFound } from "@formulaic/fp";
import {
  FindOneOptions,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from "typeorm";

/**
 * A base set of utilities designed around a TypeORM repository.
 *
 * The {@link BaseEntityService} provides completely entity-agnostic
 * utilities.
 *
 * For most entities, you should use {@link EntityService}, which adds
 * additional shortcuts, but has some required fields.
 */
export class BaseEntityService<
  T extends ObjectLiteral,
  EntityName extends string = string,
> {

  /**
   * A name to use in error messages - typically the class name of {@link T}.
   */
  protected readonly entityName: EntityName;

  /**
   * The TypeORM {@link Repository} for the entities this service is based around.
   */
  protected readonly repo: Repository<T>;

  /**
   * Create a new service based around a TypeORM {@link Repository}.
   *
   * @param entityName The name of the entity.  Traditionally the class name.
   * @param repo The TypeORM {@link Repository} to wrap.
   */
   public constructor(
    entityName: EntityName,
    repo: Repository<T>,
  ) {
    this.entityName = entityName;
    this.repo = repo;
  }

  /**
   * Get every entity in the database.
   * Returns a {@link DatabaseException} if any errors are thrown.
   */
   public async listAll(): Promise<Data<T[]> | DatabaseException<T[], "find">>;
   /**
    * Get every entity in the database, throwing a {@link DatabaseException} if any errors are thrown.
    */
   public async listAll(required: true): Promise<T[]>;
   public async listAll(required?: true): Promise<T[] | Data<T[]> | DatabaseException<T[], "find">> {
     return this.find({}, required);
   }

   public async find(options: FindManyOptions<T>, required: true): Promise<T[]>;
   public async find(options: FindManyOptions<T>): Promise<Data<T[]> | DatabaseException<T[], "find">>;
   public async find(
     options: FindManyOptions<T>,
     required?: true,
   ): Promise<T[] | Data<T[]> | DatabaseException<T[], "find">> {
     try {
       const data = await this.repo.find(options);
       if(required) {
         return data;
       }
       return new Data(data);
     } catch (e) {
       if(required) {
         throw new DatabaseException("find", e);
       }
       return new DatabaseException("find", e);
     }
   }

  public async findOne(options: FindOneOptions<T>, required: true): Promise<T>;
  public async findOne(options: FindOneOptions<T>): Promise<Data<T> | EntityNotFound<EntityName, FindOneOptions<T>> | DatabaseException<T, "findOne">>;
  public async findOne(
    options: FindOneOptions<T>,
    required?: true,
  ): Promise<T | Data<T> | EntityNotFound<EntityName, FindOneOptions<T>, T> | DatabaseException<T, "findOne">> {
    try {
      const data = await this.repo.findOne(options);
      if(data) {
        return required ? data : new Data(data);
      } else if(required) {
        throw new EntityNotFound(this.entityName, options);
      }
      return new EntityNotFound<EntityName, FindOneOptions<T>, T>(this.entityName, options);
    } catch (e) {
      if(required) {
        throw new DatabaseException("findOne", e);
      }
      return new DatabaseException("findOne", e);
    }
  }

  protected async save(unsaved: T): Promise<Data<T> | DatabaseException<T, "save">> {
    try {
      const saved = await this.repo.save(unsaved);
      return new Data(saved);
    } catch (e) {
      return new DatabaseException("save", e);
    }
  }

}
