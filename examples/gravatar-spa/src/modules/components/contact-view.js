export default () => ({ profile }) => {

    const $contactView = document.createElement('div');

    const $name = document.createElement('div');
    $name.innerHTML = profile.name.formatted;

    const $image = document.createElement('img');
    $image.src = profile.thumbnailUrl;

    $contactView.append($name);
    $contactView.append($image);

    return $contactView;

};
