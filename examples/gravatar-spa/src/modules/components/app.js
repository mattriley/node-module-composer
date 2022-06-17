export default ({ components, services }) => () => {

    const onSubmit = async ({ email }) => {

        const profile = await services.fetchGravatarProfile(email);

        const $profile = components.contactView({ profile });

        $container.append($profile);
    };


    const $container = document.createElement('div');

    const $controls = components.contactForm({ onSubmit });


    $container.append($controls);


    return $container;

};
