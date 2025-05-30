export abstract class EntityBase {
    protected id?: number;
    protected createdDate?: Date;
    protected modifiedDate?: Date;
    protected createdById?: number;
    protected modifiedById?: number;

    constructor(base?: {
        id?: number;
        createdDate?: Date;
        modifiedDate?: Date;
        createdById?: number;
        modifiedById?: number;
    }) {
        this.id = base?.id;
        this.createdDate = base?.createdDate;
        this.modifiedDate = base?.modifiedDate;
        this.createdById = base?.createdById;
        this.modifiedById = base?.modifiedById;
    }

    getId(): number | undefined {
        return this.id;
    }

    getCreatedDate(): Date | undefined {
        return this.createdDate;
    }

    getModifiedDate(): Date | undefined {
        return this.modifiedDate;
    }

    getCreatedById(): number | undefined {
        return this.createdById;
    }

    getModifiedById(): number | undefined {
        return this.modifiedById;
    }
}
