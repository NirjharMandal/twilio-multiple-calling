<?php

namespace App\Http\Middleware;

use App\Traits\helperTrait;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class WorkspacePermission
{
    use helperTrait;
    public function handle(Request $request, Closure $next,$accessTo)
    {
        if(auth()->user()->ws->user_type === 'owner') {
            return $next($request);
        }
        if(in_array($accessTo, auth()->user()->ws->permissions)){
            return $next($request);
        }

        if ($request->ajax()) {
            return $this->eResponse(['permission' => false],"Sorry, you don't have right permission to access <b>'".str_replace('_', ' ', $accessTo)."'</b>");
        }
        Session::put('AccessPermission', false);
        return redirect('dashboard')->with("Sorry, you don't have right permission to access '".str_replace('_', '', $accessTo)."'");
    }
}
