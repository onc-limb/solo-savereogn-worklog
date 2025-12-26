import { Id } from "./id.vo";

export class WorkNoteId extends Id {
  static override create(value?: string): WorkNoteId {
    return super.create(value) as WorkNoteId;
  }
}
