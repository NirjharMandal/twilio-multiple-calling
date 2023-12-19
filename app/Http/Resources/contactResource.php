<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class contactResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */

    protected $unlockLogs;

    public function unlockLogs($value){
        $this->unlockLogs = $value;
        return $this;
    }

    public function toArray($request)
    {
        // return parent::toArray($request);
        $id = $this['_id'];
        $data = (object) $this['_source'];
        $image = 'default.png';
        if (isset($data->domain)) {
            $imageName = $data->domain. '.png';
            if (file_exists('/var/www/email_scraper_data/icons1/' . $imageName)) {
                $image = $imageName;
            }
        }
        $demo_email = $email = $demo_mobile_phone = $mobile_phone = '';
        if(isset($data->email)){
            $demo_email = $email = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $data->email); //mb_convert_encoding($data->email, 'UTF-8', 'UTF-8');
            // $demo_email = $data->email;
            // $email = $data->email;
        }
        if(isset($data->mobile_phone)){
            $demo_mobile_phone = $data->mobile_phone;
            $mobile_phone = $data->mobile_phone;
        }

        if(isset($this->unlockLogs) > 0){
            if(isset($id) && !in_array($id, $this->unlockLogs)){
                if(isset($data->email)){
                    $email = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $data->email);//mb_convert_encoding($data->email, 'UTF-8', 'UTF-8');
                    $demo_email = substr($email,0,4);
                    $email = 'locked';
                }
                if(isset($data->mobile_phone)){
                    $demo_mobile_phone = substr($data->mobile_phone,0,4);
                    $mobile_phone = 'locked';
                }
            }
        }

        return [
            '_id' => isset($id) ? $id: '',
            '_source' => [
                "rowId"                         => isset($id) ? $id: '',
                "id"                            => $id,
                "full_name"                     => isset($data->full_name) ? $data->full_name: '',
                "first_name"                    => isset($data->first_name) ? $data->first_name: '',
                "last_name"                     => isset($data->last_name) ? $data->last_name: '',
                "linkedin_url"                  => isset($data->linkedin_url) ? $data->linkedin_url: '',
                "linkedin_username"             => isset($data->linkedin_username) ? $data->linkedin_username: '',
                "facebook_url"                  => isset($data->facebook_url) ? $data->facebook_url: '',
                "twitter_url"                   => isset($data->twitter_url) ? $data->twitter_url: '',
                "demo_email"                    => $demo_email,
                "email"                         => strtolower($email),
                "demo_mobile_phone"             => $demo_mobile_phone,
                "mobile_phone"                  => $mobile_phone,
                "industry"                      => isset($data->industry) ? $data->industry: '',
                "title"                         => isset($data->title) ? $data->title: '',
                "company_logo"                  => isset($data->company_logo) ? $data->company_logo: '/images/ip.png',
                "company_name"                  => isset($data->company_name) ? $data->company_name: '',
                "domain"                        => isset($data->domain) ? $data->domain: '',
                "website"                       => isset($data->website) ? $data->website: '',
                "employee_count"                => isset($data->employee_count) ? $data->employee_count: '',
                "company_linkedin_url"          => isset($data->company_linkedin_url) ? $data->company_linkedin_url: '',
                "company_linkedin_username"     => isset($data->company_linkedin_username) ? $data->company_linkedin_username: '',
                "company_location"              => isset($data->company_location) ? $data->company_location: '',
                "company_city"                  => isset($data->company_city) ? $data->company_city: '',
                "company_state"                 => isset($data->company_state) ? $data->company_state: '',
                "company_country"               => isset($data->company_country) ? $data->company_country: '',
                "company_address"               => isset($data->company_address) ? $data->company_address: '',
                "location"                      => isset($data->location) ? $data->location: '',
                "city"                          => isset($data->city) ? $data->city: '',
                "state"                         => isset($data->state) ? $data->state: '',
                "country"                       => isset($data->country) ? $data->country: '',
                "zipcode"                       => isset($data->zipcode) ? $data->zipcode: '',
                "keywords"                      => isset($data->keywords) ? $data->keywords: '',
                "technologies"                  => isset($data->technologies) ? $data->technologies: '',
                "github_url"                    => isset($data->github_url) ? $data->github_url: '',
                "address"                       => isset($data->address) ? $data->address: '',
                "company_zipcode"               => isset($data->company_zipcode) ? $data->company_zipcode: '',
                "gender"                        => isset($data->gender) ? $data->gender: '',
                "birth_year"                    => isset($data->birth_year) ? $data->birth_year: '',
                "company_founded"               => isset($data->company_founded) ? $data->company_founded: '',
                "title_role"                    => isset($data->title_role) ? $data->title_role: '',
                "company_industry"              => isset($data->company_industry) ? $data->company_industry: '',
                "linkedin_connections"          => isset($data->linkedin_connections) ? $data->linkedin_connections: '',
                "inferred_salary"               => isset($data->inferred_salary) ? $data->inferred_salary: '',
                "inferred_years_experience"     => isset($data->inferred_years_experience) ? $data->inferred_years_experience: '',
                "summary"                       => isset($data->summary) ? $data->summary: '',
                "job_summary"                   => isset($data->job_summary) ? $data->job_summary: '',
                "company_keywords"              => isset($data->company_keywords) ? $data->company_keywords: '',
                "inferred_salary_s"             => isset($data->inferred_salary_s) ? $data->inferred_salary_s: '',
                "inferred_salary_e"             => isset($data->inferred_salary_e) ? $data->inferred_salary_e: '',
                "employee_count_s"              => isset($data->employee_count_s) ? $data->employee_count_s: '',
                "employee_count_e"              => isset($data->employee_count_e) ? $data->employee_count_e: '',
                "image"                         => $image,
                "isChecked"                     => false,
            ]
        ];
        // return [
        //     'rowId'                         => isset($id) ? $id: '',
        //     "id"                            => isset($data->id) ? $data->id: '',
        //     "gg_unique_id"                  => isset($data->gg_unique_id) ? $data->gg_unique_id: '',
        //     "gg_unique_prospect_account_id" => isset($data->gg_unique_prospect_account_id) ? $data->gg_unique_prospect_account_id: '',
        //     "completeness_score"            => isset($data->completeness_score) ? $data->completeness_score: '',
        //     "full_name"                     => isset($data->full_name) ? $data->full_name: '',
        //     "first_name"                    => isset($data->first_name) ? $data->first_name: '',
        //     "last_name"                     => isset($data->last_name) ? $data->last_name: '',
        //     "linkedin_url"                  => isset($data->linkedin_url) ? $data->linkedin_url: '',
        //     "linkedin_username"             => isset($data->linkedin_username) ? $data->linkedin_username: '',
        //     "facebook_url"                  => isset($data->facebook_url) ? $data->facebook_url: '',
        //     "twitter_url"                   => isset($data->twitter_url) ? $data->twitter_url: '',
        //     "email"                         => isset($data->email) ? $data->email: '',
        //     "mobile_phone"                  => isset($data->mobile_phone) ? $data->mobile_phone: '',
        //     "industry"                      => isset($data->industry) ? $data->industry: '',
        //     "title"                         => isset($data->title) ? $data->title: '',
        //     "company_name"                  => isset($data->company_name) ? $data->company_name: '',
        //     "domain"                        => isset($data->domain) ? $data->domain: '',
        //     "website"                       => isset($data->website) ? $data->website: '',
        //     "employee_count"                => isset($data->employee_count) ? $data->employee_count: '',
        //     "company_linkedin_url"          => isset($data->company_linkedin_url) ? $data->company_linkedin_url: '',
        //     "company_linkedin_username"     => isset($data->company_linkedin_username) ? $data->company_linkedin_username: '',
        //     "company_location"              => isset($data->company_location) ? $data->company_location: '',
        //     "company_city"                  => isset($data->company_city) ? $data->company_city: '',
        //     "company_state"                 => isset($data->company_state) ? $data->company_state: '',
        //     "company_country"               => isset($data->company_country) ? $data->company_country: '',
        //     "company_address"               => isset($data->company_address) ? $data->company_address: '',
        //     "location"                      => isset($data->location) ? $data->location: '',
        //     "city"                          => isset($data->city) ? $data->city: '',
        //     "state"                         => isset($data->state) ? $data->state: '',
        //     "country"                       => isset($data->country) ? $data->country: '',
        //     "zipcode"                       => isset($data->zipcode) ? $data->zipcode: '',
        //     "keywords"                      => isset($data->keywords) ? $data->keywords: '',
        //     "technologies"                  => isset($data->technologies) ? $data->technologies: '',
        //     "split_keywords"                => isset($data->split_keywords) ? $data->split_keywords: '',
        //     "split_technologies"            => isset($data->split_technologies) ? $data->split_technologies: '',
        //     "pdl_id"                        => isset($data->pdl_id) ? $data->pdl_id: '',
        //     "github_url"                    => isset($data->github_url) ? $data->github_url: '',
        //     "address"                       => isset($data->address) ? $data->address: '',
        //     "company_zipcode"               => isset($data->company_zipcode) ? $data->company_zipcode: '',
        //     "gender"                        => isset($data->gender) ? $data->gender: '',
        //     "birth_year"                    => isset($data->birth_year) ? $data->birth_year: '',
        //     "company_founded"               => isset($data->company_founded) ? $data->company_founded: '',
        //     "title_levels"                  => isset($data->title_levels) ? $data->title_levels: '',
        //     "split_title_levels"            => isset($data->split_title_levels) ? $data->split_title_levels: '',
        //     "title_role"                    => isset($data->title_role) ? $data->title_role: '',
        //     "company_industry"              => isset($data->company_industry) ? $data->company_industry: '',
        //     "company_location_geo"          => isset($data->company_location_geo) ? $data->company_location_geo: '',
        //     "location_geo"                  => isset($data->location_geo) ? $data->location_geo: '',
        //     // "phone_numbers"                 => isset($data->phone_numbers) ? $data->phone_numbers: '',
        //     // "emails"                        => isset($data->emails) ? $data->emails: '',
        //     "dataset_version"               => isset($data->dataset_version) ? $data->dataset_version: '',
        //     "verified_email"                => isset($data->verified_email) ? $data->verified_email: '',
        //     "linkedin_connections"          => isset($data->linkedin_connections) ? $data->linkedin_connections: '',
        //     "inferred_salary"               => isset($data->inferred_salary) ? $data->inferred_salary: '',
        //     "inferred_years_experience"     => isset($data->inferred_years_experience) ? $data->inferred_years_experience: '',
        //     "summary"                       => isset($data->summary) ? $data->summary: '',
        //     "job_summary"                   => isset($data->job_summary) ? $data->job_summary: '',
        //     "company_keywords"              => isset($data->company_keywords) ? $data->company_keywords: '',
        //     "inferred_salary_s"             => isset($data->inferred_salary_s) ? $data->inferred_salary_s: '',
        //     "inferred_salary_e"             => isset($data->inferred_salary_e) ? $data->inferred_salary_e: '',
        //     "employee_count_s"              => isset($data->employee_count_s) ? $data->employee_count_s: '',
        //     "employee_count_e"              => isset($data->employee_count_e) ? $data->employee_count_e: '',
        //     "rowId"                         => isset($id) ? $id: '',
        //     // "email1"                        => isset($data->email1) ? $data->email1: '',
        //     // "emails1"                       => isset($data->emails1) ? $data->emails1: '',
        //     "image"                         => $image,
        //     // "isChecked"                  => isset($data->isChecked) ? $data->isChecked : '',
        //     "isChecked" => false,
        // ];
    }
}
