import { useKeycloakRoles } from "../shared/useKeycloakRoles";
import { filterRealmRoles } from "../shared/keycloakRoleTypes";

export default function AllRoles() {
  const { availableRoles, loadingRoles, filteredRealmRoles } = useKeycloakRoles();

  const externalRoles = filteredRealmRoles.filter((role) =>
    role.name.includes("EXT")
  );
  const internalRoles = filteredRealmRoles.filter(
    (role) => !role.name.includes("EXT")
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">All Roles</h1>
      </div>

      {loadingRoles ? (
        <div className="p-6 text-sm text-gray-500">Loading roles...</div>
      ) : (
        <div className="p-6 space-y-8">
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Internal Roles ({internalRoles.length})
            </h2>
            <ul className="space-y-2">
              {internalRoles.map((role) => (
                <li
                  key={role.id}
                  className="px-4 py-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-800"
                >
                  {role.name}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              External Roles ({externalRoles.length})
            </h2>
            <ul className="space-y-2">
              {externalRoles.map((role) => (
                <li
                  key={role.id}
                  className="px-4 py-2 bg-gray-50 rounded border border-gray-200 text-sm text-gray-800"
                >
                  {role.name}
                </li>
              ))}
            </ul>
          </section>

          {filteredRealmRoles.length === 0 && (
            <p className="text-sm text-gray-500">
              No assignable roles found ({availableRoles.realmRoles.length}{" "}
              total, {filterRealmRoles(availableRoles.realmRoles).length}{" "}
              filtered).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
