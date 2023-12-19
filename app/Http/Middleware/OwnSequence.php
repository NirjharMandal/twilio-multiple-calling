<?php

namespace App\Http\Middleware;

use App\Traits\helperTrait;
use Closure;
use Illuminate\Http\Request;

class OwnSequence {
    use helperTrait;

    public function handle(Request $request, Closure $next) {
        if (isset($request->sequence_id) && !empty($request->sequence_id)) {
            if (haveDevPermission()) {
                return $next($request);
            }
            try {
                $campaign = MDB()->get([
                    'index' => TBL_SEQUENCE,
                    'id'    => $request->sequence_id,
                ]);

                if ($campaign['_source']['workspace_id'] != auth()->user()->active_workspace) {
                    if ($request->ajax()) {
                        return $this->eResponse([], 'Sorry! You dont have permission');
                    }
                    return redirect()->route('sequenceList');//->with(["flash" => "Sorry, you are not able to see the sequence details"]);
                }
                return $next($request);
            } catch (\Throwable $th) {
                return redirect()->route('sequenceList');//->with(["flash" => "Sorry, you are not able to see the sequence details"]);
            }
        }
        return $next($request);
    }
}
