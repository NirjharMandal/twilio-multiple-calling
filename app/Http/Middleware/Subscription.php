<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Subscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
//        if (auth()->user()->team_is_owner === 0) {
//            $user = auth()->user()->owner;
//        }
//    pp($user);
        if($user->user_type === 'admin'){
            return $next($request);
        }

        if(isset($user->ws->subscription_type) && $user->ws->subscription_type === 'free' ){
            return redirect('billing');
//            if($user->trial_ends_at < time()){
//                $request->merge([
//                    'billing' => true
//                ]);
//            }
        }
        return $next($request);
    }
}
