<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource {
    public function toArray($request): array {
        $result = (object)$this['_source'];
        return [
            "id"                 => $this['_id'],
            "active_workspace"   => $result->active_workspace ?? "",
            "avatar"             => $result->avatar ?? "",
            "business_area"      => $result->business_area ?? "",
            "business_model"     => $result->business_model ?? "",
            "company"            => $result->company ?? "",
            "countryCode"        => $result->countryCode ?? "",
            "created_at"         => isset($result->created_at) ? date("d M Y", $result->created_at) : '',
            "cus_id"             => $result->cus_id ?? "",
            "customer_id"        => $result->customer_id ?? "",
            "email"              => $result->email ?? "",
            "email_verified_at"  => $result->email_verified_at ?? "",
            "email_verify_token" => $result->email_verify_token ?? "",
            "first_name"         => $result->first_name ?? "",
            "hear_about_us"      => $result->hear_about_us ?? "",
            "ip"                 => $result->ip ?? "",
            "landing_page_url"   => $result->landing_page_url ?? "",
            'last_login_at'      => isset($result->last_login_at) ? date("d M, h:ia", $result->last_login_at) : '',
            "last_name"          => $result->last_name ?? "",
            "leads_limit"        => $result->leads_limit ?? 0,
            "leads_limit_used"   => $result->leads_limit_used ?? 0,
            "leads_balance"      => $result->leads_limit - $result->leads_limit_used,

            "name"                      => $result->name ?? "",
            //            "password"                  => $result->password ?? "",
            "people_use_qty"            => $result->people_use_qty ?? "",
            "phone"                     => $result->phone ?? "",
            "phoneCode"                 => $result->phoneCode ?? "",
            "plan_type"                 => $result->plan_type ?? "",
            "plan_name"                 => $result->plan_name ?? "",
            "price_id"                  => $result->price_id ?? "",
            "profile_pic"               => $result->profile_pic ?? "",
            "registerFrom"              => $result->registerFrom ?? "",
            "registration_step"         => $result->registration_step ?? "",
            "remember_token"            => $result->remember_token ?? "",
            "reset_password_otp"        => $result->reset_password_otp ?? "",
            "reset_password_otp_expire" => $result->reset_password_otp_expire ?? "",
            "status"                    => $result->status ?? "",
            "subscription_id"           => $result->subscription_id ?? "",
            "timezone"                  => $result->timezone ?? "",
            "trial_end_at"              => $result->trial_end_at ?? "",
            "trial_ended"               => $result->trial_ended ?? "",
            "trial_ends_at"             => $result->trial_ends_at ?? "",
            "update_at"                 => $result->update_at ?? "",
            "updated_at"                => $result->updated_at ?? "",
            "user_type"                 => $result->user_type ?? "",
            "utm_campaign"              => $result->utm_campaign ?? "",
            "utm_medium"                => $result->utm_medium ?? "",
            "utm_source"                => $result->utm_source ?? "",
            "verification_limit"        => $result->verification_limit ?? 0,
            "verification_limit_used"   => $result->verification_limit_used ?? 0,
            "verification_balance"      => $result->verification_limit - $result->verification_limit_used,
            "website"                   => $result->website ?? "",
        ];
    }
}
