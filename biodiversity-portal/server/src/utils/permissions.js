export const ROLE_PERMISSIONS = {
  USER: ["species.read", "news.read", "sighting.create"],
  CONTRIBUTOR: ["species.read", "news.read", "sighting.create", "submission.create"],
  MODERATOR: ["species.read", "news.read", "sighting.create", "submission.create", "submission.review", "submission.approve", "submission.reject"],
  ADMIN: ["species.read", "news.read", "sighting.create", "submission.create", "submission.review", "submission.approve", "submission.reject", "users.read", "users.update", "users.suspend", "species.create", "species.update", "species.delete", "species.publish", "news.create", "news.update", "news.delete", "news.publish", "news.approve", "organizations.manage", "importantDays.manage", "habitats.manage", "protectedAreas.manage", "auditLogs.read"],
  SUPER_ADMIN: ["*"],
};

export function normalizeRole(role) {
  const value = String(role || "USER").toUpperCase();
  if (value === "ADMINISTRATOR") return "ADMIN";
  return ROLE_PERMISSIONS[value] ? value : "USER";
}

export function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[normalizeRole(role)] || [];
  return permissions.includes("*") || permissions.includes(permission);
}

export function roleAtLeast(role, requiredRole) {
  const order = ["USER", "CONTRIBUTOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"];
  return order.indexOf(normalizeRole(role)) >= order.indexOf(requiredRole);
}
