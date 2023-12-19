<?php

namespace App\Traits;

ini_set('memory_limit', '-1');
date_default_timezone_set('UTC');

use Dacastro4\LaravelGmail\Services\Message\Mail as GoogleMail;
use PHPMailer\PHPMailer\PHPMailer;
use Dacastro4\LaravelGmail\Facade\LaravelGmail;

// use Microsoft\Graph\Graph;
// use Microsoft\Graph\Model;

trait Mail {
    public function sendMail($providerType, $sender, $receiver, $subject, $body, $messageId = NULL, $signature = NULL, $cc = [], $bcc = []) {
        if ($providerType == 'google') {
            return $this->exeByGoogle($sender, $receiver, $subject, $body, $messageId, $signature, $cc, $bcc);
        }else if ($providerType == 'outlook') {
            return $this->exeByOutlook($sender, $receiver, $subject, $body, $messageId, $signature, $cc, $bcc);
        } else {
            return $this->exeBySMTP($sender, $receiver, $subject, $body, $messageId, $signature, $cc, $bcc);
        }
    }
    
    protected function exeByGoogle($sender, $receiver, $subject, $body, $messageId = NULL, $signature = NULL, $cc = [], $bcc = []) {
        $sender = (object)$sender; $receiver = (object)$receiver;

        $shouldSendAsNewEmail = true;
        if(isset($messageId) && !empty($messageId)){
            try{
                $gClient = new LaravelGmail();
                $gClient::setToken($sender->access_token);
                $mail = LaravelGmail::message($gClient)->get($messageId);
                $mail->using($sender->access_token);
                $mail->message($body);
                $mail->from($sender->email, $sender->name);
                $mail->to($receiver->email, $receiver->name);
                $mail->reply();
                $shouldSendAsNewEmail = false;
            }catch(\Throwable $e){ }
        }

        if($shouldSendAsNewEmail == true){
            $mail = new GoogleMail;
            $mail->using($sender->access_token);
            $mail->from($sender->email, $sender->name);
            $mail->to($receiver->email, $receiver->name);
            $mail->subject($subject);
            if (isset($signature) && !empty($signature)) {
                $body .= "<br /><br />" . $signature;
            }
            $mail->message($body);
            
            if (isset($sender->reply_to) && !empty($sender->reply_to)) {
                $mail->setHeader("Reply-To", $sender->reply_to);
            } else if (isset($sender->email) && !empty($sender->email)) {
                $mail->setHeader("Reply-To", $sender->email);
            }

            if(isset($cc) && !empty($cc) && is_array($cc)){
                $mail->setHeader('cc',$cc);
            }
            if(isset($bcc) && !empty($bcc) && is_array($bcc)){
                $mail->setHeader('bcc',$bcc);
            }

            $mail->send();
        }

        return $mail->getId();
    }
    
