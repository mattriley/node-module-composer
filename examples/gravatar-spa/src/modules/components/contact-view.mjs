export default () => ({ contact }) => {

    const $contactView = document.createElement('div');

    const $name = document.createElement('div');
    $name.innerHTML = contact.name;

    const $image = document.createElement('img');
    $image.src = contact.thumbnailUrl;

    $contactView.append($name);
    $contactView.append($image);

    return $contactView;

};
