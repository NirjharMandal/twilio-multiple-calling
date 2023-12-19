<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SequenceLogResource extends JsonResource {
    public function toArray($request): array {
        $result = (object)$this['_source'];

        $timezone = $result->timezone ?? auth()->user()->timezone;

        return [
            "id"                       => $this['_id'],
            "email"                    => $result->prospect_email ?? "",
            "prospect_id"              => $result->prospect_id ?? "",
            "prospect_mapping_id"      => $result->prospect_mapping_id ?? "",
            "sender_email"             => $result->sender_email ?? "",
            "email_provider_id"        => $result->email_provider_id ?? "",
            "sequence_id"              => $result->sequence_id ?? "",
            "sequence"                 => $result->sequence ?? 0,
            "followup_type"            => $result->followup_type ?? "",
            "send_start_time"          => isset($result->send_start_time) ? timeFormat($result->send_start_time , $timezone) : "",
            "message_id"               => $result->message_id ?? "",
            "sender_to_receiver_error" => $result->sender_to_receiver_error ?? "",
            "receiver_to_sender_error" => $result->receiver_to_sender_error ?? "",
            "created_at"               => isset($result->created_at) ? timeFormat($result->created_at) : "",
            "updated_at"               => isset($result->updated_at) ? timeFormat($result->updated_at) : "",
        ];
    }
}
