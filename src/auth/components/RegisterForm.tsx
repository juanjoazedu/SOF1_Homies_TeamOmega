import { useEffect, useRef, useState } from 'react';

import avatarIcon from '../../assets/avatar.svg';
import type { IsoDate } from '../../shared/utils/formatDate';
import { MIN_PASSWORD_LENGTH } from '../services/authService';
import type { RegisterData } from '../types/auth.types';

interface RegisterFormProps {
  isSubmitting: boolean;
  onSubmit: (data: RegisterData) => void;
}

const initialForm = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  dateOfBirth: '',
};

type FormField = keyof typeof initialForm;

export const RegisterForm = ({ isSubmitting, onSubmit }: RegisterFormProps) => {
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const handleChange = (field: FormField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handlePhotoChange = (file: File | null) => {
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : '');
  };

  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          ...form,
          dateOfBirth: form.dateOfBirth as IsoDate,
          ...(photo ? { photo } : {}),
        });
      }}
    >
      <div className="auth-form__photo">
        {photoPreview ? (
          <img src={photoPreview} alt="Profile preview" />
        ) : (
          <img className="avatar-placeholder" src={avatarIcon} alt="" />
        )}

        <div className="auth-form__photo-info">
          <span className="auth-form__photo-label">Profile photo (optional)</span>

          <div className="auth-form__photo-actions">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              aria-label="Profile photo"
              hidden
              onChange={(event) => {
                const input = event.currentTarget;
                handlePhotoChange(input.files?.[0] ?? null);
                input.value = '';
              }}
            />

            <button
              type="button"
              className="auth-form__select-photo"
              onClick={() => photoInputRef.current?.click()}
            >
              {photo ? 'Change photo' : 'Select photo'}
            </button>

            {photo && (
              <button
                type="button"
                className="auth-form__remove-photo"
                aria-label="Remove photo"
                onClick={() => handlePhotoChange(null)}
              >
                <span className="tweet-icon tweet-icon--trash" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      <label htmlFor="register-full-name">
        Full name
        <input
          id="register-full-name"
          value={form.fullName}
          onChange={(event) => handleChange('fullName', event.target.value)}
          autoComplete="name"
          maxLength={50}
          required
        />
      </label>

      <label htmlFor="register-username">
        Username
        <input
          id="register-username"
          value={form.username}
          onChange={(event) => handleChange('username', event.target.value)}
          autoComplete="username"
          maxLength={15}
          required
        />
      </label>

      <label htmlFor="register-email">
        Email
        <input
          id="register-email"
          type="email"
          value={form.email}
          onChange={(event) => handleChange('email', event.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label htmlFor="register-password">
        Password
        <input
          id="register-password"
          type="password"
          value={form.password}
          onChange={(event) => handleChange('password', event.target.value)}
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
      </label>

      <label htmlFor="register-date-of-birth">
        Date of birth
        <input
          id="register-date-of-birth"
          type="date"
          value={form.dateOfBirth}
          onChange={(event) => handleChange('dateOfBirth', event.target.value)}
          required
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
};
