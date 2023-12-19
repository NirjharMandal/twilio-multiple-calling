<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InboxResource extends JsonResource {
    public function toArray($request) {
        $result = (object)$this['_source'];
        $timezone = auth()->user()->timezone;
        if (!isset($timezone)) {
            $timezone = 'UTC';
        }
        $tags = [];
        if (isset($result->tags) && !empty($result->tags)) {
            $tags = explode(',', $result->tags);
        }

        $email = $result->from_email ?? '';
        $name = $result->from_name ?? '';

        if(isset($result->sent) && $result->sent === 1){
            $email = $result->to_email ?? '';
            $name = $result->to_name ?? '';
        }

        return [
            'id'                  => $this['_id'],
            'from_email'          => $email,
            'from_name'           => $name,
            'message_id'          => $result->message_id ?? '',
            'email_provider_id'   => $result->email_provider_id ?? '',
            'workspace_id'        => $result->workspace_id ?? '',
            'sequence_id'        => $result->sequence_id ?? '',
            'subject'             => $result->subject ?? '',
            'body'                => $result->body ?? '',
            'is_warm_up_msg'      => $result->is_warm_up_msg ?? 0,
            'mail_date_timestamp' => isset($result->mail_date_timestamp) ? timeFormat($result->mail_date_timestamp,auth()->user()->timezone,'M d h:i A') : '',
            'is_stared'           => $result->is_stared ?? 0,
            'is_replied'          => $result->is_replied ?? 0,
            'is_read'             => $result->is_read ?? 0,
            'is_bounced'          => $result->is_bounced ?? 0,
            'should_alarm'          => $result->should_alarm ?? 0,
            'alarm_at'            => isset($result->alarm_at) && $result->alarm_at > 0 ? \Carbon\Carbon::parse($result->alarm_at, 'UTC')->timezone(auth()->user()->timezone)->format('M d h:i A') : 0,
            'folder_slug'         => $result->folder_slug ?? 'inbox',
            'real_folder_slug'    => $result->real_folder_slug ?? 'inbox',
            'is_marked_seen'      => $result->is_marked_seen ?? 0,
            'read_from'           => $result->read_from ?? 'inbox',
            'created_at'          => $result->created_at ?? time(),
            'updated_at'          => $result->updated_at ?? time(),
            'tags'                    => $tags ?? [],
            "sample_body"         => isset($result->body) ? mb_convert_encoding(shorter(skipTags($result->body), 50), 'UTF-8', 'UTF-8') : '',
            'format_time'         => emailTimeFormat($result->mail_date_timestamp, $timezone)
        ];
    }
}
