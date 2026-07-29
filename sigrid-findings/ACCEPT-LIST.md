# ACCEPT-LIST — Architecture hubs (post 3.98)

Accept in Sigrid UI (do **not** code-fix):

## Architecture / Independence / Coupling

- High fan-in hubs: `src/hooks/useContent.ts`, `src/hooks/useLogAction.ts`
- Remaining Independence interface modules and Module coupling hubs listed in pack `all-findings-rijkswaterstaat-otg-lis-20260728`
- Component entanglement findings

## Security / Interfacing / Size (out of scope code)

- Docker / dockerfile CWE findings
- Express / Multer handler signatures
- `react-router-dom` OSH if still RAW
- Size: dockerfile + script helpers

## Do not Accept

- Data coupling (already code-cleared; repos only)
- Findings cleared by ZustandStates / HomePage colocation waves after next scan
