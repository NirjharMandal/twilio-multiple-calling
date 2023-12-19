<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request) {
//        return parent::toArray($request);
        $result = (object)$this['_source'];
        return [
            'id'                    => $this['_id'],
            'user_id'               => $result->user_id ?? '',
            'name'                  => isset($result->name) ? ucwords($result->name) : '',
            'description'           => isset($result->description) ? strip_tags($result->description) : '',
            'members'               => $result->members ?? 0,
            'email_sending_limit'   => $result->email_sending_limit ?? 0,
            'contacts_upload_limit' => $result->contacts_upload_limit ?? 0,
            'contacts_upload_used'  => $result->contacts_upload_used ?? 0,
            'email_sending_used'    => $result->email_sending_used ?? 0,
            'plan_name'             => $result->plan_name ?? "Free",
            'created_at'             => isset($result->created_at) ? date("d M Y", $result->created_at) : ''
        ];
    }
}
