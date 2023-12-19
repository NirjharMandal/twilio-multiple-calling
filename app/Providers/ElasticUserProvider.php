<?php

namespace App\Providers;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Resources\userResource;
use Elasticsearch\Common\Exceptions\Missing404Exception;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Hashing\Hasher;
use App\Models\ElasticUser;
use Auth;
use Illuminate\Support\Facades\File;


class ElasticUserProvider implements UserProvider {

    protected $model;

    public function __construct() {
        $this->model = ElasticUser::class;
    }

    /**
     * @param $credentials
     *
     * @return Authenticatable
     */
    public function connectElasticUser($credentials) {
        $userModel = [];
        $userModel['email'] = 'N/A';
        $userModel['password'] = 'N/A';
        $userModel['remember_token'] = NULL;

        if (session()->has('SocialUserId') || session()->has('SPYUSERLOGINID') || (isset($_COOKIE[REMEMBERME]) && !empty($_COOKIE[REMEMBERME]))) {
            if (isset($credentials['_id']) && !empty($credentials['_id'])) {
                try {
                    $result = MDB()->get([
                        'index' => TBL_USER,
                        'id'    => $credentials['_id']
                    ]);
                    $userData = $result['_source'];
                    $userData['_id'] = $result['_id'];
                    $userData = $this->creditSetup($userData);
                    $userModel = $userData;
                    return new $this->model($userData);
                } catch (Missing404Exception $e) {
                    (new AuthController())->logout();
                }
            }
        }

        if (isset($credentials['_id']) && !empty($credentials['_id']) && isset($credentials['password']) && !empty($credentials['password'])) {
            $password = trim($credentials['password']);
            try {
                $result = MDB()->get([
                    'index' => 'users',
                    'id'    => $credentials['_id']
                ]);
                $userData = $result['_source'];
                $userData['_id'] = $result['_id'];
//                unset($userData['id']);
                if ($userData['password'] == $credentials['password']) {
                    $userData = $this->creditSetup($userData);
                    $userModel = $userData;
                }
            } catch (Missing404Exception $e) {
                (new AuthController())->logout();
            }

        } else if (isset($credentials['email']) && !empty($credentials['email']) && isset($credentials['password']) && !empty($credentials['password'])) {
            $email = trim(strtolower($credentials['email']));
            $getUserData = MDB()->search([
                'index' => 'users',
                'body'  => [
                    'query' => [
                        'match' => [
                            'email.keyword' => $email
                        ]
                    ]
                ]
            ]);
            if (isset($getUserData['hits']) && isset($getUserData['hits']['hits']) && count($getUserData['hits']['hits']) == 1) {
                $userData = $getUserData['hits']['hits'][0]['_source'];
                $userData['_id'] = $getUserData['hits']['hits'][0]['_id'];
//                unset($userData['id']);
                $userData = $this->creditSetup($userData);
                $userModel = $userData;
            }
        }
        // dd($userModel);
        return new $this->model($userModel);
    }

    /**
     * Retrieve a user by their unique identifier.
     *
     * @param mixed $identifier
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveById($identifier) {
//        dd($identifier);
        if (session()->has('SPYUSERLOGINID') || (isset($_COOKIE[REMEMBERME]) && !empty($_COOKIE[REMEMBERME]))) {
            return $this->connectElasticUser(['_id' => $identifier['_id']]);
        }
        return $this->connectElasticUser(['_id' => $identifier['_id'], 'password' => $identifier['password']]);
    }

    /**
     * Retrieve a user by their unique identifier and "remember me" token.
     *
     * @param mixed $identifier
     * @param string $token
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByToken($identifier, $token) {
//        dd($identifier);
    }

    /**
     * Update the "remember me" token for the given user in storage.
     *
     * @param \Illuminate\Contracts\Auth\Authenticatable $user
     * @param string $token
     */
    public function updateRememberToken(Authenticatable $user, $token) {
    }

    /**
     * Retrieve a user by the given credentials.
     *
     * @param array $credentials
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByCredentials(array $credentials) {
        return $this->connectElasticUser($credentials);
    }

    /**
     * Validate a user against the given credentials.
     *
     * @param \Illuminate\Contracts\Auth\Authenticatable $user
     * @param array $credentials
     *
     * @return bool
     */
    public function validateCredentials(Authenticatable $user, array $credentials) {
        return \Hash::check($credentials['password'], $user->getAuthPassword());
    }

