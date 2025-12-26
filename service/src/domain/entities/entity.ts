import { Id } from "../value-objects/id.vo";

export abstract class Entity {
    protected constructor(protected readonly id: Id) {}

    static create(): Entity {
        return new (this as any)(Id.create());
    }

    static reconstruct(idValue: string): Entity {
        return new (this as any)(Id.create(idValue));
    }

    getId(): string {
        return this.id.getValue();
    }
}