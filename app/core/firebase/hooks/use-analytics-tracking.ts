import { useTrackSignedInUser } from './use-track-signed-in-user';

/**
 * @name useAnalyticsTracking
 * @description Hook to start tracking using other Analytics hooks
 */
export function useAnalyticsTracking() {
  useTrackSignedInUser();
}
