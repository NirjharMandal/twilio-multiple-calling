<?php
if (!function_exists('makeSendgridUserName')) {
    function makeSendgridUserName() {
        if (config('app.debug') == TRUE) {
            return 'ghorar_dim';
        } else {
            return 'mukati.abdul@gmail.com';
        }
    }
}

if (!function_exists('makeSendgridHost')) {
    function makeSendgridHost() {
        if (config('app.debug') == TRUE) {
            return 'ghorar_dim_host';
        } else {
            return 'smtp-relay.sendinblue.com';
        }
    }
}
if (!function_exists('makeSendgridPassword')) {
    function makeSendgridPassword() {
        if (config('app.debug') == TRUE) {
            return 'ghorar_dim_ghorar_dim_ghorar_dim_ghorar_dim_ghorar_dim_ghorar_dim_ghorar';
        } else {
            // return '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';
            // return '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';
            // return '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'; -- old outreachbin
//            return "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";
//            return "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";
            return 'xsmtpsib-9821e7e34352b1dd5c8742cb0a64241fd79a3c92b8491f672a7b7928041cef3f-6wq5WNLP7G24KfTS';
        }
    }
}

return [
    
    /*
    |--------------------------------------------------------------------------
    | Mail Driver
    |--------------------------------------------------------------------------
    |
    | Laravel supports both SMTP and PHP's "mail" function as drivers for the
    | sending of e-mail. You may specify which one you're using throughout
    | your application here. By default, Laravel is setup for SMTP mail.
    |
    | Supported: "smtp", "mail", "sendmail", "mailgun", "mandrill", "ses", "log"
    |
    */
    
    'driver' => 'smtp',
    
    /*
    |--------------------------------------------------------------------------
    | SMTP Host Address
    |--------------------------------------------------------------------------
    |
    | Here you may provide the host address of the SMTP server used by your
    | applications. A default option is provided that is compatible with
    | the Mailgun mail service which will provide reliable deliveries.
    |
    */
    
    'host' => makeSendgridHost(),
    
    /*
    |--------------------------------------------------------------------------
    | SMTP Host Port
    |--------------------------------------------------------------------------
    |
    | This is the SMTP port used by your application to deliver e-mails to
    | users of the application. Like the host we have set this value to
    | stay compatible with the Mailgun e-mail application by default.
    |
    */
    
    'port' => 587,
    
    /*
    |--------------------------------------------------------------------------
    | Global "From" Address
    |--------------------------------------------------------------------------
    |
    | You may wish for all e-mails sent by your application to be sent from
    | the same address. Here, you may specify a name and address that is
    | used globally for all e-mails that are sent by your application.
    |
    */
    
    'from' => ['address' => 'team@salesmix.com', 'name' => 'SalesMix'],
    
    /*
    |--------------------------------------------------------------------------
    | E-Mail Encryption Protocol
    |--------------------------------------------------------------------------
    |
    | Here you may specify the encryption protocol that should be used when
    | the application send e-mail messages. A sensible default using the
    | transport layer security protocol should provide great security.
    |
    */
    
    'encryption' => 'tls',
    
    /*
    |--------------------------------------------------------------------------
    | SMTP Server Username
    |--------------------------------------------------------------------------
    |
    | If your SMTP server requires a username for authentication, you should
    | set it here. This will get used to authenticate with your server on
    | connection. You may also set the "password" value below this one.
    |
    */
    
    'username' => makeSendgridUserName(),
    
    /*
    |--------------------------------------------------------------------------
    | SMTP Server Password
    |--------------------------------------------------------------------------
    |
    | Here you may set the password required by your SMTP server to send out
    | messages from your application. This will be given to the server on
    | connection so that the application will be able to send messages.
    |
    */
    
    'password' => makeSendgridPassword(),
    
    /*
    |--------------------------------------------------------------------------
    | Sendmail System Path
    |--------------------------------------------------------------------------
    |
    | When using the "sendmail" driver to send e-mails, we will need to know
    | the path to where Sendmail lives on this server. A default path has
    | been provided here, which will work well on most of your systems.
    |
    */
    
    'sendmail' => '/usr/sbin/sendmail -bs',
    
    /*
    |--------------------------------------------------------------------------
    | Mail "Pretend"
    |--------------------------------------------------------------------------
    |
    | When this option is enabled, e-mail will not actually be sent over the
    | web and will instead be written to your application's logs files so
    | you may inspect the message. This is great for local development.
    |
    */
    
    'pretend' => FALSE,

];
