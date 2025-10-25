import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL_BACKEND,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem("token");
    headers.set("Authorization", `${accessToken}`);
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api-locations",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Search"],
  keepUnusedDataFor: 30,

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/admin/login",
        method: "POST",
        body,
      }),
    }),
    getUser: builder.query({
      query: () => "admin/get_me",
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/admin/admin_forget_password",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/admin/verification_admin_forget_password",
        method: "PATCH",
        body,
      }),
    }),
    getEmployees: builder.mutation({
      query: (query) => ({
        url: `/admin/get_all_admin?${query}`,
        method: "GET",
      }),
    }),
    getEmployeeStatus: builder.query({
      query: () => "/admin/admin_stats",
    }),
    addEmployee: builder.mutation({
      query: (body) => ({
        url: "/admin/add_admin",
        method: "POST",
        body,
      }),
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/admin/delete_admin/${id}`,
        method: "DELETE",
      }),
    }),
    editEmployee: builder.mutation({
      query: ({ body, id }) => {
        console.log("body", body);
        return {
          url: `/admin/update_admin/${id}`,
          method: "PATCH",
          body,
        };
      },
    }),
    updateMyAccount: builder.mutation({
      query: (body) => ({
        url: `/admin/update_my_account`,
        method: "PATCH",
        body,
      }),
    }),
    changeMyPassword: builder.mutation({
      query: (body) => ({
        url: `/admin/change_my_Password`,
        method: "PATCH",
        body,
      }),
    }),

    /* Permissions */
    getPermissions: builder.query({
      query: () => "/groupPermission/get_all_group_permission",
    }),

    /* Clients */
    getClients: builder.mutation({
      query: (query) => ({
        url: `/client/get_all_client?${query}`,
        method: "GET",
      }),
    }),
    addClient: builder.mutation({
      query: (body) => ({
        url: "/client/add_client",
        method: "POST",
        body,
      }),
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/client/delete_client/${id}`,
        method: "DELETE",
      }),
    }),
    editClient: builder.mutation({
      query: ({ body, id }) => {
        console.log("body", body);
        return {
          url: `/client/update_client/${id}`,
          method: "PATCH",
          body,
        };
      },
    }),
    getOneClient: builder.query({
      query: (id) => `/client/get_one_client/${id}`,
    }),

    /* Township */
    geTownship: builder.mutation({
      query: (query) => ({
        url: `/township/get_all_township?${query}`,
        method: "GET",
      }),
    }),
    editTownship: builder.mutation({
      query: ({ body, id }) => ({
        url: `/township/update_township/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    editCurrentTownship: builder.mutation({
      query: ({ body, id }) => ({
        url: `/township/update_current_township/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    getTownshipName: builder.mutation({
      query: (pin) => `/property/get_property_township/${pin}`,
    }),
    migrateTownship: builder.mutation({
      query: (id) => ({
        url: `/township/migrate_township/${id}`,
        method: "PATCH",
      }),
    }),

    /* Properties */
    searchProperties: builder.mutation({
      query: (query) => ({
        url: `/property_address/search_property_address?${query}`,
        method: "GET",
      }),
    }),
    getOneProperty: builder.mutation({
      query: (query) => ({
        url: `/property/get_one_property/${query}`,
        method: "GET",
      }),
    }),
    getOneProperty2: builder.query({
      query: (query) => ({
        url: `/property/get_one_property/${query}`,
        method: "GET",
      }),
    }),
    editPropertyImage: builder.mutation({
      query: ({ body, pin }) => ({
        url: `/property/update_property_image/${pin}`,
        method: "PATCH",
        body,
      }),
    }),
    deletePropertySale: builder.mutation({
      query: (id) => ({
        url: `/property_sale/delete_property_sale/${id}`,
        method: "DELETE",
      }),
    }),
    addPropertySale: builder.mutation({
      query: (body) => ({
        url: "/property_sale/add_property_sale",
        method: "POST",
        body,
      }),
    }),
    editPropertySale: builder.mutation({
      query: ({ body, id }) => ({
        url: `/property_sale/update_property_sale/${id}`,
        method: "PATCH",
        body,
      }),
    }),

    /* Comparison */
    getPropertiesComparison: builder.mutation({
      query: ({ id, query }) => ({
        url: `/property_address/get_properties_within_radius/${id}?${query}`,
        method: "GET",
      }),
    }),
    getListOfProperties: builder.mutation({
      query: (body) => ({
        url: `/property/get_list_of_properties`,
        method: "POST",
        body,
      }),
    }),

    /* permission */
    getPermissionsMut: builder.mutation({
      query: (q) => ({
        url: `/groupPermission/get_all_group_permission?search=${q}`,
        method: "GET",
      }),
    }),
    getOnePermission: builder.mutation({
      query: (id) => `/groupPermission/get_one_group_permission/${id}`,
    }),
    updatedPermissions: builder.mutation({
      query: ({ body, id }) => {
        return {
          url: `/groupPermission/update_groupPermission/${id}`,
          method: "PATCH",
          body: {
            name: body.name,
            permissions: body.permissions,
          },
        };
      },
    }),
    addPermission: builder.mutation({
      query: (body) => ({
        url: "/groupPermission/add_groupPermission",
        method: "POST",
        body,
      }),
    }),
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/groupPermission/delete_group_permission/${id}`,
        method: "DELETE",
      }),
    }),
    getConstants: builder.query({
      query: () => "/constants",
    }),

    /* Data Script */
    uploadProperties: builder.mutation({
      query: (body) => ({
        url: "/property/import_property_data",
        method: "POST",
        body,
      }),
    }),
    getAllFilesUploaded: builder.mutation({
      query: ({ page }) => ({
        url: `/get_all_file_uploads?page=${page}`,
        method: "GET",
      }),
    }),
    uploadSalesData: builder.mutation({
      query: (body) => ({
        url: "/property/import_property_sale_data",
        method: "POST",
        body,
      }),
    }),
    uploadTaxRateData: builder.mutation({
      query: (body) => ({
        url: "/tax_rate/import_tax_rate_data",
        method: "POST",
        body,
      }),
    }),
    removeDuplicateProperties: builder.mutation({
      query: () => ({
        url: "/property/find_duplicate_properties",
      }),
    }),

    /* Appeals */
    getAppeals: builder.mutation({
      query: (query) => ({
        url: `/appeal/get_all_appeal?${query}`,
        method: "GET",
      }),
    }),
    addAppeal: builder.mutation({
      query: (body) => ({
        url: "/appeal/admin_add_appeal",
        method: "POST",
        body,
      }),
    }),
    updateAppeal: builder.mutation({
      query: ({ body, id }) => ({
        url: `/appeal/admin_update_appeal/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    getReportData: builder.mutation({
      query: (body) => ({
        url: "/property/export_report_data",
        method: "POST",
        body,
      }),
    }),
    deleteAppeal: builder.mutation({
      query: (id) => ({
        url: `/appeal/delete_appeal/${id}`,
        method: "DELETE",
      }),
    }),

    /* Status */
    getAllStatus: builder.query({
      query: (q) => ({
        url: `/appeal_status/get_all_appeal_status?${q}`,
      }),
    }),
    addStatus: builder.mutation({
      query: (body) => ({
        url: "/appeal_status/add_appeal_status",
        method: "POST",
        body,
      }),
    }),
    updateStatus: builder.mutation({
      query: ({ body, id }) => ({
        url: `/appeal_status/update_appeal_status/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    deleteStatus: builder.mutation({
      query: (id) => ({
        url: `/appeal_status/delete_appeal_status/${id}`,
        method: "DELETE",
      }),
    }),
    exportAppealData: builder.mutation({
      query: (body) => ({
        url: "/appeal/export_data",
        method: "POST",
        body,
      }),
    }),

    /*  */

    getAddressGoogle: builder.mutation({
      query: (body) => ({
        url: "/property/search_google_address",
        method: "POST",
        body,
      }),
    }),

    /* Invoices */
    getAllInvoices: builder.mutation({
      query: (q) => ({
        url: `/invoice/get_all_invoice?${q}`,
      }),
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoice/delete_invoice/${id}`,
        method: "DELETE",
      }),
    }),
    addInvoice: builder.mutation({
      query: (body) => ({
        url: "/invoice/add_invoice",
        method: "POST",
        body,
      }),
    }),
    editInvoice: builder.mutation({
      query: ({ body, id }) => ({
        url: `/invoice/update_invoice/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    getInvoiceFromAppeal: builder.mutation({
      query: (id) => ({
        url: `/invoice/get_invoice_from_appeal/${id}`,
        method: "GET",
      }),
    }),

    /* Blogs */
    getAllBlogs: builder.query({
      query: (q) => ({
        url: `/blog/get_all_blogs?${q}`,
        method: "GET",
      }),
    }),
    getBlogsInfo: builder.query({
      query: () => ({
        url: "/blog/blogs_info",
        method: "GET",
      }),
    }),
    addBlog: builder.mutation({
      query: (body) => ({
        url: "/blog/add_blog",
        method: "POST",
        body,
      }),
    }),
    editBlog: builder.mutation({
      query: ({ body, id }) => ({
        url: `/blog/update_blog/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/delete_blog/${id}`,
        method: "DELETE",
      }),
    }),
    getOneBlog: builder.query({
      query: (id) => `/blog/get_one_blog/${id}`,
    }),

    /* Workers */
    getWorkers: builder.mutation({
      query: (q) => `/worker/get_all_worker?sort=-id&sort=sort&${q}`,
    }),
    addWorker: builder.mutation({
      query: (body) => ({
        url: "/worker/add_worker",
        method: "POST",
        body,
      }),
    }),
    updateWorker: builder.mutation({
      query: ({ body, id }) => ({
        url: `/worker/update_worker/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    deleteWorker: builder.mutation({
      query: (id) => ({
        url: `/worker/delete_worker/${id}`,
        method: "DELETE",
      }),
    }),

    /* Contact Us */
    getAllContactUs: builder.mutation({
      query: (q) => `/contact_us/get_all_contact_us?sort=-id&${q}`,
    }),
    addReplay: builder.mutation({
      query: (body) => ({
        url: "/contact_us_reply/add_contact_us_reply",
        method: "POST",
        body,
      }),
    }),
    getAllReplays: builder.query({
      query: (id) =>
        `/contact_us_reply/get_all_contact_us_replyies?sort=-id&${id}`,
    }),
    getContactUsInfo: builder.query({
      query: () => ({
        url: "/contact_us/get_contact_us_info",
        method: "GET",
      }),
    }),

    sendFormSignature: builder.mutation({
      query: (body) => ({
        url: "/signature/apply_signature",
        method: "POST",
        body,
      }),
    }),
    getAppealDocumentsStatus: builder.mutation({
      query: (id) => ({
        url: `/appeal/get_appeal_details/${id}`,
        method: "GET",
      }),
    }),
    openToSendDocument: builder.mutation({
      query: (id) => ({
        url: `/appeal/open_to_send_docs/${id}`,
        method: "PATCH",
      }),
    }),
    getInvoiveNumber: builder.mutation({
      query: () => ({
        url: "/invoice/get_invoice_number",
        method: "GET",
      }),
    }),
    getReports: builder.query({
      query: () => ({
        url: "/report/get_all_report",
        method: "GET",
      }),
    }),
    deleteReport: builder.mutation({
      query: (id) => ({
        url: `/report/delete_report/${id}`,
        method: "DELETE",
      }),
    }),
    updateReport: builder.mutation({
      query: ({ body, id }) => ({
        url: `/report/update_report_status/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    getAppeal: builder.query({
      query: (id) => `/appeal/get_one_appeal/${id}`,
    }),
    getAllFAQs: builder.query({
      query: (q) => ({
        url: `/faq/get_all_faq?sort=-id&${q}`,
      }),
    }),
    addFAQ: builder.mutation({
      query: (body) => ({
        url: "/faq/add_faq",
        method: "POST",
        body,
      }),
    }),
    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `/faq/delete_faq/${id}`,
        method: "DELETE",
      }),
    }), ///faq/delete_faq/3
    updateFAQ: builder.mutation({
      query: ({ body, id }) => ({
        url: `/faq/update_faq/${id}`,
        body,
        method: "PATCH",
      }),
    }),
    getOneFAQ: builder.query({
      query: (id) => `/faq/get_one_faq/${id}`,
    }),
    importAppealHistory: builder.mutation({
      query: (body) => ({
        url: "/appeal/import_appeal_history",
        method: "POST",
        body,
      }),
    }),
    getPropertyListHistory: builder.mutation({
      query: (pin) => ({
        url: `property/list_history?pin=${pin}`,
        method: "GET",
        keepUnusedDataFor: 86400,
      }),
    }),
    sendCertificateErrorOfAppeal: builder.mutation({
      query: (appealId) => ({
        url: `/appeal/send_certificate_of_error/${appealId}`,
        method: "GET",
      }),
    }),
    openToSendCertificateError: builder.mutation({
      query: (id) => ({
        url: `/appeal/open_to_send_certificate_of_error_docs/${id}`,
        method: "PATCH",
      }),
    }),
    getDocuSignatureUrl: builder.mutation({
      query: (envelopeId) => ({
        url: `/signature/docusign_doc_status_fn/${envelopeId}`,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetEmployeesMutation,
  useGetEmployeeStatusQuery,
  useGetUserQuery,
  useEditEmployeeMutation,
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetClientsMutation,
  useAddClientMutation,
  useDeleteClientMutation,
  useEditClientMutation,
  useForgetPasswordMutation,
  useVerifyOtpMutation,
  useGetPermissionsQuery,
  useGeTownshipMutation,
  useEditTownshipMutation,
  useSearchPropertiesMutation,
  useGetOnePropertyMutation,
  useGetOneProperty2Query,
  useGetPropertiesComparisonMutation,
  useGetListOfPropertiesMutation,
  useGetOnePermissionMutation,
  useGetPermissionsMutMutation,
  useGetConstantsQuery,
  useUpdatedPermissionsMutation,
  useAddPermissionMutation,
  useDeletePermissionMutation,
  useUploadPropertiesMutation,
  useGetAllFilesUploadedMutation,
  useUploadSalesDataMutation,
  useUploadTaxRateDataMutation,
  useGetAppealsMutation,
  useAddAppealMutation,
  useGetTownshipNameMutation,
  useGetAllStatusQuery,
  useUpdateAppealMutation,
  useAddStatusMutation,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
  useExportAppealDataMutation,
  useGetOneClientQuery,
  useGetReportDataMutation,
  useEditPropertyImageMutation,
  useDeleteAppealMutation,
  useGetAddressGoogleMutation,
  useDeletePropertySaleMutation,
  useAddPropertySaleMutation,
  useEditPropertySaleMutation,
  useRemoveDuplicatePropertiesMutation,
  useGetAllInvoicesMutation,
  useDeleteInvoiceMutation,
  useAddInvoiceMutation,
  useEditInvoiceMutation,
  useGetInvoiceFromAppealMutation,
  useGetAllBlogsQuery,
  useGetBlogsInfoQuery,
  useAddBlogMutation,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useGetWorkersMutation,
  useAddWorkerMutation,
  useUpdateWorkerMutation,
  useDeleteWorkerMutation,
  useGetAllContactUsMutation,
  useAddReplayMutation,
  useGetAllReplaysQuery,
  useGetContactUsInfoQuery,
  useSendFormSignatureMutation,
  useGetAppealDocumentsStatusMutation,
  useOpenToSendDocumentMutation,
  useGetInvoiveNumberMutation,
  useGetReportsQuery,
  useDeleteReportMutation,
  useUpdateReportMutation,
  useEditCurrentTownshipMutation,
  useMigrateTownshipMutation,
  useGetAppealQuery,
  useGetAllFAQsQuery,
  useAddFAQMutation,
  useDeleteFAQMutation,
  useUpdateFAQMutation,
  useImportAppealHistoryMutation,
  useUpdateMyAccountMutation,
  useChangeMyPasswordMutation,
  useGetOneBlogQuery,
  useGetOneFAQQuery,
  useGetPropertyListHistoryMutation,
  useSendCertificateErrorOfAppealMutation,
  useOpenToSendCertificateErrorMutation,
  useGetDocuSignatureUrlMutation,
} = apiSlice;
