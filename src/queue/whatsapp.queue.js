const whatsappService = require('../services/whatsapp.service');

class WhatsAppQueue {

    constructor() {

        this.jobs = [];
        this.processing = false;

        this.MIN_DELAY = 15000;
        this.MAX_DELAY = 30000;

    }

    sleep(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));

    }

    randomDelay() {

        return Math.floor(
            Math.random() *
            (this.MAX_DELAY - this.MIN_DELAY + 1)
        ) + this.MIN_DELAY;

    }

    async enqueue(job) {

        this.jobs.push(job);

        console.log(
            `[QUEUE] Trabajo agregado. Pendientes: ${this.jobs.length}`
        );

        if (!this.processing) {

            this.process();

        }

    }

    async process() {

        this.processing = true;

        while (this.jobs.length > 0) {

            const job = this.jobs.shift();

            try {

                console.log(
                    `[QUEUE] Enviando a ${job.phone}`
                );

                await whatsappService.sendImage(

                    job.phone,

                    job.qrFile

                );

            } catch (err) {

                console.error(err);

            }

            if (this.jobs.length > 0) {

                const delay = this.randomDelay();

                console.log(
                    `[QUEUE] Esperando ${delay} ms`
                );

                await this.sleep(delay);

            }

        }

        console.log("[QUEUE] Cola vacía.");

        this.processing = false;

    }

}

module.exports = new WhatsAppQueue();