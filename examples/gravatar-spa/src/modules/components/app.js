export default ({ components, services }) => () => {

    const onSubmit = async ({ email }) => {
        const profile = await services.fetchGravatarProfile(email);
        const $profile = components.contactView({ profile });
        $app.append($profile);
    };

    const $app = document.createElement('div');
    const $contactForm = components.contactForm({ onSubmit });
    $app.append($contactForm);

    return $app;

};
