# v1 upgrade guide

For every 1.x update:

1. Read `CHANGELOG.md` and compare the tracked public declaration reports.
2. Keep React/React DOM within `>=18.3 <20` and Recharts within `>=3 <4`.
3. Install with the application lockfile, then run typecheck, unit tests, SSR or
   framework production build, and the narrowest supported dashboard viewport.
4. Verify loading, empty, error/retry, keyboard tooltip, and reduced-motion
   behavior for customized charts.
5. Do not rely on deprecated aliases for new code. They remain compatible in
   1.x but are scheduled for v2 removal.

Minor releases may add optional props, exports, messages, presets, and stories.
Patch releases may correct rendering, accessibility, formatting, compatibility,
or types without changing documented input semantics. Business requests,
Shopify data fetching, metric calculation, and storage remain application-owned.
