<?php

use App\Http\Controllers\ScheduleCallController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::controller(ScheduleCallController::class)->group(function () {
    Route::any('call-routing/{ws_id}', 'callRouting')->name('callRouting');
    Route::get('call-routing-callback', 'callRoutingCallback')->name('callRoutingCallback');
    Route::post('machine-detection-callback', 'machineDetectionCallback')->name('machineDetectionCallback');
    Route::any('if-call-not-picked', 'ifCallNotPickedUp')->name('ifCallNotPickedUp');
    Route::post('status-callback-voice/{mode}', 'statusCallbackTwilioCall')->name('statusCallbackTwilioCall');

});
