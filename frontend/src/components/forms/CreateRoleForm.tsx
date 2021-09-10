import React from "react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";

import { UpstreamCreateRoleProperties } from "../../types/role";
import { DatabaseProperties } from "../../types/models";
import { RoleClient, RoleValidation } from "../../api/roleClient";


export interface CreateRoleFormProps {
    database?: DatabaseProperties;
    onSubmit: (value: UpstreamCreateRoleProperties) => void;
    onClose?: () => void;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ database, onSubmit, onClose }) => {

    const schema = yup.object().shape({
        roleName: yup
            .string()
            .required("Name is required")
            .min(4, "Name should be of minimum 4 characters length")
            .matches(/^[a-z][a-z0-9_]*$/, "Name must begin with a letter (a-z). Subsequent characters in a name can be letters, digits (0-9), or underscores.")
            .test("unique_test", "Name is already registered", (value, ctx) =>
                validateDatabaseValues(value, ctx)
            )
    });

    const validateDatabaseValues = async (
        roleName: string | undefined,
        context: yup.TestContext<Record<string, any>>
    ): Promise<boolean> => {
        if (roleName !== undefined && database !== undefined) {
            const payload: UpstreamCreateRoleProperties = {
                roleName: `${database.name}_${roleName}`,
                instanceId: database.id
            };
            const response = await RoleClient.existsRoleForDatabase(payload);
            try {
                const { exists } = RoleValidation.existsRoleForDatabaseSchema.validateSync(
                    response.data
                );
                if (!exists) {
                    return true;
                }
            } catch (parseError) {
                // TODO: user should know what happend
                return false;
            }
        }
        return false;
    };

    return (
        <>
            <Formik
                initialValues={{
                    roleName: "",
                }}
                validationSchema={schema}
                onSubmit={values => {
                    // same shape as initial values
                    console.log(values);
                    if (database) {
                        onSubmit({ roleName: `${database.name}_${values.roleName}`, instanceId: database.id })
                    }
                }}
            >
                {({ errors, touched }) => (
                    <Form className="space-y-6">
                        <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                {database ? `${database.name}_` : ":("}
                            </span>
                            <Field
                                id="roleName"
                                name="roleName"
                                type="text"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300" />
                        </div>
                        {errors.roleName && (
                            <span className="mt-2 text-sm text-red-600" id="roleNameHelp">
                                {errors.roleName}
                            </span>
                        )}
                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                            >
                                Create
                            </button>
                            <button
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>

                    </Form>
                )}
            </Formik>

        </>
    );
};

export default CreateRoleForm;
