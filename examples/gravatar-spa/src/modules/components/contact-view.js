export default () => ({ profile }) => {

    const $profile = document.createElement('div');

    const $name = document.createElement('div');
    $name.innerHTML = profile.name.formatted;

    const $image = document.createElement('img');
    $image.src = profile.thumbnailUrl;

    $profile.append($name);
    $profile.append($image);

    return $profile;

};
