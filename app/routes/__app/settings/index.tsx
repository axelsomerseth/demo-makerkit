import { redirect } from '@remix-run/node';
import configuration from '~/configuration';

export function loader() {
  return redirect(configuration.paths.settings.profile);
}
