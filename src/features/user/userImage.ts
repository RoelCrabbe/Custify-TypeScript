import { EntityBase } from '@base/entityBase';
import { ValidationError } from '@error-log/exceptions';
import { PrismaUserImage } from '@prisma';
import { User } from '@user';

export class UserImage extends EntityBase {
    public readonly url: string;
    public readonly altText: string;
    public readonly fileName: string;
    public readonly mimeType: string;
    public readonly fileSize: number;

    constructor(userImage: {
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
        super(userImage);

        this.url = userImage.url;
        this.altText = userImage.altText;
        this.fileName = userImage.fileName;
        this.mimeType = userImage.mimeType;
        this.fileSize = userImage.fileSize;
        this.validate(userImage);
    }

    private validate(userImage: {
        url: string;
        altText: string;
        fileName: string;
        mimeType: string;
        fileSize: number;
    }): void {
        if (!userImage.url?.trim()) {
            throw new ValidationError('UserImage validation: Url is required');
        }
        if (!userImage.altText?.trim()) {
            throw new ValidationError('UserImage validation: Alt Text is required');
        }
        if (!userImage.fileName?.trim()) {
            throw new ValidationError('UserImage validation: File Name is required');
        }
        if (!userImage.mimeType?.trim()) {
            throw new ValidationError('UserImage validation: Mime Type is required');
        }
        if (!userImage.fileSize || userImage.fileSize <= 0) {
            throw new ValidationError('UserImage validation: File Size must be greater than zero');
        }

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (userImage.fileSize > MAX_FILE_SIZE) {
            throw new ValidationError(
                `UserImage validation: File Size must not exceed ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
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

    equals(userImage: UserImage): boolean {
        return (
            this.url === userImage.getUrl() &&
            this.altText === userImage.getAltText() &&
            this.fileName === userImage.getFileName() &&
            this.mimeType === userImage.getMimeType() &&
            this.fileSize === userImage.getFileSize()
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
    }: PrismaUserImage): UserImage {
        return new UserImage({
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
        currentUser,
        userImageData,
    }: {
        currentUser: User | null;
        userImageData: {
            url: string;
            altText: string;
            fileName: string;
            mimeType: string;
            fileSize: number;
        };
    }): UserImage {
        return new UserImage({
            ...userImageData,
            createdById: currentUser?.getId() ?? undefined,
        });
    }

    static update({
        currentUser,
        existingUserImage,
        userImageData,
    }: {
        currentUser: User;
        existingUserImage: UserImage;
        userImageData: {
            url: string;
            altText: string;
            fileName: string;
            mimeType: string;
            fileSize: number;
        };
    }): UserImage {
        return new UserImage({
            id: existingUserImage.getId(),
            url: userImageData.url ?? existingUserImage.getUrl(),
            altText: userImageData.altText ?? existingUserImage.getAltText(),
            fileName: userImageData.fileName ?? existingUserImage.getFileName(),
            mimeType: userImageData.mimeType ?? existingUserImage.getMimeType(),
            fileSize: userImageData.fileSize ?? existingUserImage.getFileSize(),
            createdById: existingUserImage.getCreatedById(),
            createdDate: existingUserImage.getCreatedDate(),
            modifiedById: currentUser.getId()!,
        });
    }
}
