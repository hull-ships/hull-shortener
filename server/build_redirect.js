import { extract, parse, stringify } from "query-string";

const redirect = ({ organization, long_url, query = {}, referrer = "" }) => {
  const dest_qs = stringify({ ...parse(extract(long_url)), ...query });
  const url = (dest_qs) ? `${long_url.split("?").shift()}?${dest_qs}` : long_url;
  const qs = {
    ...query,
    url
  };
  if (referrer) qs.referrer = referrer;
  return `https://${organization}/r?${stringify(qs)}`;
};

export default redirect;
