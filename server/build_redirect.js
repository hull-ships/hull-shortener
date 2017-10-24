import { extract, parse, stringify } from "query-string";

const redirect = ({ organization, long_url, query = {}, referrer = "" }) => {
  const dest_qs = stringify({ ...parse(extract(long_url)), ...query });
  const long = (long_url.match(/^http(s)?:\/\//)) ? long_url : `https://${long_url}`;
  const url = (dest_qs) ? `${long.split("?").shift()}?${dest_qs}` : long;
  const qs = {
    ...query,
    url
  };
  if (referrer) qs.referrer = referrer;
  return `https://${organization}/r?${stringify(qs)}`;
};

export default redirect;
