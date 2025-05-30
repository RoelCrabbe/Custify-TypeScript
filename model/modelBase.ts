export abstract class ModelBase {
    protected id?: number;
    protected createdDate?: Date;
    protected updatedDate?: Date;

    constructor(base?: { id?: number; createdDate?: Date; updatedDate?: Date }) {
        this.id = base?.id;
        this.createdDate = base?.createdDate;
        this.updatedDate = base?.updatedDate;
    }

    getId(): number | undefined {
        return this.id;
    }

    getCreatedDate(): Date | undefined {
        return this.createdDate;
    }

    getUpdatedDate(): Date | undefined {
        return this.updatedDate;
    }
}
