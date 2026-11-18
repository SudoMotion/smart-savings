<?php

namespace App\Support;

use App\Models\User;

class CustomerPortal
{
    public static function defaultLandingUrl(User $user): string
    {
        if ($user->isDiamond()) {
            $event = UserEventData::activeEvent($user);

            if ($event) {
                return route('event.show', $event, absolute: false);
            }

            return route('home', absolute: false);
        }

        return route('home', absolute: false);
    }
}
