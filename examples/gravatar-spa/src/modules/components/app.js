export default ({ components, services }) => () => {

    const onSubmit = async ({ email }) => {
        const profile = await services.fetchGravatarProfile(email);

        const $name = document.createElement('div');
        $name.innerHTML = profile.name.formatted;

        const $image = document.createElement('img');
        $image.src = profile.thumbnailUrl;

        $profile.append($name);
        $profile.append($image);
    };


    const $container = document.createElement('div');

    const $controls = components.contactForm({ onSubmit });

    const $profile = document.createElement('div');

    $container.append($controls);
    $container.append($profile);



    return $container;

};
