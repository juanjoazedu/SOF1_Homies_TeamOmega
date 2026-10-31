import { useState } from 'react';

import type { IsoDate } from '../../shared/utils/formatDate';
import { MIN_PASSWORD_LENGTH } from '../services/authService';
import type { RegisterData } from '../types/auth.types';

interface RegisterFormProps {
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

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (field: FormField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ ...form, dateOfBirth: form.dateOfBirth as IsoDate });
      }}
    >
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

      <button type="submit">Create account</button>
    </form>
  );
};