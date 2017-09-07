const redirect = ({ organization, long_url, referrer = "" }) => `https://${organization}/r?url=${encodeURIComponent(long_url)}&referrer=${referrer}`;

export default redirect;
