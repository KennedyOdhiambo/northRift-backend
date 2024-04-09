import dotenv from 'dotenv';
import handleError from '../lib/handleError';
import { Response, Request, NextFunction } from 'express';
import axios from 'axios';
import { Payment } from '../models/paymentModel';
import { Consts } from '../lib/const';

dotenv.config();

export type StkRequest = Request & {
   token?: { token: string };
};

export const createToken = async (req: StkRequest, res: Response, next: NextFunction) => {
   try {
      const auth = Buffer.from(
         `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
      ).toString('base64');

      const response = await axios.get(
         'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
         {
            headers: {
               Authorization: `Basic ${auth}`,
            },
         }
      );

      const token = response.data.access_token;
      req.token = { token };
      next();
   } catch (error) {
      return handleError(error, res);
   }
};

export const callBack = async (req: Request, res: Response) => {
   try {
      console.log('I have been reached');
      console.log('data from callback:', req);
      const data = req.body.Body.stkCallback;

      const transaction = {
         MerchantRequestID: data.MerchantRequestID,
         CheckoutRequestID: data.CheckoutRequestID,
         ResultCode: data.ResultCode,
         ResultDesc: data.ResultDesc,
         Amount: data.CallbackMetadata?.Item[0].Value,
         MpesaReceiptNumber: data.CallbackMetadata?.Item[1].Value,
         Balance: data.CallbackMetadata?.Item[2].Value,
         TransactionDate: data.CallbackMetadata?.Item[3].Value,
         PhoneNumber: data.CallbackMetadata?.Item[4].Value,
      };

      const payment = new Payment(transaction);
      await payment.save();

      return res.status(201).json({
         status: Consts.resCodeSuccess,
         message: 'Payment succesfully received',
      });
   } catch (error) {
      handleError(error, res);
   }
};

export const postStk = async (req: StkRequest, res: Response) => {
   try {
      const { customerName, phone, amount, shuttleNumber, bookingDate } = req.body;
      const token = req.token;
      if (!phone) throw new Error('Phone number is required');
      if (!amount) throw new Error('please specify amount');

      const date = new Date();
      const timestamp =
         date.getFullYear() +
         ('0' + (date.getMonth() + 1)).slice(-2) +
         ('0' + date.getDate()).slice(-2) +
         ('0' + date.getHours()).slice(-2) +
         ('0' + date.getMinutes()).slice(-2) +
         ('0' + date.getSeconds()).slice(-2);

      const password = Buffer.from(
         (process.env.MPESA_SHORTCODE as string) + process.env.MPESA_PASSKEY + timestamp
      ).toString('base64');

      const callbackUrl = `https://8014-102-0-0-243.ngrok-free.app/north-rift/v1/payment/callback`;
      console.log(callbackUrl);

      const data = {
         BusinessShortCode: process.env.MPESA_SHORTCODE,
         Password: password,
         Timestamp: timestamp,
         TransactionType: 'CustomerPayBillOnline',
         Amount: amount,
         PartyA: phone,
         PartyB: process.env.MPESA_SHORTCODE,
         PhoneNumber: phone,
         CallBackURL: callbackUrl,
         AccountReference: 'ticket payment',
         TransactionDesc: 'purchase',
      };

      const response = await axios.post(
         'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
         data,
         {
            headers: {
               Authorization: `Bearer ${token?.token}`,
            },
            timeout: 5000,
         }
      );

      const {
         MerchantRequestID,
         CheckoutRequestID,
         ResponseCode,
         ResponseDescription,
         CustomerMessage,
      } = response.data;

      const transaction = {
         merchantRequestID: MerchantRequestID,
         checkoutRequestID: CheckoutRequestID,
         responseCode: ResponseCode,
         responseDescription: ResponseDescription,
         customerMessage: CustomerMessage,
         amount: amount,
         customerPhoneNumber: phone,
         customerName: customerName,
         shuttleNumber: shuttleNumber,
         bookingDate: bookingDate,
      };
      const payment = new Payment(transaction);
      await payment.save();

      return res.status(201).json({
         status: Consts.resCodeSuccess,
         message: 'Payment succesfully initiated',
      });
   } catch (error) {
      console.log(error);
      return handleError(error, res);
   }
};

export const getPayments = async (req: Request, res: Response) => {
   try {
      const { date, shuttleId } = req.query;

      const conditions: { bookingDate?: string; shuttleNumber?: string } = {};
      if (date) {
         conditions.bookingDate = date as string;
      }
      if (shuttleId) {
         conditions.shuttleNumber = shuttleId as string;
      }

      const payments = await Payment.find(conditions);

      return res.status(201).json({
         status: Consts.resCodeSuccess,
         data: payments,
      });
   } catch (error) {
      return handleError(error, res);
   }
};
