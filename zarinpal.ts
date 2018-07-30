import axios from 'axios';
import { config } from './util/zarinPalConfig';

export interface IPaymentRequest {
	Amount: number;
	CallbackURL: string;
	Description: string;
	Email: string;
	Mobile: string;
}
export interface IPRZarin {
	status?: number;
	authority?: string;
	url?: string;
	error?: string;
}
export interface IPVZarin {
	status?: string;
	RefID?: string;
	error?: string;
}
export class Zarinpal {
	private sbox = false;
	private url = '';
	private static ZarinProto: Zarinpal;

	constructor() {
		this.url = (this.sbox === true) ? config.sandbox : config.https;
	}
	public static bootstrap(): Zarinpal {
		if (!Zarinpal.ZarinProto) {
			Zarinpal.ZarinProto = new Zarinpal();
		}
		return Zarinpal.ZarinProto;
	}

	private axioss(url: string, module: string, method: string, data: any) {
		let urll = url + module;

		let options = {
			method: method,
			url: urll,
			headers: {
				'cache-control': 'no-cache',
				'content-type': 'application/json'
			},
			data: data
		};
		return axios(options);
	}

	public paymentRequest(input?: IPaymentRequest): Promise<IPRZarin> {

		// you must fill in all the entries
		let params = {
			MerchantID: config.merchant,
			Amount: +input.Amount,
			CallbackURL: input.CallbackURL,
			Description: input.Description,
			Email: input.Email,
			Mobile: input.Mobile
		};

		return new Promise((resolve, reject) => {
			Zarinpal.bootstrap().axioss(Zarinpal.bootstrap().url, config.API.PR, 'POST', params).then((axi: any) => {
				/*
				you must save this property in your database for verify payment
					axi.data.Authority,
					input.orderId,
					input.userId,
					+input.Amount,
				*/
				resolve({
					status: +axi.data.Status,
					authority: axi.data.Authority,
					url: config.PG(Zarinpal.bootstrap().sbox) + axi.data.Authority
					// if you active ‫‪ZarinGate‬‬ for your account , use line below for url
					// url: config.PG(Zarinpal.bootstrap().sbox) + axi.data.Authority + '/‫‪ZarinGate‬‬' 
				});

			}).catch((err: any) => {
				reject({
					error: err.message
				});
			});
		});

	}

	public PaymentVerification(input: any): Promise<IPVZarin> {
		let params = {
			MerchantID: config.merchant,
			Amount: input.Amount,
			Authority: input.Authority
		};

		return new Promise((resolve, reject) => {
			Zarinpal.bootstrap().axioss(config.https, config.API.PV, 'POST', params).then((axi: any) => {
				
				/* if verify ok , modify database*/
				
				resolve({
					status: axi.data.Status,
					RefID: axi.data.RefID
				});
			}).catch((err: any) => {
				reject({
					error: err.message
				});
			});
		});
	}

	public UnverifiedTransactions() {
		let params = {
			MerchantID: config.merchant
		};

		return new Promise((resolve, reject) => {
			Zarinpal.bootstrap().axioss(config.https, config.API.UT, 'POST', params).then((axi: any) => {
				resolve({
					status: axi.data.Status,
					authorities: axi.data.Authorities
				});
			}).catch((err: any) => {
				reject(err.message);
			});
		});
	}

	public RefreshAuthority(input: any) {
		let params = {
			MerchantID: config.merchant,
			Authority: input.Authority,
			ExpireIn: input.Expire
		};

		return new Promise(function (resolve, reject) {
			Zarinpal.bootstrap().axioss(config.https, config.API.RA, 'POST', params).then((axi: any) => {
				resolve({
					status: axi.data.Status
				});
			}).catch((err) => {
				reject(err.message);
			});
		});
	}
}