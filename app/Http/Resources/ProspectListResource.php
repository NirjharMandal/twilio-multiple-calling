<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProspectListResource extends JsonResource {
    public function toArray($request): array {
        $result = (object)$this['_source'];
        return [
            'id'           => $this['_id'],
            'workspace_id' => $result->workspace_id ?? '',
            'sequence_id' => $result->sequence_id ?? '',
            'user_id'      => $result->user_id ?? '',
            'name'         => $result->name ?? '',
            'quantity'     => $result->quantity ?? 0,
            'is_deal_positive'     => $result->is_deal_positive ?? 0,
            'is_graveyard' => $result->is_graveyard ?? 0,
            'created_at'   => $result->created_at ?? time(),
            'updated_at'   => $result->updated_at ?? time(),
        ];
    }
}
