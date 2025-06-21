import { ValidationError } from '@errorLog/exceptions';
import { UserImageInput } from '@types';
import { UserImage } from '@user/index';
import { User } from '@user/user';
import { userImageRepository } from '@userImage/index';

export const createOrUpdateUserImage = async ({
    actionUser,
    userImageInput,
    user,
}: {
    actionUser: User;
    userImageInput: UserImageInput;
    user: User;
}): Promise<UserImage> => {
    const userId = user.getId();
    if (!userId) throw new ValidationError('User id is required');

    const existingProfileImage = user.getProfileImage();

    const userImage = existingProfileImage
        ? UserImage.update({
              updateUser: actionUser,
              updateData: userImageInput,
              updateEntity: existingProfileImage,
          })
        : UserImage.create({
              createUser: actionUser,
              createData: userImageInput,
          });

    return await userImageRepository.upsertUserImage({ userId, userImage });
};
