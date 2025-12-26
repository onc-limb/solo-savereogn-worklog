import { Id, Name } from "../value-objects";

/**
 * CategoryEntity: タスクカテゴリーを表すエンティティ
 * ユーザーが追加・編集可能
 */
export class CategoryEntity {
  private constructor(
    private readonly id: Id,
    private name: Name,
    private icon: string,
    private color: string,
    private order: number,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  static create(params: {
    name: string;
    icon?: string;
    color?: string;
    order?: number;
  }): CategoryEntity {
    const now = new Date();
    return new CategoryEntity(
      Id.create(),
      Name.create(params.name),
      params.icon || "📁",
      params.color || "gray",
      params.order ?? 0,
      now,
      now
    );
  }

  static reconstruct(data: {
    id: string;
    name: string;
    icon: string;
    color: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  }): CategoryEntity {
    return new CategoryEntity(
      Id.create(data.id),
      Name.create(data.name),
      data.icon,
      data.color,
      data.order,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }

  getId(): string {
    return this.id.getValue();
  }

  getName(): string {
    return this.name.getValue();
  }

  getIcon(): string {
    return this.icon;
  }

  getColor(): string {
    return this.color;
  }

  getOrder(): number {
    return this.order;
  }

  updateName(name: string): void {
    this.name = Name.create(name);
    this.updatedAt = new Date();
  }

  updateIcon(icon: string): void {
    this.icon = icon;
    this.updatedAt = new Date();
  }

  updateColor(color: string): void {
    this.color = color;
    this.updatedAt = new Date();
  }

  updateOrder(order: number): void {
    this.order = order;
    this.updatedAt = new Date();
  }

  toPlainObject() {
    return {
      id: this.id.getValue(),
      name: this.name.getValue(),
      icon: this.icon,
      color: this.color,
      order: this.order,
      createdAt: this.createdAt.toISOString().split("T")[0],
      updatedAt: this.updatedAt.toISOString().split("T")[0],
    };
  }
}
