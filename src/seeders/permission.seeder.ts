import { DataSource, In } from 'typeorm';
import { Permission } from '@/modules/permissions/permission.entity';
import { PERMISSIONS_MAP } from '@/modules/permissions/permissions-map';

export async function permissionSeeder(dataSource: DataSource) {
  const repo = dataSource.getRepository(Permission);

  const allPermissions: Permission[] = [];

  for (const [moduleName, actions] of Object.entries(PERMISSIONS_MAP)) {
    for (const actionName of actions) {
      const slug = `${actionName}_${moduleName}`.toLowerCase();
      const name = `${actionName} ${moduleName}`.toLowerCase();
      const description = `Allows ${actionName} action on ${moduleName}`;
      allPermissions.push(repo.create({ slug, name, description, module: moduleName, action: actionName }) );
    }
  }

  // Get all existing slugs from DB to skip duplicates efficiently
  const existing = await repo.find({
    where: { slug: In(allPermissions.map(p => p.slug)) },
    select: ['slug'],
  });

  const existingSlugs = new Set(existing.map(p => p.slug));
  const newPermissions = allPermissions.filter(p => !existingSlugs.has(p.slug));

  if (newPermissions.length > 0) {
    await repo.save(newPermissions);
    console.log(`✅ Seeded ${newPermissions.length} new permissions`);
  } else {
    console.log('⚪ No new permissions to seed');
  }
}
