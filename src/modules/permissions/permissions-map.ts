import { OddPermission } from './permissions.type';

export const PERMISSIONS_MAP = {
  users: ['create', 'view', 'update', 'delete'],
  admins: ['create', 'view', 'update', 'delete', 'approve', 'reject'],
  events: ['create', 'view', 'update', 'delete', 'approve'],
  tickets: ['create', 'view', 'update', 'delete'],
  plans: ['create', 'view', 'update', 'delete'],
  hero: ['create', 'view', 'activate'],
  images: ['upload', 'delete'],
  permissions: ['view'],
  intent: ['create'],
  roles: ['create', 'view', 'delete', 'update'],
};

export const ODD_PERMISSIONS: OddPermission[] = [
  {
    moduleName: 'roles',
    actionName: 'assign',
    description: 'Allow to assign permissions to role',
    slug: 'assign_permissions_to_role',
  },
  {
    moduleName: 'roles',
    actionName: 'assign',
    description: 'Allow to assign roles to admin',
    slug: 'assign_roles_to_admin',
  },
];
