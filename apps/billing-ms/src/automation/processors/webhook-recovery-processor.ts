import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Worker,Job } from "bullmq";
@Injectable()
export class WebhookRecoveryProcessor implements OnModuleInit,OnModuleDestroy{
    private worker:Worker;
    constructor(){}
    async onModuleInit() {
        this.worker = new Worker('webhook-recovery-queue', async (job: Job) => {
            return this.processJob(job);
        }, {
            connection: {
                port: 6379,
                host: 'localhost',
                db: 3
            },
            autorun: true
        });
    }
    
    async onModuleDestroy() {
        if (this.worker) {
            await this.worker.close();
        }
    }

    async processJob(job: Job) {
        //Comparing the local db data and the Stripe data
        console.log(`Processing job ${job.id} with data:`, job.data);
        try {
            console.log(job)
        } catch (error) {
            console.error(`Error processing job ${job.id}:`, error);
            throw error; // Rethrow to allow retry logic to kick in
        }
    }

}