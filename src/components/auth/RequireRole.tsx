import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isStaffOrAdmin, normalizeRole } from '../../utils/authRoles';

type RequireRoleProps = {
  roles: string[];
  /** Chưa đăng nhập */
  redirectTo?: string;
  /** Đã đăng nhập nhưng không đủ quyền */
  forbiddenTo?: string;
};

export function RequireRole({
  roles,
  redirectTo = '/login',
  forbiddenTo = '/',
}: RequireRoleProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const userRole = normalizeRole(user.role);
  const allowed = roles.some((r) => normalizeRole(r) === userRole);

  if (!allowed) {
    return <Navigate to={forbiddenTo} replace />;
  }

  return <Outlet />;
}

/** Guard nhanh cho layout admin: Admin hoặc Staff */
export function RequireStaffOrAdmin(props: Omit<RequireRoleProps, 'roles'>) {
  return <RequireRole roles={['Admin', 'Staff']} {...props} />;
}

export function RequireAdminOnly(props: Omit<RequireRoleProps, 'roles'>) {
  return <RequireRole roles={['Admin']} forbiddenTo="/admin" {...props} />;
}

export { isStaffOrAdmin };
