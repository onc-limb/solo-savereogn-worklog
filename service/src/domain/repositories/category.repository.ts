import { CategoryEntity } from "../entities/category.entity";

export interface ICategoryRepository {
  findById(id: string): Promise<CategoryEntity | null>;
  findAll(): Promise<CategoryEntity[]>;
  save(category: CategoryEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
