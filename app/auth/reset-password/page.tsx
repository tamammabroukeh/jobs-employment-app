'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import ReusableForm from '@/components/Reusable-Components/Reusable-Form';
import { Flex } from '@/components/Reusable-Components';
import { resetPasswordAction } from '@/apis/services/auth/actions';
import { resetPasswordSchema, ResetPasswordFormData } from '@/schemas/auth';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function ResetPasswordPage() {
  const router = useRouter();
  const t = useTranslations('auth.resetPassword');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    const storedCode = sessionStorage.getItem('verifiedCode');

    if (!storedEmail || !storedCode) {
      router.push('/forgot-password');
      return;
    }

    setEmail(storedEmail);
    setCode(storedCode);
  }, [router]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (email && code) {
      form.setValue('email', email);
      form.setValue('code', code);
    }
  }, [email, code, form]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const result = await resetPasswordAction({ ...data, email, code });

      if (result?.data?.success) {
        toast.success(t('success'));
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('verifiedCode');
        router.push('/login');
      } else if (result?.serverError) {
        toast.error(result.serverError);
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputs = [
    {
      name: 'password',
      label: t('password'),
      type: 'password',
      placeholder: t('passwordPlaceholder'),
    },
    {
      name: 'confirmPassword',
      label: t('confirmPassword'),
      type: 'password',
      placeholder: t('confirmPasswordPlaceholder'),
    },
  ];

  return (
    <div className="min-h-screen auth-bg">
      {/* Header with switchers */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>

      <Flex classes="min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fa-solid fa-lock text-2xl text-white" />
            </div>
          </div>

          <div className="auth-card p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('title')}</h2>
              <p className="text-muted-foreground">{t('description')}</p>
            </div>

            <ReusableForm
              form={form}
              inputs={inputs}
              submitHandler={onSubmit}
              submitButtonText={t('submit')}
              isLoading={isLoading}
              errors={form.formState.errors}
              links={[{
                title: t('backToLogin'),
                path: '/login',
              }]}
            />
          </div>
        </div>
      </Flex>
    </div>
  );
}
