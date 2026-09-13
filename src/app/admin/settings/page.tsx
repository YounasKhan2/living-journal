import { AdminSettingsScreen } from '../../../screens/Admin/AdminSettingsScreen'
import { requireCapability } from '../../../server/auth/guards'

export default async function Page() {
  await requireCapability('settings:manage')
  return <AdminSettingsScreen/>
}
