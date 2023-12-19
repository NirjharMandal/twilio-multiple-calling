<?php

namespace App\Traits;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

trait verifyBee {

    /**
     * Verify given email address.
     *
     * @param string $email
     *
     * @return bool
     */
    public function eVerify(string $email): bool {
        $getResult = $this->eVerifyList([$email],false);
        if (isset($getResult) && count($getResult) > 0) {
            $thisResult = $getResult[0];
            if ((isset($thisResult->deliverable) && !empty($thisResult->deliverable)) | (isset($thisResult->catchAll) && !empty($thisResult->catchAll))) {
               return TRUE;
            }
        }
       return false;
    }

    public function eVerifyList($emails = [], $logs = TRUE) {
        $postData = [];
        $postData['emails'] = implode(',', $emails);
        $restCalls = 'https://app.bounceproof.com/api/v1.4/verify-email-list/';
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL            => $restCalls,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_ENCODING       => "",
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 60,
            CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST  => "POST",
            CURLOPT_POST           => 1,
            CURLOPT_POSTFIELDS     => json_encode($postData),
            CURLOPT_HTTPHEADER     => array(
                "content-type: application/json",
                "evToken: RB9MRVMCAVCOHPW0BARB9MRVMCOPAYCOHPW0"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        $obj = json_decode($response);
        if ($logs) {
            return $this->saveLogs($obj);
        }
        if (isset($obj->status) && !empty($obj->status) && $obj->status == 'success') {
            return $obj->emails;
        }
        return [];
    }

    public function saveLogs($response): callable|array {
        $bulk_insert_params = [];
        $data = [];
        $ws_id = auth()->user()->active_workspace;
        $user_id = auth()->user()->ws->owner_id;
        foreach ($response->emails as $k => $res) {
            if (isset($res->username) && !empty($res->username) && isset($res->domain) && !empty($res->domain)) {
                $email = $res->username . '@' . $res->domain;
                $bulk_insert_params['body'][]['index'] = [
                    '_index' => TBL_VERIFY_LOGS,
                    '_id'    => $user_id . '_' . $email
                ];

                $bulk_insert_params['body'][] = [
                    'workspace_id' => $ws_id,
                    'user_id'      => $user_id,
                    'email'        => $email,
                    'validFormat'  => isset($res->validFormat) && !empty($res->validFormat) ? 1 : 0,
                    'deliverable'  => isset($res->deliverable) && !empty($res->deliverable) ? 1 : 0,
                    'catchAll'     => isset($res->catchAll) && !empty($res->catchAll) ? 1 : 0,
                    'fullInbox'    => isset($res->fullInbox) && !empty($res->fullInbox) ? 1 : 0,
                    'hostExists'   => isset($res->hostExists) && !empty($res->hostExists) ? 1 : 0,
                    'created_at'   => time(),
                ];
                $data[$email] = [
                    'validFormat' => isset($res->validFormat) && !empty($res->validFormat) ? 1 : 0,
                    'deliverable'  => isset($res->deliverable) && !empty($res->deliverable) ? 1 : 0,
                    'catchAll'     => isset($res->catchAll) && !empty($res->catchAll) ? 1 : 0,
                ];
            }

        }
//         dd($bulk_insert_params);
        if (count($bulk_insert_params) > 0) {
            $resData = MDB()->bulk($bulk_insert_params);
            $createdQty = 0;
            if (isset($resData['items']) && count($resData['items']) > 0) {
                foreach ($resData['items'] as $item) {
                    if ($item['index']['result'] === 'created') {
                        $createdQty += 1;
                    }
                }
            }
//            pp($createdQty);
            if($createdQty > 0){
                MDB()->updateByQuery([
                    'index' => TBL_USER,
                    "conflicts"=>"proceed",
                    'body'  => [
                        'query'  => [
                            'match' => [
                                '_id' => $user_id,
                            ]
                        ],
                        'script' => [
                            'source' => 'ctx._source.verification_limit_used += params.verification_limit_used;',
                            'params' => [
                                'verification_limit_used' => $createdQty
                            ],
                        ]
                    ]
                ]);
            }
//            pp($data);
            return ['emails' => $data,'verified'=>$createdQty];
        }
        return [];
    }
}

