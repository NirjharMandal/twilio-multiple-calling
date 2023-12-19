<?php

namespace App\Traits;

class SendAnalyticsToWebHook {

    /**
     * SendAnalyticsToWebHook.
     *
     * @param string $eventType ,$campaignId, $prospectsId
     *
     */

    public function execute($prospectsId, $prospectMapId, string $eventType = "prospect-opened",$extraParams = []) : array {
        // prospect-opened
        // prospect-clicked
        // prospect-replied
        // prospect-bounced
        // prospect-unsubscribed
        // prospect-non-engagement
        if($eventType === 'prospect-replied'){
            if(
                (isset($extraParams['reply_msg']) && !empty($extraParams['reply_msg'])) &&
                (isset($extraParams['sequence_id']) && !empty($extraParams['sequence_id'])) &&
                (isset($extraParams['from_email']) && !empty($extraParams['from_email']))
            ){
                try {
                    $sequence = MDB()->get(['index' => TBL_SEQUENCE,'id'=>$extraParams['sequence_id']])['_source'];
                    if(
                        (
                            isset($sequence['slack_integration']) &&
                            !empty($sequence['slack_integration']) &&
                            (int) $sequence['slack_integration'] === 1
                        ) &&
                        (
                            isset($sequence['slack_integration_webhook']) &&
                            !empty($sequence['slack_integration_webhook'])
                        )
                    ){
                        $this->sendSlackMsg($sequence['slack_integration_webhook'],$extraParams);
                    }

                    if(
                        (
                        isset($sequence['discord_integration']) &&
                        !empty($sequence['discord_integration']) &&
                        (int) $sequence['discord_integration'] === 1
                        ) &&
                        (
                            isset($sequence['discord_integration_webhook']) &&
                            !empty($sequence['discord_integration_webhook'])
                        )
                    ){
                        $this->sendDiscordMsg($sequence['discord_integration_webhook'],$extraParams);
                    }

                }catch (\Throwable $th){}
            }
        }
        $res = ['status' => 'error', 'msg' => 'Unknown',];
        $sequenceData = $prospectData = $mappingData = [];
        try {
            $prospectData = MDB()->get([
                'index' => TBL_PROSPECT,
                'id'    => $prospectsId
            ])['_source'];

            $mappingData = MDB()->get([
                'index' => TBL_SEQUENCE_PROSPECT_MAPPING,
                'id'    => $prospectMapId
            ])['_source'];

            $sequenceData = MDB()->get([
                'index' => TBL_SEQUENCE,
                'id'    => $mappingData['sequence_id']
            ])['_source'];
        } catch (\Throwable $e) {
        }
        if (!empty($sequenceData) && !empty($prospectData) && !empty($mappingData) && isset($sequenceData['webhook_url']) && !empty($sequenceData['webhook_url'])) {
            $postData = [
                'event'            => $eventType ?? "",
                'sequence_id'      => $mappingData['sequence_id'] ?? "",
                'sequence_name'    => $sequenceData['name'] ?? "",
                'first_name'       => $prospectData['first_name'] ?? "",
                'last_name'        => $prospectData['last_name'] ?? "",
                'email'            => $prospectData['email'] ?? "",
                'phone'            => $prospectData['phone'] ?? "",
                'website'          => $prospectData['website'] ?? "",
                'company'          => $prospectData['company'] ?? "",
                'position'         => $prospectData['position'] ?? "",
                'custom_variables' => $prospectData['custom_variables'] ?? [],
                'replied'          => $prospectData['replied'] ?? 0,
                'bounced'          => $prospectData['bounced'] ?? 0,
                'clicked'          => $prospectData['clicked'] ?? 0,
                'opened'          => $prospectData['opened'] ?? 0,
                'unsubscribed'     => $prospectData['unsubscribed'] ?? 0,
            ];

            $response = \Illuminate\Support\Facades\Http::post($sequenceData['webhook_url'], [
                'form_params' => $postData
            ]);
            if ($response->successful()) {
                $res['status'] = "success";
            } else {
                $res['msg'] = "System could not able to send data to webhook URL!";
            }
            return $res;
        }
        return $res;
    }

    private function sendDiscordMsg($webhookUrl,$params){
        // Message content
        $message = "Hay you've a reply form SalesMix!";

        // Embed data
        $embed = array(
            "title" => $params["from_email"],
            "description" => strip_tags($params["reply_msg"]),
            "color" => 255, // Hex color code (e.g., red = 16711680, blue = 255)
            "footer" => array(
                "text" => "Replied at | ". date('M d, h:i
 a'),
//                "icon_url" => "https://example.com/footer.png"
            )
        );

        // Create payload object
        $payload = json_encode(array(
            "content" => $message,
            "embeds" => array($embed)
        ));

        // Set headers
        $headers = array(
            "Content-Type: application/json",
        );

        // Initialize cURL
        $ch = curl_init();

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, $webhookUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute cURL request
        $response = curl_exec($ch);

        // Check for errors
        if ($response === false) {
            echo "Error sending message: " . curl_error($ch);
        }

        // Close cURL
        curl_close($ch);

        // Output the response
//        echo $response;
    }
    private function sendSlackMsg($webhookUrl,$params): void
    {
        // Create payload object
        $payload = array(
            "text" => "Hay you've a reply form SalesMix!",
            "attachments" => array(
                array(
                    "fallback" => "Embedded Message",
                    "color" => "#36a64f", // Hex color code
//                    "pretext" => "Optional Pretext",
//                    "author_name" => "Author Name",
//                    "author_link" => "https://example.com",
//                    "author_icon" => "https://example.com/author.png",
                    "title" => $params["from_email"],
                    "title_link" => "https://app.salesmix.com/inbox?filter[from]=".$params["from_email"],
                    "text" => strip_tags($params["reply_msg"]),
                    "footer" => "Replied at",
//                    "footer_icon" => "https://example.com/footer.png",
                    "ts" => time()
                )
            )
        );

        // Convert payload to JSON
        $jsonPayload = json_encode($payload);

        // Set headers
        $headers = array(
            "Content-Type: application/json",
        );

        // Initialize cURL
        $ch = curl_init();

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, $webhookUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute cURL request
        $response = curl_exec($ch);

        // Check for errors
        if ($response === false) {
            echo "Error sending message: " . curl_error($ch);
        }

        // Close cURL
        curl_close($ch);
//        pp($payload);

        // Output the response
//        echo $response;
    }
}

