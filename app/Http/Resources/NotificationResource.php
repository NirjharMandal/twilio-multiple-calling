<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource {
    public function toArray($request): array {
        $result = (object)$this['_source'];
        $timezone = auth()->user()->timezone;
        if (!isset($timezone)) {
            $timezone = 'UTC';
        }
        return [
            'id'          => $this['_id'],
            'user_id'     => $result->user_id ?? '',
            'body'        => $result->body ?? '',
            'link'        => $result->link ?? '',
            'type'        => $result->type ?? 'Default',
            'read'        => $result->read ?? 0,
            'updated_at'  => $result->updated_at ?? '',
            'created_at'  => $result->created_at ?? '',
            'format_time' => facebook_time_ago($result->created_at, $timezone)
        ];
    }
}
