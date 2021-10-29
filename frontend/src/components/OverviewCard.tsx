import React from 'react'

import { Database, EngineType } from '../types/database';
import { UserProperties } from '../types/user';
import { getDatabaseEngineTitle } from './DatabaseList/DatabaseList';

export interface OverviewCardProps {
  database?: Database;
  user?: UserProperties;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ database, user }) => {

  const getEngineConnectionString = (): string => {
    if (database?.engine === EngineType.PostgreSQL) {
      return database.connectionString(user?.username || "")
    } else if (database?.engine === EngineType.MongoDB) {
      return database.connectionString() || ""
    } else if (database === undefined) {
      return ".."
    } else {
      const assertNever = (_: never): string => "";
      return assertNever(database?.engine);
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
            <dt className="text-sm font-medium text-gray-500">Hostname</dt>
            {database ?
              <dd className="mt-1 text-sm text-gray-900">{database.hostname}</dd> :
              <dd className="animate-pulse mt-1 h-6 w-48 bg-gray-200" />}
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Port</dt>
            {database ?
              <dd className="mt-1 text-sm text-gray-900">{database.port.toString()}</dd> :
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
            {database && user ?
              <dd className="mt-2 text-sm text-gray-900">
                <div className="flex flex-col space-y-2">
                  <div>
                    <span className="px-2 py-1 rounded bg-gray-200">{getEngineConnectionString()}</span>
                  </div>
                  <div>
                    <button
                      className="mr-2 border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400 hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => navigator.clipboard.writeText(getEngineConnectionString())}
                    >
                      Strg-C
                    </button>
                    <a
                      href={database.adminerUrl || "#"}
                      target="_blank" rel="noopener noreferrer"
                      className="border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400 hover:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Adminer
                    </a>
                  </div>
                </div>
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