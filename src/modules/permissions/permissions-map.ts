import { OddPermission } from './permissions.type';

export const PERMISSIONS_MAP = {
  users: ['create', 'view', 'update', 'delete'],
  admins: ['create', 'view', 'update', 'delete', 'approve'],
  events: ['create', 'view', 'update', 'delete', 'approve'],
  tickets: ['create', 'view', 'update', 'delete'],
  plans: ['create', 'view', 'update', 'delete'],
  hero: ['create', 'view', 'activate'],
  images: ['upload', 'delete'],
  permissions: ['create', 'view', 'delete'],
  intent: ['create'],
  roles: ['create', 'view', 'delete'],
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
    description: 'Allow to assign admins to role',
    slug: 'assign_admins_to_role',
  },
];
