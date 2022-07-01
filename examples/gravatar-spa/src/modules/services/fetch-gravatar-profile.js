import md5 from 'blueimp-md5';

export default ({ io, config }) => async email => {

    const emailHash = md5(email.trim().toLowerCase());
    const url = `${config.gravatar.hostname}/${emailHash}.json`;
    const response = await io.fetch(url);
    if (response.status === 404) return {};
    if (!response.ok) throw new Error(`Unexpected Gravatar response status ${response.status}.`);
    const data = await response.json();
    const [profile] = data.entry;
    return profile;

};
