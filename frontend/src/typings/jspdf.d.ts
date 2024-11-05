declare module 'jspdf' {
    export default class jsPDF {
        constructor();
        addImage(imageData: string, format: string, x: number, y: number, width: number, height: number): void;
        save(fileName: string): void;
        internal: {
            pageSize: {
                height: number;
            };
        };
    }
}
