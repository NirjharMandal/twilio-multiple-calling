<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'google' => [
        'client_id' => '424486748368-9c4le2dn7a75ql428donhim5l3ij6jsq.apps.googleusercontent.com',
        'client_secret' => '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',
        'redirect' => 'https://app.salesmix.com/auth/google/callback',
    ],
    'outlook' => [
        'client_id' => '39f4d264-72f6-4302-bff8-51cbf55486ef',
        'client_secret' => '41998041-9be2-4c06-be74-ac5ca48de6b5',
        'redirect' => 'https://app.salesmix.com/auth/outlook/callback',
    ],

];
