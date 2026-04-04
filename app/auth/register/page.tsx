'use client';

import ReusableForm from '@/components/Reusable-Components/Reusable-Form';
import { Flex } from '@/components/Reusable-Components';
import ReusableSelect from '@/components/Reusable-Components/Reusable-Select';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useRegister } from '@/hooks/auth/useRegister';
import { UserRole } from '@/constants/roles';

export default function RegisterPage() {
  const { form, isLoading, onSubmit, inputs, roleOptions, links, t } = useRegister();

  return (
    <div className="min-h-screen auth-bg">
      {/* Header with switchers */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>

      <Flex classes="min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fa-solid fa-user-plus text-2xl text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">JobsPortal</h1>
          </div>

          <div className="auth-card p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('title')}</h2>
              <p className="text-muted-foreground">{t('description')}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-foreground">{t('role')}</label>
              <ReusableSelect
                defaultValue={form.watch('role')}
                selectValues={roleOptions}
                onValueChange={(value) => form.setValue('role', value as UserRole)}
              />
            </div>

            <ReusableForm
              form={form}
              inputs={inputs}
              submitHandler={onSubmit}
              submitButtonText={t('submit')}
              isLoading={isLoading}
              errors={form.formState.errors}
              links={links}
            />
          </div>
        </div>
      </Flex>
    </div>
  );
}
