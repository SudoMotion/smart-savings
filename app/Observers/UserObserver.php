<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function created(User $user): void
    {
        $user->wallet()->firstOrCreate([], ['balance' => 0]);
        $user->earningWallet()->firstOrCreate([], ['balance' => 0]);
    }
}
