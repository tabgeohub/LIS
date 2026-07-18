export const GETAC_DEVICES_CREATE_TABLE_SQL = `
        CREATE TABLE IF NOT EXISTS lis.getac_devices (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          device_token TEXT UNIQUE NOT NULL,
          hostname TEXT NOT NULL,
          machine_id TEXT UNIQUE NOT NULL,
          windows_version TEXT,
          os_build TEXT,
          status TEXT NOT NULL DEFAULT 'unknown',
          pending_update_count INT NOT NULL DEFAULT 0,
          pending_command TEXT,
          command_status TEXT,
          last_error TEXT,
          last_seen_at TIMESTAMPTZ,
          last_checked_at TIMESTAMPTZ,
          last_updated_at TIMESTAMPTZ,
          registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;
