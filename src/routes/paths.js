export const auth = {
  login: "/login",
  forgetPassword: "/forget-password/:id",
  resetPassword: "/resetPassword",
};

export const homepage = {
  index: "/",
};

export const employees = {
  index: "/employee",
};
export const clients = {
  index: "/clients",
  client: "/clients/:id",
};

export const notFound = {
  index: "/not-found",
};

export const township = {
  index: "/township",
};

export const properties = {
  index: "/properties",
  property: "/properties/:id",
  comparison: "/properties/:id/comparison",
};

export const settings = {
  permissions: "/settings/permissions",
  permission: "/settings/permissions/:id",
  appealStatus: "/settings/appeal-status",
  blogs: "/settings/blogs",
  workers: "/settings/workers",
  contactUs: "/settings/contact-us",
  reports: "/settings/reports",
  faqs: "/settings/faqs",
};

export const dataScript = {
  index: "/data-script",
  importDataScript: "/data-script/import-data-script",
  actions: "/data-script/actions",
};

export const appeals = {
  index: "/residential_appeals",
  commercialAppeals: "/commercial_appeals",
  appeal: "/appeals/:id",
};

export const invoices = {
  index: "/invoices",
};

export const profile = {
  index: "/profile",
};
