<?php

namespace App\Http\Middleware;
use App\Providers\ElasticUserProvider;
use App\Traits\helperTrait;
use Closure;

class ApiAuth {
    use helperTrait;
    public function handle($request, Closure $next, ...$guards){
        $key = $request->header('Authorization') ? $request->header('Authorization') : '';
        $key = str_replace("Bearer ","",$key);
        $getUserToken = MDB()->search([
            'index'=> TBL_USER,
            'body'=>[
                'query'=>[
                    'match'=>[
                        'access_token.keyword'=>$key
                    ]
                ]
            ]
        ])['hits']['hits'];
        if(count($getUserToken) > 0){
            $userData = $getUserToken[0]['_source'];
            $userData['_id'] = $getUserToken[0]['_id'];
            unset($userData['password']);
            $userData = (new ElasticUserProvider())->creditSetup($userData);
//            pp($userData);
            request()->merge(['user' => $userData]);
            return $next($request);
        }else{
            return $this->eResponse([],'unauthorized');
        }
    }
}
