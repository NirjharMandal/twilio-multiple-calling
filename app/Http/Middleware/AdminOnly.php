<?php

namespace App\Http\Middleware;

use App\Traits\helperTrait;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminOnly {
    use helperTrait;

    public function handle(Request $request, Closure $next) {
        if (Auth::check()) {
            if (auth()->user()->user_type === 'user') {
                if ($request->ajax()) {
                    return $this->eResponse([], 'Sorry! You dont have permission');
                }
                return redirect('dashboard');
            }
            return $next($request);
        } else {
            return redirect('/');
        }

    }
}
