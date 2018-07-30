# zarinpal-typescript
zarinpal
```
import { Zarinpal } from './zarinpal'

Zarinpal.bootstrap().paymentRequest({
    Amount: 1000,
    CallbackURL: 'your callback url',
    Mobile: '09123456789',
    Email: 'your@mail.com',
    Description: 'description'
}).then(result => // use result)
```