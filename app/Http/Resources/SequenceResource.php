<?php

namespace App\Http\Resources;

use App\Http\Services\Sequence\EmailProviderService;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use JsonSerializable;

class SequenceResource extends ResourceCollection{
    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     *
     * @return array|Arrayable|JsonSerializable
     */
    public function toArray($request): array|JsonSerializable|Arrayable{
        $result = (object)$this['_source'];
        $email_provider = '';
        if(isset($result->email_provider_id) && !empty($result->email_provider_id)){
            $emails = explode('_', $result->email_provider_id) ?? [];
            $email_provider = $emails[count($emails) - 1] ?? 'unknown';
        }
        $email_provider_id = [];
        if(isset($result->email_provider_id) && !empty($result->email_provider_id)){
            $email_provider_id = explode(',', $result->email_provider_id) ?? [];
        }
        $subsequence_count = 0;
        $subsequences = [];
        if(isset($result->subsequences) && !empty($result->subsequences)){
            $subsequence_count = count($result->subsequences);
            $subsequences = $result->subsequences;
        }

        return ['id'                => $this['_id'],
                '_id'               => $this['_id'],
                'name'              => $result->name,
                'sequence_type'     => $result->sequence_type,
                'total_steps'       => $result->total_steps,
                'total_prospects'   => $result->total_prospects,
                'is_subsequence'    => $result->is_subsequence ?? 0,
                'parent_sequence_id'    => $result->parent_sequence_id ?? '',
                'status'            => $result->status,
                'subsequence_count' => $subsequence_count,
                'subsequences'      => $subsequences,
                'stage_steps'       => $result->stage_steps ?? 0,
                'stage_prospects'   => $result->stage_prospects ?? 0,
                'stage_schedule'    => $result->stage_schedule ?? 0,
                'stage_settings'    => $result->stage_settings ?? 0,
                'email_provider_id' => $email_provider_id,
                'timezone'          => $result->timezone ?? 'UTC',
                'webhook_url'       => $result->webhook_url ?? '',
                'is_workflow'       => $result->is_workflow ?? 0,
                'email_provider'    => $email_provider,
                'user_id'           => $result->user_id ?? '',
                'subsequence_tag_id'           => $result->subsequence_tag_id ?? '',
        ];
    }
}
