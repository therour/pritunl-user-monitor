import { useMemo } from "react";
import useSWR from "swr";

/**
 *
 * @param {String} organizationId
 * @param {import('swr').SWRConfiguration} options
 */
function useApiDevices(organizationId, options) {
  const { data: response, error } = useSWR(() => organizationId ? `/api/devices/${organizationId}` : null, options);
  const data = useMemo(() => {
    return response?.data ?? []
  }, [response])
  const loading = !response && !error;
  const empty = data.length === 0;

  return { data, loading, empty, error }
}

export default useApiDevices;
