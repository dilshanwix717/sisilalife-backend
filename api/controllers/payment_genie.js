const express = require("express");
const request = require('request');
const CC = require('currency-converter-lt')

const baseUrl = "https://api.geniebiz.lk";
// const baseUrl = "https://api.uat.geniebiz.lk";
const redirectUrl = "https://www.susilalife.com/#/success";
// const redirectUrl = "https://susila-life-test.firebaseapp.com/#/success";
// const redirectUrl = "http://112.134.134.113/#/success";
// const authenticationCode = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjM2YmFmY2U3LWEyMDEtNDI5Yi1hOWUyLWM1Yjc4NTQ2Njc3YyIsImNvbXBhbnlJZCI6IjYzOTdmMzlkZjA3ZmJhMDAwODQyYTkwYiIsImlhdCI6MTY3MDkwMjY4NSwiZXhwIjo0ODI2NTc2Mjg1fQ.fy12dgFhA3iB_RCjD7y8j5HClNRZUiBZgAg-QzFpxaE';
const authenticationCode = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjZhM2E5YTM2LWJmNzYtNDgwNi1hNzAyLTNmMjdmNTE0ZDkzYiIsImNvbXBhbnlJZCI6IjY0MzY0NTI1NTZiYjg2MDAwOGMwNTY0MSIsImlhdCI6MTY4MTI3ODI0NSwiZXhwIjo0ODM2OTUxODQ1fQ.F98usorXthbUN-v8Mvdw1Upotnsp_JpecSh_h6GtWj0';

exports.create = (req, res, next) => {

    const amount = req.body.amount;
    const currency = req.body.currency;
    const customerReference = req.body.customerReference;
    let currencyConverter = new CC({from: "USD", to: "LKR", amount: amount})
    console.log('amount === ', amount)


    currencyConverter.convert().then((response) => {

        console.log('response === ', Math.round(response) * 100)

        const options = {
            method: 'POST',
            url: baseUrl + '/public/v2/transactions',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: authenticationCode
            },
            body: {
                amount: Math.round(response) * 100,
                currency: currency,
                customerReference: customerReference,
                redirectUrl: redirectUrl
            },
            json: true
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);

            if (body != null) {
                res.status(201).json({
                    body
                })
            }

        });
    });

}

exports.success = (req, res, next) => {
    console.log('success ===> ', req.body);
}

exports.get_payment = (req, res, next) => {
    const transactionId = req.params.id;

    const options = {
        method: 'GET',
        url:  baseUrl + '/public/transactions/' + transactionId,
        headers: {
            Accept: 'application/json',
            Authorization: authenticationCode
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const obj = JSON.parse(body);
        console.log(obj);
        if (body != null) {
            res.status(201).json({
                obj
            })
        }
    });
}
