type DirectLoginErrorBody = {
  success: false;
  message: string;
  error?: string;
};

export function mapDirectLoginError(error: unknown): {
  status: number;
  body: DirectLoginErrorBody;
} {
  const err = error as { error?: string; message?: string };

  if (err?.error === "invalid_grant" || err?.error === "unauthorized_client") {
    return { status: 401, body: { success: false, message: "Invalid credentials" } };
  }

  return {
    status: 500,
    body: {
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV !== "production" ? err?.message : undefined,
    },
  };
}
