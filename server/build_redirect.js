import { extract, parse, stringify } from "query-string";

const _ = require("lodash");

const redirect = ({
  ship,
  organization,
  long_url,
  query = {},
  referrer = ""
}) => {
  const [namespace, domain, tld] = organization.split(".");
  if (!_.isEmpty(referrer) && _.isEmpty(query.referrer)) {
    query.referrer = referrer;
  }

  const dest_qs = stringify({ ...parse(extract(long_url)), ...query });
  const url = dest_qs ? `${long_url.split("?").shift()}?${dest_qs}` : long_url;

  const websiteQs = {
    url,
    "hull-app-id": ship
  };

  // eslint-disable-next-line prettier/prettier
  return `https://${namespace}.web.${domain}.${tld}/api/v1/r?${stringify(websiteQs)}`;
};

export default redirect;
