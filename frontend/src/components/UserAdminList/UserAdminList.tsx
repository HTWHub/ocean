import React from "react";

import { UserProperties } from "../../types/user";

export interface UserAdminListProps {
  users: ReadonlyArray<UserProperties>;
}

export const UserAdminList: React.FC<UserAdminListProps> = ({ users }) => {
  // Descending
  const sortedUsers = users.slice(0).sort((left, right) => right.id - left.id);

  const render = (): React.ReactElement => {
    return (
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                {renderTableHead()}
                {renderTableBody()}
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTableHead = (): React.ReactElement => {
    return (
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            User ID
          </th>
          <th
            scope="col"
            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Firstname
          </th>
          <th
            scope="col"
            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Lastname
          </th>
          <th
            scope="col"
            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Username
          </th>
          <th
            scope="col"
            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Employee
          </th>
        </tr>
      </thead>
    );
  };

  const renderTableBody = (): React.ReactElement => {
    return (
      <tbody className="divide-y divide-gray-200 bg-white">
        {sortedUsers.map((user) => (
          <tr key={user.id}>
            <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
              {user.id}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
              {user.firstName}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
              {user.lastName}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
              {user.username}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
              <span
                className={
                  "bg-green-100 text-green-800 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                }
              >
                {user.employeeType}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return render();
};