    /**
     * @param $userData
     *
     * @return array
     */
    public function creditSetup($userData): array {
        $ws['_source'] = [];
        $ws_deals = [];
        try {
            $ws = MDB()->get([
                'index' => TBL_WORKSPACE,
                'id'    => $userData['active_workspace']
            ]);
            $ws_deals = isset($ws['_source']['deal_status']) && !empty($ws['_source']['deal_status']) ? $ws['_source']['deal_status'] : [];
        } catch (\Throwable $th) {
        }
        $wsInfo = [
            'plan_name'                          => $ws['_source']['plan_name'] ?? '',
            'subscription_type'                  => $ws['_source']['subscription_type'] ?? 'free',
            "email_sending_limit"                => $ws['_source']['email_sending_limit'] ?? 0,
            "email_sending_used"                 => $ws['_source']['email_sending_used'] ?? 0,
            "contacts_upload_limit"              => $ws['_source']['contacts_upload_limit'] ?? 0,
            "contacts_upload_used"               => $ws['_source']['contacts_upload_used'] ?? 0,
            "verification_limit"                 => $userData['verification_limit'] ?? 0,
            "deal_status"                        => $ws_deals,
            "verification_limit_used"            => $userData['verification_limit_used'] ?? 0,
            "leads_limit"                        => $userData['leads_limit'] ?? 0,
            "leads_limit_used"                   => $userData['leads_limit_used'] ?? 0,
            'name'                               => $ws['_source']['name'] ?? '',
            'members'                            => $ws['_source']['members'] ?? 1,
            'owner_id'                           => $ws['_source']['user_id'] ?? '',
            'description'                        => $ws['_source']['description'] ?? '',
            'twilio_app_sid'                     => $ws['_source']['twilio_app_sid'] ?? '',
            'twilio_auth_token'                  => $ws['_source']['twilio_auth_token'] ?? '',
            'twilio_sid'                         => $ws['_source']['twilio_sid'] ?? '',
            'twilio_api_sid'                     => $ws['_source']['twilio_api_sid'] ?? '',
            'twilio_api_secret'                  => $ws['_source']['twilio_api_secret'] ?? '',
            'call_recording'                     => $ws['_source']['call_recording'] ?? 1,
            'twilio_phone_number'                => $ws['_source']['twilio_phone_number'] ?? '',
            'twilio_musking_id'                => $ws['_source']['twilio_musking_id'] ?? '',
            'member_wise_different_phone_number' => $ws['_source']['member_wise_different_phone_number'] ?? 0,
            'ai_email_prompt' => $ws['_source']['ai_email_prompt'] ?? File::get('default-settings/ai_prompt.txt'),
        ];
        $wsInfo['permissions'] = [];
        $wsInfo['user_type'] = '';
        $trial_end_at = $userData['trial_end_at'] ?? time();
        if (isset($ws['_source']['user_id']) && $ws['_source']['user_id'] != $userData['_id']) {
            try {
                $owner = MDB()->get([
                    'index' => TBL_USER,
                    'id'    => $ws['_source']['user_id']
                ])['_source'];
                $wsInfo['leads_limit'] = $owner['leads_limit'] ?? 0;
                $wsInfo['leads_limit_used'] = $owner['leads_limit_used'] ?? 0;
                $wsInfo['verification_limit'] = $owner['verification_limit'] ?? 0;
                $trial_end_at = $owner['trial_end_at'] ?? 0;
                $wsInfo['verification_limit_used'] = $owner['verification_limit_used'] ?? 0;
            } catch (\Throwable $th) {}
        }
//        if($wsInfo['subscription_type'] !== 'free'){
        try {
            $ws_user = MDB()->get([
                'index' => TBL_WORKSPACE_USER,
                'id'    => $userData['_id'] . '_' . $userData['active_workspace']
            ])['_source'];
            $wsInfo['permissions'] = $ws_user['permissions'] ?? [];
            $userType = $ws_user['user_type'] ?? '';
            if($userType === 'admin'){
                $userType = 'owner'; //because admin behave as a owner
            }
            $wsInfo['user_type'] = $userType;
            $userData['twilio_phone_number'] = isset($ws_user['twilio_number']) && !empty($ws_user['twilio_number']) ? $ws_user['twilio_number'] : $wsInfo['twilio_phone_number'] ?? '';
            $userData['twilio_musking_id'] = isset($ws_user['twilio_musking_id']) && !empty($ws_user['twilio_musking_id']) ? $ws_user['twilio_musking_id'] : $wsInfo['twilio_musking_id'] ?? '';
//            dd($ws_user,$wsInfo,$userData);

            /*if(isset($ws_user['twilio_number']) && $ws_user['twilio_number'] != ""){
                if(isset($wsInfo['member_wise_different_phone_number']) && $wsInfo['member_wise_different_phone_number'] === 1){
                    $userData['twilio_phone_number'] = $ws_user['twilio_number'] ?? '';
                    $userData['twilio_musking_id'] = $ws_user['twilio_musking_id'] ?? '';
                }
            }*/
        } catch (\Throwable $th) {}

//        }
        $userData['trial_end_at'] = $trial_end_at;
        $userData['ws'] = (object)$wsInfo;
        return $userData;
    }


}
