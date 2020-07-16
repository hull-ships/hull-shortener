import { extract, parse, stringify } from "query-string";

const redirect = ({ ship, organization, long_url, query = {}, referrer = "" }) => {
  const [namespace] = organization.split(".");
  const dest_qs = stringify({ ...parse(extract(long_url)), ...query });
  const url = dest_qs ? `${long_url.split("?").shift()}?${dest_qs}` : long_url;
  const qs = {
    ...query
  };
  if (referrer) qs.referrer = referrer;

  const websiteQs = {
    url: `${url}?${stringify(qs)}`,
    "hull-app-id": ship
  }

  return `https://${namespace}.web.hullapp.io/api/v1/r?${stringify(websiteQs)}`;
};

export default redirect;
