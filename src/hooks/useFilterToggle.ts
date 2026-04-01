'use client';

import { startTransition, useCallback, useState } from 'react';

/**
 * Shared hook for category/tag filter toggles.
 * Used by Skills and BlogIndex to avoid duplicating filter state logic.
 */
export function useFilterToggle(allLabel = 'All') {
  const [active, setActive] = useState(allLabel);

  const toggle = useCallback(
    (label: string) => {
      startTransition(() => {
        setActive((current) => (current === label ? allLabel : label));
      });
    },
    [allLabel],
  );

  const isActive = useCallback((label: string) => active === label, [active]);

  const isAll = active === allLabel;

  return { active, toggle, isActive, isAll } as const;
}

export default useFilterToggle;
