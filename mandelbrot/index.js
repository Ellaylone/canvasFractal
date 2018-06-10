class Fractal {
    constructor(canvas, size = { width: 100, height: 100 }) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.width = size.width;
        this.canvas.height = size.height;

        this.limits = {
            x: {
                min: -2.2,
                max: 1,
            },
            y: {
                min: -1.2,
                max: 1.2,
            },
            iterations: 300,
        };
    }

    map(num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    getColorIndicesForCoord(x, y) {
        const red = (y * (this.canvas.width * 4)) + (x * 4);
        return {
            red,
            green: red + 1,
            blue: red + 2,
            alpha: red + 3,
        };
    }
    
    draw() {
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                let a = this.map(x, 0, this.canvas.width, this.limits.x.min, this.limits.x.max);
                let b = this.map(y, 0, this.canvas.height, this.limits.y.min, this.limits.y.max);
                let ca = a;
                let cb = b;
                let z = 0;
                let n = 0;

                for (; n < this.limits.iterations; n++) {
                    const aa = a**2 - b**2;
                    const bb = 2 * a * b;

                    a = aa + ca;
                    b = bb + cb;

                    if (Math.abs(a + b) > 1000) break;
                }

                let brightness = this.map(n, 0, this.limits.iterations, 0, 1);
                brightness = this.map(Math.sqrt(brightness), 0, 1, 0, 255);

                let colorIndices = this.getColorIndicesForCoord(x, y);

                imgData.data[colorIndices.red] = brightness;
                imgData.data[colorIndices.blue] = brightness;
                imgData.data[colorIndices.green] = brightness;
                imgData.data[colorIndices.alpha] = 255;
            }
        }

        this.ctx.putImageData(imgData, 0, 0);
    }

    print(outNode) {
        outNode.src = this.canvas.toDataURL('image/png', 1.0);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const mandelbrot = new Fractal(document.querySelector('canvas'), { width: 1000, height: 1000 });

mandelbrot.clear();
mandelbrot.draw();
/* mandelbrot.print(document.querySelector('.outImage'));
document.querySelector('.outImage').classList.remove('hidden'); */