declare module 'html2canvas' {
    interface Html2CanvasOptions {
        // Add any options you might use here
    }
    function html2canvas(element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
    export default html2canvas;
}
