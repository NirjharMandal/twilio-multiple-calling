<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource {
    public function toArray($request): array {
        $result = (object)$this['_source'];
        $sub = $result->subject ?? '';
        if ($result->followup_type === 'call') {
            $sub = 'Schedule Call';
        }
//        if ($result->followup_type === 'linkedin') {
//            $sub = 'LinkedIn message';
//        }
        $timezone = auth()->user()->timezone;
        if (!isset($timezone)) {
            $timezone = 'UTC';
        }
        $msg = [
            'id'                 => $this['_id'],
            "sequence"           => $result->sequence ?? "",
            "enable_thread"      => $result->enable_thread ?? "",
            "followup_condition" => $result->followup_condition ?? "",
            "subject"            => $sub,
            "sequence_id"        => $result->sequence_id ?? "",
            "workspace_id"       => $result->workspace_id ?? "",
            "wait_days"          => $result->wait_days ?? "",
            "message"            => $result->message ?? "",
            "followup_type"      => $result->followup_type ?? "",
            "webhook_url"        => $result->webhook_url ?? '',
            "due_count"        => $result->due_count ?? 0,
            "completed_count"  => $result->completed_count ?? 0,
            "updated_at"  => $result->updated_at ?? "",
            "created_at"  => $result->created_at ?? "",
            "starting_at" => isset($result->starting_at) ? timeFormat($result->starting_at) : '',
        ];
        $msg['total_task'] = $msg['due_count'] + $msg['completed_count'];
        return $msg;
    }
}
