import { v4 as uuid } from 'uuid';

export abstract class Id {
    protected constructor(private readonly value: string) {}
    static create(value?: string): Id {
        const idValue = value ?? uuid();
        return new (this as any)(idValue);
    }

    getValue(): string {
        return this.value;
    }
}