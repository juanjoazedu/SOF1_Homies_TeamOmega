import { useEffect, useRef, useState } from 'react';

import avatarIcon from '../../assets/avatar.svg';
import type { IsoDate } from '../../shared/utils/formatDate';
import { getFileError } from '../../shared/utils/mediaFiles';
import { Modal } from '../../ui/components/Modal';
import { MAX_BIO_LENGTH, MAX_FULL_NAME_LENGTH } from '../services/userService';
import type { ProfileUpdate, User } from '../types/user.types';

interface EditProfileModalProps {
  user: User;
  onSubmit: (changes: ProfileUpdate) => Promise<void>;
  onClose: () => void;
}

export const EditProfileModal = ({ user, onSubmit, onClose }: EditProfileModalProps) => {
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user.fullName);
  const [bio, setBio] = useState(user.bio ?? '');
  const [dateOfBirth, setDateOfBirth] = useState<string>(user.dateOfBirth ?? '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const savedPhoto = isPhotoRemoved ? '' : (user.photoURL ?? '');
  const currentPhoto = photoPreview || savedPhoto;

  const hasChanges = fullName.trim() !== user.fullName
    || bio.trim() !== (user.bio ?? '')
    || dateOfBirth !== (user.dateOfBirth ?? '')
    || photo !== null
    || (isPhotoRemoved && Boolean(user.photoURL));
  const isDisabled = !fullName.trim() || !hasChanges || isSubmitting;

  const handleSelectPhoto = (file: File | null) => {
    if (!file) return;

    const photoError = getFileError(file, false);
    if (photoError) {
      setErrorMessage(photoError);
      return;
    }

    setErrorMessage('');
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setIsPhotoRemoved(false);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview('');
    setIsPhotoRemoved(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await onSubmit({
        fullName,
        bio,
        dateOfBirth: dateOfBirth as IsoDate | '',
        removePhoto: isPhotoRemoved && !photo,
        ...(photo ? { newPhoto: photo } : {}),
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not update the profile.');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Edit profile" size="large" isBusy={isSubmitting} onClose={onClose}>
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isDisabled) handleSubmit();
        }}
      >
        <div className="auth-form__photo">
          {currentPhoto ? (
            <img src={currentPhoto} alt="Profile preview" referrerPolicy="no-referrer" />
          ) : (
            <img className="avatar-placeholder" src={avatarIcon} alt="" />
          )}

          <div className="auth-form__photo-info">
            <span className="auth-form__photo-label">Profile photo</span>

            <div className="auth-form__photo-actions">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                aria-label="Profile photo"
                hidden
                onChange={(event) => {
                  const input = event.currentTarget;
                  handleSelectPhoto(input.files?.[0] ?? null);
                  input.value = '';
                }}
              />

              <button
                type="button"
                className="auth-form__select-photo"
                onClick={() => photoInputRef.current?.click()}
                disabled={isSubmitting}
              >
                {currentPhoto ? 'Change photo' : 'Select photo'}
              </button>

              {currentPhoto && (
                <button
                  type="button"
                  className="auth-form__remove-photo"
                  aria-label="Remove photo"
                  onClick={handleRemovePhoto}
                  disabled={isSubmitting}
                >
                  <span className="tweet-icon tweet-icon--trash" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        <label htmlFor="profile-full-name">
          Full name
          <input
            id="profile-full-name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            maxLength={MAX_FULL_NAME_LENGTH}
            required
          />
        </label>

        <label htmlFor="profile-bio">
          Bio (optional)
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            maxLength={MAX_BIO_LENGTH}
            rows={3}
          />
          <span className="tweet-form__counter profile-form__counter">
            {bio.length}/{MAX_BIO_LENGTH}
          </span>
        </label>

        <label htmlFor="profile-date-of-birth">
          Date of birth (optional)
          <input
            id="profile-date-of-birth"
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />
        </label>

        <div className="profile-form__footer">
          <button
            type="button"
            className="profile-form__cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" disabled={isDisabled}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>

      {errorMessage && <p className="modal__error" role="alert">{errorMessage}</p>}
    </Modal>
  );
};