import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { DatabaseIcon } from "@heroicons/react/outline";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { DatabaseProperties, HostProperties } from "../../types/models";
import { User, UserProperties } from "../../types/user";
import { UpstreamCreateRoleProperties } from "../../types/role";
import { Invitation, UpstreamCreateInvitationProperties } from "../../types/invitation";
import { DatabasesNavigation } from "../../constants/menu.";
import { tabs } from "../../constants/tabs";
import { deleteModalContent } from "../../constants/modals";
import { RoleClient } from "../../api/roleClient";
import { InvitationClient } from "../../api/invitationClient";
import { UserClient } from "../../api/userClient";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  deleteDatabaseStart,
  getDatabaseStart,
} from "../../redux/slices/data/databaseSlice";
import AppLayout from "../../layouts/AppLayout";
import TabList from "../../components/TabList";
import ActionDropdown from "../../components/ActionDropdown";
import DeleteModal from "../../components/DeleteModal";
import OverviewCard from "../../components/OverviewCard";
import { getDatabaseEngineTitle } from "../../components/DatabaseList/DatabaseList";
import Alert from "../../components/Alert";
import RoleList from "../../components/RoleList/RoleList";
import Headline from "../../components/Headline";
import UserSelector from "../../components/UserSelector/UserSelector";
import CreateRoleModal from "../../components/modals/CreateRoleModal";
import InvitationList from "../../components/InvitationList/InvitationList";

const {
  REACT_APP_POSTGRESQL_HOSTNAME,
  REACT_APP_POSTGRESQL_PORT,
  REACT_APP_MONGODB_HOSTNAME,
  REACT_APP_MONGODB_PORT,
  REACT_APP_ADMINER_URL,
} = process.env;


interface DatabaseDetailViewProps { }

