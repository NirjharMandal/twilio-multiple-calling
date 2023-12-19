<?php

namespace App\Http\Services;

use Carbon\Carbon;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Twilio\Exceptions\ConfigurationException;
use Twilio\Exceptions\TwilioException;
use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\VoiceGrant;
use Twilio\Rest\Client;
use Twilio\TwiML\VoiceResponse;

class ScheduleCallService {
    private VoiceResponse $voice_response;

    public function __construct() {
        $this->voice_response = new VoiceResponse();
    }

    /****************************************************************************************************************************/

    public function getAccessToken(Request $request): JsonResponse {
        try {
            $twilio_caller_id = '################';
            $my_twilio_identity = '##################';
            /**********************************************/

            $account_sid = '###################';
            $auth_token = '###################';
            $api_key_sid = '###################';
            $api_secret = '###################';
            $twiLml_app_sid = '###################';
            $region = 'US1';
            /**********************************************/
            if (trim($twilio_caller_id) == ""
                || trim($account_sid) == ""
                || trim($api_key_sid) == ""
                || trim($api_secret) == ""
                || trim($twiLml_app_sid) == ""
                || trim($auth_token) == "") {
                return $this->eResponse([], 'It looks like the Twilio call configuration is incomplete.');
            }
            /**********************************************/
            $access_token = new AccessToken(
                $account_sid,
                $api_key_sid,
                $api_secret,
                3600,
                $my_twilio_identity
            );
            /**********************************************/
            $voice_grant = new VoiceGrant();
            $voice_grant->setOutgoingApplication($twiLml_app_sid, [
                'salesmix_user_id' => $user->_id,
            ]);
//            $voice_grant->setIncomingAllow(TRUE);
            /**********************************************/
            $access_token->addGrant($voice_grant);
            $token = $access_token->toJWT();
//            $twilio_caller_id = '+16194390641';
//            $twilio_caller_id = '+12013714190';
//            $twilio_caller_id = '+17372324431';
//            $twilio_caller_id = '+14704666444';
//            $twilio_caller_id = '+12405707241';
//            $twilio_caller_id = '+12029329086';
            return $this->sResponse([
                'twilio_access_token' => $token,
                'twilio_identity' => $my_twilio_identity,
                'twilio_caller_id' => $twilio_caller_id,
                'twilio_location' => $region,
            ]);
        } catch (\Throwable $throwable) {
            return $this->eResponse($throwable->getMessage());
        }
    }

    /**
     * @param Request $request
     * @param $ws_id
     * @return Application|ResponseFactory|Response
     */
    public function callRouting(Request $request, $ws_id) {
        $dialed_number = $request->has('To') ? $request->To : NULL;
        $twilio_caller_id = $request->has('callerId') ? $request->callerId : NULL;
        $my_twilio_identity = $request->has('agent') ? $request->agent : NULL;
        try {
            if ($dialed_number == $twilio_caller_id) {
                # Receiving an incoming call to the browser from an external phone [inbound call]
                $dial = $this->voice_response->dial('', [
                    'timeout' => 40,
                    'record' => 'record-from-ringing-dual' // record-from-answer-dual
                ]);
                $dial->client($my_twilio_identity);
            } else if (!empty($dialed_number) && strlen($dialed_number) > 0) {
                # Dialing a phone number from browser [outbound call]
                $number = htmlspecialchars($dialed_number);
                $dial = $this->voice_response->dial('', [
                    'callerId' => $twilio_caller_id,
                    'timeout' => 30,
                    'action' => route('callRoutingCallback'),
                    'method' => 'POST',
                    'record' => 'record-from-answer-dual', // record-from-ringing-dual
                    'statusCallbackEvent' => "initiated,ringing,answered,completed",
                ]);
                $numbers[] = '+15712011081'; // switched off number abdulM
                $caller_id = [
                    '+16194390641',
                    '+12013714190'
                ];
                foreach ($numbers as $i => $number) {
                    $dial->number($number, [
                        'callerId' => $caller_id[$i],
                        'answerOnBridge' => 'true',
                        'machineDetection' => 'DetectMessageEnd', // DetectMessageEnd | Enable
                        'amdStatusCallbackMethod' => 'POST',
                        'machineDetectionTimeout' => 10,
                        'machineDetectionSpeechThreshold' => 2400,
                        'machineDetectionSpeechEndThreshold' => 1200,
                        'amdStatusCallback' => route('machineDetectionCallback'),
                    ]);
                }
            } else {
                # mostly for the testing from twilio console
                $this->voice_response->say("We can't execute this call for unreal caller id and calling id");
            }
        } catch (\Throwable $th) {
        }
        return response((string)$this->voice_response, 201)->header('Content-Type', 'text/xml');

    }

    public function machineDetectionCallback(Request $request): Response|Application|ResponseFactory {
        if ($request->AnsweredBy == 'machine_start') {
            $this->voice_response->say("call by machin");
        }
        return response((string)$this->voice_response, 201)->header('Content-Type', 'text/xml');
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function callRoutingCallback(Request $request): Response {

        try {
            if ($request->has('CallSid') && $request->has('CallStatus')) {
                //$this->callRoutingCallbackDBOperation($request);
            }
        } catch (\Throwable $throwable) {
        }
        return response((string)$this->voice_response, 200)->header('Content-Type', 'text/xml');
    }

    public function callRoutingCallbackDBOperation($request) {

        // $request->DialCallStatus = completed | answered | busy | no-answer | failed | canceled
        // Do another operation
    }


    /**
     * @param $request
     *
     * @return Response
     */
    public function ifCallNotPickedUp($request): Response {
        $this->voice_response->say('Hello Dear, This is a auto-generated voice message.');
        $this->voice_response->pause(['length' => 1]);
        $this->voice_response->say('Thank you for your patient to talk with me.');
        return response((string)$this->voice_response, 201)->header('Content-Type', 'text/xml');
    }
}
