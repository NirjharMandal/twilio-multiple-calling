<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmailResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request) {
        $result = (object)$this['_source'];
        return [
            'id'                          => $this['_id'],
            'provider_type'               => $result->provider_type ?? '',
            'alias_enabled'               => $result->alias_enabled ?? '',
            'unread_emails'               => $result->unread_emails ?? '',
            'created_at'                  => timeFormat($result->created_at),
            'smtp_server_type'            => $result->smtp_server_type ?? '',
            'name'                        => isset($result->name) ? ucfirst($result->name) : '',
            'user_id'                    => $result->user_id ?? '',
            'reply_to'                    => $result->reply_to ?? '',
            'warm_up_filter_tag'          => $result->warm_up_filter_tag ?? '',
            #smtp Info
            'smtp'                        => $result->smtp ?? 0,
            'email'                       => $result->email ?? '',
            'smtp_host'                   => $result->smtp_host ?? '',
            'smtp_port'                   => $result->smtp_port ?? '',
            'smtp_encryption'             => $result->smtp_encryption ?? '',
            'smtp_password'               => $result->smtp_password ?? '',
            #imap Info
            'imap'                        => $result->imap ?? 0,
            'imap_username'               => $result->imap_username ?? '',
            'imap_password'               => $result->imap_password ?? '',
            'imap_host'                   => $result->imap_host ?? '',
            'imap_port'                   => $result->imap_port ?? '',
            'imap_encryption'             => $result->imap_encryption ?? '',
            #analytics
            'moved_from_spam'             => $result->moved_from_spam ?? 0,
            'moved_from_other'            => $result->moved_from_other ?? 0,
            'sent'                        => $result->sent ?? 0,
            'replied'                     => $result->replied ?? 0,
            'remaining_verification'      => $result->remaining_verifybee ?? '',
            'remaining_bounce'            => $result->remaining_bounce ?? '',
            'smtp_alert'                  => $result->smtp_alert ?? '',
            'warm_up_error'               => !empty($result->warm_up_error) ? $result->warm_up_error : 'Something went wrong please connect again.',
            'imap_error'                  => !empty($result->imap_error) ? $result->imap_error : 'Something went wrong please connect again.',
            'smtp_error'                  => !empty($result->smtp_error) ? $result->smtp_error : 'Something went wrong please connect again.',
            #settings
            'sequence_limit_notification' => $result->sequence_limit_notification ?? 0,
            'warm_up'                     => $result->warm_up ?? 0,
            'call_setup'                  => $result->call_setup ?? 'manually',
            'sequence_daily_limit'        => $result->sequence_daily_limit ?? 0,
            'sequence_today_limit'        => $result->sequence_today_limit ?? 0,
            'warmup_max_limit'            => $result->warmup_max_limit ?? 0,
            'ramp_up_value'               => $result->ramp_up_value ?? 0,
            'warmup_starting_value'       => $result->warmup_starting_value ?? 0,
            'warmup_replay_rate'          => $result->warmup_replay_rate ?? 0,
            'opt_out'                     => $result->opt_out ?? 0,
            'opt_subject'                 => $result->opt_subject ?? "PS: If you don't want to hear from me anymore, just let me know",
            "warm_up_variables" => isset($result->warm_up_variables) ? json_decode($result->warm_up_variables,true) : [],
        ];
    }
}
