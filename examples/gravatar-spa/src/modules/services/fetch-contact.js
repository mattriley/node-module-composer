export default ({ services }) => async email => {

    const profile = await services.fetchGravatarProfile(email);

    const name = profile.name?.formatted ?? email;
    const thumbnailUrl = profile.thumbnailUrl ?? '';

    return { name, thumbnailUrl };

};
