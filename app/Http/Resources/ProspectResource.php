<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProspectResource extends JsonResource {
    public function toArray($request): array {
//        return parent::toArray($request);
        $result = (object)$this['_source'];
//        pp($result);
        $customVariables = [];
        if (isset($result->custom_variables)) {
            $cVs = json_decode($result->custom_variables, TRUE);
//            pp($cVs);
            if (is_array($cVs) && count($cVs) > 0) {
                foreach ($cVs as $k => $v) {
                    if(!empty($v)){
                        if(is_array($v)){
                           $v = json_encode($v);
                        }
                        if(!preg_match('/[A-Z]/', $v) && !in_array(strtolower($k),['email','website','linkedin','domain','url'])){
                            $v = ucwords($v);
                        }
                        $customVariables[$k] = $v;
                    }
                }
            }
        }
        $customVariablesOrigin = $customVariables;
        foreach (CUSTOM_VARIABLE as $v) {
            $customVariables[$v] = isset($result->$v) ? ucfirst($result->$v) : '';
            if(in_array($v,['email','website','linkedin','domain'])){
                $customVariables[$v] = strtolower($customVariables[$v]);
            }
        }
        $name = '';
//
        if (isset($result->first_name) && !empty($result->first_name)) {
            $name = ucfirst($result->first_name);
        }
        if (isset($result->last_name) && !empty($result->last_name)) {
            $name = $name . ' ' . ucfirst($result->last_name);
        }
        $tags = [];
        if (isset($result->tags) && !empty($result->tags)) {
            $tags = explode(',', $result->tags);
        }
        $linkedIn = ''; $linkedin_username = $result->linkedin ?? '';
        if(isset($result->linkedin) && !empty($result->linkedin)){
            if(str_contains($result->linkedin , 'www.linkedin.com')){
                $linkedIn = $result->linkedin;
                $linkedin_username = str_replace('https://www.linkedin.com/in/', "", $linkedIn);
            }else{
                $linkedIn = 'https://www.linkedin.com/in/'.$result->linkedin;
            }
        }
//        $customVariables['name'] = $name;
        return [
            'id'                      => $this['_id'],
            'name'                    => trim($name),
            'email'                   => $result->email ?? '',
            'first_name'              => isset($result->first_name) ? ucfirst($result->first_name) : '',
            'last_name'               => isset($result->last_name) ? ucfirst($result->last_name) : '',
            'list_id'                 => $result->list_id ?? '',
            'phone'                   => $result->phone ?? '',
            'workspace_id'            => $result->workspace_id ?? '',
            'company_id'              => $result->company_id ?? '',
            'company_user_id'         => $result->company_user_id ?? '',
            'website'                 => $result->website ?? '',
            'company'                 => isset($result->company) ? ucfirst($result->company) : '',
            'position'                => isset($result->position) ? ucfirst($result->position) : '',
            'personalized_line'       => $result->personalized_line ?? '',
            'linkedin'                => $linkedIn,
            'linkedin_username'                => $linkedin_username,
            'deal_value'              => $result->deal_value ?? DEFAULT_DEAL_VALUE,
            'deal_status'             => $result->deal_status ?? DEFAULT_DEAL_STATUS,
            'graveyard'               => $result->graveyard ?? 0,
            'power_calling'           => $result->power_calling ?? 0,
            'is_deal_positive'        => $result->is_deal_positive ?? 0,
            'user_id'                 => $result->user_id ?? '',
            'tags'                    => $tags ?? [],
            "call_note"               => $result->call_note ?? [],
            'created_at'              => timeFormat($result->created_at),
//            'last_activity_date'    => $result->last_activity_date,
            'last_activity_datetime'  => isset($result->last_activity_datetime) ? timeFormat($result->last_activity_datetime,auth()->user()->timezone,'d M, h:i a') : '',
            'custom_variables_origin' => $customVariablesOrigin,//isset($result->custom_variables) && !empty($result->custom_variables) ? json_decode($result->custom_variables) : [],
            'custom_variables'        => $customVariables //isset($result->custom_variables) && !empty($result->custom_variables) ? json_decode($result->custom_variables) : [],
        ];
    }
}
