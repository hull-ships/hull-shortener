import { extract, parse, stringify } from "query-string";

const redirect = ({ organization, long_url, query = {}, referrer = "" }) => {
  const dest_qs = stringify({ ...parse(extract(long_url)), ...query });
  const url = dest_qs ? `${long_url.split("?").shift()}?${dest_qs}` : long_url;
  const qs = {
    ...query
  };
  if (referrer) qs.referrer = referrer;
  return `${url}?${stringify(qs)}`;
};

export default redirect;
