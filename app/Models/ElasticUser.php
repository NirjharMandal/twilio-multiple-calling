<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;

class ElasticUser implements Authenticatable {

    protected $attributes = [];

    public function __construct($attributes) {
        $this->attributes = $attributes;
    }

    public function __get($attribute) {
        if (isset($this->attributes[$attribute])) {
            return $this->attributes[$attribute];
        } else {
            return NULL;
        }
    }

    public function getKey() {
        return $this->attributes['_id'];
    }

    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public function getAuthIdentifierName() {
        return '_id';
    }

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier() {
        // dd($this->attributes);
        // if(isset($this->attributes['_id']) && isset($this->attributes['password'])){
            return ['_id' => $this->attributes['_id'], 'password' => $this->attributes['password']];
        // }
        // return ['_id' => $this->attributes['_id'], 'password' => $this->attributes['password']];
    }

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword() {
        return $this->attributes['password'];
    }

    /**
     * Get the token value for the "remember me" session.
     *
     * @return string
     */
    public function getRememberToken() {
        return $this->attributes[$this->getRememberTokenName()];
    }

    /**
     * Set the token value for the "remember me" session.
     *
     * @param string $value
     *
     * @return void
     */
    public function setRememberToken($value) {
        $this->attributes[$this->getRememberTokenName()] = $value;
    }

    /**
     * Get the column name for the "remember me" token.
     *
     * @return string
     */
    public function getRememberTokenName() {
        return 'remember_token';
    }

    public function getAttributes() {
        return $this->attributes;
    }

}
