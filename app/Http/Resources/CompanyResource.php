<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource {
    public function toArray($request): array {
        $result = (object)$this['_source'];
        return [
            'id'              => $this['_id'],
            'name'            => isset($result->name) ? ucfirst($result->name) : "",
            'domain'          => $result->domain ?? "",
            'workspace_id'    => $result->workspace_id ?? "",
            'logo'            => $result->logo ?? "",
            'created_at'      => $result->created_at ?? "",
            'deal_status'     => $result->deal_status ?? "",
            'deal_value'      => $result->deal_value ?? "",
            'description'     => $result->description ?? "",
            'total_prospects' => $result->total_prospects ?? 0,
            'user_id'         => $result->user_id ?? "",
            'user_email'      => $result->user_email ?? "",
            'website'         => $result->website ?? "",
            'location'        => $result->location ?? "",
            'industry'        => $result->industry ?? "",
            'company_size'    => $result->company_size ?? "",
            'founded'         => $result->founded ?? "",
            'notes'           => $result->notes ?? [],
            'custom_variables'   => isset($result->custom_variables) ? json_decode($result->custom_variables,true) : [],
            'is_free'         => $result->is_free ?? 0,
            'last_activity_datetime'  => isset($result->last_activity_datetime) ? timeFormat($result->last_activity_datetime,auth()->user()->timezone,'d M, h:i a') : '',
        ];
    }
}
