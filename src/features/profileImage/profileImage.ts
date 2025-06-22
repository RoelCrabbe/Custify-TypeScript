import { EntityBase } from '@base/entityBase';
import { ValidationError } from '@errorLog/exceptions';
import { PrismaProfileImage } from '@prisma/index';
import { User } from '@user';

export class ProfileImage extends EntityBase {
    public readonly url: string;
    public readonly altText: string;
    public readonly fileName: string;
    public readonly mimeType: string;
    public readonly fileSize: number;

    constructor(profileImage: {
        url: string;
        altText: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
        id?: number;
        createdById?: number;
        createdDate?: Date;
        modifiedById?: number;
        modifiedDate?: Date;
    }) {
        super(profileImage);

        this.url = profileImage.url;
        this.altText = profileImage.altText;
        this.fileName = profileImage.fileName;
        this.mimeType = profileImage.mimeType;
        this.fileSize = profileImage.fileSize;

        this.validate(profileImage);
    }

    protected validate(profileImage: {
        url: string;
        altText: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
    }): void {
        if (!profileImage.url?.trim()) {
            throw new ValidationError('ProfileImage validation: Url is required');
        }
        if (!profileImage.altText?.trim()) {
            throw new ValidationError('ProfileImage validation: Alt Text is required');
        }
        if (!profileImage.fileName?.trim()) {
            throw new ValidationError('ProfileImage validation: File Name is required');
        }
        if (!profileImage.mimeType?.trim()) {
            throw new ValidationError('ProfileImage validation: Mime Type is required');
        }
        if (!profileImage.fileSize || profileImage.fileSize <= 0) {
            throw new ValidationError(
                'ProfileImage validation: File Size must be greater than zero',
            );
        }
    }

    getUrl(): string {
        return this.url;
    }

    getAltText(): string {
        return this.altText;
    }

    getFileName(): string {
        return this.fileName;
    }

    getMimeType(): string {
        return this.mimeType;
    }

    getFileSize(): number {
        return this.fileSize;
    }

    equals(profileImage: ProfileImage): boolean {
        return (
            this.url === profileImage.getUrl() &&
            this.altText === profileImage.getAltText() &&
            this.fileName === profileImage.getFileName() &&
            this.mimeType === profileImage.getMimeType() &&
            this.fileSize === profileImage.getFileSize()
        );
    }

    toJSON() {
        return {
            id: this.getId(),
            url: this.url,
            altText: this.altText,
            fileName: this.fileName,
            mimeType: this.mimeType,
            fileSize: this.fileSize,
            createdById: this.getCreatedById(),
            createdDate: this.getCreatedDate(),
            modifiedById: this.getModifiedById(),
            modifiedDate: this.getModifiedDate(),
        };
    }

    static from({
        id,
        url,
        altText,
        fileName,
        mimeType,
        fileSize,
        createdById,
        createdDate,
        modifiedById,
        modifiedDate,
    }: PrismaProfileImage): ProfileImage {
        return new ProfileImage({
            id,
            url,
            altText,
            fileName,
            mimeType,
            fileSize,
            createdById: createdById || undefined,
            createdDate: createdDate || undefined,
            modifiedById: modifiedById || undefined,
            modifiedDate: modifiedDate || undefined,
        });
    }

    static create({
        createUser,
        createData,
    }: {
        createUser: User | null;
        createData: {
            url: string;
            altText: string;
            fileName: string;
            mimeType: string;
            fileSize: number;
        };
    }): ProfileImage {
        return new ProfileImage({
            ...createData,
            createdById: createUser?.getId(),
        });
    }

    static update({
        updateUser,
        updateData,
        updateEntity,
    }: {
        updateUser: User;
        updateData: {
            url: string;
            altText: string;
            fileName: string;
            mimeType: string;
            fileSize: number;
        };
        updateEntity: ProfileImage;
    }): ProfileImage {
        return new ProfileImage({
            id: updateEntity.getId(),
            url: updateData.url ?? updateEntity.getUrl(),
            altText: updateData.altText ?? updateEntity.getAltText(),
            fileName: updateData.fileName ?? updateEntity.getFileName(),
            mimeType: updateData.mimeType ?? updateEntity.getMimeType(),
            fileSize: updateData.fileSize ?? updateEntity.getFileSize(),
            createdById: updateEntity.getCreatedById(),
            createdDate: updateEntity.getCreatedDate(),
            modifiedById: updateUser.getId(),
        });
    }
}
