<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class contactCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */

    protected $unlockLogs;

    public function unlockLogs($value){
        $this->unlockLogs = $value;
        return $this;
    }

    // public function toArray($request)
    // {
    //     // dd($this->collection);
    //     // return parent::toArray($request);
    //     return contactResource::collection($this->collection);
    // }

    public function toArray($request){
        return $this->collection->map(function(contactResource $resource) use($request){
            return $resource->unlockLogs($this->unlockLogs)->toArray($request);
        })->all();

    }

}
