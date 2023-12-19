<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AnalyticResource extends JsonResource {
    public function toArray($request): array {
        $result = (object)$this['_source'];
        $name = "";
        if (isset($result->first_name) && !empty($result->first_name)) {
            $name = ucfirst($result->first_name);
        }
        if (isset($result->last_name) && !empty($result->last_name)) {
            $name = $name . ' ' . ucfirst($result->last_name);
        }
        $timezone = $result->timezone ?? auth()->user()->timezone;

        return [
            "id"                  => $this['_id'],
            "email"               => $result->prospect_email ?? "",
            'name'                => $name,
            "email_provider_id"   => $result->email_provider_id ?? "",
            "prospect_id"         => $result->prospect_id ?? "",
            "prospect_mapping_id" => $result->prospect_mapping_id ?? "",
            "company_user_id"     => $result->company_user_id ?? "",
            "workspace_id"        => $result->workspace_id ?? "",
            "sequence_id"         => $result->sequence_id ?? "",
            "sequence"            => $result->sequence ?? 0,
            "followup_type"       => $result->followup_type ?? "",
            "mail_id"             => $result->mail_id ?? "",
            "sent"                => $result->sent ?? 0,
            "sent_at"             => isset($result->sent_at) ? timeFormat($result->sent_at,$timezone) : "",
            "created_at"          => isset($result->created_at) ? timeFormat($result->created_at,$timezone) : "",
            "updated_at"          => isset($result->updated_at) ? timeFormat($result->updated_at,$timezone) : "",
            "message_id"          => $result->message_id ?? "",
            "company_id"          => $result->company_id ?? "",
            "last_call_record"    => $result->last_call_record ?? "",
            "last_call_duration"  => $result->last_call_duration ?? "",
            "last_call_occurred"  => isset($result->last_call_occurred) ? timeFormat($result->last_call_occurred,$timezone) : "",
            "automatic_sending"              => $result->automatic_sending ?? 0,
            "opened_times"              => $result->opened_times ?? 0,
            "opened"              => $result->opened ?? 0,
            "clicked"             => $result->clicked ?? 0,
            "replied"             => $result->replied ?? 0,
            "bounced"             => $result->bounced ?? 0,
            "failed"             => $result->failed ?? 0,
            "bounced_msg"         => $result->bounced_msg ?? '',
            "unsubscribed"        => $result->unsubscribed ?? 0,
            "status"              => $result->status ?? 'due',
            "task_notes"          => $result->task_notes ?? [],
            "failed_at"           => isset($result->failed_at) ? timeFormat($result->failed_at,$timezone) : "",
            "opened_at"           => isset($result->opened_at) ? timeFormat($result->opened_at,$timezone) : "",
            "clicked_at"          => isset($result->clicked_at) ? timeFormat($result->clicked_at,$timezone) : "",
            "replied_at"          => isset($result->replied_at) ? timeFormat($result->replied_at,$timezone) : "",
            "bounced_at"          => isset($result->bounced_at) ? timeFormat($result->bounced_at,$timezone) : "",
            "unsubscribed_at"          => isset($result->unsubscribed_at) ? timeFormat($result->unsubscribed_at,$timezone) : "",
//            'prospect_deleted'    => $analytic->prospect_deleted ?? 0,
            'due_at'              => isset($result->due_at) ? timeFormat($result->due_at,$timezone) : "",
            'completed_at'        => isset($result->completed_at) ? timeFormat($result->completed_at,$timezone) : "",
            'deal_value'          => $result->deal_value ?? DEFAULT_DEAL_VALUE,
            'deal_status'         => $result->deal_status ?? DEFAULT_DEAL_STATUS,
            'failed_reason'         => $result->failed_reason ?? '',
        ];
    }
}
