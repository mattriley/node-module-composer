export default ({ services }) => () => {

    const $container = document.createElement('div');

    const $controls = document.createElement('div');

    const $profile = document.createElement('div');

    $container.append($controls);
    $container.append($profile);


    const $email = document.createElement('input');
    $email.value = 'mattrileyaus@gmail.com';
    $email.type = 'text';
    $controls.append($email);

    const submitButton = document.createElement('button');
    submitButton.innerHTML = 'Submit';
    submitButton.addEventListener('click', async () => {
        const profile = await services.fetchGravatarProfile($email.value);

        const $name = document.createElement('div');
        $name.innerHTML = profile.name.formatted;

        const $image = document.createElement('img');
        $image.src = profile.thumbnailUrl;

        $profile.append($name);
        $profile.append($image);
    });

    $controls.append(submitButton);

    return $container;

};
