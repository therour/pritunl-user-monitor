import { Table } from "./components/Table";
import Moment from 'react-moment';
import moment from "moment";
import React, { useEffect, useState, memo } from "react";
import ReactTooltip from "react-tooltip";
import { Select } from "./components/Select";
import useApiOrganizations from "./hooks/useApiOrganizations";
import useApiDevices from "./hooks/useApiDevices";

const columns = [
  {
    Header: 'Device Name',
    accessor: 'name',
  },
  {
    Header: 'Ip Address',
    accessor: 'ip_address',
  },
  {
    Header: 'Real IP Address',
    accessor: 'real_address',
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ value }) => value ? <span className="text-green-500">Online</span> : <span className="text-red-500">Offline</span>
  },
  {
    Header: 'Uptime',
    accessor: 'connected_since',
    Cell: ({ value }) => value != null ? <span data-tip={moment.unix(value).format('DD MMM YYYY - HH:mm')}><Moment unix fromNow ago>{value}</Moment></span> : '-',
  },
]

function App() {
  const { data: organizations, loading: apiOrgLoading, error: apiOrgError } = useApiOrganizations();
  const [selectedOrganization, setSelectedOrganization] = useState();

  useEffect(() => {
    if (!selectedOrganization && organizations.length > 0) {
      const defaultOrganization = organizations.find((org) => org.is_default) || organizations[0];
      setSelectedOrganization({
        value: defaultOrganization.id,
        label: `${defaultOrganization.name} (${defaultOrganization.count})`
      });
    }
  }, [selectedOrganization, organizations])

  const { data: devices, loading: apiDevLoading, apiDevError } = useApiDevices(selectedOrganization?.value, { refreshInterval: 15000 });
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [devices])

  if (apiOrgError || apiDevError) {
    return <div className="w-screen h-screen flex items-center justify-center">
      <h1>Woops, Something Wrong</h1>
    </div>
  }

  if (apiOrgLoading && !selectedOrganization) {
    return <div className="w-screen h-screen flex flex-col items-center justify-center">
      <Loading color="text-green-700" />
      <span className="text-xl mt-3">Loading...</span>
    </div>
  }

  const organizationOptions = organizations.map((org) => ({
    value: org.id, label: `${org.name} (${org.count})`
  }));

  return (
    <div className="flex flex-col p-4 min-w-full min-h-screen">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <div className="pt-2 pb-4">
              <Select
                options={organizationOptions}
                onChange={setSelectedOrganization}
                value={selectedOrganization}
              />
            </div>
            {apiDevLoading ?
              <div className="p-32 flex flex-col items-center justify-center">
                <Loading color="text-blue-700" />
                <span className="text-xl mt-3">Retrieving Data...</span>
              </div>
              : <Table data={devices} columns={columns} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const Loading = memo(({ color }) => (
  <svg className={`animate-spin -ml-1 mr-3 h-16 w-16 ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
))

export default App;
