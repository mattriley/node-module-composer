export default () => ({ onSubmit }) => {

    const handleSubmit = () => {
        const email = $email.value;
        onSubmit({ email });
    };

    const $contactForm = document.createElement('div');

    const $email = document.createElement('input');
    $email.placeholder = 'Email address';
    $email.type = 'text';
    $contactForm.append($email);

    const $submit = document.createElement('button');
    $submit.innerHTML = 'Submit';
    $submit.addEventListener('click', handleSubmit);
    $contactForm.append($submit);

    return $contactForm;

};
