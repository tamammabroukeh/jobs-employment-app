'use server';

// import { cookies } from 'next/headers';
import { loginSchema, registerSchema, forgotPasswordSchema, verifyCodeSchema, resetPasswordSchema } from '@/schemas/auth';
import { ActionError } from '@/apis/types/error';
import { messages } from '@/constants/messages';
import { actionClient } from '@/lib/safe-action';
import { authRepository } from './index';
import { IRegisterRequest } from './interface';
import { deleteCookie } from '@/apis/cookie';

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

// Sign In Action - Direct implementation without NextAuth signIn
export const signInAction = actionClient.schema(loginSchema).action(async ({ parsedInput: data }) => {
  try {
    console.log("[Sign In Action] ========== STARTING SIGN IN ==========");
    console.log("[Sign In Action] Email:", data.email);
    console.log("[Sign In Action] Password length:", data.password?.length);
    
    // Call the login API directly
    const response = await authRepository.signIn(data);
    
    console.log("[Sign In Action] ========== API RESPONSE ==========");
    console.log("[Sign In Action] Has access_token?", !!response.access_token);
    console.log("[Sign In Action] Has user?", !!response.user);

    if (!response.access_token || !response.user) {
      console.error("[Sign In Action] Missing access_token or user");
      throw new ActionError(messages.error.auth.invalidCredential);
    }

    console.log("[Sign In Action] ========== LOGIN SUCCESSFUL ==========");
    console.log("[Sign In Action] User ID:", response.user.id);
    console.log("[Sign In Action] User email:", response.user.email);
    
    // Return success with user data
    return { 
      success: true, 
      message: messages.success.auth.login.title,
      user: response.user,
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
    };
  } catch (error) {
    console.error('[Sign In Action] ========== EXCEPTION ==========');
    console.error('[Sign In Action] Error:', error);
    
    // Extract more detailed error information
    if (error && typeof error === 'object' && 'info' in error) {
      console.error('[Sign In Action] Error info:', error.info);
      const errorInfo = error.info as Record<string, string>;
      
      // Check if there's a message in the error info
      if (errorInfo && typeof errorInfo === 'object' && 'message' in errorInfo) {
        console.error('[Sign In Action] API Error Message:', errorInfo.message);
        throw new ActionError(errorInfo.message || messages.error.auth.invalidCredential);
      }
    }
    
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
    console.log('[Sign Out Action] ========== STARTING LOGOUT ==========');
    
    // Step 1: Call the logout API to invalidate the token on the server
    try {
      const response = await authRepository.logout();
      console.log('[Sign Out Action] API logout successful:', response.message);
    } catch (apiError) {
      // Log the error but continue with NextAuth signOut
      // This ensures the user is logged out locally even if the API call fails
      console.error('[Sign Out Action] API logout failed:', apiError);
      console.log('[Sign Out Action] Continuing with local logout...');
    }
    
    // Step 2: Clear the NextAuth session cookies
    // const cookieStore = await cookies();
    deleteCookie("next-auth.session-token")
    deleteCookie("__Secure-next-auth.session-token")
    deleteCookie("next-auth.csrf-token")
    deleteCookie("__Secure-next-auth.csrf-token")
    deleteCookie("next-auth.callback-url")
    deleteCookie("__Secure-next-auth.callback-url")
    // Delete NextAuth session cookies
    // cookieStore.delete('next-auth.session-token');
    // cookieStore.delete('__Secure-next-auth.session-token');
    // cookieStore.delete('next-auth.csrf-token');
    // cookieStore.delete('__Secure-next-auth.csrf-token');
    // cookieStore.delete('next-auth.callback-url');
    // cookieStore.delete('__Secure-next-auth.callback-url');
    
    console.log('[Sign Out Action] ========== LOGOUT SUCCESSFUL ==========');
    return { success: true, message: messages.success.auth.logout };
  } catch (error) {
    console.error('[Sign Out Action] ========== EXCEPTION ==========');
    console.error('[Sign Out Action] Error:', error);
    throw new ActionError('Failed to logout. Please try again.');
  }
});
