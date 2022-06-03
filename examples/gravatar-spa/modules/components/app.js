export default () => () => {

    const div = document.createElement('div');
    div.innerHTML = 'hello world';
    return div;

};
