<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\UserEvent;
use App\Support\UserEventData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserEventController extends Controller
{
    public function show(Request $request, UserEvent $userEvent): Response
    {
        $user = $request->user();

        if (! $user->isDiamond() || $userEvent->user_id !== $user->id) {
            abort(403);
        }

        if ($userEvent->expire_on !== null && $userEvent->expire_on->isPast()) {
            abort(404);
        }

        return Inertia::render('Customer/Event/Show', [
            'event' => UserEventData::forShow($user, $userEvent),
        ]);
    }
}
