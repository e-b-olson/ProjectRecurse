import { getAdminClient } from "./clients.js";

const userIds = new Set<string>();
const betaRegistrationIds = new Set<string>();

export function trackUser(id: string): void {
  userIds.add(id);
}

export function trackBetaRegistration(id: string): void {
  betaRegistrationIds.add(id);
}

export async function runGlobalCleanup(): Promise<void> {
  const admin = getAdminClient();

  if (betaRegistrationIds.size > 0) {
    await admin
      .from("beta_registrations")
      .delete()
      .in("id", [...betaRegistrationIds]);
    betaRegistrationIds.clear();
  }

  for (const userId of userIds) {
    await admin.auth.admin.deleteUser(userId);
  }
  userIds.clear();
}
