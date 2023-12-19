<?php
// limit ip for dev
if(isset($_SERVER['HTTP_HOST']) && !empty($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'],"dev.") !== false){
    $allowedIps = [
        '103.112.149.98',
        '2400:adc5:436:ef00:605a:1b4c:e508:5e15',
        '192.168.106.216',
        '103.112.151.32',
        '221.132.118.98',
        '37.111.239.170',
        '2400:adc5:436:ef00:4494:2a79:55f2:d21',
        '2400:adc5:436:ef00:4c63:89c6:3bf:8f30',
        '2400:adc5:436:ef00:5c44:f65e:21fe:99a7',
        '2400:adc5:436:ef00:480b:54c1:b9be:c31c',
        '2400:adc5:436:ef00:fc7b:9d97:fa:75d'
    ];
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip_address = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip_address = $_SERVER['REMOTE_ADDR'];
    }
    $restriction = true;
    foreach ($allowedIps as $allow_ip){
        $ip_address_segment = explode('.', $ip_address);
        $allow_ip_segment = explode('.', $allow_ip);
        if($allow_ip == $ip_address){
            $restriction = FALSE;
        }
        if($allow_ip_segment[3] == '*'){
            unset($ip_address_segment[3]);
            unset($allow_ip_segment[3]);
            if(implode('.', $ip_address_segment) == implode('.', $allow_ip_segment)){
                $restriction = FALSE;
            }
        }
    }
    if($restriction){
        echo json_encode([
            'status'=>'Error',
            'msg'=>'Not allowed.'.$ip_address
        ]);
        exit();
    }
}


use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
|
| If the application is in maintenance / demo mode via the "down" command
| we will load this file so that any pre-rendered content can be shown
| instead of starting the framework, which could cause an exception.
|
*/

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| this application. We just need to utilize it! We'll simply require it
| into the script here so we don't need to manually load our classes.
|
*/

require __DIR__.'/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application, we can handle the incoming request using
| the application's HTTP kernel. Then, we will send the response back
| to this client's browser, allowing them to enjoy our application.
|
*/

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
