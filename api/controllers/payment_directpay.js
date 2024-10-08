const directPayIpg = require('directpay-ipg-js')
const cryptoJs = require('crypto-js')

exports.create = (req, res, next) => {

    // const json_payload = {
    //     merchant_id: "IS14914",
    //     amount: "10.00",
    //     type: "ONE_TIME",
    //     order_id: "CP123456789",
    //     currency: "USD",
    //     response_url: "https://www.susilalife.com/#/success",
    //     first_name: "Tharuke",
    //     last_name: "Jay",
    //     email: "user@email.com",
    //     phone: "0712345678",
    //     logo: "https://firebasestorage.googleapis.com/v0/b/susila-life-test.appspot.com/o/Temp%2Fsusila_branding.png?alt=media&token=57a26331-2547-41ce-956b-ce77e6a57ab1",
    // };

    const json_payload = {
        "merchant_id": "SE14999",
        "amount": "50.00",
        "type": 'ONE_TIME',
        "order_id": "njsa123",
        "currency": "LKR",
        "return_url": "",
        "response_url": "http://localhost/response.php",
        "first_name": "user",
        "last_name": "user",
        "phone": "0774592258",
        "email": "user@mail.lk",
        "page_type": 'IN_APP',
        "logo" : "https://esecretary.lk/images/logo.png"

    }

    let encode_payload = cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(JSON.stringify(json_payload)));
    // let encode_payload = CryptoJs
    let signature = cryptoJs.HmacSHA256( encode_payload, '68fd228c561f86b2e6a2fcb9d736188d1c25f74d40ae4a273e6d9922e2120628');

    const dpInit = new directPayIpg.Init({
        signature: signature,
        dataString: encode_payload,
        stage: 'DEV',
        container: 'card_container'
    });

    // console.log('IPG ====> ', dpInit.doInAppCheckout)

    dpInit.doInContainerCheckout().then((data) => {
        console.log('client-res', JSON.stringify(data))
    }).catch((error) => {
        console.log('client-error', JSON.stringify(error))
    })

}