    public function exeBySMTP($sender, $receiver, $subject, $body, $messageId = NULL, $signature = NULL, $cc = [], $bcc = []) {
        set_time_limit(0);
        $sender = (object)$sender;
        $receiver = (object)$receiver;
        
        $mail = new PHPMailer(TRUE);
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer'       => FALSE,
                'verify_peer_name'  => FALSE,
                'allow_self_signed' => TRUE,
                'ciphers'           => 'DEFAULT:!DH'
            )
        );
        
        try {
            $mail->SMTPDebug = FALSE;
            $mail->isSMTP();
            $mail->CharSet = 'UTF-8';
            $mail->Host = $sender->smtp_host;
            $mail->SMTPAuth = TRUE;
            $mail->Timeout = 10;
            if(isset($sender->smtp_username) && !empty($sender->smtp_username)){
                $mail->Username = $sender->smtp_username;
            }else{
                $mail->Username = $sender->email;
            }
            $mail->Password = $sender->smtp_password;
            
            if (!empty($sender->smtp_encryption)) {
                $mail->SMTPSecure = strtolower($sender->smtp_encryption) == 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
            }
            $mail->Port = (int)$sender->smtp_port;
            $mail->setFrom($sender->email, $sender->name);
            
            if (isset($sender->reply_to) && !empty($sender->reply_to)) {
                $mail->addReplyTo($sender->reply_to, $sender->name);
            } else if (isset($sender->email) && !empty($sender->email)) {
                $mail->addReplyTo($sender->email, $sender->name);
            }
            $mail->addAddress($receiver->email, $receiver->name);
            $mail->isHTML(TRUE);
            $mail->Subject = $subject;
            
            if (isset($signature) && !empty($signature)) {
                $body .= "<br /><br />" . $signature;
            }
            
            $mail->Body = $body;

            if(isset($cc) && !empty($cc) && is_array($cc)){
                foreach($cc as $getN){
                    $mail->addCC($getN);
                }
            }
            if(isset($bcc) && !empty($bcc) && is_array($bcc)){
                foreach($bcc as $getN){
                    $mail->addBCC($getN);
                }
            }
            
            if (isset($messageId) && !empty($messageId)) {
                $mail->addCustomHeader('In-Reply-To', "<" . $messageId . ">");
                $mail->addCustomHeader('References', "<" . $messageId . ">");
            }
            if (!$mail->send()) {
                throw new \Exception("Unknown Error");
            } else {
                return $mail->getLastMessageID();
            }
        } catch (\Exception $e) {
            throw new \Exception($mail->ErrorInfo);
        }
    }
    
    protected function exeByOutlook($sender, $receiver, $subject, $body, $messageId = NULL, $signature = NULL, $cc = [], $bcc = []) {
        if (isset($signature) && !empty($signature)) {
            $body .= "<br /><br />" . $signature;
        }
        
        $messageBody = [
            'saveToSentItems' => FALSE,
            'message'         => [
                'subject'                => $subject,
                'body'                   => [
                    'contentType' => 'HTML',
                    'content'     => $body
                ],
                'toRecipients'           => [
                    [
                        'emailAddress' => [
                            'address' => $receiver->email
                        ]
                    ]
                ],
                // 'from' => [
                //     [
                //         'emailAddress' => [
                //             'address' => $sender->email,
                //             // 'name' => $sender->name
                //         ]
                //     ]
                // ],
                'internetMessageHeaders' => [
                    [
                        'name'  => 'X-From',
                        'value' => "{$sender->name} <{$sender->email}>"
                    ],
                    [
                        'name'  => 'X-Reply-To',
                        'value' => $sender->reply_to
                    ]
                ]
            ]
        ];
        
        if (isset($messageId) && !empty($messageId)) {
            $messageBody['message']['internetMessageHeaders'] = array_merge(
                $messageBody['message']['internetMessageHeaders'],
                [
                    [
                        'name'    => 'X-Message-ID',
                        'content' => $messageId
                    ],
                    [
                        'name'    => 'X-In-Reply-To',
                        'content' => $messageId
                    ],
                    [
                        'name'    => 'X-References',
                        'content' => $messageId
                    ]
                ]
            );
        }
        
        $executeSending = function ($sender, $messageBody) {
            $graph = new Graph();
            $graph->setAccessToken($sender->access_token);
            
            $graph->createRequest('post', '/me/sendMail')
                  ->attachBody($messageBody)
                  ->execute();
        };
        
        try {
            $executeSending($sender, $messageBody);
        } catch (\Exception $e) {
            $oauthClient = new \League\OAuth2\Client\Provider\GenericProvider([
                'clientId'                => config('azure.appId'),
                'clientSecret'            => config('azure.appSecret'),
                'redirectUri'             => config('azure.redirectUri'),
                'urlAuthorize'            => config('azure.authority') . config('azure.authorizeEndpoint'),
                'urlAccessToken'          => config('azure.authority') . config('azure.tokenEndpoint'),
                'urlResourceOwnerDetails' => '',
                'scopes'                  => config('azure.scopes')
            ]);
            
            $newAccessToken = $oauthClient->getAccessToken('refresh_token', [
                'refresh_token' => $sender->refresh_token
            ]);
            
            $sender->update(['access_token' => $newAccessToken]);
            
            $executeSending($sender, $messageBody);
        }
        
        return NULL;
    }
    
    
}
