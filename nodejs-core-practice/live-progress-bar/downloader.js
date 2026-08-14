const { EventEmitter } = require("node:events");

class Download extends EventEmitter {
    constructor() {
        super();
        this.step = 0;
    }

    start() {
        const interval = setInterval(() => {
            this.step++;
            const percent = this.step * 10;
            this.emit('progress', percent);
            if (percent === 100) {
                clearInterval(interval);
                this.emit('done');
            }
        }, 500);    
    }
}

const download = new Download();

download.on('progress', (percent) => {
    const filledField = (percent / 100) * 20;
    const hash = '#'.repeat(filledField);
    const emptyField = 20 - filledField;
    const dash = '-'.repeat(emptyField);
    const downloadLine = hash + dash;
    process.stdout.write(`\r[${downloadLine}] ${percent}%`);
})

download.on('done', () => {
    console.log("\nDownload complete!");
});

download.start();