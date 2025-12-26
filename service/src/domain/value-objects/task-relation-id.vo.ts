import { Id } from "./id.vo";

export class TaskRelationId extends Id {
  static override create(value?: string): TaskRelationId {
    return super.create(value) as TaskRelationId;
  }
}
