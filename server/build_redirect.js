const redirect = ({ organization, long_url }) => `https://${organization}/r?url=${encodeURIComponent(long_url)}`;

export default redirect;
