class Fractal {
    constructor(canvas, size = { width: 100, height: 100 }) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.width = size.width;
        this.canvas.height = size.height;

        // Границы расчета и ограничение числа итераций
        this.limits = {
            x: {
                min: -0.9,
                max: 0.9,
            },
            y: {
                min: -0.8,
                max: 0.8,
            },
            iterations: 25,
        };
    }

    // Вспомогательная функция для приведения значения num из 
    // интервала [in_min, in_max]
    // к интервалу [out_min, out_max]
    map(num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    // Вспомогательная функция для вычисления на основе координат
    // индексов из imageData для манипулированимя цветом
    getColorIndicesForCoord(x, y) {
        const red = (y * (this.canvas.width * 4)) + (x * 4);
        return {
            red,
            green: red + 1,
            blue: red + 2,
            alpha: red + 3,
        };
    }

    // Вспомогательная функция
    // Возведение комплексного числа в третью степень
    in3(a, b) {
        return {
            real: a**3 - 3*a*b**2,
            imag: 3*a**2*b - b**3,
        }
    }

    // Вспомогательная функция
    // Возведение комплексного числа в четвертую степень
    in4(a, b) {
        return {
            real: a**4 + b**4 - 5*a**2*b**2,
            imag: 4*a**3*b - 4*a*b**3,
        }
    }

    // Вспомогательная функция
    // Деление одного комплексного числа на другое
    divide(comp1, comp2) {
        var a = comp1.real;
        var b = comp1.imag;
        var a2 = comp2.real;
        var b2 = comp2.imag;
        var aNew = (a*a2 + b*b2)/(a2*a2+b2*b2);
        var bNew = (b*a2 - a*b2)/(a2*a2+b2*b2);
        return { real: aNew, imag: bNew };
      }
    
    draw() {
        // Получение данных о пикселях на canvas
        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Проходим по всем точкам canvas-а
        for (let x = 0; x < this.canvas.width; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                // Приводим координаты к границам рассчета
                let a = this.map(x, 0, this.canvas.width, this.limits.x.min, this.limits.x.max);
                let b = this.map(y, 0, this.canvas.height, this.limits.y.min, this.limits.y.max);
                let n = 0;

                // Начинаем итерацию
                for (; n < this.limits.iterations; n++) {
                    // Вычисляем четвертую и третью степень комплексного числа
                    const in4 = this.in4(a, b);
                    const in3 = this.in3(a, b);
                    
                    // Вычисляем значение нынешнего шага по итерационной формуле
                    const z = this.divide({
                        real: 3*in4.real+1,
                        imag: 3*in4.imag,
                    }, {
                        real: 4*in3.real,
                        imag: 4*in3.imag,
                    });

                    // Обновляем комплексное число для следующей итерации
                    a = z.real;
                    b = z.imag;

                    // Проверка условия прекращения цикла
                    if (Math.abs(in4.real + in4.imag - 1)**2 <= 0.0000000001) break;
                }

                // Определение яркости пикселя на основе числа пройденных итераций
                let brightness = this.map(n, 0, this.limits.iterations, 0, 1);
                brightness = this.map(brightness, 0, 1, 0, 255);

                let colorIndices = this.getColorIndicesForCoord(x, y);

                // Установка цвета пикселя
                imgData.data[colorIndices.red] = brightness;
                imgData.data[colorIndices.blue] = brightness;
                imgData.data[colorIndices.green] = brightness;
                imgData.data[colorIndices.alpha] = 255;
            }
        }

        // Установка модифицированных данных о пикселях в canvasß
        this.ctx.putImageData(imgData, 0, 0);
    }

    // Вспомогательная функция
    // Очищает canvas и заполняет его черным цветом
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0,0,0,1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Создание и конфигурация объекта фрактала
const newton = new Fractal(document.querySelector('canvas'), { width: 1000, height: 1000 });

// Предварительная очистка canvas и рисование
newton.clear();
newton.draw();