import cron from 'node-cron';
import { RowDataPacket } from 'mysql2/promise';

export interface ScheduledCom extends RowDataPacket {

};

const apiKey: string = `${process.env.SMS_API_KEY}`;
const apiSecret: string = `${process.env.SMS_API_SECRET}`;

const accountApiCredentials: string = `${apiKey}:${apiSecret}`;
const buff: Buffer = Buffer.from(accountApiCredentials);
const base64Credentials: string = buff.toString('base64');

// SCHEDULED TO RUN AT 3AM EVERYDAY
cron.schedule('*/5 * * * *', () => runScheduledComs());

// FUNCTIONS 
const runScheduledComs = async () => {

  console.log("Cron Jobs Would run here")

};