import { ValidationError } from '@errorLog/exceptions';
import { ProfileImageInput } from '@types';
import { User } from '@user/user';
import { ProfileImage, profileImageRepository } from 'features/profileImage/index';

export const createOrUpdateProfileImage = async ({
    actionUser,
    profileImageInput,
    user,
}: {
    actionUser: User;
    profileImageInput: ProfileImageInput;
    user: User;
}): Promise<ProfileImage> => {
    const userId = user.getId();
    if (!userId) throw new ValidationError('User id is required');

    const fProfileImage = user.getProfileImage();

    const profileImage = fProfileImage
        ? ProfileImage.update({
              updateUser: actionUser,
              updateData: profileImageInput,
              updateEntity: fProfileImage,
          })
        : ProfileImage.create({
              createUser: actionUser,
              createData: profileImageInput,
          });

    return await profileImageRepository.upsertProfileImage({ userId, profileImage });
};
