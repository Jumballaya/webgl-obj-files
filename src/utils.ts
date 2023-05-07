
export async function loadImage(path: string): Promise<HTMLImageElement> {
    const image = document.createElement('img');
    return new Promise(res => {
        image.src = path;
        image.addEventListener('load', () => {
            res(image);
        });
        image.hidden = true;
        document.body.appendChild(image);
    })
}
