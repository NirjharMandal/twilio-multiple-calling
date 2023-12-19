<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TagResource extends JsonResource
{
    public function toArray($request): array
    {
        $result = (object)$this['_source'];
         return [
                "id"  => $this['_id'],
                'name' => isset($result->name) ? ucwords($result->name) : '',
                'workspace_id' => $result->workspace_id ?? '',
                'user_id' => $result->user_id ?? '',
                'color' => $result->color ?? '#000000',
                'keywords' => $result->keywords ?? '',
                'created_at' => isset($result->created_at) ? timeFormat($result->created_at) : "",
                'updated_at' => isset($result->updated_at) ? timeFormat($result->updated_at) : "",
                'quantity' => $result->quantity ?? 0,
                'order' => $result->order ?? -1,
         ];
    }
}
