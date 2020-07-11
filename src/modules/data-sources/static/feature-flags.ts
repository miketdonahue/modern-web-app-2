import { getManager } from '@server/modules/db-manager';

const getFeatureFlags = async () => {
  const db = getManager();
  const featureFlags = await db.query(`SELECT name, flag FROM feature_flag`);

  return featureFlags;
};

export { getFeatureFlags };
