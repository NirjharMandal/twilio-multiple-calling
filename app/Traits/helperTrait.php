<?php

namespace App\Traits;

use App\Helper\eDB;
use App\Http\Controllers\NotificationController;
use App\Http\Services\BackgroundTaskServices;
use App\Http\Services\NotificationService;
use App\Models\Notification;
use Carbon\Carbon;
use Intervention\Image\Facades\Image;
use Illuminate\Http\Request;

trait helperTrait {

    public function errorRes($msg = "SalesMix couldn't execute this."): array { // php Error response
        return [ 'success' => FALSE, 'msg' => $msg];
    }
    public function successRes(): array { // php success response
        return [ 'success' => TRUE ];
    }

    public function sResponse($data = [], $msg = "Operation executed successfully") { //success response
        return response()->json([
            'success' => TRUE,
            'msg'     => $msg,
            'data'    => $data,
        ]);
    }

    public function eResponse($data = [], $msg = "SalesMix couldn't execute this.") {
        //error response
        return response()->json([
            'success' => FALSE,
            'msg'     => $msg,
            'data'    => $data,
        ]);
    }

    public function sResponseMeta($data = [], $meta = []) { //success response
        $data = [
            'success' => TRUE,
            'data'    => $data,
            'meta'    => $meta,
        ];
        return response()->json($data);
    }

    public function checkReCaptacha($dataIn) {
        $res = [];
        $res['status'] = 'error';
        if (isset($dataIn['g-recaptcha-response']) && !empty($dataIn['g-recaptcha-response'])) {
            $postReCaptacha = $this->post_captcha($dataIn['g-recaptcha-response']);
            if ($postReCaptacha == TRUE) {
                $res['status'] = 'success';
            } else {
                $res['msg'] = 'Please solve the re-captcha';
            }
            //$res['status'] = 'success';
        } else {
            $res['msg'] = 'Please solve the re-captcha';
        }
        return $res;
    }

    private function post_captcha($user_response) {
        $fields_string = '';
        $fields = array(
            'secret'   => RECAPTCHA_ID,
            'response' => $user_response
        );
        foreach ($fields as $key => $value) {
            $fields_string .= $key . '=' . $value . '&';
        }
        $fields_string = rtrim($fields_string, '&');

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
        curl_setopt($ch, CURLOPT_POST, count($fields));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, TRUE);
    }

    public function getUserTimeZoneTime($timestamp, $timezone = 'UTC') {
        date_default_timezone_set('UTC');
        $dt = new \DateTime();
        $dt->setTimestamp((int)$timestamp);
        $dt->setTimezone(new \DateTimeZone($timezone));
        return $dt->format('Y-m-d h:i:s a');
    }


    public function uploadImage(Request $request) {
        $dataIn = $request->all();
        $images_receive = $request->file('file');
        $image_extension = $images_receive->getClientOriginalExtension();
        $image_name = randomString('32') . '.' . $image_extension;

        $file_put_path = public_path() . '/uploads';
        $request->file('file')->move($file_put_path, $image_name);
        $retrive_image_path = $file_put_path . '/' . $image_name;


        // main image handle
        $finalName = randomString('16') . '.png';
        $intervation_put_path = $file_put_path . '/' . $finalName;

        // dd($intervation_put_path);

        Image::make($retrive_image_path)->resize(NULL, 300, function ($constraint) {
            $constraint->aspectRatio();
        })->save($intervation_put_path, 90);

        if (file_exists($retrive_image_path)) {
            @unlink($retrive_image_path);
        }
        $thePath = siteUrl() . '/public/uploads/' . $finalName;
        // dd($thePath);
        $d = moveImageToCDN($thePath);
        if (file_exists($intervation_put_path)) {
            @unlink($intervation_put_path);
        }

        $res = [];
        $res['status'] = 'success';
        $res['name'] = $finalName;


        return $res;
    }

    public function saveNotification($arr, $userId = NULL): void {
        try {
            if ($userId == NULL) {
                $userId = auth()->user()->_id;
            }
            $data = array_merge($arr, ['user_id' => $userId]);
            $nController = new NotificationService();
            $nController->createNotification($data);
            return;
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    public function pushToBackground($event, $params=[], $user=null): void{
        if(empty($user)){
            if(auth()->check()){
                $user = auth()->user();
            }else{
                keepLog($event . " [user not found] - while creating background task");
                return;
            }
        }
        if(is_array($user)){
            $user = (object) $user;
        }
        (new BackgroundTaskServices())->createTask($event, $user->_id, $user->active_workspace, $params);
    }

    public function saveDeleteLog($arr, $userId = NULL, $workspace_id = NULL): void {
        try {
            if ($userId == NULL) {
                $userId = auth()->user()->_id;
            }
            if ($workspace_id == NULL) {
                $workspace_id = auth()->user()->active_workspace;
            }
            $data = [
                'user_id'      => $userId ?? '',
                'workspace_id' => $workspace_id ?? '',
                'index'        => $arr['index'] ?? '',
                'body'         => $arr['body'] ?? '',
                'created_at'   => time(),
            ];
            $data = array_merge($arr, $data);
            QDB()->index([
                'index' => TBL_DELETED_LOG,
                'id'    => randomString(32),
                'body'  => $data
            ]);
            return;
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

    public function downloadAsCSV($name, $data = [], $sl = TRUE) {
        if (count($data) == 0) {
            return $this->eResponse([], 'no data found!');
        }
        $fileName = $name . '_' . randomString(10) . date("Y-m-d H:i:s") . '.csv';
        $savedpath = public_path() . '/downloads/' . $fileName;
        $fp = fopen($savedpath, "w");
        $arrKeys = array_keys($data[0]);
        if ($sl) {
            array_unshift($arrKeys, 'sl');
        }
        fputcsv($fp, $arrKeys);
        $i = 0;
        foreach ($data as $e) {
            $thisRow = [];
            if ($sl) {
                $thisRow[] = ++$i;
            }
            foreach ($e as $key => $item) {
                $thisRow[] = isset($e[$key]) ? $e[$key] : '';
            }
            try{fputcsv($fp, $thisRow);}catch (\Throwable $th){}
        }
        fclose($fp);
        return $this->sResponse(['file' => $fileName]);
    }

    function get_gravatar($email, $s = 80, $d = 'mp', $r = 'g', $img = FALSE, $atts = array()) {
        $url = 'https://www.gravatar.com/avatar/';
        $url .= md5(strtolower(trim($email)));
        $url .= "?s=$s&d=$d&r=$r";
        if ($img) {
            $url = '<img src="' . $url . '"';
            foreach ($atts as $key => $val) {
                $url .= ' ' . $key . '="' . $val . '"';
            }
            $url .= ' />';
        }
        return $url;
    }

    public function POST_REST($url, $postData, $headers = [], $userPwd = NULL) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        if (isset($userPwd) && !empty($userPwd)) {
            curl_setopt($ch, CURLOPT_USERPWD, $userPwd);
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);
        curl_close($ch);
        return json_decode($result);
    }

    public function GET_REST($url, $headers = [], $userPwd = NULL) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        if (isset($userPwd) && !empty($userPwd)) {
            curl_setopt($ch, CURLOPT_USERPWD, $userPwd);
        }
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $result = curl_exec($ch);
        curl_close($ch);
        return json_decode($result);
    }

}
