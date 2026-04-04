"use client";
import { useLogin } from "@/hooks/auth/useLogin";
import { ReusableForm } from "../Reusable-Components";
import { Typography } from "../Reusable-Components/typography";

function LoginForm() {
  const { form, isLoading, onSubmit, inputs, links, t } = useLogin();

  return (
    <div className="auth-card p-8">
      <div className="text-center mb-6">
        <Typography variant="h2">
          {t("title")}
        </Typography>
        <Typography  className="text-muted-foreground">
          {t("description")}
        </Typography>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <ReusableForm
        form={form}
        inputs={inputs}
        submitHandler={onSubmit}
        submitButtonText={t("submit")}
        isLoading={isLoading}
        errors={form.formState.errors}
        links={links}
      />
    </div>
  );
}

export default LoginForm;
