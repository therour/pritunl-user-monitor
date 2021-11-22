import { useMemo } from "react";
import useSWR from "swr";

/**
 *
 * @param {import('swr').SWRConfiguration} options
 */
function useApiOrganizations(options) {
  const { data: response, error } = useSWR(`/api/organizations`, options);
  const data = useMemo(() => {
    return response?.data ?? []
  }, [response])

  const loading = !response && !error;
  const empty = data.length === 0;

  return { data, loading, empty, error }
}

export default useApiOrganizations;
