<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Welcome {
    public function handle(Request $request, Closure $next) {
        $user = auth()->user();
        if ($user->registration_step > 0) {
            return redirect()->route('welcome');
        }
        return $next($request);

    }
}
