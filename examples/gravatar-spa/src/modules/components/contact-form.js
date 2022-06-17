export default () => ({ onSubmit }) => {
    const $form = document.createElement('div');

    const $email = document.createElement('input');
    $email.type = 'text';
    $form.append($email);

    const $submit = document.createElement('button');
    $submit.innerHTML = 'Submit';
    $submit.addEventListener('click', () => {
        const email = $email.value;
        onSubmit({ email });
    });
    $form.append($submit);

    return $form;
};
