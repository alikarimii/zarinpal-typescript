import { Zarinpal, IPaymentRequest, IPRZarin } from './zarinpal';

export function example (input: IPaymentRequest ): Promise<IPRZarin> {
    return Zarinpal.bootstrap().paymentRequest({
        Amount: input.Amount,
        CallbackURL: input.CallbackURL,
        Mobile: input.Mobile,
        Email: input.Email,
        Description: input.Description
    });
}


// you must fill in all the input 
example({
    Amount: 1000,
    CallbackURL: 'your callback',
    Mobile: '09123456789',
    Email: 'your@mail.com',
    Description: 'your description'
}).then(result => {
    console.log(result);
    // result.authority
    // result.error
    // result.status
    // result.url
});