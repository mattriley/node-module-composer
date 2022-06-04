export default ({ services }) => () => {

    const emailInput = document.createElement('input');
    emailInput.type = 'text';

    const submitButton = document.createElement('button');
    submitButton.innerHTML = 'Submit';
    submitButton.addEventListener('click', async () => {
        const email = 'mattrileyaus@gmail.com';
        const profile = await services.fetchGravatarProfile(email);
        div.innerHTML = JSON.stringify(profile);
    });

    const div = document.createElement('div');
    div.append(submitButton);
    return div;

};
