export function normalizeRole(role?: string): string {
  return String(role ?? '').toLowerCase();
}

export function isAdmin(role?: string): boolean {
  return normalizeRole(role) === 'admin';
}

export function isStaff(role?: string): boolean {
  return normalizeRole(role) === 'staff';
}

export function isStaffOrAdmin(role?: string): boolean {
  const r = normalizeRole(role);
  return r === 'admin' || r === 'staff';
}

/** Sau login/register/social — Staff và Admin đều vào /admin */
export function getPostLoginPath(role?: string): string {
  return isStaffOrAdmin(role) ? '/admin' : '/';
}
