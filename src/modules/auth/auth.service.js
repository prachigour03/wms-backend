export const buildPermissions = (user) => {
  return user.Role?.Permissions?.map(
    (p) => `${p.module}:${p.action}`
  ) || [];
};
