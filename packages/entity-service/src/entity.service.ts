import { DatabaseException, EntityNotFound, Literal } from "@formulaic/fp";
import { FindOneOptions, FindOptionsWhere, FindOptionsWhereProperty, ObjectLiteral } from "typeorm";
import { BaseEntityService } from "./base.entity.service";

export type CommonEntity = ObjectLiteral & {
  id: string | number;
};

export class EntityService<
  T extends CommonEntity,
  EntityName extends string = string,
> extends BaseEntityService<T, EntityName> {

  public async findById(id: T["id"], required: true): Promise<T>;
  public async findById(id: T["id"]): Promise<Literal<T> | EntityNotFound<T, T, EntityName, FindOneOptions<T>> | DatabaseException<T, "findOne">>;
  public async findById(
    idValue: T["id"],
    required?: true,
  ): Promise<T | Literal<T> | EntityNotFound<T, T, EntityName, FindOneOptions<T>> | DatabaseException<T, "findOne">> {
    const id = idValue as FindOptionsWhereProperty<NonNullable<T["id"]>>;
    const where = { id } as FindOptionsWhere<T>;
    return this.findOne({ where }, required);
  }

}
