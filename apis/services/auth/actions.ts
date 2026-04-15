'use server';

import { signIn, signOut } from 'next-auth/react';
import { loginSchema, registerSchema, forgotPasswordSchema, verifyCodeSchema, resetPasswordSchema } from '@/schemas/auth';
import { ActionError } from '@/apis/types/error';
import { messages } from '@/constants/messages';
import { actionClient } from '@/lib/safe-action';
import { authRepository } from './index';

// Sign In Action
export const signInAction = actionClient.schema(loginSchema).action(async ({ parsedInput: data }) => {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      throw new ActionError(messages.error.auth.invalidCredential);
    }

    return { success: true, message: messages.success.auth.login.title };
  } catch (error) {
    if (error instanceof ActionError) throw error;
    throw new ActionError(messages.error.auth.invalidCredential);
  }
});

// Register Action
export const registerAction = actionClient.schema(registerSchema).action(async ({ parsedInput: data }) => {
  try {
    const response = await authRepository.signUp(data);

    if (!response.status && !response.access_token) {
      throw new ActionError(response.message || 'Registration failed');
    }

    return { success: true, message: messages.success.auth.register.title, data: response };
  } catch (error) {
    if (error instanceof ActionError) throw error;
    throw new ActionError('Registration failed. Please try again.');
  }
});

// Forgot Password Action
export const forgotPasswordAction = actionClient.schema(forgotPasswordSchema).action(async ({ parsedInput: data }) => {
  try {
    const response = await authRepository.forgotPassword(data);

    if (!response.status) {
      throw new ActionError(response.message || 'Failed to send reset code');
    }

    return { success: true, message: 'Verification code sent to your email' };
  } catch (error) {
    if (error instanceof ActionError) throw error;
    throw new ActionError('Failed to send reset code. Please try again.');
  }
});

// Verify Code Action
export const verifyCodeAction = actionClient.schema(verifyCodeSchema).action(async ({ parsedInput: data }) => {
  try {
    const response = await authRepository.verifyCode(data);

    if (!response.status || !response.valid) {
      throw new ActionError(response.message || 'Invalid verification code');
    }

    return { success: true, message: 'Code verified successfully' };
  } catch (error) {
    if (error instanceof ActionError) throw error;
    throw new ActionError('Invalid verification code. Please try again.');
  }
});

// Reset Password Action
export const resetPasswordAction = actionClient.schema(resetPasswordSchema).action(async ({ parsedInput: data }) => {
  try {
    const response = await authRepository.resetPassword(data);

    if (!response.status) {
      throw new ActionError(response.message || 'Failed to reset password');
    }

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    if (error instanceof ActionError) throw error;
    throw new ActionError('Failed to reset password. Please try again.');
  }
});

// Sign Out Action
export const signOutAction = actionClient.action(async () => {
  try {
    await signOut({ redirect: false });
    return { success: true, message: messages.success.auth.logout };
  } catch {
    throw new ActionError('Failed to logout. Please try again.');
  }
});
