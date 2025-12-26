import { Id } from "./id.vo";

export class TaskId extends Id {
  static override create(value?: string): TaskId {
    return super.create(value) as TaskId;
  }
}
