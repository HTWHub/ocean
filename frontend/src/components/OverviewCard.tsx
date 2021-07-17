/* This example requires Tailwind CSS v2.0+ */
import React from 'react'

import { DatabaseProperties, HostProperties, UserProperties } from '../types/models';
import { getDatabaseEngineTitle } from './DatabaseList/DatabaseList';

export interface OverviewCardProps {
  database?: DatabaseProperties;
  host?: HostProperties;
  user?: UserProperties;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ database, host, user }) => {

  const getConnectionString = (): string | undefined => {
    if (database && host && host && user) {
      if (database.engine === 'P') {
        return `psql -U ${user.username} -h ${host.hostname} -p ${host.port.toString()} -d ${database.name}`
      } else if (database.engine === 'M') {
        return `mongodb://${host.hostname}:${host.port.toString()}/${database.name} --username ${user.username}`
      } else {
        return ''
      }
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Database</dt>
            {database ?
              <dd className="mt-1 text-sm text-gray-900">{database.name}</dd> :
              <dd className="animate-pulse mt-1 h-6 w-48 bg-gray-200" />}

          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Host</dt>
            {host ?
              <dd className="mt-1 text-sm text-gray-900">{host.hostname}</dd> :
              <dd className="animate-pulse mt-1 h-6 w-48 bg-gray-200" />}
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Port</dt>
            {host ?
              <dd className="mt-1 text-sm text-gray-900">{host.port.toString()}</dd> :
              <dd className="animate-pulse mt-1 h-6 w-24 bg-gray-200" />}
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Engine</dt>
            {database ?
              <dd className="mt-1 text-sm text-gray-900">{getDatabaseEngineTitle(database.engine)}</dd> :
              <dd className="animate-pulse mt-1 h-6 w-32 bg-gray-200" />}
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Connection String</dt>
            {database && host && user ?
              <dd className="mt-2 text-sm text-gray-900">
                {/*TODO: clipboard*/}
                <span className="px-2 py-1 rounded bg-gray-200">{getConnectionString()}</span>
              </dd> :
              <dd className="animate-pulse mt-1 h-6 w-64 bg-gray-200" />
            }
          </div>
        </dl>
      </div>
    </div>
  )
}

export default OverviewCard;