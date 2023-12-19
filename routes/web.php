<?php

use App\Http\Controllers\ScheduleCallController;
use Illuminate\Support\Facades\Route;

Route::controller(ScheduleCallController::class)->group(function () {
    Route::any('/', 'landing')->name('landing');
    Route::any('get-twilio-access-token', 'getAccessToken')->name('getAccessToken');
});
