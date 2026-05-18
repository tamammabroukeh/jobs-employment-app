'use server';

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from '@/auth';
import { loginSchema, registerSchema, forgotPasswordSchema, verifyCodeSchema, resetPasswordSchema } from '@/schemas/auth';
import { ActionError } from '@/apis/types/error';
import { messages } from '@/constants/messages';
import { actionClient } from '@/lib/safe-action';
import { authRepository } from './index';
import { IRegisterRequest } from './interface';

// Register Action - Returns auth data for session creation
export const registerAction = actionClient.schema(registerSchema).action(async ({ parsedInput: data }) => {
  try {
    console.log("[Register Action] Starting registration for:", data.email);
    
    const registerData: IRegisterRequest = {
      name: data.username,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      role: data.role.toLowerCase(), // Convert to lowercase to match API
    };

    const response = await authRepository.signUp(registerData);

    console.log("[Register Action] Registration response received");
    console.log("[Register Action] Has access_token?", !!response.access_token);
    console.log("[Register Action] Has user?", !!response.user);

    if (!response.access_token) {
      throw new ActionError(response.message || 'Registration failed');
    }

    // Return the full response including access token and user data
    return { 
      success: true, 
      message: response.message || messages.success.auth.register.title,
      user: response.user,
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
      // Store credentials for auto-login
      credentials: {
        email: data.email,
        password: data.password,
      }
    };
  } catch (error) {
    console.error('[Register Action] Error:', error);
    if (error instanceof ActionError) throw error;
    throw new ActionError('Registration failed. Please try again.');
  }
});

// Sign In Action
export const signInAction = actionClient.schema(loginSchema).action(async ({ parsedInput: data }) => {
  try {
    console.log("[Sign In Action] Attempting sign in for:", data.email);
    
    const result = await nextAuthSignIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    console.log("[Sign In Action] Sign in result:", result);

    if (result?.error) {
      console.error("[Sign In Action] Sign in error:", result.error);
      throw new ActionError(messages.error.auth.invalidCredential);
    }

    if (!result?.ok) {
      console.error("[Sign In Action] Sign in not ok");
      throw new ActionError(messages.error.auth.invalidCredential);
    }

    console.log("[Sign In Action] Sign in successful");
    return { success: true, message: messages.success.auth.login.title };
  } catch (error) {
    console.error('[Sign In Action] Error:', error);
    if (error instanceof ActionError) throw error;
    throw new ActionError(messages.error.auth.invalidCredential);
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
    console.error('Forgot password action error:', error);
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
    console.error('Verify code action error:', error);
    if (error instanceof ActionError) throw error;
    throw new ActionError('Invalid verification code. Please try again.');
  }
});

// Reset Password Action
export const resetPasswordAction = actionClient.schema(resetPasswordSchema).action(async ({ parsedInput: data }) => {
  try {
    const response = await authRepository.resetPassword({
      email: data.email,
      code: data.code,
      password: data.password,
    });

    if (!response.status) {
      throw new ActionError(response.message || 'Failed to reset password');
    }

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Reset password action error:', error);
    if (error instanceof ActionError) throw error;
    throw new ActionError('Failed to reset password. Please try again.');
  }
});

// Sign Out Action
export const signOutAction = actionClient.action(async () => {
  try {
    await nextAuthSignOut({ redirect: false });
    return { success: true, message: messages.success.auth.logout };
  } catch (error) {
    console.error('[Sign Out Action] Error:', error);
    throw new ActionError('Failed to logout. Please try again.');
  }
});
