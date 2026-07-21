# Next focus status — Jul21 polish wave

Dashboard after Jul21 export: Maintainability **4.2** · Architecture **3.3** · Security **4.3** · Reliability **5.5**.

## Done this wave

- Reduced remaining same-component duplication by extracting shared helpers for AddToPlan selection submit, filter-step advance flow, point-coordinate update context, and delete-point map click flow.
- Finalized `showPlanSearchListHover` as a thin public facade over `showPlanSearchListHoverCore`.
- Refreshed `ACCEPT-LIST.md` for Jul21 FE-BE duplication twins and intentional facades.

## Verification

- `npm run check:architecture` — pass
- `npm run test:architecture-helpers` — pass

## Remaining strategy

- FE-BE duplication twins stay Accepted unless a shared package is introduced.
- Architecture MEDIUM `*Core` files remain a separate strategy problem; do not keep splitting files for score.
