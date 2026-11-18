<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\UserEvent;
use App\Support\PortalGuard;
use App\Support\UserEventData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserEventController extends Controller
{
    public function show(Request $request, UserEvent $userEvent): Response
    {
        $user = $request->user(PortalGuard::CUSTOMER);

        if (! $user || ! $user->canLogin() || $userEvent->user_id !== $user->id) {
            abort(403);
        }

        if ($userEvent->expire_on !== null && $userEvent->expire_on->isPast()) {
            abort(404);
        }

        $flashedEventId = $request->session()->pull('customer_event_summary_revealed');

        return Inertia::render('Customer/Event/Show', [
            'event' => UserEventData::forShow($user, $userEvent),
            'summaryRevealed' => (int) $flashedEventId === $userEvent->id,
        ]);
    }

    public function revealSummary(Request $request, UserEvent $userEvent): RedirectResponse
    {
        $user = $request->user(PortalGuard::CUSTOMER);

        if (! $user || ! $user->canLogin() || $userEvent->user_id !== $user->id) {
            abort(403);
        }

        if ($userEvent->expire_on !== null && $userEvent->expire_on->isPast()) {
            abort(404);
        }

        return redirect()
            ->route('event.show', $userEvent)
            ->with('customer_event_summary_revealed', $userEvent->id);
    }
}
