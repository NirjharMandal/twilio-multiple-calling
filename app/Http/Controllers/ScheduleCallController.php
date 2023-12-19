<?php

namespace App\Http\Controllers;


use App\Http\Services\ScheduleCallService;
use Illuminate\Http\Request;

class ScheduleCallController extends Controller {
    public ScheduleCallService $service;

    public function __construct(ScheduleCallService $service) {
        $this->service = $service;
    }
    public function landing() {
        return view('call');
    }
    /*******************************************************************************************/
    /*******************************************************************************************/

    public function getAccessToken(Request $request) {
        return $this->service->getAccessToken($request);
    }

    public function callRouting(Request $request, $ws_id) {
        return $this->service->callRouting($request, $ws_id);
    }

    public function callRoutingCallback(Request $request) {
        return $this->service->callRoutingCallback($request);
    }

    public function machineDetectionCallback(Request $request) {
        return $this->service->machineDetectionCallback($request);
    }

    public function ifCallNotPickedUp(Request $request) {
        return $this->service->ifCallNotPickedUp($request);
    }
}