const DatabaseDetailView: React.FC<DatabaseDetailViewProps> = () => {
  let { id } = useParams<{ id: string }>();
  const history = useHistory();
  // Redux
  const dispatch = useAppDispatch();
  const { loading, error, databases } = useAppSelector(
    (state) => state.data.database
  );
  const { user } = useAppSelector((state) => state.data.user);
  // Tab Selection
  const [selectedId, setSelectedId] = useState<number>(1);
  // Delete Modal
  const [openDeleteDatabaseModal, setDeleteDatabaseOpenModal] = useState<boolean>(false);
  // Create Role Modal
  const [openCreateRoleModal, setOpenCreateRoleModal] = useState<boolean>(false);
  // Delete database process
  const [deleteDatabaseProcess, setDeleteDatabaseProcess] = useState<boolean>(false);
  // Current database id
  const databaseId = Number.parseInt(id);
  // Current database
  const database = databases.find(
    (database) => database.id === databaseId
  );
  // Queries
  const queryClient = useQueryClient()
  const { data: users } = useQuery("users", () => UserClient.getUsers())
  const { data: roles } = useQuery("roles", () => RoleClient.getRolesForDatabase(Number.parseInt(id)))
  const { data: invitations } = useQuery(["invitations"], () => InvitationClient.getInvitationsForDatabase(Number.parseInt(id)));
  // Mutations
  const createRoleMutation = useMutation((role: UpstreamCreateRoleProperties) => RoleClient.createRoleForDatabase(role), {
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"])
      setOpenCreateRoleModal(false);
    }
  })
  const deleteRoleMutation = useMutation((id: number) => RoleClient.deleteRoleForDatabase(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"])
    }
  })
  const createInvitationMutation = useMutation((invitation: UpstreamCreateInvitationProperties) => InvitationClient.createInvitationForDatabase(invitation), {
    onSuccess: () => {
      queryClient.invalidateQueries(["invitations"])
    },
  })
  const deleteInvitationMutation = useMutation((id: number) => InvitationClient.deleteInvitationForDatabase(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(["invitations"])
    },
  })
  // Other users except our user
  const otherUsers = (users || []).filter(_ => _.id !== user?.id)

  useEffect(() => {
    dispatch(getDatabaseStart(databaseId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    // HINT: Database deleted
    if (!loading && deleteDatabaseProcess) {
      setDeleteDatabaseProcess(false);
      setDeleteDatabaseOpenModal(false);
      const deleted = !databases.some(
        (database) => database.id === Number.parseInt(id)
      );
      if (error === undefined && deleted) {
        history.push("/databases");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const onDeleteDatabase = () => {
    setDeleteDatabaseProcess(true);
    dispatch(deleteDatabaseStart(Number.parseInt(id)));
  };

  const onCreateOrDeleteInvitation = (value: UserProperties) => {
    if (invitations) {
      const invitation = invitations.find(invitation => invitation.userId === value.id);
      if (invitation) {
        deleteInvitationMutation.mutate(invitation.id);
      } else {
        createInvitationMutation.mutate({ instanceId: Number.parseInt(id), userId: value.id });
      }
    }

  }

  const renderTabContent = (): React.ReactNode => {
    const database = databases.find(
      (database) => database.id === Number.parseInt(id)
    );
    if (selectedId === 1) {
      return (
        <OverviewCard
          database={database}
          host={database ? getHostFor(database) : undefined}
          user={user}
          pgAdminUrl={REACT_APP_ADMINER_URL}
        />
      );
    } else if (selectedId === 2) {
      return (
        <div className="mt-6">
          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap pb-8">
            <div>
              <Headline title="Users" size="medium" />
              <p className="mt-1 text-sm text-gray-500">
                Only for this database
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={createRoleMutation.isLoading}
                onClick={() => setOpenCreateRoleModal(true)}
              >
                Add new user
              </button>
            </div>
          </div>
          <RoleList roles={roles || []} onDelete={(role) => deleteRoleMutation.mutate(role.id)} />
        </div>
      );
    } else if (selectedId === 3) {
      return <div className="z-50">
        <UserSelector users={otherUsers} selectedUserIds={Invitation.getUserIds(invitations)} onSelect={onCreateOrDeleteInvitation} />
        <div className="my-5">
          <Headline title="Invitations" size="medium" />
          <p className="mt-1 text-sm text-gray-500">
            Invite other people
          </p>
        </div>
        <InvitationList users={User.getInvitedUsers(otherUsers, invitations || [])} onDelete={(user) => onCreateOrDeleteInvitation({ ...user, employeeType: "", mail: "" })} />
      </div>
    }
  };

  const getHostFor = (
    database: DatabaseProperties
  ): HostProperties | undefined => {
    if (database.engine === "P") {
      return {
        hostname: REACT_APP_POSTGRESQL_HOSTNAME || "",
        port: Number.parseInt(REACT_APP_POSTGRESQL_PORT || "5432"),
      };
    } else if (database.engine === "M") {
      return {
        hostname: REACT_APP_MONGODB_HOSTNAME || "",
        port: Number.parseInt(REACT_APP_MONGODB_PORT || "27017"),
      };
    }
  };

  return (
    <AppLayout selectedNavigation={DatabasesNavigation.name}>
      <div className="flex space-x-3 mb-4">
        <div className="flex-shrink-0">
          <DatabaseIcon className="h-10 w-10 rounded-full text-cyan-600" />
        </div>
        <div className="min-w-0 flex-1">
          {database ? (
            <div className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {database.name}
            </div>
          ) : (
            <div className="animate-pulse mt-1 h-6 w-36 bg-gray-200" />
          )}
          {database ? (
            <div className="text-sm text-gray-500">
              {getDatabaseEngineTitle(database.engine)}
            </div>
          ) : (
            <div className="animate-pulse mt-1 h-4 w-24 bg-gray-200" />
          )}
        </div>
        <div className="flex-shrink-0 self-center flex">
          <ActionDropdown onDelete={() => setDeleteDatabaseOpenModal(true)} />
        </div>
      </div>
      <Alert errorMessage={error} />
      <TabList
        tabs={tabs}
        selectedId={selectedId}
        onSelect={(value) => setSelectedId(value)}
      />
      <div className="mt-4">{renderTabContent()}</div>
      {/* Modals*/}
      <DeleteModal
        open={openDeleteDatabaseModal}
        modalContent={deleteModalContent}
        onSubmit={onDeleteDatabase}
        onClose={() => setDeleteDatabaseOpenModal(false)}
      />
      <CreateRoleModal
        database={database}
        open={openCreateRoleModal}
        onSubmit={(value) => createRoleMutation.mutate(value)}
        onClose={() => setOpenCreateRoleModal(false)}
      />
    </AppLayout>
  );
};

export default DatabaseDetailView;
