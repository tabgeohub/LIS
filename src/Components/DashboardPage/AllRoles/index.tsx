import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getBackEndUrl } from "@helpers/getBackEndUrl";

type AvailableRole = {
  id: string;
  name: string;
};

type AvailableRoles = {
  realmRoles: AvailableRole[];
  clientRoles: Record<string, AvailableRole[]>;
};

const unwantedRoles = [
  "default-roles-",
  "offline_access",
  "uma_authorization",
  "manage-account",
  "manage-account-links",
  "view-profile",
  "manage-realm",
];

function isUnwantedRole(role: string): boolean {
  return unwantedRoles.some((unwanted) => role.includes(unwanted));
}

export default function AllRoles() {
  const [availableRoles, setAvailableRoles] = useState<AvailableRoles>({
    realmRoles: [],
    clientRoles: {},
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${getBackEndUrl()}/api/keycloak/management/roles`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch roles");
        }

        setAvailableRoles(data);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load roles");
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const filteredRealmRoles = availableRoles.realmRoles.filter(
    (role) => !isUnwantedRole(role.name)
  );

  // Separate roles into Internal and External
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

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading roles...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* External Roles Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                External Roles ({externalRoles.length})
              </h2>
              {externalRoles.length === 0 ? (
                <p className="text-gray-500">No external roles found</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {externalRoles.map((role) => (
                    <div
                      key={role.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {role.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Internal Roles Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Internal Roles ({internalRoles.length})
              </h2>
              {internalRoles.length === 0 ? (
                <p className="text-gray-500">No internal roles found</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {internalRoles.map((role) => (
                    <div
                      key={role.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {role.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Client Roles (if any) */}
            {Object.keys(availableRoles.clientRoles).length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Client Roles
                </h2>
                {Object.entries(availableRoles.clientRoles).map(
                  ([clientId, roles]) => (
                    <div key={clientId} className="mb-6">
                      <h3 className="text-md font-medium text-gray-700 mb-2">
                        {clientId} ({roles.length})
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {roles.map((role) => (
                          <div
                            key={role.id}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <p className="text-sm font-medium text-gray-900">
                              {role.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

