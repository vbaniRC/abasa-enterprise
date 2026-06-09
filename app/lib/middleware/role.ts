export function role(requiredRole: string) {
  return function (user: any) {
    if (!user || !user.role) {
      return {
        ok: false,
        status: 403,
        message: "Forbidden: No role assigned",
      };
    }

    if (user.role !== requiredRole) {
      return {
        ok: false,
        status: 403,
        message: `Forbidden: Requires role ${requiredRole}`,
      };
    }

    return {
      ok: true,
      status: 200,
    };
  };
}
