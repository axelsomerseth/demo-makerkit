import { useTransition } from '@remix-run/react';
import { createRef, useEffect, lazy, useRef, useCallback } from 'react';
import type { LoadingBarRef } from 'react-top-loading-bar';
import ClientOnly from '~/core/ui/ClientOnly';

const LoadingBar = lazy(() => import('react-top-loading-bar'));

// we wait 50ms before displaying the loading bar
// to avoid useless animations when navigation is fast
const DEFAULT_MIN_WAITING = 50;

function AppRouteLoadingIndicator() {
  const ref = createRef<LoadingBarRef>();
  const runningRef = useRef(false);
  const timeoutRef = useRef<number>();
  const transition = useTransition();

  const scheduleAnimation = useCallback(() => {
    return window.setTimeout(() => {
      runningRef.current = true;
      ref.current?.continuousStart();
    }, DEFAULT_MIN_WAITING);
  }, [ref]);

  useEffect(() => {
    const isIdle = transition.state === 'idle';
    const isRouteLoading =
      transition.type === 'normalLoad' && transition.state === 'loading';

    if (isRouteLoading) {
      timeoutRef.current = scheduleAnimation();
    }

    if (isIdle) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      if (runningRef.current) {
        ref.current?.complete();
        runningRef.current = false;
      }
    }
  }, [ref, transition.type, transition.state, scheduleAnimation]);

  return (
    <ClientOnly>
      <LoadingBar
        waitingTime={200}
        shadow={true}
        className={'bg-primary-500'}
        color={''}
        ref={ref}
      />
    </ClientOnly>
  );
}

export default AppRouteLoadingIndicator;
