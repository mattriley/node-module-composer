export default ({ components, services }) => () => {

    const onSubmit = async ({ email }) => {
        const contact = await services.fetchContact(email);
        const $profile = components.contactView({ contact });
        $app.append($profile);
    };

    const $app = document.createElement('div');
    const $contactForm = components.contactForm({ onSubmit });
    $app.append($contactForm);

    return $app;

};
